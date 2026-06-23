'use client';

import { useParams } from 'next/navigation';
import OrgDetailPage from '@/components/org-detail-page';
import { locationsApi } from '@/lib/api';

export default function LocationDetailPage() {
  const { id } = useParams();
  return (
    <OrgDetailPage
      title="Locations"
      backHref="/dashboard/organization/locations"
      editHref={`/dashboard/organization/locations/${id}/edit`}
      api={locationsApi}
      id={id as string}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{val}</span>
        )},
        { key: 'latitude', label: 'Latitude' },
        { key: 'longitude', label: 'Longitude' },
        { key: 'company', label: 'Company', render: (val) => val?.name || '—' },
        { key: 'site', label: 'Site', render: (val) => val?.name || '—' },
        { key: 'parent', label: 'Parent Location', render: (val) => val?.name || '—' },
        { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
      ]}
    />
  );
}
