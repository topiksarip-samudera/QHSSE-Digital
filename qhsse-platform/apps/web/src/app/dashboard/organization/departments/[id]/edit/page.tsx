'use client';

import { useParams } from 'next/navigation';
import OrgFormPage from '@/components/org-form-page';
import { departmentsApi } from '@/lib/api';

export default function EditDepartmentPage() {
  const { id } = useParams();
  return (
    <OrgFormPage
      title="Edit Department"
      backHref={`/dashboard/organization/departments/${id}`}
      api={{ get: departmentsApi.get, update: departmentsApi.update }}
      id={id as string}
      fields={[
        { name: 'name', label: 'Department Name', type: 'text', required: true },
        { name: 'code', label: 'Code', type: 'text' },
        { name: 'siteId', label: 'Site ID', type: 'text' },
        { name: 'headId', label: 'Head (User ID)', type: 'text' },
        { name: 'parentId', label: 'Parent Department ID', type: 'text' },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'archived', label: 'Archived' },
        ]},
      ]}
    />
  );
}
