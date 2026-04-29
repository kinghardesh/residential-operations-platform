import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import api from '@/lib/api';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export function AdminResidents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [flatNo, setFlatNo] = useState('');

  usePageMeta({
    title: 'Resident management',
    subtitle: 'resident_id, name, phone, email, flat_no',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Residents' }],
  });

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/residents');
      setRows(res.data);
    } catch (err) {
      setError('Failed to load residents. Is the Flask backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  function openNew() {
    setEdit(null);
    setName('');
    setPhone('');
    setEmail('');
    setFlatNo('');
    setOpen(true);
  }

  function openEdit(row) {
    setEdit(row);
    setName(row.name ?? '');
    setPhone(row.phone ?? '');
    setEmail(row.email ?? '');
    setFlatNo(row.flat_no ?? '');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    try {
      const payload = { name, phone, email, flat_no: flatNo };
      if (edit) {
        await api.put(`/residents/${edit.resident_id}`, payload);
      } else {
        await api.post('/residents', payload);
      }
      setOpen(false);
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Save failed');
    }
  }

  async function remove(row) {
    if (!confirm(`Delete resident ${row.resident_id}?`)) return;
    try {
      await api.delete(`/residents/${row.resident_id}`);
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Delete failed');
    }
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Residents"
        subtitle="Assign flats and maintain directory"
        action={
          <Button type="button" onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> Add resident
          </Button>
        }
      >
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'resident_id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'phone', label: 'Phone' },
              { key: 'email', label: 'Email' },
              { key: 'flat_no', label: 'Flat' },
              {
                key: 'actions',
                label: '',
                render: (row) => (
                  <div className="flex gap-2">
                    <button type="button" className="rounded-lg p-1.5 text-brand-600 hover:bg-brand-50" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50" onClick={() => remove(row)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ),
              },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.resident_id }))}
          />
        )}
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Edit resident' : 'Add resident'}>
        <form onSubmit={save} className="space-y-4">
          {edit && <FormInput label="resident_id" value={edit.resident_id} disabled />}
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FormInput label="Flat no" value={flatNo} onChange={(e) => setFlatNo(e.target.value)} placeholder="A-101" />
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
