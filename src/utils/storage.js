// Browser localStorage persistence with corruption recovery and O(1) ID generation.

import { getSampleData } from '../data/sampleData.js';
import { isValidStoredOrder } from './validate.js';

export const STORAGE_KEY = 'sales_dashboard_orders_v2';

// Load orders from localStorage, recovering safely from corrupted JSON or malformed items.
export function loadStoredState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const initial = getSampleData();
      saveStoredOrders(initial);
      return { orders: initial, warning: '' };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      saveStoredOrders([]);
      return {
        orders: [],
        warning:
          'Stored browser data was invalid and has been reset. You can load sample data or upload a CSV.',
      };
    }

    const validOrders = parsed.filter(isValidStoredOrder);
    if (validOrders.length !== parsed.length) {
      const removed = parsed.length - validOrders.length;
      saveStoredOrders(validOrders);
      return {
        orders: validOrders,
        warning: `Recovered stored data and skipped ${removed} corrupted record${removed === 1 ? '' : 's'}.`,
      };
    }

    return { orders: validOrders, warning: '' };
  } catch {
    saveStoredOrders([]);
    return {
      orders: [],
      warning:
        'Saved browser data was corrupted and has been reset. You can load sample data or upload a CSV.',
    };
  }
}

// Save the full orders array into localStorage and report quota errors cleanly.
export function saveStoredOrders(orders) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return { ok: true, error: '' };
  } catch {
    return {
      ok: false,
      error: 'Browser localStorage limit reached. Export CSV or clear older orders.',
    };
  }
}

// Build a fast O(1) unique ID allocator initialized once from existing orders.
export function createIdAllocator(existingOrders = []) {
  const usedIds = new Set();
  let maxNum = 1000;

  for (const order of existingOrders) {
    const idStr = String(order.id || '').trim();
    if (idStr) {
      usedIds.add(idStr);
      const match = /^ORD-(\d+)$/i.exec(idStr);
      if (match) {
        const val = Number(match[1]);
        if (val > maxNum) maxNum = val;
      }
    }
  }

  return function allocateId(preferredId = '') {
    const candidate = String(preferredId || '').trim();
    if (candidate && !usedIds.has(candidate)) {
      usedIds.add(candidate);
      const match = /^ORD-(\d+)$/i.exec(candidate);
      if (match) {
        const val = Number(match[1]);
        if (val > maxNum) maxNum = val;
      }
      return candidate;
    }

    let nextId;
    do {
      maxNum += 1;
      nextId = `ORD-${maxNum}`;
    } while (usedIds.has(nextId));
    usedIds.add(nextId);
    return nextId;
  };
}

// Generate a single next sequential order ID.
export function generateNextOrderId(orders = []) {
  const allocate = createIdAllocator(orders);
  return allocate();
}
