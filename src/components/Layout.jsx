// App shell with fixed 200px left sidebar, per-route document title, and storage notice bar.

import { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/add', label: 'Add Data', end: false },
  { to: '/orders', label: 'Orders', end: false },
  { to: '/about', label: 'About', end: false },
];

const ROUTE_TITLES = {
  '/': 'Dashboard | Sales Dashboard',
  '/add': 'Add Data | Sales Dashboard',
  '/orders': 'Orders | Sales Dashboard',
  '/about': 'About | Sales Dashboard',
};

export default function Layout({ storageNotice, onDismissNotice }) {
  const location = useLocation();

  useEffect(() => {
    document.title = ROUTE_TITLES[location.pathname] || 'Sales Dashboard';
  }, [location.pathname]);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">Sales Dashboard</div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-area">
        {storageNotice && (
          <div className="notice-banner" role="alert">
            <span>{storageNotice}</span>
            <button
              type="button"
              className="btn btn-sm"
              onClick={onDismissNotice}
            >
              Dismiss
            </button>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}
