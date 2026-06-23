'use client';

import OrgListPage from '@/components/org-list-page';
import { positionsApi } from '@/lib/api';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export default function PositionsPage() {
  return (
    <OrgListPage
      title="Positions"
      description="Manage job positions and roles"
      createHref="/dashboard/organization/positions/new"
      createLabel="New Position"
      api={positionsApi}
      basePath="/dashboard/organization/positions"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'level', label: 'Level', render: (val) => val != null ? String(val) : '—' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[val] || ''}`}>{val}</span>
        )},
      ]}
    />
  );
}
