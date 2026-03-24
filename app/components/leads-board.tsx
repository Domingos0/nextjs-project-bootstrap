"use client";

import { useMemo, useState } from "react";

import type { ValidatedLead } from "@/app/types/leads";

type LeadsBoardProps = {
  leads: ValidatedLead[];
  totalBruto: number;
  totalValidadas: number;
  configuracaoPendente: boolean;
  erros: string[];
};

export function LeadsBoard({
  leads,
  totalBruto,
  totalValidadas,
  configuracaoPendente,
  erros
}: LeadsBoardProps) {
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(leads[0]?.id ?? null);

  const states = useMemo(() => ["ALL", ...new Set(leads.map((lead) => lead.estado))], [leads]);

  const visibleLeads = useMemo(() => {
    return leads.filter((lead) => (stateFilter === "ALL" ? true : lead.estado === stateFilter));
  }, [leads, stateFilter]);

  const selectedLead = visibleLeads.find((lead) => lead.id === selectedLeadId) ?? visibleLeads[0] ?? null;

  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Leads Ativas no Brasil (Dados Abertos)</h2>
          <p>
            Clique em uma demanda para ver os detalhes e nível de validação por múltiplas fontes.
          </p>
        </div>
        <div className="stats-inline">
          <span>Total bruto: {totalBruto}</span>
          <span>Validadas: {totalValidadas}</span>
        </div>
      </div>

      {configuracaoPendente ? (
        <div className="warning-box">
          Configure as variáveis <code>PNCP_API_URL</code> e <code>ANEEL_API_URL</code> para importar
          automaticamente o maior volume possível de leads públicas ativas.
        </div>
      ) : null}

      {erros.length > 0 ? (
        <div className="warning-box">
          {erros.map((erro) => (
            <p key={erro}>{erro}</p>
          ))}
        </div>
      ) : null}

      <div className="toolbar">
        <label htmlFor="stateFilter">UF</label>
        <select
          id="stateFilter"
          value={stateFilter}
          onChange={(event) => {
            setStateFilter(event.target.value);
            setSelectedLeadId(null);
          }}
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state === "ALL" ? "Brasil (todas)" : state}
            </option>
          ))}
        </select>
      </div>

      <div className="lead-layout">
        <div className="lead-list">
          {visibleLeads.length === 0 ? (
            <p>Nenhuma lead ativa encontrada com os filtros atuais.</p>
          ) : (
            visibleLeads.map((lead) => (
              <button
                type="button"
                key={lead.id}
                className={`lead-row ${selectedLead?.id === lead.id ? "selected" : ""}`}
                onClick={() => setSelectedLeadId(lead.id)}
              >
                <strong>{lead.titulo}</strong>
                <span>
                  {lead.estado}
                  {lead.cidade ? ` • ${lead.cidade}` : ""}
                </span>
                <span>Score: {lead.scoreConfianca}</span>
              </button>
            ))
          )}
        </div>

        <aside className="lead-detail">
          {selectedLead ? (
            <>
              <h3>{selectedLead.titulo}</h3>
              <p>{selectedLead.descricao ?? "Sem descrição adicional."}</p>
              <ul>
                <li>Status: {selectedLead.status}</li>
                <li>UF: {selectedLead.estado}</li>
                <li>Cidade: {selectedLead.cidade ?? "Não informado"}</li>
                <li>Demanda estimada: {selectedLead.demandaKw ? `${selectedLead.demandaKw} kW` : "N/D"}</li>
                <li>
                  Investimento estimado: {selectedLead.investimentoEstimado ? `R$ ${selectedLead.investimentoEstimado.toLocaleString("pt-BR")}` : "N/D"}
                </li>
                <li>Fontes confirmadas: {selectedLead.fontesConfirmadas.join(", ")}</li>
                <li>Validação automática: {selectedLead.validada ? "validada" : "pendente"}</li>
                <li>Atualizado em: {new Date(selectedLead.dataAtualizacao).toLocaleDateString("pt-BR")}</li>
              </ul>
              <a href={selectedLead.linkFonte} target="_blank" rel="noreferrer">
                Abrir fonte oficial
              </a>
            </>
          ) : (
            <p>Sem detalhes para exibir.</p>
          )}
        </aside>
      </div>
    </section>
  );
}
