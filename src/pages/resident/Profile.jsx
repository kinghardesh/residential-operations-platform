import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { getResidentById } from '@/data/mockData';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const base = getResidentById(user?.userId);
  const [name, setName] = useState(user?.displayName || (base?.name ?? ''));
  const [phone, setPhone] = useState(user?.phone || (base?.phone ?? ''));
  const [email, setEmail] = useState(user?.email || (base?.email ?? ''));
  const [saved, setSaved] = useState(false);

  usePageMeta({
    title: 'Profile',
    subtitle: 'Manage your personal information',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Profile' }],
  });

  function save(e) {
    e.preventDefault();
    updateProfile({
      displayName: name,
      phone: phone,
      email: email,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <DashboardCard title="Resident profile" subtitle="Edit your contact details">
        <form onSubmit={save} className="space-y-4">
          <FormInput label="resident_id" value={base?.resident_id ?? ''} disabled className="bg-slate-50" />
          <FormInput label="flat_id" value={base?.flat_id ?? ''} disabled className="bg-slate-50" />
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit">Save changes</Button>
          {saved && <p className="text-sm text-emerald-600">Profile updated successfully!</p>}
        </form>
      </DashboardCard>
    </div>
  );
}
