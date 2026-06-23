'use client';

import OrgListPage from '@/components/org-list-page';
import { usersApi } from '@/lib/api';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-yellow-100 text-yellow-800',
  invited: 'bg-blue-100 text-blue-800',
};

export default function UsersPage() {
  return (
    <OrgListPage
      title="Users"
      description="Manage platform users and their access"
      createHref="/dashboard/users/new"
      createLabel="New User"
      api={usersApi}
      basePath="/dashboard/users"
      columns={[
        { key: 'email', label: 'Email' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[val] || ''}`}>{val}</span>
        )},
        { key: 'companyAssignments', label: 'Company', render: (val) => val?.[0]?.company?.name || '—' },
        { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
      ]}
    />
  );
}
