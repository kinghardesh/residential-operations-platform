import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-slate-500 mb-4 flex-wrap" aria-label="Breadcrumb">
      <Link to="/" className="inline-flex items-center gap-1 hover:text-brand-600 transition-colors">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
          {item.to && i < items.length - 1 ? (
            <Link to={item.to} className="hover:text-brand-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
