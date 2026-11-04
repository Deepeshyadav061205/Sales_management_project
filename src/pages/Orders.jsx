// Orders page with search, sortable columns, 20-row pagination, CSV export, and accessible Edit modal.

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderForm from '../components/OrderForm.jsx';
import OrdersTable from '../components/OrdersTable.jsx';
import { exportOrdersToCsv } from '../utils/csv.js';
import { formatInteger } from '../utils/format.js';

const PAGE_SIZE = 20;

export default function Orders({
  orders,
  onUpdateOrder,
  onDeleteOrder,
  onLoadSample,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState(null);

  // Close the edit modal when Escape is pressed.
  useEffect(() => {
    if (!editingOrder) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setEditingOrder(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingOrder]);

  const matchedOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter(
      (order) =>
        String(order.customerName || '').toLowerCase().includes(query) ||
        String(order.productName || '').toLowerCase().includes(query)
    );
  }, [orders, search]);

  const sortedOrders = useMemo(() => {
    const copy = [...matchedOrders];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      } else {
        cmp = String(av ?? '').localeCompare(String(bv ?? ''));
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [matchedOrders, sortKey, sortDirection]);

  const totalRows = sortedOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalRows);
  const visibleOrders = sortedOrders.slice(startIdx, endIdx);

  function handleSort(columnKey) {
    if (sortKey === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(columnKey);
      const defaultDesc =
        columnKey === 'orderDate' ||
        columnKey === 'sales' ||
        columnKey === 'profit' ||
        columnKey === 'quantity' ||
        columnKey === 'discount';
      setSortDirection(defaultDesc ? 'desc' : 'asc');
    }
    setPage(1);
  }

  function handleDeleteClick(order) {
    const confirmed = window.confirm(
      `Delete order ${order.id} for ${order.customerName}?`
    );
    if (!confirmed) return;
    onDeleteOrder(order.id);
  }

  function handleSaveEdit(cleanFields) {
    if (!editingOrder) return;
    onUpdateOrder(editingOrder.id, cleanFields);
    setEditingOrder(null);
  }

  if (orders.length === 0) {
    return (
      <div className="page-stack">
        <div className="page-header">
          <h1 className="page-title">Orders</h1>
        </div>
        <div className="card">
          <p>
            No orders are stored yet. Go to the <Link to="/add">Add Data</Link>{' '}
            page to enter an order or upload a CSV file, or load the sample
            dataset.
          </p>
          <div className="btn-group">
            <Link to="/add" className="btn btn-primary">
              Add Data
            </Link>
            <button type="button" className="btn" onClick={onLoadSample}>
              Load sample data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button
          type="button"
          className="btn"
          onClick={() => exportOrdersToCsv(sortedOrders)}
          disabled={sortedOrders.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="form-field search-field">
            <label htmlFor="orders-search">Search Orders</label>
            <input
              id="orders-search"
              type="search"
              placeholder="Customer or product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <span className="text-muted">
            {totalRows === 0
              ? 'Showing 0 of 0 orders'
              : `Showing ${formatInteger(startIdx + 1)} to ${formatInteger(endIdx)} of ${formatInteger(totalRows)} orders`}
          </span>
        </div>

        {totalRows === 0 ? (
          <div className="empty-search">
            <p className="text-muted">
              No orders match &quot;{search}&quot;.
            </p>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
            >
              Clear search
            </button>
          </div>
        ) : (
          <>
            <OrdersTable
              orders={visibleOrders}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={(order) => setEditingOrder(order)}
              onDelete={handleDeleteClick}
            />

            <div className="pagination-bar">
              <span className="text-muted">
                Page {formatInteger(safePage)} of {formatInteger(totalPages)}
              </span>

              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setPage(safePage - 1)}
                  disabled={safePage <= 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setPage(safePage + 1)}
                  disabled={safePage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {editingOrder && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setEditingOrder(null);
            }
          }}
        >
          <div className="card modal-card">
            <h2 id="edit-modal-title" className="card-title">
              Edit Order ({editingOrder.id})
            </h2>
            <OrderForm
              initialOrder={editingOrder}
              onSubmit={handleSaveEdit}
              onCancel={() => setEditingOrder(null)}
              submitLabel="Save Changes"
              autoFocusFirst
            />
          </div>
        </div>
      )}
    </div>
  );
}
