'use client';

import OrgFormPage from '@/components/org-form-page';
import { positionsApi } from '@/lib/api';

export default function NewPositionPage() {
  return (
    <OrgFormPage
      title="Create New Position"
      backHref="/dashboard/organization/positions"
      api={{ create: positionsApi.create }}
      fields={[
        { name: 'companyId', label: 'Company ID', type: 'text', required: true, placeholder: 'Enter company ID' },
        { name: 'name', label: 'Position Name', type: 'text', required: true, placeholder: 'e.g. Safety Manager' },
        { name: 'code', label: 'Code', type: 'text', placeholder: 'e.g. SM-001' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Position description' },
        { name: 'level', label: 'Level', type: 'number', placeholder: 'e.g. 5' },
      ]}
    />
  );
}
