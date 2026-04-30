import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { StatCard } from '@/components/ui/DashboardCard';
import { DashboardCard } from '@/components/ui/DashboardCard';
import api from '@/lib/api';
import { Building2, Home, UserCheck } from 'lucide-react';

export function OwnerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Dashboard',
    subtitle: 'Owned flats and occupancy',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Dashboard' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const res = await api.get(`/dashboard/owner/${user.userId}`);
        setData(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.userId]);

  const displayName = user?.displayName || data?.owner?.name || 'Owner';
  const displayPhone = user?.phone || data?.owner?.phone || '—';
  const displayEmail = user?.email || data?.owner?.email || '—';

  return (
    <div className="space-y-6">
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Owned flats" value={String(data?.owned_flats ?? 0)} icon={Building2} accent="brand" />
        <StatCard label="Occupied" value={String(data?.occupied ?? 0)} icon={UserCheck} accent="emerald" />
        <StatCard label="Vacant / rental" value={String(data?.vacant ?? 0)} icon={Home} accent="amber" />
      </div>

      <DashboardCard title={displayName} subtitle={`Phone: ${displayPhone} | Email: ${displayEmail}`}>
        <p className="text-sm text-slate-600">
          Track occupancy across your flats. Ownership is tied via owner_id on each residential unit.
        </p>
      </DashboardCard>
    </div>
  );
}
