import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard, StatCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import {
  complaints,
  getFlatById,
  getResidentById,
  payments,
  visitors,
} from '@/data/mockData';
import { AlertCircle, CreditCard, Home, Mail, User } from 'lucide-react';

export function ResidentDashboard() {
  const { user } = useAuth();
  const resident = getResidentById(user?.userId);
  const flat = resident ? getFlatById(resident.flat_id) : null;
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setTableLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  usePageMeta({
    title: 'Dashboard',
    subtitle: 'Your flat and society activity',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Dashboard' }],
  });

  const myComplaints = useMemo(
    () => complaints.filter((c) => c.resident_id === user?.userId),
    [user?.userId]
  );
  const pendingDues = useMemo(() => {
    const paid = payments
      .filter((p) => p.resident_id === user?.userId)
      .reduce((s, p) => s + p.amount, 0);
    const annual = 8500 * 12;
    return Math.max(0, annual - paid);
  }, [user?.userId]);

  const recentVisitors = useMemo(
    () => visitors.filter((v) => v.flat_id === resident?.flat_id).slice(0, 5),
    [resident?.flat_id]
  );

  const activeComplaints = myComplaints.filter((c) => c.status !== 'Resolved').length;
  
  // Use profile data from AuthContext if available, fallback to mock data
  const displayName = user?.displayName || resident?.name || 'Resident';
  const displayEmail = user?.email || resident?.email || '—';
  const displayPhone = user?.phone || resident?.phone || '—';

  return (
    <div className="space-y-6">
      <DashboardCard
        title={`Welcome, ${displayName}`}
        subtitle="Here is a quick snapshot of your account."
        icon={User}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Flat" value={flat?.flat_no ?? '—'} icon={Home} accent="brand" />
          <StatCard
            label="Pending dues (est.)"
            value={`₹${pendingDues.toLocaleString('en-IN')}`}
            icon={CreditCard}
            accent="amber"
          />
          <StatCard
            label="Active complaints"
            value={String(activeComplaints)}
            icon={AlertCircle}
            accent="violet"
          />
          <StatCard label="Email" value={displayEmail} icon={Mail} accent="emerald" />
        </div>
      </DashboardCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Profile summary" subtitle="Your contact information">
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Resident ID</dt>
              <dd className="font-medium text-slate-900">{resident?.resident_id}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Name</dt>
              <dd className="font-medium text-slate-900">{displayName}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Phone</dt>
              <dd className="font-medium text-slate-900">{displayPhone}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-900 truncate max-w-[200px]">{displayEmail}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Flat ID</dt>
              <dd className="font-medium text-slate-900">{resident?.flat_id}</dd>
            </div>
          </dl>
        </DashboardCard>

        <DashboardCard title="Complaint status" subtitle="Your raised tickets">
          <ul className="space-y-2 text-sm">
            {myComplaints.slice(0, 4).map((c) => (
              <li key={c.complaint_id} className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="truncate text-slate-800">{c.name}</span>
                <span className="shrink-0 text-xs font-medium text-brand-700">{c.status}</span>
              </li>
            ))}
            {myComplaints.length === 0 && <p className="text-sm text-slate-500">No complaints yet.</p>}
          </ul>
        </DashboardCard>
      </div>

      <DashboardCard title="Recent visitor logs" subtitle="Latest entries for your flat">
        <DataTable
          loading={tableLoading}
          columns={[
            { key: 'visitor_id', label: 'ID' },
            { key: 'name', label: 'Visitor' },
            { key: 'visit_date', label: 'Date' },
            { key: 'visit_time', label: 'In' },
            { key: 'exit_time', label: 'Out' },
          ]}
          rows={recentVisitors.map((r) => ({ ...r, id: r.visitor_id }))}
          pageSize={5}
        />
      </DashboardCard>
    </div>
  );
}
