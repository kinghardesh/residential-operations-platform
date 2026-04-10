import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Search, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { clsx } from '@/lib/cn';
import Logo from '/Logo.png';

export function Navbar({ title, subtitle, showSearch, onSearch, onMenuClick }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handle(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const demoNotifications = [
    { id: 1, text: 'Maintenance invoice due in 3 days', time: '2h ago' },
    { id: 2, text: 'New society circular published', time: '1d ago' },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-white/80 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="truncate text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {showSearch && (
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search tables, records…"
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none ring-brand-500 focus:border-brand-300 focus:bg-white focus:ring-2"
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white py-2 shadow-card-lg">
              <p className="border-b border-slate-100 px-4 py-2 text-xs font-semibold uppercase text-slate-500">
                Notifications
              </p>
              <ul className="max-h-64 overflow-y-auto">
                {demoNotifications.map((n) => (
                  <li key={n.id} className="px-4 py-3 text-sm hover:bg-slate-50">
                    <p className="text-slate-800">{n.text}</p>
                    <p className="mt-1 text-xs text-slate-400">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              'flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 pl-2 pr-2 text-left hover:bg-slate-50',
              open && 'ring-2 ring-brand-500/20'
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <User className="h-4 w-4" />
            </span>
            <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-800 sm:block">
              {user?.displayName || 'User'}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-card-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-medium text-slate-900">{user?.displayName}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                <p className="mt-1 text-xs capitalize text-brand-600">{user?.role}</p>
              </div>
              <Link
                to={
                  user?.role === 'resident'
                    ? '/resident/profile'
                    : user?.role === 'owner'
                      ? '/owner/dashboard'
                      : '/admin/dashboard'
                }
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" /> Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
