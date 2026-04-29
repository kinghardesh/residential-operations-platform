import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { ConsumptionCharts } from '@/components/charts/ConsumptionCharts';
import api from '@/lib/api';

export function Resources() {
  const { user } = useAuth();
  const [usage, setUsage] = useState([]);
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Resource consumption',
    subtitle: 'Water and electricity usage',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Resources' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const d = await api.get(`/dashboard/resident/${user.userId}`);
        const f = d.data?.flat;
        setFlat(f);
        if (f?.flat_id) {
          const r = await api.get(`/resource-usage?unit_id=${f.flat_id}`);
          setUsage(r.data);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.userId]);

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Usage analytics"
        subtitle={`Flat ${flat?.flat_no ?? '—'} — monthly consumption`}
      >
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : usage.length === 0 ? (
          <p className="text-sm text-slate-500">No consumption records yet for this flat.</p>
        ) : (
          <ConsumptionCharts data={usage} />
        )}
      </DashboardCard>
    </div>
  );
}
