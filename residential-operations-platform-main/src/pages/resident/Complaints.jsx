import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { FormInput, FormTextarea } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';
import { clsx } from '@/lib/cn';

const categories = [
  { value: 'Plumbing', label: 'Plumbing' },
  { value: 'Electrical', label: 'Electrical' },
  { value: 'Common Area', label: 'Common Area' },
  { value: 'Parking', label: 'Parking' },
  { value: 'Housekeeping', label: 'Housekeeping' },
];

export function Complaints() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [desc, setDesc] = useState('');

  usePageMeta({
    title: 'Complaints',
    subtitle: 'Raise and track complaints',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Complaints' }],
  });

  async function reload() {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/complaints?resident_id=${user.userId}`);
      setList(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, [user?.userId]);

  const filtered = useMemo(() => {
    if (tab === 'pending') return list.filter((c) => c.status === 'Pending');
    if (tab === 'progress') return list.filter((c) => c.status === 'In Progress');
    if (tab === 'resolved') return list.filter((c) => c.status === 'Resolved');
    return list;
  }, [list, tab]);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.post('/complaints', {
        resident_id: user?.userId,
        category,
        description: title ? `${title} — ${desc}` : desc,
      });
      setTitle('');
      setDesc('');
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Submit failed');
    }
  }

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'progress', label: 'In Progress' },
    { id: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Raise new complaint" subtitle="Title, category, and description">
          <form onSubmit={submit} className="space-y-4">
            <FormInput label="Complaint title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Select label="Category" options={categories} value={category} onChange={(e) => setCategory(e.target.value)} />
            <FormTextarea label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} required />
            <p className="text-xs text-slate-500">Date auto-generated server-side.</p>
            <Button type="submit">Submit complaint</Button>
          </form>
        </DashboardCard>

        <DashboardCard title="Complaint tracking" subtitle="Filter by workflow state">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={clsx(
                  'rounded-full px-3 py-1.5 text-sm font-medium',
                  tab === t.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : (
              <DataTable
                columns={[
                  { key: 'complaint_id', label: 'ID' },
                  { key: 'description', label: 'Title' },
                  { key: 'category', label: 'Category' },
                  { key: 'date', label: 'Date' },
                  {
                    key: 'status',
                    label: 'Status',
                    render: (row) => (
                      <span
                        className={clsx(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          row.status === 'Resolved' && 'bg-emerald-50 text-emerald-800',
                          row.status === 'In Progress' && 'bg-amber-50 text-amber-800',
                          row.status === 'Pending' && 'bg-slate-100 text-slate-700'
                        )}
                      >
                        {row.status}
                      </span>
                    ),
                  },
                ]}
                rows={filtered.map((r) => ({ ...r, id: r.complaint_id }))}
              />
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
