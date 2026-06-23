'use client';

import OrgFormPage from '@/components/org-form-page';
import { departmentsApi } from '@/lib/api';

export default function NewDepartmentPage() {
  return (
    <OrgFormPage
      title="Create New Department"
      backHref="/dashboard/organization/departments"
      api={{ create: departmentsApi.create }}
      fields={[
        { name: 'companyId', label: 'Company ID', type: 'text', required: true, placeholder: 'Enter company ID' },
        { name: 'name', label: 'Department Name', type: 'text', required: true, placeholder: 'e.g. Human Resources' },
        { name: 'code', label: 'Code', type: 'text', placeholder: 'e.g. HR-001' },
        { name: 'siteId', label: 'Site ID', type: 'text', placeholder: 'Optional — for site-specific dept' },
        { name: 'headId', label: 'Head (User ID)', type: 'text', placeholder: 'Optional — department head user ID' },
        { name: 'parentId', label: 'Parent Department ID', type: 'text', placeholder: 'Optional — parent department ID' },
      ]}
    />
  );
}
