import { NavLink } from 'react-router-dom';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from '@/lib/cn';

export function Sidebar({ items, collapsed, onToggle, title = 'ROP', mobileOpen, onCloseMobile }) {
  const closeIfMobile = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          aria-label="Close menu"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={clsx(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200',
          collapsed ? 'w-[72px]' : 'w-64',
          'max-lg:-translate-x-full max-lg:shadow-card-lg',
          mobileOpen && 'max-lg:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">{title}</p>
                <p className="truncate text-xs text-slate-500">Operations</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:inline-flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2 scrollbar-thin">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeIfMobile}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-3">
          {!collapsed && (
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Residential Operations Platform</p>
          )}
        </div>
      </aside>
    </>
  );
}
