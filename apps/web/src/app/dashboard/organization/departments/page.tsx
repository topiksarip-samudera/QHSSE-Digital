'use client';

import OrgListPage from '@/components/org-list-page';
import { departmentsApi } from '@/lib/api';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export default function DepartmentsPage() {
  return (
    <OrgListPage
      title="Departments"
      description="Manage organizational departments"
      createHref="/dashboard/organization/departments/new"
      createLabel="New Department"
      api={departmentsApi}
      basePath="/dashboard/organization/departments"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[val] || ''}`}>{val}</span>
        )},
        { key: 'parent', label: 'Parent', render: (_val, row) => row.parent?.name || '—' },
      ]}
    />
  );
}
