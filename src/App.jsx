// Root application component configuring React Router routes and persistent orders state.

import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import { getSampleData } from './data/sampleData.js';
import About from './pages/About.jsx';
import AddData from './pages/AddData.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Orders from './pages/Orders.jsx';
import {
  generateNextOrderId,
  loadStoredState,
  saveStoredOrders,
} from './utils/storage.js';

export default function App() {
  const [initialState] = useState(() => loadStoredState());
  const [orders, setOrders] = useState(initialState.orders);
  const [storageNotice, setStorageNotice] = useState(initialState.warning);

  useEffect(() => {
    const result = saveStoredOrders(orders);
    if (!result.ok) {
      setStorageNotice(result.error);
    }
  }, [orders]);

  function handleAddOrder(cleanOrder) {
    setOrders((prev) => {
      const nextOrder = {
        id: generateNextOrderId(prev),
        ...cleanOrder,
      };
      return [nextOrder, ...prev];
    });
  }

  function handleUpdateOrder(orderId, cleanFields) {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId ? { ...cleanFields, id: orderId } : item
      )
    );
  }

  function handleDeleteOrder(orderId) {
    setOrders((prev) => prev.filter((item) => item.id !== orderId));
  }

  function handleImportOrders(importedOrders, mode) {
    if (mode === 'replace') {
      setOrders(importedOrders);
    } else {
      setOrders((prev) => [...importedOrders, ...prev]);
    }
  }

  function handleLoadSample() {
    const sample = getSampleData();
    setOrders(sample);
    return sample.length;
  }

  function handleClearAll() {
    setOrders([]);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              storageNotice={storageNotice}
              onDismissNotice={() => setStorageNotice('')}
            />
          }
        >
          <Route
            path="/"
            element={
              <Dashboard orders={orders} onLoadSample={handleLoadSample} />
            }
          />
          <Route
            path="/add"
            element={
              <AddData
                orders={orders}
                onAddOrder={handleAddOrder}
                onImportOrders={handleImportOrders}
                onLoadSample={handleLoadSample}
                onClearAll={handleClearAll}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <Orders
                orders={orders}
                onUpdateOrder={handleUpdateOrder}
                onDeleteOrder={handleDeleteOrder}
                onLoadSample={handleLoadSample}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
