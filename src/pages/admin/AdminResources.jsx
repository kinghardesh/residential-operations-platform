import { useState } from 'react';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { consumptions as consSeed, flats, resources as seed } from '@/data/mockData';
import { Plus } from 'lucide-react';

const types = [
  { value: 'Water', label: 'Water' },
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Internet', label: 'Internet' },
];

export function AdminResources() {
  const [resources, setResources] = useState(seed);
  const [consumptions, setConsumptions] = useState(consSeed);
  const [open, setOpen] = useState(false);
  const [resource_type, setResourceType] = useState('Water');
  const [flat_id, setFlatId] = useState(flats[0]?.flat_id ?? '');

  usePageMeta({
    title: 'Resource management',
    subtitle: 'resource_id, resource_type, flat_id — consumption tracking',
    breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Resources' }],
  });

  const flatOptions = flats.map((f) => ({ value: f.flat_id, label: `${f.flat_no} (${f.flat_id})` }));

  function addResource(e) {
    e.preventDefault();
    const id = `RESRC-${String(resources.length + 1).padStart(3, '0')}`;
    setResources((r) => [...r, { resource_id: id, resource_type, flat_id }]);
    setOpen(false);
  }

  function addConsumptionRow() {
    setConsumptions((c) => [
      ...c,
      {
        flat_id: flats[0]?.flat_id,
        staff_id: null,
        month: '2026-04',
        units: 0,
        type: 'Water',
      },
    ]);
  }

  return (
    <div className="space-y-6">
      <DashboardCard
        title="Resources"
        subtitle="Register utilities per flat"
        action={
          <Button type="button" onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add resource
          </Button>
        }
      >
        <DataTable
          columns={[
            { key: 'resource_id', label: 'Resource ID' },
            { key: 'resource_type', label: 'Type' },
            { key: 'flat_id', label: 'Flat' },
          ]}
          rows={resources.map((r) => ({ ...r, id: r.resource_id }))}
        />
      </DashboardCard>

      <DashboardCard
        title="Consumption tracking"
        subtitle="flat_id, staff_id, month, units (demo)"
        action={
          <Button type="button" variant="secondary" onClick={addConsumptionRow}>
            Add row
          </Button>
        }
      >
        <DataTable
          searchable={false}
          columns={[
            { key: 'flat_id', label: 'Flat' },
            { key: 'staff_id', label: 'Staff', render: (r) => r.staff_id ?? '—' },
            { key: 'month', label: 'Month' },
            { key: 'type', label: 'Type' },
            { key: 'units', label: 'Units' },
          ]}
          rows={consumptions.map((r, i) => ({ ...r, id: `${r.flat_id}-${i}` }))}
        />
      </DashboardCard>

      <Modal open={open} onClose={() => setOpen(false)} title="Add resource">
        <form onSubmit={addResource} className="space-y-4">
          <Select label="Resource type" options={types} value={resource_type} onChange={(e) => setResourceType(e.target.value)} />
          <Select label="Flat" options={flatOptions} value={flat_id} onChange={(e) => setFlatId(e.target.value)} />
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
