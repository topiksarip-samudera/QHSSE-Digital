'use client';

import OrgFormPage from '@/components/org-form-page';
import { sitesApi } from '@/lib/api';

export default function NewSitePage() {
  return (
    <OrgFormPage
      title="Create New Site"
      backHref="/dashboard/organization/sites"
      api={{ create: sitesApi.create }}
      fields={[
        { name: 'companyId', label: 'Company ID', type: 'text', required: true, placeholder: 'Enter company ID' },
        { name: 'name', label: 'Site Name', type: 'text', required: true, placeholder: 'e.g. Head Office' },
        { name: 'code', label: 'Code', type: 'text', placeholder: 'e.g. HO-001' },
        { name: 'businessUnitId', label: 'Business Unit ID', type: 'text', placeholder: 'Optional business unit' },
        { name: 'address', label: 'Address', type: 'textarea', placeholder: 'Full address' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State/Province', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'latitude', label: 'Latitude', type: 'number', placeholder: '-6.2088' },
        { name: 'longitude', label: 'Longitude', type: 'number', placeholder: '106.8456' },
      ]}
    />
  );
}
