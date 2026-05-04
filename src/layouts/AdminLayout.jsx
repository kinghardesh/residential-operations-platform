import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  CreditCard,
  Droplets,
  LayoutDashboard,
  MessageSquareWarning,
  UserPlus,
  Users,
  UserCog,
  Home,
  Briefcase,
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/owners', label: 'Owners', icon: UserCog },
  { to: '/admin/flats', label: 'Flats', icon: Home },
  { to: '/admin/residents', label: 'Residents', icon: Users },
  { to: '/admin/staff', label: 'Staff', icon: Briefcase },
  { to: '/admin/complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/visitors', label: 'Visitors', icon: UserPlus },
  { to: '/admin/resources', label: 'Resources', icon: Droplets },
];

const defaultMeta = {
  title: 'Dashboard',
  subtitle: 'Administration',
  breadcrumb: [{ label: 'Admin', to: '/admin/dashboard' }, { label: 'Dashboard' }],
};

export function AdminLayout() {
  const [meta, setPageMeta] = useState(defaultMeta);

  return (
    <DashboardShell
      navItems={navItems}
      sidebarTitle="Admin"
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
