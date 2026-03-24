type KpiCardProps = {
  label: string;
  value: string;
  trend?: string;
};

export function KpiCard({ label, value, trend }: KpiCardProps) {
  return (
    <article className="card kpi">
      <p className="kpi-label">{label}</p>
      <h3>{value}</h3>
      {trend ? <span className="trend">{trend}</span> : null}
    </article>
  );
}
