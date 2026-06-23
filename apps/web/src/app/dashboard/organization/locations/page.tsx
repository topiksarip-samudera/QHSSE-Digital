'use client';

import OrgListPage from '@/components/org-list-page';
import { locationsApi } from '@/lib/api';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export default function LocationsPage() {
  return (
    <OrgListPage
      title="Locations"
      description="Manage physical locations within sites"
      createHref="/dashboard/organization/locations/new"
      createLabel="New Location"
      api={locationsApi}
      basePath="/dashboard/organization/locations"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[val] || ''}`}>{val}</span>
        )},
      ]}
    />
  );
}
