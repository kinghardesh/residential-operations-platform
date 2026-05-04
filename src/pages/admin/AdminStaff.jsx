import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

const roles = [
  { value: 'Security Supervisor', label: 'Security Supervisor' },
  { value: 'Maintenance Lead', label: 'Maintenance Lead' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Housekeeping', label: 'Housekeeping' },
];

export function AdminStaff() {
  const [rows, setRows] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(roles[0].value);
  const [flatId, setFlatId] = useState('');

  usePageMeta({
    title: 'Staff management',
    subtitle: 'staff_id, name, role, phone, flat_id',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Staff' }],
  });

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const [s, f] = await Promise.all([api.get('/staff'), api.get('/flats')]);
      setRows(s.data);
      setFlats(f.data);
    } catch {
      setError('Failed to load staff.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const flatOptions = [{ value: '', label: '— Society-wide —' }, ...flats.map((f) => ({ value: f.flat_id, label: `${f.flat_no} (#${f.flat_id})` }))];

  function openNew() {
    setName('');
    setPhone('');
    setRole(roles[0].value);
    setFlatId('');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    try {
      await api.post('/staff', { name, role, phone, flat_id: flatId ? Number(flatId) : null });
      setOpen(false);
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Save failed');
    }
  }

  async function remove(row) {
    if (!confirm(`Remove staff #${row.staff_id}?`)) return;
    try {
      await api.delete(`/staff/${row.staff_id}`);
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Delete failed');
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
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'staff_id', label: 'Staff ID' },
              { key: 'name', label: 'Name' },
              { key: 'role', label: 'Role' },
              { key: 'phone', label: 'Phone' },
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
        )}
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Add staff">
        <form onSubmit={save} className="space-y-4">
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Select label="Role" options={roles} value={role} onChange={(e) => setRole(e.target.value)} />
          <Select label="Flat (optional)" options={flatOptions} value={flatId} onChange={(e) => setFlatId(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
