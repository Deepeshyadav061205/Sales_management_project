// Grouped bar chart comparing total sales and profit by product category.

import { Bar } from 'react-chartjs-2';
import { salesByCategory } from '../../utils/calculations.js';
import { formatCurrency } from '../../utils/format.js';
import {
  BASE_LEGEND_LABELS,
  BASE_TOOLTIP,
  CHART_COLORS,
  SYSTEM_FONT,
} from './chartTheme.js';

export default function CategoryBarChart({ orders }) {
  const grouped = salesByCategory(orders);

  const data = {
    labels: grouped.labels,
    datasets: [
      {
        label: 'Sales',
        data: grouped.sales,
        backgroundColor: CHART_COLORS.accent,
        borderRadius: 2,
      },
      {
        label: 'Profit',
        data: grouped.profit,
        backgroundColor: grouped.profit.map((v) =>
          v < 0 ? CHART_COLORS.loss : CHART_COLORS.profit
        ),
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'end',
        labels: BASE_LEGEND_LABELS,
      },
      tooltip: {
        ...BASE_TOOLTIP,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Category',
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
          text: 'Amount (₹)',
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
      <h2 className="card-title">Sales and Profit by Category</h2>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
