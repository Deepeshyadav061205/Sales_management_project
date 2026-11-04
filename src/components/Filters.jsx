// Dashboard filter bar with Year, Region, Category, Segment selects and Reset button.

import { CATEGORIES, REGIONS, SEGMENTS } from '../data/sampleData.js';

export default function Filters({ filters, years, onChange, onReset }) {
  const isFiltered =
    filters.year !== 'All' ||
    filters.region !== 'All' ||
    filters.category !== 'All' ||
    filters.segment !== 'All';

  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="card">
      <div className="filters-bar">
        <div className="form-field">
          <label htmlFor="filter-year">Year</label>
          <select
            id="filter-year"
            value={filters.year}
            onChange={(e) => update('year', e.target.value)}
          >
            <option value="All">All</option>
            {years.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="filter-region">Region</label>
          <select
            id="filter-region"
            value={filters.region}
            onChange={(e) => update('region', e.target.value)}
          >
            <option value="All">All</option>
            {REGIONS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => update('category', e.target.value)}
          >
            <option value="All">All</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="filter-segment">Segment</label>
          <select
            id="filter-segment"
            value={filters.segment}
            onChange={(e) => update('segment', e.target.value)}
          >
            <option value="All">All</option>
            {SEGMENTS.map((seg) => (
              <option key={seg} value={seg}>
                {seg}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <button
            type="button"
            className="btn"
            onClick={onReset}
            disabled={!isFiltered}
          >
            Reset filters
          </button>
        </div>
      </div>
    </div>
  );
}
