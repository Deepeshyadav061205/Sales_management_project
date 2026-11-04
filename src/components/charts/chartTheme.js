// Shared Chart.js registration and plain internal-tool theme settings.

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

export const CHART_COLORS = {
  accent: '#2457c5',
  accentMid: '#6b8fe0',
  accentLight: '#b8caec',
  profit: '#1e7d4f',
  loss: '#c0392b',
  grid: '#e5e7eb',
  border: '#dcdfe4',
  text: '#1f2328',
  muted: '#5f6672',
};

export const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const BASE_TOOLTIP = {
  backgroundColor: '#ffffff',
  titleColor: CHART_COLORS.text,
  bodyColor: CHART_COLORS.text,
  borderColor: CHART_COLORS.border,
  borderWidth: 1,
  padding: 8,
  titleFont: { family: SYSTEM_FONT, size: 12, weight: '600' },
  bodyFont: { family: SYSTEM_FONT, size: 12 },
};

export const BASE_LEGEND_LABELS = {
  boxWidth: 12,
  boxHeight: 12,
  color: CHART_COLORS.text,
  font: { family: SYSTEM_FONT, size: 12 },
};
