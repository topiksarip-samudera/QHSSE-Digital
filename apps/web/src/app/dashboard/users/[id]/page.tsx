'use client';

import { useParams } from 'next/navigation';
import OrgDetailPage from '@/components/org-detail-page';
import { usersApi } from '@/lib/api';

export default function UserDetailPage() {
  const { id } = useParams();
  return (
    <OrgDetailPage
      title="Users"
      backHref="/dashboard/users"
      editHref={`/dashboard/users/${id}/edit`}
      api={usersApi}
      id={id as string}
      fields={[
        { key: 'email', label: 'Email' },
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
            val === 'active' ? 'bg-green-100 text-green-800' : val === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
          }`}>{val}</span>
        )},
        { key: 'isSuperAdmin', label: 'Super Admin', render: (val) => val ? 'Yes' : 'No' },
        { key: 'profile.employeeId', label: 'Employee ID' },
        { key: 'profile.position', label: 'Position' },
        { key: 'profile.bio', label: 'Bio' },
        { key: 'profile.city', label: 'City' },
        { key: 'profile.country', label: 'Country' },
        { key: 'companyAssignments', label: 'Companies', render: (val) =>
          val?.length ? val.map((a: any) => a.company?.name).join(', ') : '—'
        },
        { key: 'lastLoginAt', label: 'Last Login', render: (val) => val ? new Date(val).toLocaleString() : '—' },
        { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
      ]}
    />
  );
}
