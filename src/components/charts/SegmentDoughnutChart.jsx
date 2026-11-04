// Doughnut chart showing sales breakdown by customer segment with legend.

import { Doughnut } from 'react-chartjs-2';
import { salesBySegment } from '../../utils/calculations.js';
import { formatCurrency, formatPercent } from '../../utils/format.js';
import {
  BASE_LEGEND_LABELS,
  BASE_TOOLTIP,
  CHART_COLORS,
} from './chartTheme.js';

export default function SegmentDoughnutChart({ orders }) {
  const grouped = salesBySegment(orders);
  const totalSales = grouped.sales.reduce((sum, val) => sum + val, 0);

  const data = {
    labels: grouped.labels,
    datasets: [
      {
        label: 'Sales',
        data: grouped.sales,
        backgroundColor: [
          CHART_COLORS.accent,
          CHART_COLORS.accentMid,
          CHART_COLORS.accentLight,
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
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
        position: 'bottom',
        labels: BASE_LEGEND_LABELS,
      },
      tooltip: {
        ...BASE_TOOLTIP,
        callbacks: {
          label: (ctx) => {
            const val = Number(ctx.parsed) || 0;
            const share = totalSales > 0 ? (val / totalSales) * 100 : 0;
            return `${ctx.label}: ${formatCurrency(val)} (${formatPercent(share)})`;
          },
        },
      },
    },
  };

  return (
    <div className="card">
      <h2 className="card-title">Sales by Segment</h2>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
