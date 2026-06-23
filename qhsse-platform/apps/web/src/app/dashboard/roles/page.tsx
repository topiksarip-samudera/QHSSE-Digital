'use client';

import OrgListPage from '@/components/org-list-page';
import { rolesApi } from '@/lib/api';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export default function RolesPage() {
  return (
    <OrgListPage
      title="Roles & Permissions"
      description="Manage roles and their permission assignments"
      createHref="/dashboard/roles/new"
      createLabel="New Role"
      api={rolesApi}
      basePath="/dashboard/roles"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code', render: (val) => (
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{val}</code>
        )},
        { key: 'description', label: 'Description', render: (val) => val || '—' },
        { key: 'isSystem', label: 'Type', render: (val) => val ? (
          <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">System</span>
        ) : (
          <span className="inline-block rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">Custom</span>
        )},
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[val] || ''}`}>{val}</span>
        )},
        { key: '_count', label: 'Permissions', render: (val) => val?.permissions ?? 0 },
        { key: '_count', label: 'Users', render: (val) => val?.userRoles ?? 0 },
        { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
      ]}
    />
  );
}
