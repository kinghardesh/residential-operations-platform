import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

export function OwnerComplaints() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: 'Complaints',
    subtitle: 'Raised from your flats',
    breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Complaints' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const res = await api.get(`/complaints?owner_id=${user.userId}`);
        setRows(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.userId]);

  return (
    <div className="space-y-6">
      <DashboardCard title="Complaint monitoring" subtitle="complaint_id, category, date, status">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'complaint_id', label: 'ID' },
              { key: 'description', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'resident_name', label: 'Resident' },
              { key: 'flat_no', label: 'Flat' },
              { key: 'date', label: 'Date' },
              { key: 'status', label: 'Status' },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.complaint_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
