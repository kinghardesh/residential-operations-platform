import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { StatCard } from '@/components/ui/DashboardCard';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { ComplaintTrendChart } from '@/components/charts/ComplaintTrendChart';
import { PaymentCollectionChart } from '@/components/charts/PaymentCollectionChart';
import { ResourceUsageChart } from '@/components/charts/ResourceUsageChart';
import api from '@/lib/api';
import { Building2, CreditCard, MessageSquareWarning, UserCog, UserPlus, Users } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  usePageMeta({
    title: 'Master dashboard',
    subtitle: 'Society-wide analytics',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Dashboard' }],
    showSearch: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setData(res.data);
      } catch {
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = data?.counts ?? {};

  return (
    <div className="space-y-6">
      <DashboardCard
        title={`Welcome, ${user?.displayName || 'Administrator'}`}
        subtitle={`Manage your residential society operations | Email: ${user?.email || '—'}`}
      >
        <p className="text-sm text-slate-600">
          Access comprehensive analytics and management tools for your society. Monitor complaints,
          payments, residents, staff, and resources all from one central dashboard.
        </p>
      </DashboardCard>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading…</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total residents" value={String(counts.residents ?? 0)} icon={Users} accent="brand" />
        <StatCard label="Total owners" value={String(counts.owners ?? 0)} icon={UserCog} accent="violet" />
        <StatCard label="Total flats" value={String(counts.flats ?? 0)} icon={Building2} accent="emerald" />
        <StatCard label="Total complaints" value={String(counts.complaints ?? 0)} icon={MessageSquareWarning} accent="amber" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total payments" value={String(counts.payments ?? 0)} icon={CreditCard} accent="brand" />
        <StatCard label="Total visitors" value={String(counts.visitors ?? 0)} icon={UserPlus} accent="emerald" />
        <StatCard label="Total staff" value={String(counts.staff ?? 0)} icon={Users} accent="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Monthly complaint trend" subtitle="Volume by month">
          <ComplaintTrendChart data={data?.complaint_trend ?? []} />
        </DashboardCard>
        <DashboardCard title="Payment collection" subtitle="Monthly totals from DB">
          <PaymentCollectionChart data={data?.payment_trend ?? []} />
        </DashboardCard>
      </div>

      <DashboardCard title="Resource usage" subtitle="Society aggregate — water vs electricity">
        <ResourceUsageChart data={data?.resource_trend ?? []} />
      </DashboardCard>
    </div>
  );
}
