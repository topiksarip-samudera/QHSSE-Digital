'use client';

import { useParams } from 'next/navigation';
import OrgFormPage from '@/components/org-form-page';
import { sitesApi } from '@/lib/api';

export default function EditSitePage() {
  const { id } = useParams();
  return (
    <OrgFormPage
      title="Edit Site"
      backHref={`/dashboard/organization/sites/${id}`}
      api={{ get: sitesApi.get, update: sitesApi.update }}
      id={id as string}
      fields={[
        { name: 'name', label: 'Site Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'businessUnitId', label: 'Business Unit ID', type: 'text' },
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State/Province', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'latitude', label: 'Latitude', type: 'number' },
        { name: 'longitude', label: 'Longitude', type: 'number' },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'archived', label: 'Archived' },
        ]},
      ]}
    />
  );
}
