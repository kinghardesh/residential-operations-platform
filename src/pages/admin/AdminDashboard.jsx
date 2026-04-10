import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { StatCard } from '@/components/ui/DashboardCard';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { ComplaintTrendChart } from '@/components/charts/ComplaintTrendChart';
import { PaymentCollectionChart } from '@/components/charts/PaymentCollectionChart';
import { ResourceUsageChart } from '@/components/charts/ResourceUsageChart';
import {
  complaints,
  flats,
  owners,
  payments,
  residents,
  staff,
  visitors,
} from '@/data/mockData';
import { Building2, CreditCard, MessageSquareWarning, UserCog, UserPlus, Users } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  
  usePageMeta({
    title: 'Master dashboard',
    subtitle: 'Society-wide analytics',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Dashboard' }],
    showSearch: false,
  });

  const stats = useMemo(
    () => ({
      residents: residents.length,
      owners: owners.length,
      flats: flats.length,
      complaints: complaints.length,
      payments: payments.length,
      visitors: visitors.length,
      staff: staff.length,
    }),
    []
  );

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
      
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total residents" value={String(stats.residents)} icon={Users} accent="brand" />
        <StatCard label="Total owners" value={String(stats.owners)} icon={UserCog} accent="violet" />
        <StatCard label="Total flats" value={String(stats.flats)} icon={Building2} accent="emerald" />
        <StatCard label="Total complaints" value={String(stats.complaints)} icon={MessageSquareWarning} accent="amber" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total payments" value={String(stats.payments)} icon={CreditCard} accent="brand" />
        <StatCard label="Total visitors" value={String(stats.visitors)} icon={UserPlus} accent="emerald" />
        <StatCard label="Total staff" value={String(stats.staff)} icon={Users} accent="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Monthly complaint trend" subtitle="Volume by month">
          <ComplaintTrendChart />
        </DashboardCard>
        <DashboardCard title="Payment collection" subtitle="Monthly totals (demo)">
          <PaymentCollectionChart />
        </DashboardCard>
      </div>

      <DashboardCard title="Resource usage" subtitle="Society aggregate — water vs electricity">
        <ResourceUsageChart />
      </DashboardCard>
    </div>
  );
}
