// Full-width line chart showing monthly sales and profit over time.

import { Line } from 'react-chartjs-2';
import { monthlyTrend } from '../../utils/calculations.js';
import { formatCurrency } from '../../utils/format.js';
import {
  BASE_LEGEND_LABELS,
  BASE_TOOLTIP,
  CHART_COLORS,
  SYSTEM_FONT,
} from './chartTheme.js';

export default function MonthlyTrendChart({ orders }) {
  const series = monthlyTrend(orders);

  const data = {
    labels: series.labels,
    datasets: [
      {
        label: 'Sales',
        data: series.sales,
        borderColor: CHART_COLORS.accent,
        backgroundColor: CHART_COLORS.accent,
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.15,
      },
      {
        label: 'Profit',
        data: series.profit,
        borderColor: CHART_COLORS.profit,
        backgroundColor: CHART_COLORS.profit,
        pointBackgroundColor: series.profit.map((v) =>
          v < 0 ? CHART_COLORS.loss : CHART_COLORS.profit
        ),
        pointBorderColor: series.profit.map((v) =>
          v < 0 ? CHART_COLORS.loss : CHART_COLORS.profit
        ),
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.15,
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
          text: 'Month',
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 12 },
        },
        ticks: {
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 11 },
          maxRotation: 45,
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
    <div className="card chart-span-full">
      <h2 className="card-title">Monthly Sales and Profit</h2>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
