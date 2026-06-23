'use client';

import { useParams } from 'next/navigation';
import OrgFormPage from '@/components/org-form-page';
import { usersApi } from '@/lib/api';

export default function EditUserPage() {
  const { id } = useParams();
  return (
    <OrgFormPage
      title="Edit User"
      backHref={`/dashboard/users/${id}`}
      api={usersApi}
      id={id as string}
      fields={[
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'phone', label: 'Phone', type: 'text' },
        { name: 'employeeId', label: 'Employee ID', type: 'text' },
        { name: 'position', label: 'Position', type: 'text' },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'address', label: 'Address', type: 'textarea' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'timezone', label: 'Timezone', type: 'text', placeholder: 'Asia/Jakarta' },
        { name: 'language', label: 'Language', type: 'text', placeholder: 'id' },
      ]}
    />
  );
}
