import { useEffect, useMemo, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Select';
import { FormInput } from '@/components/ui/FormInput';
import api from '@/lib/api';

const modes = [
  { value: '', label: 'All modes' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Net Banking', label: 'Net Banking' },
  { value: 'Online', label: 'Online' },
];

export function AdminPayments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('');
  const [dateQ, setDateQ] = useState('');
  const [resQ, setResQ] = useState('');

  usePageMeta({
    title: 'Payment management',
    subtitle: 'Filter by resident, date, mode',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Payments' }],
  });

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/payments');
      setRows(res.data);
    } catch {
      setError('Failed to load payments.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    return rows.filter((p) => {
      if (mode && p.mode !== mode) return false;
      if (dateQ && !(p.date || '').includes(dateQ)) return false;
      if (resQ) {
        const hay = `${p.resident_id} ${p.resident_name ?? ''}`.toLowerCase();
        if (!hay.includes(resQ.toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, mode, dateQ, resQ]);

  return (
    <div className="space-y-6">
      <DashboardCard title="All payments" subtitle="payment_id, amount, date, mode, resident_id">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="min-w-[160px]">
            <Select label="Mode" options={modes} value={mode} onChange={(e) => setMode(e.target.value)} />
          </div>
          <div className="min-w-[160px]">
            <FormInput label="Date contains" value={dateQ} onChange={(e) => setDateQ(e.target.value)} placeholder="2026-04" />
          </div>
          <div className="min-w-[200px]">
            <FormInput label="Resident search" value={resQ} onChange={(e) => setResQ(e.target.value)} placeholder="Name or resident_id" />
          </div>
        </div>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'payment_id', label: 'ID' },
              { key: 'amount', label: 'Amount', render: (r) => `₹${Number(r.amount).toLocaleString('en-IN')}` },
              { key: 'date', label: 'Date' },
              { key: 'mode', label: 'Mode' },
              { key: 'resident_id', label: 'Resident ID' },
              { key: 'resident_name', label: 'Resident', render: (r) => r.resident_name ?? '—' },
            ]}
            rows={filtered.map((r) => ({ ...r, id: r.payment_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
