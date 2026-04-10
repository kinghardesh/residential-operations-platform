import { clsx } from '@/lib/cn';

export function Skeleton({ className }) {
  return <div className={clsx('animate-pulse rounded-md bg-slate-200', className)} />;
}

export function CardGridSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ cols = 5, rows = 6 }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
      <Skeleton className="mb-4 h-9 w-full max-w-xs" />
      <div className="space-y-2">
        <div className="flex gap-2">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-2">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-10 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-32" />
      </div>
      <CardGridSkeleton />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
