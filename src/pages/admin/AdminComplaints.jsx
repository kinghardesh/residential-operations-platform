import { useMemo, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { complaints as seed, getResidentById, staff } from '@/data/mockData';

const statuses = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

export function AdminComplaints() {
  const [rows, setRows] = useState(seed);

  usePageMeta({
    title: 'Complaint management',
    subtitle: 'Assign staff and update status',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Complaints' }],
  });

  const staffOptions = useMemo(
    () => staff.map((s) => ({ value: s.staff_id, label: `${s.role} (${s.staff_id})` })),
    []
  );

  function setStatus(id, status) {
    setRows((r) => r.map((x) => (x.complaint_id === id ? { ...x, status } : x)));
  }

  function setStaff(id, staff_id) {
    setRows((r) => r.map((x) => (x.complaint_id === id ? { ...x, staff_id: staff_id || null } : x)));
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="All complaints" subtitle="complaint_id, category, resident, staff assignment">
        <DataTable
          columns={[
            { key: 'complaint_id', label: 'ID' },
            { key: 'name', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'date', label: 'Date' },
            {
              key: 'resident_id',
              label: 'Resident',
              render: (row) => getResidentById(row.resident_id)?.name ?? row.resident_id,
            },
            {
              key: 'staff_id',
              label: 'Assign staff',
              render: (row) => (
                <select
                  className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                  value={row.staff_id ?? ''}
                  onChange={(e) => setStaff(row.complaint_id, e.target.value)}
                >
                  <option value="">—</option>
                  {staffOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <select
                  className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                  value={row.status}
                  onChange={(e) => setStatus(row.complaint_id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ),
            },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.complaint_id }))}
        />
      </DashboardCard>
    </div>
  );
}
