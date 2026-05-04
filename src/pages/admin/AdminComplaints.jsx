import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import api from '@/lib/api';

const statuses = [
  { value: 'Pending', label: 'Pending' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
];

export function AdminComplaints() {
  const [rows, setRows] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  usePageMeta({
    title: 'Complaint management',
    subtitle: 'Assign staff and update status',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Complaints' }],
  });

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const [c, s] = await Promise.all([api.get('/complaints'), api.get('/staff')]);
      setRows(c.data);
      setStaff(s.data);
    } catch {
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const staffOptions = staff.map((s) => ({ value: s.staff_id, label: `${s.role} (#${s.staff_id})` }));

  async function setStatus(id, status) {
    try {
      await api.put(`/complaints/${id}`, { status });
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Update failed');
    }
  }

  async function setStaffAssigned(id, staff_id) {
    try {
      await api.put(`/complaints/${id}`, { staff_id: staff_id ? Number(staff_id) : null });
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Update failed');
    }
  }

  return (
    <div className="space-y-6">
      <DashboardCard title="All complaints" subtitle="complaint_id, category, resident, staff assignment">
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'complaint_id', label: 'ID' },
              { key: 'description', label: 'Title' },
              { key: 'category', label: 'Category' },
              { key: 'date', label: 'Date' },
              { key: 'resident_name', label: 'Resident', render: (r) => r.resident_name ?? r.resident_id },
              {
                key: 'staff_id',
                label: 'Assign staff',
                render: (row) => (
                  <select
                    className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    value={row.staff_id ?? ''}
                    onChange={(e) => setStaffAssigned(row.complaint_id, e.target.value)}
                  >
                    <option value="">—</option>
                    {staffOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
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
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                ),
              },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.complaint_id }))}
          />
        )}
      </DashboardCard>
    </div>
  );
}
