import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

export function OwnerPayments() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Payment monitoring',
    subtitle: 'Maintenance dues by flat',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Payments' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const [p, f] = await Promise.all([
          api.get(`/payments?owner_id=${user.userId}`),
          api.get(`/flats?owner_id=${user.userId}`),
        ]);
        setRows(p.data);
        setFlats(f.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.userId]);

  const unpaid = useMemo(
    () => flats.map((f) => ({ flat_id: f.flat_id, flat_no: f.flat_no, amount: Number(f.rent) || 8500, status: f.occupancy_status === 'Occupied' ? 'Due (demo)' : 'Vacant' })),
    [flats]
  );

  return (
    <div className="space-y-6">
      <DashboardCard title="Paid records" subtitle="Payments from residents in your flats">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'payment_id', label: 'ID' },
              { key: 'resident_name', label: 'Resident' },
              { key: 'flat_no', label: 'Flat' },
              { key: 'amount', label: 'Amount', render: (r) => `₹${Number(r.amount).toLocaleString('en-IN')}` },
              { key: 'date', label: 'Date' },
              { key: 'mode', label: 'Mode' },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.payment_id }))}
          />
        )}
      </DashboardCard>

      <DashboardCard title="Maintenance snapshot" subtitle="Per-flat status">
        <DataTable
          searchable={false}
          columns={[
            { key: 'flat_no', label: 'Flat' },
            { key: 'flat_id', label: 'Flat ID' },
            { key: 'amount', label: 'Rent/Due', render: (r) => `₹${Number(r.amount).toLocaleString('en-IN')}` },
            { key: 'status', label: 'Status' },
          ]}
          rows={unpaid.map((r) => ({ ...r, id: r.flat_id }))}
        />
      </DashboardCard>
    </div>
  );
}
