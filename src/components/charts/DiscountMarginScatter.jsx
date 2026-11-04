// Full-width scatter chart plotting order discount (%) against profit margin (%).
// Orders with negative margin are colored red (#c0392b); others use accent (#2457c5).

import { Scatter } from 'react-chartjs-2';
import { discountVsMargin } from '../../utils/calculations.js';
import { formatCurrency, formatPercent } from '../../utils/format.js';
import {
  BASE_LEGEND_LABELS,
  BASE_TOOLTIP,
  CHART_COLORS,
  SYSTEM_FONT,
} from './chartTheme.js';

export default function DiscountMarginScatter({ orders }) {
  const allPoints = discountVsMargin(orders);
  const positivePoints = allPoints.filter((pt) => pt.y >= 0);
  const negativePoints = allPoints.filter((pt) => pt.y < 0);

  const data = {
    datasets: [
      {
        label: 'Positive / Zero Margin',
        data: positivePoints,
        backgroundColor: CHART_COLORS.accent,
        pointRadius: 4,
      },
      {
        label: 'Negative Margin (Loss)',
        data: negativePoints,
        backgroundColor: CHART_COLORS.loss,
        pointRadius: 4,
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
          title: (items) =>
            items[0] && items[0].raw ? items[0].raw.productName : '',
          label: (ctx) => {
            const raw = ctx.raw || {};
            return [
              `Discount: ${raw.x}% | Margin: ${formatPercent(raw.y)}`,
              `Sales: ${formatCurrency(raw.sales)} | Profit: ${formatCurrency(raw.profit)}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: CHART_COLORS.grid },
        min: 0,
        max: 80,
        title: {
          display: true,
          text: 'Discount (%)',
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 12 },
        },
        ticks: {
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 11 },
          callback: (val) => `${val}%`,
        },
      },
      y: {
        grid: { color: CHART_COLORS.grid },
        title: {
          display: true,
          text: 'Profit Margin (%)',
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 12 },
        },
        ticks: {
          color: CHART_COLORS.muted,
          font: { family: SYSTEM_FONT, size: 11 },
          callback: (val) => `${val}%`,
        },
      },
    },
  };

  return (
    <div className="card chart-span-full">
      <h2 className="card-title">Discount vs Profit Margin</h2>
      <div className="chart-container">
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
}
