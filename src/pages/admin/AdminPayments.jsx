import { useMemo, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Select } from '@/components/ui/Select';
import { FormInput } from '@/components/ui/FormInput';
import { getResidentById, payments as seed } from '@/data/mockData';

const modes = [
  { value: '', label: 'All modes' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Net Banking', label: 'Net Banking' },
];

export function AdminPayments() {
  const [mode, setMode] = useState('');
  const [dateQ, setDateQ] = useState('');
  const [resQ, setResQ] = useState('');

  usePageMeta({
    title: 'Payment management',
    subtitle: 'Filter by resident, date, mode',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Payments' }],
  });

  const rows = useMemo(() => {
    return seed.filter((p) => {
      if (mode && p.mode !== mode) return false;
      if (dateQ && !p.date.includes(dateQ)) return false;
      if (resQ) {
        const r = getResidentById(p.resident_id);
        const hay = `${p.resident_id} ${r?.name ?? ''}`.toLowerCase();
        if (!hay.includes(resQ.toLowerCase())) return false;
      }
      return true;
    });
  }, [mode, dateQ, resQ]);

  return (
    <div className="space-y-6">
      <DashboardCard title="All payments" subtitle="payment_id, amount, date, mode, resident_id">
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="min-w-[160px]">
            <Select label="Mode" options={modes} value={mode} onChange={(e) => setMode(e.target.value)} />
          </div>
          <div className="min-w-[160px]">
            <FormInput label="Date contains" value={dateQ} onChange={(e) => setDateQ(e.target.value)} placeholder="2026-04" />
          </div>
          <div className="min-w-[200px]">
            <FormInput
              label="Resident search"
              value={resQ}
              onChange={(e) => setResQ(e.target.value)}
              placeholder="Name or resident_id"
            />
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'payment_id', label: 'ID' },
            { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount.toLocaleString('en-IN')}` },
            { key: 'date', label: 'Date' },
            { key: 'mode', label: 'Mode' },
            { key: 'resident_id', label: 'Resident ID' },
            {
              key: 'resident_name',
              label: 'Resident',
              render: (row) => getResidentById(row.resident_id)?.name ?? '—',
            },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.payment_id }))}
        />
      </DashboardCard>
    </div>
  );
}
