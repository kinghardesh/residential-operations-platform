import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import { DataTable } from '@/components/ui/DataTable';
import { payments as seed } from '@/data/mockData';

const modes = [
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Net Banking', label: 'Net Banking' },
];

export function Payments() {
  const { user } = useAuth();
  const [rows, setRows] = useState(seed);
  const [amount, setAmount] = useState('8500');
  const [mode, setMode] = useState('UPI');

  usePageMeta({
    title: 'Payments',
    subtitle: 'Maintenance and charges',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Payments' }],
  });

  const mine = useMemo(() => rows.filter((p) => p.resident_id === user?.userId), [rows, user?.userId]);

  function pay(e) {
    e.preventDefault();
    const id = `PAY-${String(rows.length + 1).padStart(3, '0')}`;
    setRows([
      ...rows,
      {
        payment_id: id,
        amount: Number(amount),
        date: new Date().toISOString().slice(0, 10),
        mode,
        resident_id: user?.userId,
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Make payment" subtitle="Record a maintenance or ad-hoc payment">
          <form onSubmit={pay} className="space-y-4">
            <FormInput
              label="Amount (₹)"
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <Select label="Payment mode" options={modes} value={mode} onChange={(e) => setMode(e.target.value)} />
            <Button type="submit">Pay now</Button>
            <p className="text-xs text-slate-500">
              Demo only — integrates with payment gateway and backend APIs in production.
            </p>
          </form>
        </DashboardCard>
        <DashboardCard title="Summary" subtitle="Your payment activity">
          <p className="text-sm text-slate-600">
            Total recorded against your resident ID:{' '}
            <span className="font-semibold text-slate-900">
              ₹{mine.reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}
            </span>
          </p>
        </DashboardCard>
      </div>

      <DashboardCard title="Payment history" subtitle="payment_id, amount, date, mode, resident_id">
        <DataTable
          columns={[
            { key: 'payment_id', label: 'Payment ID' },
            { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount.toLocaleString('en-IN')}` },
            { key: 'date', label: 'Date' },
            { key: 'mode', label: 'Mode' },
            { key: 'resident_id', label: 'Resident' },
          ]}
          rows={mine.map((r) => ({ ...r, id: r.payment_id }))}
        />
      </DashboardCard>
    </div>
  );
}
