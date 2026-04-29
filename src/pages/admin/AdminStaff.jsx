import { useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { flats, staff as seed } from '@/data/mockData';
import { Plus, Trash2 } from 'lucide-react';

const roles = [
  { value: 'Security Supervisor', label: 'Security Supervisor' },
  { value: 'Maintenance Lead', label: 'Maintenance Lead' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Housekeeping', label: 'Housekeeping' },
];

export function AdminStaff() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(roles[0].value);
  const [flat_id, setFlatId] = useState('');

  usePageMeta({
    title: 'Staff management',
    subtitle: 'staff_id, role, flat_id',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Staff' }],
  });

  const flatOptions = [{ value: '', label: '— Society-wide —' }, ...flats.map((f) => ({ value: f.flat_id, label: f.flat_no }))];

  function openNew() {
    setRole(roles[0].value);
    setFlatId('');
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    const id = `STF-${String(rows.length + 1).padStart(3, '0')}`;
    setRows((r) => [
      ...r,
      {
        staff_id: id,
        role,
        flat_id: flat_id || null,
      },
    ]);
    setOpen(false);
  }

  function remove(row) {
    if (confirm(`Remove staff ${row.staff_id}?`)) {
      setRows((r) => r.filter((x) => x.staff_id !== row.staff_id));
    }
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Staff"
        subtitle="Assign roles and optional flat scope"
        action={
          <Button type="button" onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> Add staff
          </Button>
        }
      >
        <DataTable
          columns={[
            { key: 'staff_id', label: 'Staff ID' },
            { key: 'role', label: 'Role' },
            { key: 'flat_id', label: 'Flat', render: (r) => r.flat_id ?? '—' },
            {
              key: 'actions',
              label: '',
              render: (row) => (
                <button type="button" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" onClick={() => remove(row)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              ),
            },
          ]}
          rows={rows.map((r) => ({ ...r, id: r.staff_id }))}
        />
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Add staff">
        <form onSubmit={save} className="space-y-4">
          <Select label="Role" options={roles} value={role} onChange={(e) => setRole(e.target.value)} />
          <Select label="Flat (optional)" options={flatOptions} value={flat_id} onChange={(e) => setFlatId(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
