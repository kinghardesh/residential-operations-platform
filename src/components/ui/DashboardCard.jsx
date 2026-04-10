import { clsx } from '@/lib/cn';

export function DashboardCard({ title, subtitle, icon: Icon, children, className, action }) {
  return (
    <div className={clsx('rounded-xl border border-slate-200 bg-white p-5 shadow-card', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            {title && <h3 className="font-semibold text-slate-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    violet: 'bg-violet-50 text-violet-600',
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accents[accent]}`}>
          <Icon className="h-4 w-4" />
        </span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
      {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
    </div>
  );
}
