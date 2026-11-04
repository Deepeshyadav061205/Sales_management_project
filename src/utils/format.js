// Formatting helpers for Indian Rupees (en-IN), numbers, percentages, and dates.

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Format a rupee value using Indian grouping (e.g. ₹1,45,000 or -₹8,200).
export function formatCurrency(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '₹0';
  const absFormatted = currencyFormatter.format(Math.abs(num));
  return num < 0 ? `-₹${absFormatted}` : `₹${absFormatted}`;
}

// Format an integer count or quantity using Indian grouping.
export function formatInteger(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';
  return integerFormatter.format(Math.round(num));
}

// Format a percentage number (e.g. 21.4 -> "21.4%").
export function formatPercent(value, digits = 1) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.0%';
  return `${num.toFixed(digits)}%`;
}

// Format a discount fraction (0 to 0.8) as a percentage label (e.g. 0.2 -> "20%").
export function formatDiscount(fraction) {
  const pct = (Number(fraction) || 0) * 100;
  const rounded = Math.round(pct * 10) / 10;
  return `${rounded}%`;
}

// Convert YYYY-MM into "Oct 2024".
export function formatMonthYear(yearMonth) {
  if (!yearMonth || typeof yearMonth !== 'string') return '';
  const [year, monthStr] = yearMonth.split('-');
  const idx = Number(monthStr) - 1;
  if (idx < 0 || idx > 11) return yearMonth;
  return `${MONTH_SHORT[idx]} ${year}`;
}

// Return Today's local calendar date in YYYY-MM-DD format.
export function getTodayIsoDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
