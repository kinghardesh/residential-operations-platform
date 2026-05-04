import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

export function OwnerVisitors() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Visitor logs',
    subtitle: 'All visitors for owned flats',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Visitors' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const res = await api.get(`/visitors?owner_id=${user.userId}`);
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.userId]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Visitor entries" subtitle="visitor_id, name, date, times, flat">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'visitor_id', label: 'ID' },
              { key: 'name', label: 'Visitor' },
              { key: 'flat_no', label: 'Flat' },
              { key: 'flat_id', label: 'Flat ID' },
              { key: 'visit_date', label: 'Date' },
              { key: 'visit_time', label: 'In' },
              { key: 'exit_time', label: 'Out' },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.visitor_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
