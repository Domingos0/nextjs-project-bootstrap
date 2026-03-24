import { KpiCard } from "@/app/components/kpi-card";
import { OpportunityTable } from "@/app/components/opportunity-table";
import { marketKpis, regionalOpportunities, sinaisMercado } from "@/app/data/market-data";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
});

export default function HomePage() {
  return (
    <main className="dashboard">
      <header>
        <p className="eyebrow">Solar Intelligence Brasil</p>
        <h1>Inteligência de Mercado Solar</h1>
        <p>
          Painel para monitorar demanda, viabilidade e riscos no mercado fotovoltaico brasileiro.
        </p>
      </header>

      <section className="grid-kpis">
        <KpiCard label="Crescimento anual" value={`${marketKpis.crescimentoAnual}%`} trend="+2.3 p.p" />
        <KpiCard label="Novos projetos / mês" value={`${marketKpis.novosProjetosMes}`} trend="+31" />
        <KpiCard label="CAPEX médio por MWp" value={currency.format(marketKpis.capexMedioMwp)} />
        <KpiCard label="Payback médio" value={`${marketKpis.paybackMedioAnos} anos`} trend="-0.4" />
      </section>

      <OpportunityTable rows={regionalOpportunities} />

      <section className="card">
        <h2>Sinais de Mercado</h2>
        <ul>
          {sinaisMercado.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
