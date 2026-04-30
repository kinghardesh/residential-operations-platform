import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  CreditCard,
  Droplets,
  LayoutDashboard,
  MessageSquareWarning,
  User,
  UserPlus,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

const navItems = [
  { to: '/resident/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/resident/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/resident/payments', label: 'Payments', icon: CreditCard },
  { to: '/resident/visitors', label: 'Visitors', icon: UserPlus },
  { to: '/resident/resources', label: 'Resources', icon: Droplets },
  { to: '/resident/profile', label: 'Profile', icon: User },
];

const defaultMeta = {
  title: 'Dashboard',
  subtitle: 'Resident portal',
  breadcrumb: [{ label: 'Resident', to: '/resident/dashboard' }, { label: 'Dashboard' }],
};

export function ResidentLayout() {
  const [meta, setPageMeta] = useState(defaultMeta);

  return (
    <DashboardShell
      navItems={navItems}
      sidebarTitle="Resident"
      title={meta.title}
      subtitle={meta.subtitle}
      breadcrumb={meta.breadcrumb}
      showSearch={meta.showSearch}
      onSearch={meta.onSearch}
    >
      <Outlet context={{ setPageMeta }} />
    </DashboardShell>
  );
}
