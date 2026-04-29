import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export function AdminFlats() {
  const [rows, setRows] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [flatNo, setFlatNo] = useState('');
  const [floorNo, setFloorNo] = useState('1');
  const [ownerId, setOwnerId] = useState('');

  usePageMeta({
    title: 'Flat management',
    subtitle: 'flat_id, flat_no, floor_no, owner_id',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Flats' }],
  });

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const [fRes, oRes] = await Promise.all([api.get('/flats'), api.get('/owners')]);
      setRows(fRes.data);
      setOwners(oRes.data);
    } catch {
      setError('Failed to load flats. Is the Flask backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const ownerOptions = [{ value: '', label: '— Unassigned —' }, ...owners.map((o) => ({ value: o.owner_id, label: `${o.name} (#${o.owner_id})` }))];

  function openNew() {
    setEdit(null);
    setFlatNo('');
    setFloorNo('1');
    setOwnerId(owners[0]?.owner_id ?? '');
    setOpen(true);
  }

  function openEdit(row) {
    setEdit(row);
    setFlatNo(row.flat_no ?? '');
    setFloorNo(String(row.floor_no ?? 1));
    setOwnerId(row.owner_id ?? '');
    setOpen(true);
  }

  async function save(e) {
    e.preventDefault();
    try {
      const payload = {
        flat_no: flatNo,
        floor_no: Number(floorNo),
        owner_id: ownerId ? Number(ownerId) : null,
      };
      if (edit) await api.put(`/flats/${edit.flat_id}`, payload);
      else await api.post('/flats', payload);
      setOpen(false);
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Save failed');
    }
  }

  async function remove(row) {
    if (!confirm(`Delete flat ${row.flat_id}?`)) return;
    try {
      await api.delete(`/flats/${row.flat_id}`);
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Delete failed');
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
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'flat_id', label: 'Flat ID' },
              { key: 'flat_no', label: 'Flat no.' },
              { key: 'floor_no', label: 'Floor' },
              { key: 'owner_id', label: 'Owner ID', render: (r) => r.owner_id ?? '—' },
              { key: 'occupancy_status', label: 'Status' },
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
        )}
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title={edit ? 'Update flat' : 'Add flat'}>
        <form onSubmit={save} className="space-y-4">
          {edit && <FormInput label="flat_id" value={edit.flat_id} disabled />}
          <FormInput label="Flat number" value={flatNo} onChange={(e) => setFlatNo(e.target.value)} required />
          <FormInput label="Floor number" type="number" value={floorNo} onChange={(e) => setFloorNo(e.target.value)} required />
          <Select label="Assign owner" options={ownerOptions} value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
