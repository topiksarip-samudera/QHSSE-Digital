'use client';

import { useParams } from 'next/navigation';
import OrgFormPage from '@/components/org-form-page';
import { positionsApi } from '@/lib/api';

export default function EditPositionPage() {
  const { id } = useParams();
  return (
    <OrgFormPage
      title="Edit Position"
      backHref={`/dashboard/organization/positions/${id}`}
      api={{ get: positionsApi.get, update: positionsApi.update }}
      id={id as string}
      fields={[
        { name: 'name', label: 'Position Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'level', label: 'Level', type: 'number' },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'archived', label: 'Archived' },
        ]},
      ]}
    />
  );
}
