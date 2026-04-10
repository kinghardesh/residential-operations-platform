import { useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { DataTable } from '@/components/ui/DataTable';
import { getResidentById, visitors as seed } from '@/data/mockData';

export function Visitors() {
  const { user } = useAuth();
  const resident = getResidentById(user?.userId);
  const [rows, setRows] = useState(seed);
  const [name, setName] = useState('');
  const [visitDate, setVisitDate] = useState(new Date().toISOString().slice(0, 10));
  const [visitTime, setVisitTime] = useState('10:00');
  const [exitTime, setExitTime] = useState('18:00');

  usePageMeta({
    title: 'Visitors',
    subtitle: 'Requests and history',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Visitors' }],
  });

  const flatId = resident?.flat_id;
  const mine = useMemo(() => rows.filter((v) => v.flat_id === flatId), [rows, flatId]);

  function addVisitor(e) {
    e.preventDefault();
    if (!flatId) return;
    const id = `VIS-${String(rows.length + 1).padStart(3, '0')}`;
    setRows([
      ...rows,
      {
        visitor_id: id,
        name,
        visit_date: visitDate,
        visit_time: visitTime,
        exit_time: exitTime,
        flat_id: flatId,
      },
    ]);
    setName('');
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
              <dd className="font-mono text-slate-900">{flatId ?? '—'}</dd>
            </div>
          </dl>
        </DashboardCard>
      </div>

      <DashboardCard title="Visitor history" subtitle="visitor_id, name, visit_date, times, flat_id">
        <DataTable
          columns={[
            { key: 'visitor_id', label: 'Visitor ID' },
            { key: 'name', label: 'Name' },
            { key: 'visit_date', label: 'Date' },
            { key: 'visit_time', label: 'Entry' },
            { key: 'exit_time', label: 'Exit' },
            { key: 'flat_id', label: 'Flat' },
          ]}
          rows={mine.map((r) => ({ ...r, id: r.visitor_id }))}
        />
      </DashboardCard>
    </div>
  );
}
