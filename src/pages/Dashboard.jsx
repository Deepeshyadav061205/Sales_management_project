// Dashboard page displaying filters, 6 KPI cards, 6 Chart.js charts, and auto-written Key Insights.

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Filters from '../components/Filters.jsx';
import KeyInsights from '../components/KeyInsights.jsx';
import KpiCard from '../components/KpiCard.jsx';
import CategoryBarChart from '../components/charts/CategoryBarChart.jsx';
import DiscountMarginScatter from '../components/charts/DiscountMarginScatter.jsx';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart.jsx';
import RegionBarChart from '../components/charts/RegionBarChart.jsx';
import SegmentDoughnutChart from '../components/charts/SegmentDoughnutChart.jsx';
import TopProductsChart from '../components/charts/TopProductsChart.jsx';
import {
  filterOrders,
  getAvailableYears,
  getKpis,
} from '../utils/calculations.js';
import {
  formatCurrency,
  formatInteger,
  formatPercent,
} from '../utils/format.js';

const DEFAULT_FILTERS = {
  year: 'All',
  region: 'All',
  category: 'All',
  segment: 'All',
};

export default function Dashboard({ orders, onLoadSample }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const years = useMemo(() => getAvailableYears(orders), [orders]);

  const filteredOrders = useMemo(
    () => filterOrders(orders, filters),
    [orders, filters]
  );

  const kpis = useMemo(() => getKpis(filteredOrders), [filteredOrders]);

  if (orders.length === 0) {
    return (
      <div className="page-stack">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="card">
          <p>No sales orders are currently stored in the browser.</p>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onLoadSample}
            >
              Load sample data
            </button>
            <Link to="/add" className="btn">
              Add data
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profitClass =
    kpis.totalProfit < 0
      ? 'text-loss'
      : kpis.totalProfit > 0
        ? 'text-profit'
        : '';
  const marginClass = kpis.profitMargin < 0 ? 'text-loss' : '';

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
      </div>

      <Filters
        filters={filters}
        years={years}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <div className="kpi-grid">
        <KpiCard label="Total Sales" value={formatCurrency(kpis.totalSales)} />
        <KpiCard
          label="Total Profit"
          value={formatCurrency(kpis.totalProfit)}
          valueClass={profitClass}
        />
        <KpiCard
          label="Profit Margin"
          value={formatPercent(kpis.profitMargin)}
          valueClass={marginClass}
        />
        <KpiCard label="Orders" value={formatInteger(kpis.orderCount)} />
        <KpiCard
          label="Average Order Value"
          value={formatCurrency(kpis.avgOrderValue)}
        />
        <KpiCard label="Customers" value={formatInteger(kpis.customerCount)} />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card">
          <p>No orders match the selected filters.</p>
          <button
            type="button"
            className="btn"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="charts-grid">
            <MonthlyTrendChart orders={filteredOrders} />
            <CategoryBarChart orders={filteredOrders} />
            <RegionBarChart orders={filteredOrders} />
            <SegmentDoughnutChart orders={filteredOrders} />
            <TopProductsChart orders={filteredOrders} />
            <DiscountMarginScatter orders={filteredOrders} />
          </div>

          <KeyInsights orders={filteredOrders} />
        </>
      )}
    </div>
  );
}
