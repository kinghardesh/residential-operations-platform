import { useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import { flats as seed, owners } from '@/data/mockData';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export function AdminFlats() {
  const [rows, setRows] = useState(seed);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [flat_no, setFlatNo] = useState('');
  const [floor_no, setFloorNo] = useState('1');
  const [owner_id, setOwnerId] = useState(owners[0]?.owner_id ?? '');

  usePageMeta({
    title: 'Flat management',
    subtitle: 'flat_id, flat_no, floor_no, owner_id',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Flats' }],
  });

  const ownerOptions = owners.map((o) => ({ value: o.owner_id, label: `${o.name} (${o.owner_id})` }));

  function openNew() {
    setEdit(null);
    setFlatNo('');
    setFloorNo('1');
    setOwnerId(owners[0]?.owner_id ?? '');
    setOpen(true);
  }

  function openEdit(row) {
    setEdit(row);
    setFlatNo(row.flat_no);
    setFloorNo(String(row.floor_no));
    setOwnerId(row.owner_id);
    setOpen(true);
  }

  function save(e) {
    e.preventDefault();
    if (edit) {
      setRows((r) =>
        r.map((x) =>
          x.flat_id === edit.flat_id
            ? { ...x, flat_no, floor_no: Number(floor_no), owner_id }
            : x
        )
      );
    } else {
      const id = `FLT-X-${String(rows.length + 101)}`;
      setRows((r) => [
        ...r,
        {
          flat_id: id,
          flat_no,
          floor_no: Number(floor_no),
          owner_id,
        },
      ]);
    }
    setOpen(false);
  }

  function remove(row) {
    if (confirm(`Delete flat ${row.flat_id}?`)) {
      setRows((r) => r.filter((x) => x.flat_id !== row.flat_id));
    }
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Flats"
        subtitle="Assign owners and maintain inventory"
        action={
          <Button type="button" onClick={openNew} className="gap-2">
            <Plus className="h-4 w-4" /> Add flat
          </Button>
        }
      >
        <DataTable
          columns={[
            { key: 'flat_id', label: 'Flat ID' },
            { key: 'flat_no', label: 'Flat no.' },
            { key: 'floor_no', label: 'Floor' },
            { key: 'owner_id', label: 'Owner' },
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
          rows={rows.map((r) => ({ ...r, id: r.flat_id }))}
        />
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Update flat' : 'Add flat'}>
        <form onSubmit={save} className="space-y-4">
          {edit && <FormInput label="flat_id" value={edit.flat_id} disabled />}
          <FormInput label="Flat number" value={flat_no} onChange={(e) => setFlatNo(e.target.value)} required />
          <FormInput label="Floor number" type="number" value={floor_no} onChange={(e) => setFloorNo(e.target.value)} required />
          <Select label="Assign owner" options={ownerOptions} value={owner_id} onChange={(e) => setOwnerId(e.target.value)} />
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
