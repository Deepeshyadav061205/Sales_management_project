// Horizontal bar chart listing the top 10 products ranked by sales.

import { Bar } from 'react-chartjs-2';
import { topProducts } from '../../utils/calculations.js';
import { formatCurrency } from '../../utils/format.js';
import { BASE_TOOLTIP, CHART_COLORS, SYSTEM_FONT } from './chartTheme.js';

function shortenLabel(name, maxLen = 24) {
  if (!name || name.length <= maxLen) return name;
  return `${name.slice(0, maxLen - 3)}...`;
}

export default function TopProductsChart({ orders }) {
  const top = topProducts(orders, 10);

  const data = {
    labels: top.labels,
    datasets: [
      {
        label: 'Sales',
        data: top.sales,
        backgroundColor: CHART_COLORS.accent,
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        ...BASE_TOOLTIP,
        callbacks: {
          title: (items) => (items[0] ? top.labels[items[0].dataIndex] : ''),
          label: (ctx) => `Sales: ${formatCurrency(ctx.parsed.x)}`,
        },
      },
    },
    scales: {
      x: {
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
      y: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Product',
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 12 },
        },
        ticks: {
          color: CHART_COLORS.text,
          font: { family: SYSTEM_FONT, size: 11 },
          callback: function formatTick(value) {
            const label = this.getLabelForValue(value);
            return shortenLabel(label);
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <h2 className="card-title">Top 10 Products by Sales</h2>
      <div className="chart-container chart-container-tall">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
