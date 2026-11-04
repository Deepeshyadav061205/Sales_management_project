// Single KPI card displaying a muted label and a large tabular number.

export default function KpiCard({ label, value, valueClass = '' }) {
  return (
    <div className="card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value ${valueClass}`.trim()}>{value}</div>
    </div>
  );
}
