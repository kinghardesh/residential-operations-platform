import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { StatCard } from '@/components/ui/DashboardCard';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { flats, getOwnerById, residents } from '@/data/mockData';
import { Building2, Home, UserCheck } from 'lucide-react';

export function OwnerDashboard() {
  const { user } = useAuth();
  const owner = getOwnerById(user?.userId);
  
  // Use profile data from AuthContext if available, fallback to mock data
  const displayName = user?.displayName || owner?.name || 'Owner';
  const displayPhone = user?.phone || owner?.phone || '—';
  const displayEmail = user?.email || '—';

  usePageMeta({
    title: 'Dashboard',
    subtitle: 'Owned flats and occupancy',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Dashboard' }],
  });

  const ownedFlats = useMemo(() => flats.filter((f) => f.owner_id === user?.userId), [user?.userId]);
  const occupied = useMemo(() => {
    const set = new Set(residents.map((r) => r.flat_id));
    return ownedFlats.filter((f) => set.has(f.flat_id)).length;
  }, [ownedFlats]);
  const rentalReady = ownedFlats.length - occupied;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Owned flats" value={String(ownedFlats.length)} icon={Building2} accent="brand" />
        <StatCard label="Occupied" value={String(occupied)} icon={UserCheck} accent="emerald" />
        <StatCard label="Vacant / rental" value={String(rentalReady)} icon={Home} accent="amber" />
      </div>

      <DashboardCard title={displayName} subtitle={`Phone: ${displayPhone} | Email: ${displayEmail}`}>
        <p className="text-sm text-slate-600">
          Track occupancy across your flats. Demo data ties ownership via owner_id on each flat record.
        </p>
      </DashboardCard>
    </div>
  );
}
