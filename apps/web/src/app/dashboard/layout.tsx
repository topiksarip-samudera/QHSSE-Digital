'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Companies', href: '/dashboard/companies', icon: '🏢' },
  { name: 'Organization', href: '#', icon: '🏗️', children: [
    { name: 'Sites', href: '/dashboard/organization/sites' },
    { name: 'Departments', href: '/dashboard/organization/departments' },
    { name: 'Locations', href: '/dashboard/organization/locations' },
    { name: 'Positions', href: '/dashboard/organization/positions' },
  ]},
  { name: 'User Management', href: '#', icon: '👤', children: [
    { name: 'Users', href: '/dashboard/users' },
    { name: 'Roles & Permissions', href: '/dashboard/roles' },
  ]},
  { name: 'Master Data', href: '/dashboard/master-data', icon: '🗃️' },
  { name: 'Module Management', href: '#', icon: '🧩', children: [
    { name: 'System Modules', href: '/dashboard/module-management' },
    { name: 'Tenant Settings', href: '/dashboard/module-management/tenant' },
  ]},
  { name: 'Workflow Engine', href: '#', icon: '🔄', children: [
    { name: 'Workflow Templates', href: '/dashboard/workflow' },
    { name: 'Instances', href: '/dashboard/workflow/instances' },
    { name: 'Approval Queue', href: '/dashboard/workflow/queue' },
    { name: 'Advanced', href: '/dashboard/workflow/advanced' },
  ]},
  { name: 'Notifications', href: '#', icon: '🔔', children: [
    { name: 'All Notifications', href: '/dashboard/notifications' },
    { name: 'Templates', href: '/dashboard/notifications/templates' },
    { name: 'Settings', href: '/dashboard/notifications/settings' },
  ]},
  { name: 'Attachments', href: '#', icon: '📎', children: [
    { name: 'All Files', href: '/dashboard/attachments' },
    { name: 'Upload', href: '/dashboard/attachments/new' },
    { name: 'Settings', href: '/dashboard/attachments/settings' },
  ]},
  { name: 'Audit Log', href: '#', icon: '📜', children: [
    { name: 'Activity', href: '/dashboard/audit-log' },
    { name: 'Settings', href: '/dashboard/audit-log/settings' },
  ]},
  { name: 'Risk Management', href: '#', icon: '🛡️' },
  { name: 'Incident Management', href: '#', icon: '⚠️' },
  { name: 'Audit & Inspection', href: '#', icon: '📋' },
  { name: 'Action Tracking', href: '#', icon: '✅', children: [
    { name: 'All Actions', href: '/dashboard/action-tracking' },
    { name: 'Create', href: '/dashboard/action-tracking/new' },
    { name: 'Settings', href: '/dashboard/action-tracking/settings' },
  ]},
  { name: 'Form Builder', href: '#', icon: '📝', children: [
    { name: 'All Forms', href: '/dashboard/form-builder' },
    { name: 'Create Form', href: '/dashboard/form-builder/new' },
    { name: 'Settings', href: '/dashboard/form-builder/settings' },
  ]},
  { name: 'Checklist Builder', href: '#', icon: '✓', children: [
    { name: 'All Checklists', href: '/dashboard/checklist-builder' },
    { name: 'Create', href: '/dashboard/checklist-builder/new' },
    { name: 'Settings', href: '/dashboard/checklist-builder/settings' },
  ]},
  { name: 'Numbering', href: '#', icon: '🔢', children: [
    { name: 'Rules', href: '/dashboard/numbering' },
    { name: 'Create Rule', href: '/dashboard/numbering/new' },
    { name: 'Settings', href: '/dashboard/numbering/settings' },
  ]},
  { name: 'Templates', href: '#', icon: '📄', children: [
    { name: 'All Templates', href: '/dashboard/templates' },
    { name: 'Create', href: '/dashboard/templates/new' },
    { name: 'Categories', href: '/dashboard/templates/settings' },
  ]},
  { name: 'Import & Export', href: '#', icon: '📥', children: [
    { name: 'Import', href: '/dashboard/import-export' },
    { name: 'Export', href: '/dashboard/import-export/settings' },
  ]},
  { name: 'Calendar', href: '#', icon: '📅', children: [
    { name: 'Schedules', href: '/dashboard/calendar' },
    { name: 'Create', href: '/dashboard/calendar/new' },
    { name: 'Settings', href: '/dashboard/calendar/settings' },
  ]},
  { name: 'API Keys', href: '#', icon: '🔑', children: [
    { name: 'All Keys', href: '/dashboard/api-keys' },
  ]},
  { name: 'Webhooks', href: '#', icon: '🔗', children: [
    { name: 'All Webhooks', href: '/dashboard/webhooks' },
    { name: 'Settings', href: '/dashboard/webhooks/settings' },
  ]},
  { name: 'Dashboard Builder', href: '#', icon: '📊', children: [
    { name: 'All Dashboards', href: '/dashboard/builder' },
    { name: 'Create', href: '/dashboard/builder/new' },
  ]},
  { name: 'Global Search', href: '/dashboard/search', icon: '🔍' },
  { name: 'SSO Providers', href: '#', icon: '🔐', children: [
    { name: 'Providers', href: '/dashboard/sso' },
    { name: 'Add Provider', href: '/dashboard/sso/new' },
    { name: 'Settings', href: '/dashboard/sso/settings' },
  ]},
  { name: 'MFA', href: '#', icon: '🔏', children: [
    { name: 'Settings', href: '/dashboard/mfa/settings' },
  ]},
  { name: 'Permissions', href: '#', icon: '🛂', children: [
    { name: 'Advanced', href: '/dashboard/permissions/settings' },
  ]},
  { name: 'Subscription', href: '#', icon: '💳', children: [
    { name: 'Plans & Usage', href: '/dashboard/subscription/settings' },
  ]},
  { name: 'Backup & Restore', href: '/dashboard/backup', icon: '💾' },
  { name: 'System Health', href: '/dashboard/system-health', icon: '❤️' },
  { name: 'AI Governance', href: '/dashboard/ai-governance', icon: '🤖' },
  { name: 'Offline Sync', href: '/dashboard/pwa', icon: '📲' },
  { name: 'Integrations', href: '/dashboard/integrations', icon: '🔌' },
  { name: 'Data Retention', href: '/dashboard/data-retention', icon: '🗄️' },
  { name: 'Compliance', href: '/dashboard/compliance', icon: '🏛️' },
  { name: 'Reports', href: '/dashboard/reporting', icon: '📈' },
  { name: 'Incident', href: '#', icon: '🚨', children: [
    { name: 'Dashboard', href: '/dashboard/incident' },
    { name: 'Settings', href: '/dashboard/incident/settings' },
    { name: 'Master Data', href: '/dashboard/incident/master-data' },
  ]},
  { name: 'Settings', href: '#', icon: '⚙️', children: [
    { name: 'Change Password', href: '/dashboard/settings/change-password' },
    { name: 'Active Sessions', href: '/dashboard/settings/sessions' },
  ]},
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Organization: pathname.startsWith('/dashboard/organization'),
    'User Management': pathname.startsWith('/dashboard/users') || pathname.startsWith('/dashboard/roles'),
    'Module Management': pathname.startsWith('/dashboard/module-management'),
    'Workflow Engine': pathname.startsWith('/dashboard/workflow'),
    Notifications: pathname.startsWith('/dashboard/notifications'),
    Attachments: pathname.startsWith('/dashboard/attachments'),
    'Audit Log': pathname.startsWith('/dashboard/audit-log'),
    'Action Tracking': pathname.startsWith('/dashboard/action-tracking'),
    'Form Builder': pathname.startsWith('/dashboard/form-builder'),
    'Checklist Builder': pathname.startsWith('/dashboard/checklist-builder'),
    Numbering: pathname.startsWith('/dashboard/numbering'),
    Templates: pathname.startsWith('/dashboard/templates'),
    'Import & Export': pathname.startsWith('/dashboard/import-export'),
    Calendar: pathname.startsWith('/dashboard/calendar'),
    'API Keys': pathname.startsWith('/dashboard/api-keys'),
    Webhooks: pathname.startsWith('/dashboard/webhooks'),
    'Dashboard Builder': pathname.startsWith('/dashboard/builder'),
    'SSO Providers': pathname.startsWith('/dashboard/sso'),
    MFA: pathname.startsWith('/dashboard/mfa'),
    Permissions: pathname.startsWith('/dashboard/permissions'),
    Subscription: pathname.startsWith('/dashboard/subscription'),
    Incident: pathname.startsWith('/dashboard/incident'),
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    // Try to get user info from stored data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold text-foreground">QHSSE Platform</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            if ('children' in item && item.children) {
              const isGroupActive = item.children.some((c) => pathname.startsWith(c.href));
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenGroups(prev => ({ ...prev, [item.name]: !prev[item.name] }))}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isGroupActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.name}
                    <span className="ml-auto text-xs">{openGroups[item.name] ? '▾' : '▸'}</span>
                  </button>
                  {openGroups[item.name] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const childActive = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                              childActive
                                ? 'bg-accent text-accent-foreground font-medium'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || ''}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
