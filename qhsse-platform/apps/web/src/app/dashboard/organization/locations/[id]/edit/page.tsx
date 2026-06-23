'use client';

import { useParams } from 'next/navigation';
import OrgFormPage from '@/components/org-form-page';
import { locationsApi } from '@/lib/api';

export default function EditLocationPage() {
  const { id } = useParams();
  return (
    <OrgFormPage
      title="Edit Location"
      backHref={`/dashboard/organization/locations/${id}`}
      api={{ get: locationsApi.get, update: locationsApi.update }}
      id={id as string}
      fields={[
        { name: 'name', label: 'Location Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'type', label: 'Type', type: 'select', options: [
          { value: 'building', label: 'Building' },
          { value: 'floor', label: 'Floor' },
          { value: 'room', label: 'Room' },
          { value: 'area', label: 'Area' },
          { value: 'zone', label: 'Zone' },
        ]},
        { name: 'parentId', label: 'Parent Location ID', type: 'text' },
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
