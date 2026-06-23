'use client';

import { useParams } from 'next/navigation';
import OrgDetailPage from '@/components/org-detail-page';
import { departmentsApi } from '@/lib/api';

export default function DepartmentDetailPage() {
  const { id } = useParams();
  return (
    <OrgDetailPage
      title="Departments"
      backHref="/dashboard/organization/departments"
      editHref={`/dashboard/organization/departments/${id}/edit`}
      api={departmentsApi}
      id={id as string}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{val}</span>
        )},
        { key: 'company', label: 'Company', render: (val) => val?.name || '—' },
        { key: 'site', label: 'Site', render: (val) => val?.name || '—' },
        { key: 'parent', label: 'Parent Department', render: (val) => val?.name || '—' },
        { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
      ]}
    />
  );
}
