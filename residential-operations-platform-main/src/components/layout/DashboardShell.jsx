import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Breadcrumb } from './Breadcrumb';

export function DashboardShell({
  navItems,
  children,
  title = '',
  subtitle,
  breadcrumb = [],
  sidebarTitle,
  showSearch,
  onSearch,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const mainPad = collapsed ? 'lg:pl-[72px]' : 'lg:pl-64';

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        items={navItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        title={sidebarTitle}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className={mainPad}>
        <Navbar
          title={title}
          subtitle={subtitle}
          showSearch={showSearch}
          onSearch={onSearch}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="p-4 lg:p-6">
          {breadcrumb?.length > 0 && <Breadcrumb items={breadcrumb} />}
          {children}
        </main>
      </div>
    </div>
  );
}
