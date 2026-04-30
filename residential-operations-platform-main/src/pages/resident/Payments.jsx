import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

const modes = [
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Net Banking', label: 'Net Banking' },
];

export function Payments() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('8500');
  const [mode, setMode] = useState('UPI');

  usePageMeta({
    title: 'Payments',
    subtitle: 'Maintenance and charges',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Payments' }],
  });

  async function reload() {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/payments?resident_id=${user.userId}`);
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, [user?.userId]);

  const total = useMemo(() => rows.reduce((s, p) => s + Number(p.amount || 0), 0), [rows]);

  async function pay(e) {
    e.preventDefault();
    try {
      await api.post('/payments', {
        resident_id: user?.userId,
        amount: Number(amount),
        mode,
      });
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Payment failed');
    }
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
          </form>
        </DashboardCard>
        <DashboardCard title="Summary" subtitle="Your payment activity">
          <p className="text-sm text-slate-600">
            Total recorded against your resident ID:{' '}
            <span className="font-semibold text-slate-900">₹{total.toLocaleString('en-IN')}</span>
          </p>
        </DashboardCard>
      </div>

      <DashboardCard title="Payment history" subtitle="payment_id, amount, date, mode, resident_id">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'payment_id', label: 'Payment ID' },
              { key: 'amount', label: 'Amount', render: (r) => `₹${Number(r.amount).toLocaleString('en-IN')}` },
              { key: 'date', label: 'Date' },
              { key: 'mode', label: 'Mode' },
              { key: 'resident_id', label: 'Resident' },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.payment_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
