import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

export function Visitors() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [flatInfo, setFlatInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [visitTime, setVisitTime] = useState('10:00');
  const [exitTime, setExitTime] = useState('18:00');

  usePageMeta({
    title: 'Visitors',
    subtitle: 'Requests and history',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Visitors' }],
  });

  async function reload() {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const [v, d] = await Promise.all([
        api.get(`/visitors?resident_id=${user.userId}`),
        api.get(`/dashboard/resident/${user.userId}`),
      ]);
      setRows(v.data);
      setFlatInfo(d.data?.flat ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, [user?.userId]);

  async function addVisitor(e) {
    e.preventDefault();
    try {
      await api.post('/visitors', {
        resident_id: user?.userId,
        flat_id: flatInfo?.flat_id ?? null,
        name,
        visit_date: visitDate,
        visit_time: visitTime,
        exit_time: exitTime,
      });
      setName('');
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Save failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Add visitor request" subtitle="visitor_id is generated on save">
          <form onSubmit={addVisitor} className="space-y-4">
            <FormInput label="Visitor name" value={name} onChange={(e) => setName(e.target.value)} required />
            <FormInput label="Visit date" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Entry time" type="time" value={visitTime} onChange={(e) => setVisitTime(e.target.value)} />
              <FormInput label="Exit time" type="time" value={exitTime} onChange={(e) => setExitTime(e.target.value)} />
            </div>
            <Button type="submit">Save request</Button>
          </form>
        </DashboardCard>
        <DashboardCard title="Flat context" subtitle="Linked flat for visitor records">
          <dl className="text-sm">
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">flat_id</dt>
              <dd className="font-mono text-slate-900">{flatInfo?.flat_id ?? '—'}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">flat_no</dt>
              <dd className="font-mono text-slate-900">{flatInfo?.flat_no ?? '—'}</dd>
            </div>
          </dl>
        </DashboardCard>
      </div>

      <DashboardCard title="Visitor history" subtitle="visitor_id, name, visit_date, times, flat">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'visitor_id', label: 'Visitor ID' },
              { key: 'name', label: 'Name' },
              { key: 'visit_date', label: 'Date' },
              { key: 'visit_time', label: 'Entry' },
              { key: 'exit_time', label: 'Exit' },
              { key: 'flat_no', label: 'Flat' },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.visitor_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
