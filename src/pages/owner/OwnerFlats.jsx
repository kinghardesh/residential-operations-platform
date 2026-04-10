import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { flats, getOwnerById } from '@/data/mockData';

export function OwnerFlats() {
  const { user } = useAuth();
  const owner = getOwnerById(user?.userId);

  usePageMeta({
    title: 'Flat management',
    subtitle: 'flat_id, flat_no, floor_no, owner_id',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Flats' }],
  });

  const rows = useMemo(() => flats.filter((f) => f.owner_id === user?.userId), [user?.userId]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Ownership" subtitle={owner?.name}>
        <DataTable
          columns={[
            { key: 'flat_id', label: 'Flat ID' },
            { key: 'flat_no', label: 'Flat no.' },
            { key: 'floor_no', label: 'Floor' },
            { key: 'owner_id', label: 'Owner' },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.flat_id }))}
        />
      </DashboardCard>
    </div>
  );
}
