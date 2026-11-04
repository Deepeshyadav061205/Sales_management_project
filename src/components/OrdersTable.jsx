// Orders table component with clickable sortable column headers and Edit/Delete actions.

import {
  formatCurrency,
  formatDiscount,
  formatInteger,
} from '../utils/format.js';

const COLUMNS = [
  { key: 'orderDate', label: 'Date', numeric: false },
  { key: 'customerName', label: 'Customer', numeric: false },
  { key: 'productName', label: 'Product', numeric: false },
  { key: 'category', label: 'Category', numeric: false },
  { key: 'region', label: 'Region', numeric: false },
  { key: 'quantity', label: 'Qty', numeric: true },
  { key: 'sales', label: 'Sales', numeric: true },
  { key: 'discount', label: 'Discount', numeric: true },
  { key: 'profit', label: 'Profit', numeric: true },
];

export default function OrdersTable({
  orders,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}) {
  function sortSuffix(key) {
    if (sortKey !== key) return '';
    return sortDirection === 'asc' ? ' (asc)' : ' (desc)';
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={col.numeric ? 'num-cell' : undefined}
              >
                <button
                  type="button"
                  className="sort-btn"
                  onClick={() => onSort(col.key)}
                >
                  {col.label}
                  {sortSuffix(col.key)}
                </button>
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const profitClass =
              order.profit < 0
                ? 'text-loss'
                : order.profit > 0
                  ? 'text-profit'
                  : '';

            return (
              <tr key={order.id}>
                <td className="nowrap">{order.orderDate}</td>
                <td>{order.customerName}</td>
                <td>{order.productName}</td>
                <td>{order.category}</td>
                <td>{order.region}</td>
                <td className="num-cell">{formatInteger(order.quantity)}</td>
                <td className="num-cell">{formatCurrency(order.sales)}</td>
                <td className="num-cell">{formatDiscount(order.discount)}</td>
                <td className={`num-cell ${profitClass}`.trim()}>
                  {formatCurrency(order.profit)}
                </td>
                <td className="nowrap">
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => onEdit(order)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => onDelete(order)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
