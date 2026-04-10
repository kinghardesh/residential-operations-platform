import { useMemo, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { FormInput } from '@/components/ui/FormInput';
import { visitors as seed } from '@/data/mockData';

export function AdminVisitors() {
  const [flatQ, setFlatQ] = useState('');
  const [dateQ, setDateQ] = useState('');

  usePageMeta({
    title: 'Visitor monitoring',
    subtitle: 'Search by flat or date',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Visitors' }],
  });

  const rows = useMemo(() => {
    return seed.filter((v) => {
      if (flatQ && !v.flat_id.toLowerCase().includes(flatQ.toLowerCase())) return false;
      if (dateQ && !v.visit_date.includes(dateQ)) return false;
      return true;
    });
  }, [flatQ, dateQ]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Full visitor log" subtitle="visitor_id, name, visit_date, times, flat_id">
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="min-w-[200px]">
            <FormInput label="Flat ID / number" value={flatQ} onChange={(e) => setFlatQ(e.target.value)} placeholder="FLT-A-101" />
          </div>
          <div className="min-w-[160px]">
            <FormInput label="Date contains" value={dateQ} onChange={(e) => setDateQ(e.target.value)} placeholder="2026-04" />
          </div>
        </div>
        <DataTable
          columns={[
            { key: 'visitor_id', label: 'ID' },
            { key: 'name', label: 'Visitor' },
            { key: 'flat_id', label: 'Flat' },
            { key: 'visit_date', label: 'Date' },
            { key: 'visit_time', label: 'In' },
            { key: 'exit_time', label: 'Out' },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.visitor_id }))}
        />
      </DashboardCard>
    </div>
  );
}
