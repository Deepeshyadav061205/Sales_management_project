// Reusable order form for adding a new order or editing an existing order.

import { useEffect, useId, useRef, useState } from 'react';
import {
  CATEGORIES,
  REGIONS,
  SEGMENTS,
  SHIP_MODES,
  SUB_CATEGORIES,
} from '../data/sampleData.js';
import { getTodayIsoDate } from '../utils/format.js';
import { validateOrderForm } from '../utils/validate.js';

function buildEmptyForm() {
  const defaultCategory = CATEGORIES[0];
  return {
    orderDate: getTodayIsoDate(),
    customerName: '',
    segment: SEGMENTS[0],
    region: REGIONS[0],
    category: defaultCategory,
    subCategory: SUB_CATEGORIES[defaultCategory][0],
    productName: '',
    quantity: '1',
    sales: '',
    discountPercent: '0',
    profit: '',
    shipMode: SHIP_MODES[0],
  };
}

function mapOrderToForm(order) {
  const pct = Math.round((Number(order.discount) || 0) * 10000) / 100;
  return {
    orderDate: order.orderDate || getTodayIsoDate(),
    customerName: order.customerName || '',
    segment: order.segment || SEGMENTS[0],
    region: order.region || REGIONS[0],
    category: order.category || CATEGORIES[0],
    subCategory:
      order.subCategory ||
      (SUB_CATEGORIES[order.category] && SUB_CATEGORIES[order.category][0]) ||
      '',
    productName: order.productName || '',
    quantity: String(order.quantity ?? 1),
    sales: String(order.sales ?? ''),
    discountPercent: String(pct),
    profit: String(order.profit ?? ''),
    shipMode: order.shipMode || SHIP_MODES[0],
  };
}

export default function OrderForm({
  initialOrder = null,
  onSubmit,
  onCancel,
  submitLabel = 'Add Order',
  autoFocusFirst = false,
}) {
  const idPrefix = useId();
  const dateInputRef = useRef(null);
  const [form, setForm] = useState(() =>
    initialOrder ? mapOrderToForm(initialOrder) : buildEmptyForm()
  );
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setForm(initialOrder ? mapOrderToForm(initialOrder) : buildEmptyForm());
    setErrors({});
    setSuccessMsg('');
  }, [initialOrder]);

  useEffect(() => {
    if (autoFocusFirst && dateInputRef.current) {
      dateInputRef.current.focus();
    }
  }, [autoFocusFirst]);

  const baseSubCategories = SUB_CATEGORIES[form.category] || [];
  const subCategoryOptions =
    form.subCategory && !baseSubCategories.includes(form.subCategory)
      ? [form.subCategory, ...baseSubCategories]
      : baseSubCategories;

  function handleChange(field, value) {
    setSuccessMsg('');
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }

    if (field === 'category') {
      const nextSubs = SUB_CATEGORIES[value] || [];
      setForm((prev) => ({
        ...prev,
        category: value,
        subCategory: nextSubs[0] || '',
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg('');

    const result = validateOrderForm(form);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    onSubmit(result.cleanOrder);

    if (!initialOrder) {
      setForm(buildEmptyForm());
      setSuccessMsg('Order added');
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="order-form-grid">
        <div className="form-field">
          <label htmlFor={`${idPrefix}-date`}>Order Date</label>
          <input
            ref={dateInputRef}
            id={`${idPrefix}-date`}
            type="date"
            value={form.orderDate}
            max={getTodayIsoDate()}
            onChange={(e) => handleChange('orderDate', e.target.value)}
          />
          {errors.orderDate && (
            <span className="field-error">{errors.orderDate}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-customer`}>Customer Name</label>
          <input
            id={`${idPrefix}-customer`}
            type="text"
            placeholder="e.g. Aarav Sharma"
            value={form.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
          />
          {errors.customerName && (
            <span className="field-error">{errors.customerName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-segment`}>Segment</label>
          <select
            id={`${idPrefix}-segment`}
            value={form.segment}
            onChange={(e) => handleChange('segment', e.target.value)}
          >
            {SEGMENTS.map((seg) => (
              <option key={seg} value={seg}>
                {seg}
              </option>
            ))}
          </select>
          {errors.segment && (
            <span className="field-error">{errors.segment}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-region`}>Region</label>
          <select
            id={`${idPrefix}-region`}
            value={form.region}
            onChange={(e) => handleChange('region', e.target.value)}
          >
            {REGIONS.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
          {errors.region && <span className="field-error">{errors.region}</span>}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-category`}>Category</label>
          <select
            id={`${idPrefix}-category`}
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="field-error">{errors.category}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-subcategory`}>Sub-Category</label>
          <select
            id={`${idPrefix}-subcategory`}
            value={form.subCategory}
            onChange={(e) => handleChange('subCategory', e.target.value)}
          >
            {subCategoryOptions.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          {errors.subCategory && (
            <span className="field-error">{errors.subCategory}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-product`}>Product Name</label>
          <input
            id={`${idPrefix}-product`}
            type="text"
            placeholder="e.g. HP ProBook 450 G10"
            value={form.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
          />
          {errors.productName && (
            <span className="field-error">{errors.productName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-shipmode`}>Ship Mode</label>
          <select
            id={`${idPrefix}-shipmode`}
            value={form.shipMode}
            onChange={(e) => handleChange('shipMode', e.target.value)}
          >
            {SHIP_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          {errors.shipMode && (
            <span className="field-error">{errors.shipMode}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-qty`}>Quantity</label>
          <input
            id={`${idPrefix}-qty`}
            type="number"
            min="1"
            step="1"
            value={form.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
          />
          {errors.quantity && (
            <span className="field-error">{errors.quantity}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-sales`}>Sales (₹)</label>
          <input
            id={`${idPrefix}-sales`}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0"
            value={form.sales}
            onChange={(e) => handleChange('sales', e.target.value)}
          />
          {errors.sales && <span className="field-error">{errors.sales}</span>}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-discount`}>Discount (%)</label>
          <input
            id={`${idPrefix}-discount`}
            type="number"
            min="0"
            max="80"
            step="1"
            placeholder="0 to 80"
            value={form.discountPercent}
            onChange={(e) => handleChange('discountPercent', e.target.value)}
          />
          {errors.discountPercent && (
            <span className="field-error">{errors.discountPercent}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={`${idPrefix}-profit`}>Profit (₹)</label>
          <input
            id={`${idPrefix}-profit`}
            type="number"
            step="0.01"
            placeholder="Can be negative"
            value={form.profit}
            onChange={(e) => handleChange('profit', e.target.value)}
          />
          {errors.profit && <span className="field-error">{errors.profit}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
        {successMsg && <span className="msg-success">{successMsg}</span>}
      </div>
    </form>
  );
}
