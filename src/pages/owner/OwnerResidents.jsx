import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { flats, getFlatById, residents } from '@/data/mockData';

export function OwnerResidents() {
  const { user } = useAuth();

  usePageMeta({
    title: 'Resident monitoring',
    subtitle: 'Current residents per owned flat',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Residents' }],
  });

  const ownedFlats = useMemo(() => flats.filter((f) => f.owner_id === user?.userId), [user?.userId]);
  const flatIds = new Set(ownedFlats.map((f) => f.flat_id));

  const rows = useMemo(
    () =>
      residents
        .filter((r) => flatIds.has(r.flat_id))
        .map((r) => ({
          ...r,
          flat_no: getFlatById(r.flat_id)?.flat_no,
        })),
    [flatIds]
  );

  return (
    <div className="space-y-6">
      <DashboardCard title="Residents" subtitle="resident_id, name, phone, email, flat_id">
        <DataTable
          columns={[
            { key: 'resident_id', label: 'Resident ID' },
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'flat_no', label: 'Flat' },
            { key: 'flat_id', label: 'Flat ID' },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.resident_id }))}
        />
      </DashboardCard>
    </div>
  );
}
