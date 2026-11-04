// Pure analytics calculation functions (no React dependencies).
// All functions safely handle empty arrays without NaN or division by zero.

import { formatCurrency, formatMonthYear, formatPercent } from './format.js';

// Filter orders by year, region, category, and segment ("All" or empty skips filter).
export function filterOrders(
  orders = [],
  { year = 'All', region = 'All', category = 'All', segment = 'All' } = {}
) {
  return orders.filter((order) => {
    if (year && year !== 'All') {
      const orderYear = String(order.orderDate || '').slice(0, 4);
      if (orderYear !== String(year)) return false;
    }
    if (region && region !== 'All' && order.region !== region) {
      return false;
    }
    if (category && category !== 'All' && order.category !== category) {
      return false;
    }
    if (segment && segment !== 'All' && order.segment !== segment) {
      return false;
    }
    return true;
  });
}

// Extract sorted distinct 4-digit years from the orders array.
export function getAvailableYears(orders = []) {
  const years = new Set();
  for (const order of orders) {
    const y = String(order.orderDate || '').slice(0, 4);
    if (/^\d{4}$/.test(y)) years.add(y);
  }
  return Array.from(years).sort();
}

// Compute the 6 summary KPIs for a set of orders.
export function getKpis(orders = []) {
  const orderCount = orders.length;
  if (orderCount === 0) {
    return {
      totalSales: 0,
      totalProfit: 0,
      profitMargin: 0,
      orderCount: 0,
      avgOrderValue: 0,
      customerCount: 0,
    };
  }

  let totalSales = 0;
  let totalProfit = 0;
  const customers = new Set();

  for (const order of orders) {
    totalSales += Number(order.sales) || 0;
    totalProfit += Number(order.profit) || 0;
    if (order.customerName) {
      customers.add(order.customerName);
    }
  }

  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

  return {
    totalSales,
    totalProfit,
    profitMargin,
    orderCount,
    avgOrderValue,
    customerCount: customers.size,
  };
}

// Aggregate monthly sales and profit chronologically (YYYY-MM).
export function monthlyTrend(orders = []) {
  const map = new Map();

  for (const order of orders) {
    const key = String(order.orderDate || '').slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(key)) continue;
    const entry = map.get(key) || { sales: 0, profit: 0 };
    entry.sales += Number(order.sales) || 0;
    entry.profit += Number(order.profit) || 0;
    map.set(key, entry);
  }

  const keys = Array.from(map.keys()).sort();
  return {
    keys,
    labels: keys.map(formatMonthYear),
    sales: keys.map((k) => Math.round(map.get(k).sales)),
    profit: keys.map((k) => Math.round(map.get(k).profit)),
  };
}

// Internal helper to group sales and profit by any categorical field.
function groupByField(orders, field) {
  const map = new Map();
  for (const order of orders) {
    const key = order[field] || 'Other';
    const entry = map.get(key) || { sales: 0, profit: 0, count: 0 };
    entry.sales += Number(order.sales) || 0;
    entry.profit += Number(order.profit) || 0;
    entry.count += 1;
    map.set(key, entry);
  }

  const sorted = Array.from(map.entries()).sort((a, b) => b[1].sales - a[1].sales);
  return {
    labels: sorted.map(([name]) => name),
    sales: sorted.map(([, v]) => Math.round(v.sales)),
    profit: sorted.map(([, v]) => Math.round(v.profit)),
    items: sorted.map(([name, v]) => ({
      name,
      sales: v.sales,
      profit: v.profit,
      count: v.count,
    })),
  };
}

// Aggregate sales and profit grouped by category.
export function salesByCategory(orders = []) {
  return groupByField(orders, 'category');
}

// Aggregate sales and profit grouped by region.
export function salesByRegion(orders = []) {
  return groupByField(orders, 'region');
}

// Aggregate sales and profit grouped by customer segment.
export function salesBySegment(orders = []) {
  return groupByField(orders, 'segment');
}

// Return top N products ranked by total sales.
export function topProducts(orders = [], n = 10) {
  const grouped = groupByField(orders, 'productName');
  const limit = Math.max(0, Number(n) || 10);
  return {
    labels: grouped.labels.slice(0, limit),
    sales: grouped.sales.slice(0, limit),
    profit: grouped.profit.slice(0, limit),
    items: grouped.items.slice(0, limit),
  };
}

// Build scatter points comparing discount percentage (x) against order profit margin % (y).
export function discountVsMargin(orders = []) {
  const points = [];
  for (const order of orders) {
    const sales = Number(order.sales) || 0;
    if (sales <= 0) continue;
    const profit = Number(order.profit) || 0;
    const discountPct = Math.round((Number(order.discount) || 0) * 1000) / 10;
    const marginPct = Math.round((profit / sales) * 1000) / 10;
    points.push({
      x: discountPct,
      y: marginPct,
      productName: order.productName,
      customerName: order.customerName,
      sales,
      profit,
    });
  }
  return points;
}

// Generate 5 data-driven plain-English insight sentences plus 1 recommendation.
// Returns null if there are fewer than 10 orders.
export function generateKeyInsights(orders = []) {
  if (!Array.isArray(orders) || orders.length < 10) {
    return null;
  }

  const kpis = getKpis(orders);
  const categories = salesByCategory(orders).items;
  const regions = salesByRegion(orders).items;
  const months = monthlyTrend(orders);
  const products = groupByField(orders, 'productName').items;

  const sentences = [];

  // 1. Best category by profit
  if (categories.length > 0) {
    const byProfit = [...categories].sort((a, b) => b.profit - a.profit);
    const bestCat = byProfit[0];
    const catMargin = bestCat.sales > 0 ? (bestCat.profit / bestCat.sales) * 100 : 0;
    sentences.push(
      `${bestCat.name} is the most profitable category with ${formatCurrency(bestCat.profit)} in profit (${formatPercent(catMargin)} margin).`
    );
  }

  // 2. Best and worst region by sales
  if (regions.length > 1) {
    const bestReg = regions[0];
    const worstReg = regions[regions.length - 1];
    sentences.push(
      `${bestReg.name} leads regional sales at ${formatCurrency(bestReg.sales)}, while ${worstReg.name} records the lowest sales at ${formatCurrency(worstReg.sales)}.`
    );
  } else if (regions.length === 1) {
    sentences.push(
      `All filtered orders are in the ${regions[0].name} region totaling ${formatCurrency(regions[0].sales)} in sales.`
    );
  }

  // 3. Peak sales month
  if (months.labels.length > 0) {
    let peakIdx = 0;
    for (let i = 1; i < months.sales.length; i += 1) {
      if (months.sales[i] > months.sales[peakIdx]) peakIdx = i;
    }
    sentences.push(
      `Peak monthly sales occurred in ${months.labels[peakIdx]} with ${formatCurrency(months.sales[peakIdx])} in revenue.`
    );
  }

  // 4. High discount (> 30%) margin vs overall margin
  const highDiscOrders = orders.filter((o) => (Number(o.discount) || 0) > 0.3);
  if (highDiscOrders.length > 0) {
    const hdKpis = getKpis(highDiscOrders);
    sentences.push(
      `Orders with a discount above 30% (${highDiscOrders.length} orders) average a ${formatPercent(hdKpis.profitMargin)} profit margin, compared to the overall margin of ${formatPercent(kpis.profitMargin)}.`
    );
  } else {
    sentences.push(
      `No orders in the current selection carry a discount above 30%, helping maintain an overall margin of ${formatPercent(kpis.profitMargin)}.`
    );
  }

  // 5. Product with the largest net loss (or lowest profit)
  const byLowestProfit = [...products].sort((a, b) => a.profit - b.profit);
  const worstProduct = byLowestProfit[0];
  if (worstProduct && worstProduct.profit < 0) {
    sentences.push(
      `${worstProduct.name} has the largest net loss at ${formatCurrency(worstProduct.profit)} across ${worstProduct.count} orders.`
    );
  } else if (worstProduct) {
    sentences.push(
      `Every product in this selection is profitable; ${worstProduct.name} contributes the smallest profit at ${formatCurrency(worstProduct.profit)}.`
    );
  }

  // Recommendation sentence derived from findings
  let recommendation;
  if (highDiscOrders.length > 0 && getKpis(highDiscOrders).profitMargin < 0) {
    const targetText =
      worstProduct && worstProduct.profit < 0
        ? `, especially on ${worstProduct.name}`
        : '';
    recommendation = `Cap promotional discounts at 25% to 30%${targetText}, as steeper discounts consistently turn orders unprofitable.`;
  } else if (worstProduct && worstProduct.profit < 0) {
    recommendation = `Review unit pricing and supplier costs for ${worstProduct.name} to eliminate recurring order losses.`;
  } else {
    const topCat = categories[0] ? categories[0].name : 'top-performing categories';
    recommendation = `Maintain current discount discipline and expand inventory in ${topCat} ahead of peak fourth-quarter demand.`;
  }

  return { sentences, recommendation };
}
