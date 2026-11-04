// Vertical bar chart showing sales across Indian regions.

import { Bar } from 'react-chartjs-2';
import { salesByRegion } from '../../utils/calculations.js';
import { formatCurrency } from '../../utils/format.js';
import { BASE_TOOLTIP, CHART_COLORS, SYSTEM_FONT } from './chartTheme.js';

export default function RegionBarChart({ orders }) {
  const grouped = salesByRegion(orders);

  const data = {
    labels: grouped.labels,
    datasets: [
      {
        label: 'Sales',
        data: grouped.sales,
        backgroundColor: CHART_COLORS.accent,
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...BASE_TOOLTIP,
        callbacks: {
          label: (ctx) => `Sales: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Region',
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 12 },
        },
        ticks: {
          color: CHART_COLORS.text,
          font: { family: SYSTEM_FONT, size: 12 },
        },
      },
      y: {
        grid: { color: CHART_COLORS.grid },
        title: {
          display: true,
          text: 'Sales (₹)',
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 12 },
        },
        ticks: {
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 11 },
          callback: (val) => formatCurrency(val),
        },
      },
    },
  };

  return (
    <div className="card">
      <h2 className="card-title">Sales by Region</h2>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
