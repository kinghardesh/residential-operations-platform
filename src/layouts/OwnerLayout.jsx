import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  MessageSquareWarning,
  UserPlus,
  Users,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

const navItems = [
  { to: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/owner/flats', label: 'Flats', icon: Building2 },
  { to: '/owner/residents', label: 'Residents', icon: Users },
  { to: '/owner/payments', label: 'Payments', icon: CreditCard },
  { to: '/owner/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/owner/visitors', label: 'Visitors', icon: UserPlus },
];

const defaultMeta = {
  title: 'Dashboard',
  subtitle: 'Owner portal',
  breadcrumb: [{ label: 'Owner', to: '/owner/dashboard' }, { label: 'Dashboard' }],
};

export function OwnerLayout() {
  const [meta, setPageMeta] = useState(defaultMeta);

  return (
    <DashboardShell
      navItems={navItems}
      sidebarTitle="Owner"
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
