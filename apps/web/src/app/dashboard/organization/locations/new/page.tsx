'use client';

import OrgFormPage from '@/components/org-form-page';
import { locationsApi } from '@/lib/api';

export default function NewLocationPage() {
  return (
    <OrgFormPage
      title="Create New Location"
      backHref="/dashboard/organization/locations"
      api={{ create: locationsApi.create }}
      fields={[
        { name: 'companyId', label: 'Company ID', type: 'text', required: true, placeholder: 'Enter company ID' },
        { name: 'siteId', label: 'Site ID', type: 'text', required: true, placeholder: 'Enter site ID' },
        { name: 'name', label: 'Location Name', type: 'text', required: true, placeholder: 'e.g. Building A - Floor 3' },
        { name: 'code', label: 'Code', type: 'text', placeholder: 'e.g. BA-F3' },
        { name: 'type', label: 'Type', type: 'select', options: [
          { value: 'building', label: 'Building' },
          { value: 'floor', label: 'Floor' },
          { value: 'room', label: 'Room' },
          { value: 'area', label: 'Area' },
          { value: 'zone', label: 'Zone' },
        ]},
        { name: 'parentId', label: 'Parent Location ID', type: 'text', placeholder: 'Optional parent location' },
        { name: 'latitude', label: 'Latitude', type: 'number', placeholder: '-6.2088' },
        { name: 'longitude', label: 'Longitude', type: 'number', placeholder: '106.8456' },
      ]}
    />
  );
}
