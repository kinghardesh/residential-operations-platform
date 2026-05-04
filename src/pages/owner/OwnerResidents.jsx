import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

export function OwnerResidents() {
  const { user } = useAuth();
  const [flats, setFlats] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Resident monitoring',
    subtitle: 'Current residents per owned flat',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Residents' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const [f, r] = await Promise.all([
          api.get(`/flats?owner_id=${user.userId}`),
          api.get('/residents'),
        ]);
        setFlats(f.data);
        setResidents(r.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.userId]);

  const rows = useMemo(() => {
    const flatNos = new Set(flats.map((f) => f.flat_no));
    return residents.filter((r) => flatNos.has(r.flat_no));
  }, [flats, residents]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Residents" subtitle="resident_id, name, phone, email, flat">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'resident_id', label: 'Resident ID' },
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'flat_no', label: 'Flat' },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.resident_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
