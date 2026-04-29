import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { complaints, flats, getResidentById } from '@/data/mockData';

export function OwnerComplaints() {
  const { user } = useAuth();

  usePageMeta({
    title: 'Complaints',
    subtitle: 'Raised from your flats',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Complaints' }],
  });

  const ownedFlats = useMemo(() => flats.filter((f) => f.owner_id === user?.userId), [user?.userId]);
  const flatIds = new Set(ownedFlats.map((f) => f.flat_id));

  const rows = useMemo(
    () =>
      complaints
        .filter((c) => {
          const res = getResidentById(c.resident_id);
          return res && flatIds.has(res.flat_id);
        })
        .map((c) => {
          const res = getResidentById(c.resident_id);
          return { ...c, flat_id: res?.flat_id, resident_name: res?.name };
        }),
    [flatIds]
  );

  return (
    <div className="space-y-6">
      <DashboardCard title="Complaint monitoring" subtitle="complaint_id, category, date, status">
        <DataTable
          columns={[
            { key: 'complaint_id', label: 'ID' },
            { key: 'name', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'resident_name', label: 'Resident' },
            { key: 'flat_id', label: 'Flat' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.complaint_id }))}
        />
      </DashboardCard>
    </div>
  );
}
