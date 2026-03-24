export const OPEN_DATA_SOURCES = [
  {
    key: "pncp",
    nome: "Portal Nacional de Contratações Públicas (PNCP)",
    descricao: "Oportunidades e contratações públicas com termos ligados a energia solar.",
    envVar: "PNCP_API_URL"
  },
  {
    key: "aneel",
    nome: "ANEEL Dados Abertos",
    descricao: "Dados regulatórios e projetos com recorte de geração distribuída/fotovoltaica.",
    envVar: "ANEEL_API_URL"
  },
  {
    key: "ibge",
    nome: "IBGE Localidades",
    descricao: "Validação de UF e município para consistência cadastral de leads.",
    envVar: "IBGE_API_URL"
  },
  {
    key: "bndes",
    nome: "BNDES Dados Abertos",
    descricao: "Linhas e operações de financiamento relacionadas à transição energética.",
    envVar: "BNDES_API_URL"
  }
] as const;
