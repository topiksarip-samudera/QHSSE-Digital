'use client';

import OrgFormPage from '@/components/org-form-page';
import { usersApi } from '@/lib/api';

export default function NewUserPage() {
  return (
    <OrgFormPage
      title="Create New User"
      backHref="/dashboard/users"
      api={{ create: usersApi.create }}
      fields={[
        { name: 'email', label: 'Email', type: 'text', required: true, placeholder: 'user@company.com' },
        { name: 'password', label: 'Password', type: 'text', required: true, placeholder: 'Min 8 characters' },
        { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'John' },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Doe' },
        { name: 'phone', label: 'Phone', type: 'text', placeholder: '+62...' },
        { name: 'companyId', label: 'Company ID', type: 'text', placeholder: 'Assign to company (optional)' },
        { name: 'employeeId', label: 'Employee ID', type: 'text', placeholder: 'EMP-001' },
        { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g. Safety Officer' },
      ]}
    />
  );
}
