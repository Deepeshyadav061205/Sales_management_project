// Validation helpers for manual order forms, uploaded CSV rows, and localStorage records.

import {
  CATEGORIES,
  REGIONS,
  SEGMENTS,
  SHIP_MODES,
  SUB_CATEGORIES,
} from '../data/sampleData.js';
import { getTodayIsoDate } from './format.js';

// Check whether a string is a valid calendar YYYY-MM-DD date.
export function isValidIsoDate(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || ''))) {
    return false;
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) return false;
  const check = new Date(Date.UTC(y, m - 1, d));
  return (
    check.getUTCFullYear() === y &&
    check.getUTCMonth() === m - 1 &&
    check.getUTCDate() === d
  );
}

// Parse YYYY-MM-DD, DD-MM-YYYY, or Superstore M/D/YYYY dates into YYYY-MM-DD.
export function parseFlexibleCsvDate(raw) {
  const value = String(raw ?? '').trim();
  if (!value) return '';

  // YYYY-MM-DD or YYYY/MM/DD
  const ymd = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/.exec(value);
  if (ymd) {
    const iso = `${ymd[1]}-${ymd[2].padStart(2, '0')}-${ymd[3].padStart(2, '0')}`;
    return isValidIsoDate(iso) ? iso : '';
  }

  // A/B/YYYY or A-B-YYYY
  const parts = /^(\d{1,2})([/-])(\d{1,2})\2(\d{4})$/.exec(value);
  if (parts) {
    const a = Number(parts[1]);
    const sep = parts[2];
    const b = Number(parts[3]);
    const year = parts[4];

    let month;
    let day;
    if (a > 12) {
      day = a;
      month = b;
    } else if (b > 12) {
      month = a;
      day = b;
    } else if (sep === '/') {
      // Standard Superstore CSV convention: M/D/YYYY
      month = a;
      day = b;
    } else {
      // Standard Indian hyphenated convention: DD-MM-YYYY
      day = a;
      month = b;
    }

    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return isValidIsoDate(iso) ? iso : '';
  }

  return '';
}

// Validate form inputs where discount is entered as a percentage (0 to 80).
export function validateOrderForm(values) {
  const errors = {};
  const today = getTodayIsoDate();

  const orderDate = String(values.orderDate || '').trim();
  if (!orderDate) {
    errors.orderDate = 'Order date is required.';
  } else if (!isValidIsoDate(orderDate)) {
    errors.orderDate = 'Enter a valid date (YYYY-MM-DD).';
  } else if (orderDate > today) {
    errors.orderDate = 'Order date cannot be in the future.';
  }

  const customerName = String(values.customerName || '').trim();
  if (!customerName) {
    errors.customerName = 'Customer name is required.';
  }

  const segment = String(values.segment || '').trim();
  if (!SEGMENTS.includes(segment)) {
    errors.segment = 'Select a valid segment.';
  }

  const region = String(values.region || '').trim();
  if (!REGIONS.includes(region)) {
    errors.region = 'Select a valid region.';
  }

  const category = String(values.category || '').trim();
  if (!CATEGORIES.includes(category)) {
    errors.category = 'Select a valid category.';
  }

  const subCategory = String(values.subCategory || '').trim();
  const allowedSubs = SUB_CATEGORIES[category] || [];
  if (!subCategory || !allowedSubs.includes(subCategory)) {
    errors.subCategory = 'Select a valid sub-category.';
  }

  const productName = String(values.productName || '').trim();
  if (!productName) {
    errors.productName = 'Product name is required.';
  }

  const shipMode = String(values.shipMode || '').trim();
  if (!SHIP_MODES.includes(shipMode)) {
    errors.shipMode = 'Select a valid ship mode.';
  }

  const qtyRaw = String(values.quantity ?? '').trim();
  const qtyNum = Number(qtyRaw);
  if (qtyRaw === '' || !Number.isInteger(qtyNum) || qtyNum < 1) {
    errors.quantity = 'Quantity must be a whole number of at least 1.';
  }

  const salesRaw = String(values.sales ?? '').trim();
  const salesNum = Number(salesRaw);
  if (salesRaw === '' || !Number.isFinite(salesNum) || salesNum <= 0) {
    errors.sales = 'Sales must be greater than 0.';
  }

  const discRaw = String(values.discountPercent ?? '').trim();
  const discPct = Number(discRaw);
  if (discRaw === '' || !Number.isFinite(discPct) || discPct < 0 || discPct > 80) {
    errors.discountPercent = 'Discount must be between 0% and 80%.';
  }

  const profitRaw = String(values.profit ?? '').trim();
  const profitNum = Number(profitRaw);
  if (profitRaw === '' || !Number.isFinite(profitNum)) {
    errors.profit = 'Enter a valid profit or loss amount.';
  }

  const isValid = Object.keys(errors).length === 0;
  if (!isValid) {
    return { isValid: false, errors, cleanOrder: null };
  }

  const discountFraction = Math.round(discPct * 100) / 10000;

  return {
    isValid: true,
    errors: {},
    cleanOrder: {
      orderDate,
      customerName,
      segment,
      region,
      category,
      subCategory,
      productName,
      quantity: qtyNum,
      sales: Math.round(salesNum * 100) / 100,
      discount: discountFraction,
      profit: Math.round(profitNum * 100) / 100,
      shipMode,
    },
  };
}

function matchAllowed(raw, allowedList) {
  const target = String(raw || '').trim().toLowerCase();
  return allowedList.find((item) => item.toLowerCase() === target) || '';
}

function normalizeShipMode(raw) {
  const cleaned = String(raw || '').trim();
  if (cleaned.toLowerCase() === 'standard class') {
    return 'Standard';
  }
  return matchAllowed(cleaned, SHIP_MODES);
}

function normalizeRegion(raw) {
  const cleaned = String(raw || '').trim();
  if (cleaned.toLowerCase() === 'center') {
    return 'Central';
  }
  return matchAllowed(cleaned, REGIONS);
}

// Validate a single parsed CSV row (supports native schema and Superstore CSV format).
export function validateCsvRow(row, rowNumber) {
  const today = getTodayIsoDate();

  const rawDate = String(row.orderDate ?? '').trim();
  const orderDate = parseFlexibleCsvDate(rawDate);
  if (!orderDate) {
    return {
      error: `Row ${rowNumber}: Invalid orderDate "${rawDate}" (use YYYY-MM-DD, DD-MM-YYYY, or M/D/YYYY).`,
    };
  }
  if (orderDate > today) {
    return {
      error: `Row ${rowNumber}: orderDate "${orderDate}" cannot be in the future.`,
    };
  }

  const customerName = String(row.customerName ?? '').trim();
  if (!customerName) {
    return { error: `Row ${rowNumber}: customerName is required.` };
  }

  const segment = matchAllowed(row.segment, SEGMENTS);
  if (!segment) {
    return {
      error: `Row ${rowNumber}: Invalid segment "${row.segment || ''}".`,
    };
  }

  const region = normalizeRegion(row.region);
  if (!region) {
    return {
      error: `Row ${rowNumber}: Invalid region "${row.region || ''}".`,
    };
  }

  const category = matchAllowed(row.category, CATEGORIES);
  if (!category) {
    return {
      error: `Row ${rowNumber}: Invalid category "${row.category || ''}".`,
    };
  }

  const subCategory = String(row.subCategory ?? '').trim();
  if (!subCategory) {
    return { error: `Row ${rowNumber}: subCategory is required.` };
  }

  const productName = String(row.productName ?? '').trim();
  if (!productName) {
    return { error: `Row ${rowNumber}: productName is required.` };
  }

  const shipMode = normalizeShipMode(row.shipMode);
  if (!shipMode) {
    return {
      error: `Row ${rowNumber}: Invalid shipMode "${row.shipMode || ''}".`,
    };
  }

  const qtyStr = String(row.quantity ?? '').replace(/,/g, '').trim();
  const quantity = Number(qtyStr);
  if (qtyStr === '' || !Number.isInteger(quantity) || quantity < 1) {
    return { error: `Row ${rowNumber}: quantity must be an integer >= 1.` };
  }

  const salesStr = String(row.sales ?? '').replace(/[₹$,\s]/g, '');
  const sales = Number(salesStr);
  if (salesStr === '' || !Number.isFinite(sales) || sales <= 0) {
    return { error: `Row ${rowNumber}: sales must be a number > 0.` };
  }

  const rawDiscStr = String(row.discount ?? '').trim();
  let discount;
  if (rawDiscStr === '') {
    discount = 0;
  } else if (rawDiscStr.endsWith('%')) {
    discount = Number(rawDiscStr.slice(0, -1)) / 100;
  } else {
    discount = Number(rawDiscStr);
  }
  if (!Number.isFinite(discount) || discount < 0 || discount > 0.8) {
    return {
      error: `Row ${rowNumber}: discount "${rawDiscStr}" must be between 0 and 0.8.`,
    };
  }

  const profitStr = String(row.profit ?? '').replace(/[₹$,\s]/g, '');
  const profit = Number(profitStr);
  if (profitStr === '' || !Number.isFinite(profit)) {
    return { error: `Row ${rowNumber}: profit must be a valid number.` };
  }

  return {
    order: {
      id: String(row.id ?? '').trim(),
      orderDate,
      customerName,
      segment,
      region,
      category,
      subCategory,
      productName,
      quantity,
      sales: Math.round(sales * 100) / 100,
      discount: Math.round(discount * 10000) / 10000,
      profit: Math.round(profit * 100) / 100,
      shipMode,
    },
  };
}

// Verify that an order read from localStorage has valid required fields and numeric types.
export function isValidStoredOrder(item) {
  if (!item || typeof item !== 'object') return false;
  if (typeof item.id !== 'string' || !item.id.trim()) return false;
  if (!isValidIsoDate(item.orderDate)) return false;
  if (typeof item.customerName !== 'string' || !item.customerName.trim()) return false;
  if (!SEGMENTS.includes(item.segment)) return false;
  if (!REGIONS.includes(item.region)) return false;
  if (!CATEGORIES.includes(item.category)) return false;
  if (typeof item.subCategory !== 'string' || !item.subCategory.trim()) return false;
  if (typeof item.productName !== 'string' || !item.productName.trim()) return false;
  if (!SHIP_MODES.includes(item.shipMode)) return false;
  if (!Number.isInteger(item.quantity) || item.quantity < 1) return false;
  if (typeof item.sales !== 'number' || !Number.isFinite(item.sales) || item.sales <= 0) return false;
  if (typeof item.discount !== 'number' || !Number.isFinite(item.discount) || item.discount < 0 || item.discount > 0.8) return false;
  if (typeof item.profit !== 'number' || !Number.isFinite(item.profit)) return false;
  return true;
}
