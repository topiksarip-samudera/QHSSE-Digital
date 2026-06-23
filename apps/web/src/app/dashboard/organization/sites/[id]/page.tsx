'use client';

import { useParams } from 'next/navigation';
import OrgDetailPage from '@/components/org-detail-page';
import { sitesApi } from '@/lib/api';

export default function SiteDetailPage() {
  const { id } = useParams();
  return (
    <OrgDetailPage
      title="Sites"
      backHref="/dashboard/organization/sites"
      editHref={`/dashboard/organization/sites/${id}/edit`}
      api={sitesApi}
      id={id as string}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'address', label: 'Address' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'country', label: 'Country' },
        { key: 'latitude', label: 'Latitude' },
        { key: 'longitude', label: 'Longitude' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{val}</span>
        )},
        { key: 'company', label: 'Company', render: (val) => val?.name || '—' },
        { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
      ]}
    />
  );
}
