import { useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { owners as seed } from '@/data/mockData';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export function AdminOwners() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  usePageMeta({
    title: 'Owner management',
    subtitle: 'owner_id, name, phone',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Owners' }],
  });

  function openNew() {
    setEdit(null);
    setName('');
    setPhone('');
    setOpen(true);
  }

  function openEdit(row) {
    setEdit(row);
    setName(row.name);
    setPhone(row.phone);
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    if (edit) {
      setRows((r) => r.map((x) => (x.owner_id === edit.owner_id ? { ...x, name, phone } : x)));
    } else {
      const id = `OWN-${String(rows.length + 1).padStart(3, '0')}`;
      setRows((r) => [...r, { owner_id: id, name, phone }]);
    }
    setOpen(false);
  }

  function remove(row) {
    if (confirm(`Delete owner ${row.owner_id}?`)) {
      setRows((r) => r.filter((x) => x.owner_id !== row.owner_id));
    }
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Owners"
        subtitle="Add, edit, or remove society owners"
        action={
          <Button type="button" onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> Add owner
          </Button>
        }
      >
        <DataTable
          columns={[
            { key: 'owner_id', label: 'Owner ID' },
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
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
          rows={rows.map((r) => ({ ...r, id: r.owner_id }))}
        />
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Edit owner' : 'Add owner'}>
        <form onSubmit={save} className="space-y-4">
          {edit && <FormInput label="owner_id" value={edit.owner_id} disabled />}
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
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
