import { useEffect, useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormInput } from '@/components/ui/FormInput';
import { Select } from '@/components/ui/Select';
import api from '@/lib/api';
import { Plus } from 'lucide-react';

export function AdminResources() {
  const [rows, setRows] = useState([]);
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [flatId, setFlatId] = useState('');
  const [month, setMonth] = useState('2026-04');
  const [water, setWater] = useState('0');
  const [electricity, setElectricity] = useState('0');

  usePageMeta({
    title: 'Resource management',
    subtitle: 'Consumption per flat per month (water + electricity)',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Resources' }],
  });

  async function reload() {
    setLoading(true);
    setError('');
    try {
      const [u, f] = await Promise.all([api.get('/resource-usage'), api.get('/flats')]);
      setRows(u.data);
      setFlats(f.data);
      if (f.data[0]) setFlatId(f.data[0].flat_id);
    } catch {
      setError('Failed to load resource usage.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { reload(); }, []);

  const flatOptions = flats.map((f) => ({ value: f.flat_id, label: `${f.flat_no} (#${f.flat_id})` }));

  async function save(e) {
    e.preventDefault();
    try {
      await api.post('/resource-usage', {
        flat_id: Number(flatId),
        month,
        water_units: Number(water),
        electricity_units: Number(electricity),
      });
      setOpen(false);
      setWater('0');
      setElectricity('0');
      reload();
    } catch (err) {
      alert(err?.response?.data?.error || 'Save failed');
    }
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Consumption tracking"
        subtitle="usage_id, flat, month, water, electricity"
        action={
          <Button type="button" onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add reading
          </Button>
        }
      >
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            columns={[
              { key: 'usage_id', label: 'ID' },
              { key: 'flat_no', label: 'Flat', render: (r) => r.flat_no ?? r.flat_id },
              { key: 'month', label: 'Month' },
              { key: 'water_units', label: 'Water (units)' },
              { key: 'electricity_units', label: 'Electricity (kWh)' },
            ]}
            rows={rows.map((r) => ({ ...r, id: r.usage_id }))}
          />
        )}
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Add reading">
        <form onSubmit={save} className="space-y-4">
          <Select label="Flat" options={flatOptions} value={flatId} onChange={(e) => setFlatId(e.target.value)} />
          <FormInput label="Month (YYYY-MM)" value={month} onChange={(e) => setMonth(e.target.value)} required />
          <FormInput label="Water units" type="number" value={water} onChange={(e) => setWater(e.target.value)} />
          <FormInput label="Electricity units" type="number" value={electricity} onChange={(e) => setElectricity(e.target.value)} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
