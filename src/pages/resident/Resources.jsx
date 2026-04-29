import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { ConsumptionCharts } from '@/components/charts/ConsumptionCharts';
import { getResidentById } from '@/data/mockData';

export function Resources() {
  const { user } = useAuth();
  const resident = getResidentById(user?.userId);
  const flatId = resident?.flat_id ?? 'FLT-A-101';

  usePageMeta({
    title: 'Resource consumption',
    subtitle: 'Water and electricity usage',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Resources' }],
  });

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Usage analytics"
        subtitle={`Flat ${flatId} — demo consumption series`}
      >
        <ConsumptionCharts flatId={flatId} />
      </DashboardCard>
    </div>
  );
}
