'use client';

import OrgFormPage from '@/components/org-form-page';
import { rolesApi } from '@/lib/api';
import { use } from 'react';

export default function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <OrgFormPage
      title="Edit Role"
      backHref={`/dashboard/roles/${id}`}
      api={rolesApi}
      id={id}
      fields={[
        { name: 'name', label: 'Role Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]},
      ]}
    />
  );
}
