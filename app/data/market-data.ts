export type RegionalOpportunity = {
  estado: string;
  potencialMw: number;
  demandaProjetos: number;
  ticketMedio: number;
  riscoRegulatorio: "baixo" | "médio" | "alto";
};

export const marketKpis = {
  crescimentoAnual: 18.4,
  novosProjetosMes: 242,
  capexMedioMwp: 4100000,
  paybackMedioAnos: 3.8
};

export const regionalOpportunities: RegionalOpportunity[] = [
  {
    estado: "Minas Gerais",
    potencialMw: 920,
    demandaProjetos: 88,
    ticketMedio: 2.1,
    riscoRegulatorio: "baixo"
  },
  {
    estado: "São Paulo",
    potencialMw: 810,
    demandaProjetos: 97,
    ticketMedio: 2.8,
    riscoRegulatorio: "médio"
  },
  {
    estado: "Bahia",
    potencialMw: 730,
    demandaProjetos: 64,
    ticketMedio: 1.9,
    riscoRegulatorio: "baixo"
  },
  {
    estado: "Paraná",
    potencialMw: 560,
    demandaProjetos: 51,
    ticketMedio: 1.7,
    riscoRegulatorio: "médio"
  },
  {
    estado: "Goiás",
    potencialMw: 490,
    demandaProjetos: 43,
    ticketMedio: 1.5,
    riscoRegulatorio: "alto"
  }
];

export const sinaisMercado = [
  "Aumento de 22% na procura por geração distribuída no segmento agro.",
  "Leilões estaduais indicam alta competição em projetos acima de 5MWp.",
  "Linhas de financiamento verde com spreads reduzidos em 0,9 p.p.",
  "Demanda industrial concentrada em telhados de médio porte nas regiões Sudeste e Sul."
];
