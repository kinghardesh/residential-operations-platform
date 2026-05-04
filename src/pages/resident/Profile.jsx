import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePageMeta } from '@/hooks/usePageMeta';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import api from '@/lib/api';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [resident, setResident] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  usePageMeta({
    title: 'Profile',
    subtitle: 'Manage your personal information',
    breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Profile' }],
  });

  useEffect(() => {
    if (!user?.userId) return;
    (async () => {
      try {
        const res = await api.get(`/residents/${user.userId}`);
        const r = res.data;
        setResident(r);
        setName(r.name ?? '');
        setPhone(r.phone ?? '');
        setEmail(r.email ?? '');
        setFlatNo(r.flat_no ?? '');
      } catch {
        setError('Could not load profile.');
      }
    })();
  }, [user?.userId]);

  async function save(e) {
    e.preventDefault();
    setSaved(false);
    setError('');
    try {
      await api.put(`/residents/${user.userId}`, { name, phone, email, flat_no: flatNo });
      updateProfile({ displayName: name, phone, email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Save failed');
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <DashboardCard title="Resident profile" subtitle="Edit your contact details">
        <form onSubmit={save} className="space-y-4">
          <FormInput label="resident_id" value={resident?.resident_id ?? ''} disabled className="bg-slate-50" />
          <FormInput label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormInput label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <FormInput label="Flat no" value={flatNo} onChange={(e) => setFlatNo(e.target.value)} />
          <Button type="submit">Save changes</Button>
          {saved && <p className="text-sm text-emerald-600">Profile updated successfully!</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </DashboardCard>
    </div>
  );
}
