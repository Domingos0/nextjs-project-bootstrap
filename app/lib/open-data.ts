import type { RawLead, ValidatedLead } from "@/app/types/leads";

const UF_LIST = new Set([
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO"
]);

function isRecent(dateIso: string) {
  const date = new Date(dateIso).getTime();
  const now = Date.now();
  const fortyFiveDays = 45 * 24 * 60 * 60 * 1000;
  return now - date <= fortyFiveDays;
}

function hasValidCnpj(cnpj?: string) {
  if (!cnpj) return false;
  const digits = cnpj.replace(/\D/g, "");
  return digits.length === 14;
}

function computeConfidence(lead: RawLead, confirmations: number) {
  let score = 0;
  if (lead.status === "ativa") score += 35;
  if (hasValidCnpj(lead.cnpj)) score += 20;
  if (UF_LIST.has(lead.estado.toUpperCase())) score += 15;
  if (isRecent(lead.dataAtualizacao)) score += 15;
  if (lead.demandaKw && lead.demandaKw > 0) score += 5;
  if (lead.investimentoEstimado && lead.investimentoEstimado > 0) score += 5;
  score += Math.min(confirmations * 5, 10);
  return Math.min(score, 100);
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar ${url} (${response.status})`);
  }

  return response.json();
}

function mapPncpLead(item: Record<string, unknown>): RawLead | null {
  const id = String(item.sequencialCompra ?? item.id ?? "").trim();
  const titulo = String(item.objetoCompra ?? item.titulo ?? "").trim();
  if (!id || !titulo.toLowerCase().includes("solar")) return null;

  return {
    id: `pncp-${id}`,
    titulo,
    descricao: String(item.informacaoComplementar ?? "").trim() || undefined,
    estado: String(item.uf ?? "").toUpperCase(),
    cidade: String(item.municipioNome ?? "").trim() || undefined,
    demandaKw: Number(item.potenciaKw ?? 0) || undefined,
    investimentoEstimado: Number(item.valorTotalEstimado ?? 0) || undefined,
    dataAtualizacao: String(item.dataAtualizacao ?? item.dataPublicacaoPncp ?? new Date().toISOString()),
    cnpj: String(item.cnpj ?? item.orgaoEntidadeCnpj ?? "").trim() || undefined,
    contato: String(item.usuarioNome ?? "").trim() || undefined,
    status: String(item.situacaoCompra ?? "").toLowerCase().includes("encerr") ? "encerrada" : "ativa",
    origem: "pncp",
    linkFonte: String(item.linkSistemaOrigem ?? "https://pncp.gov.br")
  };
}

function mapAneelLead(item: Record<string, unknown>): RawLead | null {
  const id = String(item.id ?? item.codigoEmpreendimento ?? "").trim();
  const titulo = String(item.nomeEmpreendimento ?? item.titulo ?? "Projeto Fotovoltaico").trim();
  if (!id) return null;

  return {
    id: `aneel-${id}`,
    titulo,
    descricao: String(item.classeConsumo ?? "").trim() || undefined,
    estado: String(item.uf ?? "").toUpperCase(),
    cidade: String(item.municipio ?? "").trim() || undefined,
    demandaKw: Number(item.potenciaInstaladaKw ?? item.potenciaKw ?? 0) || undefined,
    investimentoEstimado: Number(item.investimentoEstimado ?? 0) || undefined,
    dataAtualizacao: String(item.dataAtualizacao ?? new Date().toISOString()),
    cnpj: String(item.cnpjTitular ?? "").trim() || undefined,
    contato: undefined,
    status: String(item.situacao ?? "ativa").toLowerCase().includes("ativa") ? "ativa" : "suspensa",
    origem: "aneel",
    linkFonte: String(item.link ?? process.env.ANEEL_API_URL ?? "https://dadosabertos.aneel.gov.br")
  };
}

function mergeAndValidate(leads: RawLead[]): ValidatedLead[] {
  const byKey = new Map<string, ValidatedLead>();

  for (const lead of leads) {
    if (!lead.id || lead.status !== "ativa" || !UF_LIST.has(lead.estado.toUpperCase())) {
      continue;
    }

    const normalizedKey = `${lead.estado}|${(lead.cidade ?? "").toLowerCase()}|${lead.titulo.toLowerCase()}`;
    const current = byKey.get(normalizedKey);

    if (!current) {
      byKey.set(normalizedKey, {
        ...lead,
        fontesConfirmadas: [lead.origem],
        validada: false,
        scoreConfianca: 0
      });
      continue;
    }

    const mergedSources = new Set([...current.fontesConfirmadas, lead.origem]);
    byKey.set(normalizedKey, {
      ...current,
      fontesConfirmadas: [...mergedSources],
      demandaKw: Math.max(current.demandaKw ?? 0, lead.demandaKw ?? 0) || undefined,
      investimentoEstimado:
        Math.max(current.investimentoEstimado ?? 0, lead.investimentoEstimado ?? 0) || undefined,
      dataAtualizacao:
        new Date(current.dataAtualizacao) > new Date(lead.dataAtualizacao)
          ? current.dataAtualizacao
          : lead.dataAtualizacao,
      cnpj: current.cnpj ?? lead.cnpj,
      contato: current.contato ?? lead.contato
    });
  }

  return [...byKey.values()]
    .map((lead) => {
      const score = computeConfidence(lead, lead.fontesConfirmadas.length);
      return {
        ...lead,
        scoreConfianca: score,
        validada: lead.fontesConfirmadas.length >= 2 && score >= 70
      };
    })
    .sort((a, b) => b.scoreConfianca - a.scoreConfianca);
}

export async function loadActiveLeadsBrazil() {
  const pncpUrl = process.env.PNCP_API_URL;
  const aneelUrl = process.env.ANEEL_API_URL;

  const collected: RawLead[] = [];
  const erros: string[] = [];

  if (pncpUrl) {
    try {
      const pncpJson = await fetchJson(pncpUrl);
      const data = Array.isArray(pncpJson?.data) ? pncpJson.data : Array.isArray(pncpJson) ? pncpJson : [];
      collected.push(...data.map((item) => mapPncpLead(item as Record<string, unknown>)).filter(Boolean) as RawLead[]);
    } catch (error) {
      erros.push(`PNCP: ${(error as Error).message}`);
    }
  }

  if (aneelUrl) {
    try {
      const aneelJson = await fetchJson(aneelUrl);
      const data = Array.isArray(aneelJson?.result?.records)
        ? aneelJson.result.records
        : Array.isArray(aneelJson)
          ? aneelJson
          : [];
      collected.push(...data.map((item) => mapAneelLead(item as Record<string, unknown>)).filter(Boolean) as RawLead[]);
    } catch (error) {
      erros.push(`ANEEL: ${(error as Error).message}`);
    }
  }

  const validated = mergeAndValidate(collected);

  return {
    leads: validated,
    totalBruto: collected.length,
    totalValidadas: validated.filter((lead) => lead.validada).length,
    configuracaoPendente: !pncpUrl || !aneelUrl,
    erros
  };
}
