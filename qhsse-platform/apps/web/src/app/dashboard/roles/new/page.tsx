'use client';

import OrgFormPage from '@/components/org-form-page';
import { rolesApi } from '@/lib/api';

export default function NewRolePage() {
  return (
    <OrgFormPage
      title="Create New Role"
      backHref="/dashboard/roles"
      api={rolesApi}
      fields={[
        { name: 'name', label: 'Role Name', type: 'text', required: true, placeholder: 'e.g. Safety Officer' },
        { name: 'code', label: 'Role Code', type: 'text', required: true, placeholder: 'e.g. safety_officer' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the role responsibilities...' },
      ]}
    />
  );
}
