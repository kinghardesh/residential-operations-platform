import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { flats, getResidentById, payments } from '@/data/mockData';

export function OwnerPayments() {
  const { user } = useAuth();

  usePageMeta({
    title: 'Payment monitoring',
    subtitle: 'Maintenance dues by flat',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Payments' }],
  });

  const ownedFlats = useMemo(() => flats.filter((f) => f.owner_id === user?.userId), [user?.userId]);
  const flatIds = new Set(ownedFlats.map((f) => f.flat_id));

  const rows = useMemo(() => {
    return payments
      .filter((p) => {
        const res = getResidentById(p.resident_id);
        return res && flatIds.has(res.flat_id);
      })
      .map((p) => {
        const res = getResidentById(p.resident_id);
        return {
          ...p,
          flat_id: res?.flat_id,
          resident_name: res?.name,
          status: 'Paid',
        };
      });
  }, [flatIds]);

  const unpaid = useMemo(() => {
    return ownedFlats.map((f) => ({
      flat_id: f.flat_id,
      flat_no: f.flat_no,
      status: 'Unpaid (demo)',
      amount: 8500,
    }));
  }, [ownedFlats]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Paid records" subtitle="Payments from residents in your flats">
        <DataTable
          columns={[
            { key: 'payment_id', label: 'ID' },
            { key: 'resident_name', label: 'Resident' },
            { key: 'flat_id', label: 'Flat' },
            { key: 'amount', label: 'Amount', render: (r) => `₹${r.amount.toLocaleString('en-IN')}` },
            { key: 'date', label: 'Date' },
            { key: 'mode', label: 'Mode' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.payment_id }))}
        />
      </DashboardCard>

      <DashboardCard title="Maintenance snapshot" subtitle="Demo unpaid rows per flat">
        <DataTable
          searchable={false}
          columns={[
            { key: 'flat_no', label: 'Flat' },
            { key: 'flat_id', label: 'Flat ID' },
            { key: 'amount', label: 'Due (demo)', render: (r) => `₹${r.amount.toLocaleString('en-IN')}` },
            { key: 'status', label: 'Status' },
          ]}
          rows={unpaid.map((r) => ({ ...r, id: r.flat_id }))}
        />
      </DashboardCard>
    </div>
  );
}
