// Fast CSV import (supports 5,000+ rows and Superstore columns), template download, and export.

import Papa from 'papaparse';
import { createIdAllocator } from './storage.js';
import { validateCsvRow } from './validate.js';

export const CSV_HEADERS = [
  'id',
  'orderDate',
  'customerName',
  'segment',
  'region',
  'category',
  'subCategory',
  'productName',
  'quantity',
  'sales',
  'discount',
  'profit',
  'shipMode',
];

const REQUIRED_COLUMNS = [
  'orderDate',
  'customerName',
  'segment',
  'region',
  'category',
  'subCategory',
  'productName',
  'quantity',
  'sales',
  'profit',
  'shipMode',
];

// Map native headers and Superstore CSV headers to canonical field names.
const HEADER_ALIASES = {
  id: 'id',
  orderid: 'id',
  orderdate: 'orderDate',
  date: 'orderDate',
  customername: 'customerName',
  customer: 'customerName',
  segment: 'segment',
  region: 'region',
  category: 'category',
  subcategory: 'subCategory',
  productname: 'productName',
  product: 'productName',
  quantity: 'quantity',
  qty: 'quantity',
  sales: 'sales',
  revenue: 'sales',
  discount: 'discount',
  profit: 'profit',
  shipmode: 'shipMode',
};

function normalizeHeader(header) {
  const key = String(header || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  return HEADER_ALIASES[key] || header;
}

// Parse and validate a CSV File or string in O(N) time via PapaParse.
export function parseOrdersCsv(file, existingOrders = []) {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      transformHeader: normalizeHeader,
      complete: (results) => {
        const fields = (results.meta && results.meta.fields) || [];
        const missingCols = REQUIRED_COLUMNS.filter(
          (col) => !fields.includes(col)
        );
        if (missingCols.length > 0) {
          resolve({
            importedOrders: [],
            skippedCount: (results.data && results.data.length) || 0,
            errors: [
              `Missing required CSV column${missingCols.length === 1 ? '' : 's'}: ${missingCols.join(', ')}.`,
            ],
          });
          return;
        }

        const rows = results.data || [];
        if (rows.length === 0) {
          resolve({
            importedOrders: [],
            skippedCount: 0,
            errors: ['The selected CSV file contains no order rows.'],
          });
          return;
        }

        const allocateId = createIdAllocator(existingOrders);
        const importedOrders = [];
        const errors = [];

        for (let i = 0; i < rows.length; i += 1) {
          const rowNumber = i + 2; // Line 1 is header
          const check = validateCsvRow(rows[i], rowNumber);
          if (check.error) {
            errors.push(check.error);
          } else {
            const order = check.order;
            order.id = allocateId(order.id);
            importedOrders.push(order);
          }
        }

        resolve({
          importedOrders,
          skippedCount: errors.length,
          errors,
        });
      },
      error: (err) => {
        resolve({
          importedOrders: [],
          skippedCount: 1,
          errors: [
            `Unable to parse CSV file: ${err.message || 'Invalid file format'}`,
          ],
        });
      },
    });
  });
}

function downloadBlob(csvString, filename) {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.setAttribute('download', filename);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

// Download a CSV template containing the exact headers and 2 example rows.
export function downloadCsvTemplate() {
  const exampleRows = [
    {
      id: 'ORD-2001',
      orderDate: '2025-10-14',
      customerName: 'Aarav Sharma',
      segment: 'Corporate',
      region: 'North',
      category: 'Technology',
      subCategory: 'Laptops',
      productName: 'Lenovo ThinkPad E14 Gen 5',
      quantity: 2,
      sales: 115200,
      discount: 0.1,
      profit: 35600,
      shipMode: 'Standard',
    },
    {
      id: 'ORD-2002',
      orderDate: '2025-11-05',
      customerName: 'Priya Deshmukh',
      segment: 'Consumer',
      region: 'West',
      category: 'Furniture',
      subCategory: 'Chairs',
      productName: 'Featherlite Astro High Back Chair',
      quantity: 3,
      sales: 21240,
      discount: 0.4,
      profit: -7780,
      shipMode: 'Second Class',
    },
  ];
  const csv = Papa.unparse({ fields: CSV_HEADERS, data: exampleRows });
  downloadBlob(csv, 'sales-orders-template.csv');
}

// Export an array of orders as a downloadable CSV file.
export function exportOrdersToCsv(orders, filename = 'sales-orders.csv') {
  const rows = orders.map((o) => ({
    id: o.id,
    orderDate: o.orderDate,
    customerName: o.customerName,
    segment: o.segment,
    region: o.region,
    category: o.category,
    subCategory: o.subCategory,
    productName: o.productName,
    quantity: o.quantity,
    sales: o.sales,
    discount: o.discount,
    profit: o.profit,
    shipMode: o.shipMode,
  }));
  const csv = Papa.unparse({ fields: CSV_HEADERS, data: rows });
  downloadBlob(csv, filename);
}
