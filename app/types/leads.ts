export type LeadSource = "pncp" | "aneel" | "ibge" | "bndes" | "manual";

export type RawLead = {
  id: string;
  titulo: string;
  descricao?: string;
  estado: string;
  cidade?: string;
  demandaKw?: number;
  investimentoEstimado?: number;
  dataAtualizacao: string;
  cnpj?: string;
  contato?: string;
  status: "ativa" | "encerrada" | "suspensa";
  origem: LeadSource;
  linkFonte: string;
};

export type ValidatedLead = RawLead & {
  fontesConfirmadas: LeadSource[];
  validada: boolean;
  scoreConfianca: number;
};
