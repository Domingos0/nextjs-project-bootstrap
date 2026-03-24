import { KpiCard } from "@/app/components/kpi-card";
import { LeadsBoard } from "@/app/components/leads-board";
import { OpportunityTable } from "@/app/components/opportunity-table";
import { OPEN_DATA_SOURCES } from "@/app/data/open-data-sources";
import { marketKpis, regionalOpportunities, sinaisMercado } from "@/app/data/market-data";
import { loadActiveLeadsBrazil } from "@/app/lib/open-data";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0
});

export default async function HomePage() {
  const leadsResult = await loadActiveLeadsBrazil();

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

      <LeadsBoard
        leads={leadsResult.leads}
        totalBruto={leadsResult.totalBruto}
        totalValidadas={leadsResult.totalValidadas}
        configuracaoPendente={leadsResult.configuracaoPendente}
        erros={leadsResult.erros}
      />

      <OpportunityTable rows={regionalOpportunities} />

      <section className="card">
        <h2>Fontes de Dados Abertos Integráveis</h2>
        <ul>
          {OPEN_DATA_SOURCES.map((source) => (
            <li key={source.key}>
              <strong>{source.nome}</strong>: {source.descricao} (configuração via <code>{source.envVar}</code>)
            </li>
          ))}
        </ul>
      </section>

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
