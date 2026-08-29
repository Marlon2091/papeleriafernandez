import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowLeftRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  Package,
  Ruler,
  Tags,
  Truck,
  Users,
  Wrench
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavItems } from '../hooks/useNavItems';

const ICONS = {
  LayoutDashboard,
  Package,
  Ruler,
  Tags,
  Truck,
  Wrench,
  ArrowLeftRight,
  Users
};

const COLLAPSE_KEY = 'papeleria_sidebar_collapsed';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const items = useNavItems();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
      return false;
    }
  });

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        // almacenamiento no disponible (modo privado, etc.) — no es crítico
      }
      return next;
    });
  }

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <span className="sidebar-brand">Papelería Fernández</span>}
        <button
          type="button"
          className="secondary sidebar-toggle"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon size={18} />}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <span className="sidebar-user">
            {user?.nombre} · <strong>{user?.rol}</strong>
          </span>
        )}
        <button
          type="button"
          className="secondary sidebar-logout"
          onClick={logout}
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && 'Cerrar sesión'}
        </button>
      </div>
    </aside>
  );
}
