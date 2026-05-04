import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

export function OwnerFlats() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Flat management',
    subtitle: 'flat_id, flat_no, floor_no, owner_id',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Flats' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const res = await api.get(`/flats?owner_id=${user.userId}`);
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.userId]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Ownership" subtitle={user?.displayName}>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'flat_id', label: 'Flat ID' },
              { key: 'flat_no', label: 'Flat no.' },
              { key: 'floor_no', label: 'Floor' },
              { key: 'occupancy_status', label: 'Status' },
              { key: 'rent', label: 'Rent', render: (r) => `₹${Number(r.rent).toLocaleString('en-IN')}` },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.flat_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
