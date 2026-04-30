import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { DashboardCard } from '@/components/ui/DashboardCard';
import { User } from 'lucide-react';

export function ProfileSetup() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [error, setError] = useState('');

  const roleDashboardMap = {
    resident: '/resident/dashboard',
    owner: '/owner/dashboard',
    admin: '/admin/dashboard',
  };

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    updateProfile({
      displayName: name,
      phone: phone,
      email: email,
    });

    const dashboardPath = roleDashboardMap[user?.role] || '/resident/dashboard';
    navigate(dashboardPath, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
            <User className="h-8 w-8 text-brand-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Profile</h1>
          <p className="mt-2 text-sm text-slate-600">
            Please provide your details to continue
          </p>
        </div>

        <DashboardCard title="Profile Information" subtitle="This information will be displayed across your dashboard">
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
            
            <FormInput
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />
            
            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full py-2.5">
              Save & Continue
            </Button>
          </form>
        </DashboardCard>
      </div>
    </div>
  );
}
