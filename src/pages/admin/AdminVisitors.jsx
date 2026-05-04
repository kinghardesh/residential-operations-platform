import { useEffect, useMemo, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { FormInput } from '@/components/ui/FormInput';
import api from '@/lib/api';

export function AdminVisitors() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flatQ, setFlatQ] = useState('');
  const [dateQ, setDateQ] = useState('');

  usePageMeta({
    title: 'Visitor monitoring',
    subtitle: 'Search by flat or date',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Visitors' }],
  });

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/visitors');
      setRows(res.data);
    } catch {
      setError('Failed to load visitors.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((v) => {
      const flatStr = `${v.flat_id ?? ''} ${v.flat_no ?? ''}`.toLowerCase();
      if (flatQ && !flatStr.includes(flatQ.toLowerCase())) return false;
      if (dateQ && !(v.visit_date || '').includes(dateQ)) return false;
      return true;
    });
  }, [rows, flatQ, dateQ]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Full visitor log" subtitle="visitor_id, name, visit_date, times, flat_id">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="min-w-[200px]">
            <FormInput label="Flat ID / number" value={flatQ} onChange={(e) => setFlatQ(e.target.value)} placeholder="A-101" />
          </div>
          <div className="min-w-[160px]">
            <FormInput label="Date contains" value={dateQ} onChange={(e) => setDateQ(e.target.value)} placeholder="2026-04" />
          </div>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'visitor_id', label: 'ID' },
              { key: 'name', label: 'Visitor' },
              { key: 'flat_no', label: 'Flat', render: (r) => r.flat_no ?? r.flat_id ?? '—' },
              { key: 'visit_date', label: 'Date' },
              { key: 'visit_time', label: 'In' },
              { key: 'exit_time', label: 'Out' },
            ]}
            rows={filtered.map((r) => ({ ...r, id: r.visitor_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
