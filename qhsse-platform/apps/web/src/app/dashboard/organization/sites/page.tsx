'use client';

import OrgListPage from '@/components/org-list-page';
import { sitesApi } from '@/lib/api';

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  archived: 'bg-yellow-100 text-yellow-800',
};

export default function SitesPage() {
  return (
    <OrgListPage
      title="Sites"
      description="Manage company sites and locations"
      createHref="/dashboard/organization/sites/new"
      createLabel="New Site"
      api={sitesApi}
      basePath="/dashboard/organization/sites"
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'city', label: 'City' },
        { key: 'country', label: 'Country' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[val] || ''}`}>{val}</span>
        )},
      ]}
    />
  );
}
