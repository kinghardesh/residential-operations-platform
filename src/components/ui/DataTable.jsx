import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { clsx } from '@/lib/cn';
import { TableSkeleton } from './LoadingSkeleton';

export function DataTable({
  columns,
  rows,
  searchable = true,
  searchKeys,
  pageSize = 8,
  loading,
  emptyMessage = 'No records found.',
}) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const lower = q.toLowerCase();
    return rows.filter((row) => {
      const keys = searchKeys || Object.keys(row);
      return keys.some((k) => String(row[k] ?? '').toLowerCase().includes(lower));
    });
  }, [rows, q, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages - 1);
  const slice = filtered.slice(pageSafe * pageSize, pageSafe * pageSize + pageSize);

  if (loading) {
    return <TableSkeleton cols={columns.length} rows={5} />;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
      {searchable && (
        <div className="border-b border-slate-100 p-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="Search…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              slice.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-slate-50/80">
                  {columns.map((c) => (
                    <td key={c.key} className={clsx('px-4 py-3 text-slate-800', c.className)}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
          <span>
            Page {pageSafe + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pageSafe === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <button
              type="button"
              disabled={pageSafe >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
