import type { RegionalOpportunity } from "@/app/data/market-data";

type OpportunityTableProps = {
  rows: RegionalOpportunity[];
};

const riskClassMap = {
  baixo: "risk-low",
  médio: "risk-mid",
  alto: "risk-high"
};

export function OpportunityTable({ rows }: OpportunityTableProps) {
  return (
    <div className="card">
      <h2>Mapa de Oportunidades Regionais</h2>
      <table>
        <thead>
          <tr>
            <th>Estado</th>
            <th>Potencial (MW)</th>
            <th>Projetos em Pipeline</th>
            <th>Ticket Médio (R$ mi)</th>
            <th>Risco</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.estado}>
              <td>{row.estado}</td>
              <td>{row.potencialMw}</td>
              <td>{row.demandaProjetos}</td>
              <td>{row.ticketMedio.toFixed(1)}</td>
              <td>
                <span className={`risk-pill ${riskClassMap[row.riscoRegulatorio]}`}>
                  {row.riscoRegulatorio}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
