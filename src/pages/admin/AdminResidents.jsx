import { useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import { flats, residents as seed } from '@/data/mockData';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export function AdminResidents() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [flat_id, setFlatId] = useState(flats[0]?.flat_id ?? '');

  usePageMeta({
    title: 'Resident management',
    subtitle: 'resident_id, name, phone, email, flat_id',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Residents' }],
  });

  const flatOptions = flats.map((f) => ({ value: f.flat_id, label: `${f.flat_no} (${f.flat_id})` }));

  function openNew() {
    setEdit(null);
    setName('');
    setPhone('');
    setEmail('');
    setFlatId(flats[0]?.flat_id ?? '');
    setOpen(true);
  }

  function openEdit(row) {
    setEdit(row);
    setName(row.name);
    setPhone(row.phone);
    setEmail(row.email);
    setFlatId(row.flat_id);
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    if (edit) {
      setRows((r) =>
        r.map((x) =>
          x.resident_id === edit.resident_id ? { ...x, name, phone, email, flat_id } : x
        )
      );
    } else {
      const id = `RES-${String(rows.length + 1).padStart(3, '0')}`;
      setRows((r) => [...r, { resident_id: id, name, phone, email, flat_id }]);
    }
    setOpen(false);
  }

  function remove(row) {
    if (confirm(`Delete resident ${row.resident_id}?`)) {
      setRows((r) => r.filter((x) => x.resident_id !== row.resident_id));
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
        <DataTable
          columns={[
            { key: 'resident_id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'flat_id', label: 'Flat' },
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
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Edit resident' : 'Add resident'}>
        <form onSubmit={save} className="space-y-4">
          {edit && <FormInput label="resident_id" value={edit.resident_id} disabled />}
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Select label="Assign flat" options={flatOptions} value={flat_id} onChange={(e) => setFlatId(e.target.value)} />
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
