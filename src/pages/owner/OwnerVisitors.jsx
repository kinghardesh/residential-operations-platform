import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { flats, visitors } from '@/data/mockData';

export function OwnerVisitors() {
  const { user } = useAuth();

  usePageMeta({
    title: 'Visitor logs',
    subtitle: 'All visitors for owned flats',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Visitors' }],
  });

  const ownedFlats = useMemo(() => flats.filter((f) => f.owner_id === user?.userId), [user?.userId]);
  const flatIds = new Set(ownedFlats.map((f) => f.flat_id));

  const rows = useMemo(
    () =>
      visitors
        .filter((v) => flatIds.has(v.flat_id))
        .map((v) => ({
          ...v,
          flat_no: ownedFlats.find((f) => f.flat_id === v.flat_id)?.flat_no,
        })),
    [flatIds, ownedFlats]
  );

  return (
    <div className="space-y-6">
      <DashboardCard title="Visitor entries" subtitle="visitor_id, name, date, times, flat_id">
        <DataTable
          columns={[
            { key: 'visitor_id', label: 'ID' },
            { key: 'name', label: 'Visitor' },
            { key: 'flat_no', label: 'Flat' },
            { key: 'flat_id', label: 'Flat ID' },
            { key: 'visit_date', label: 'Date' },
            { key: 'visit_time', label: 'In' },
            { key: 'exit_time', label: 'Out' },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.visitor_id }))}
        />
      </DashboardCard>
    </div>
  );
}
