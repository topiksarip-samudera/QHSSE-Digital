'use client';

import { useParams } from 'next/navigation';
import OrgDetailPage from '@/components/org-detail-page';
import { positionsApi } from '@/lib/api';

export default function PositionDetailPage() {
  const { id } = useParams();
  return (
    <OrgDetailPage
      title="Positions"
      backHref="/dashboard/organization/positions"
      editHref={`/dashboard/organization/positions/${id}/edit`}
      api={positionsApi}
      id={id as string}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'description', label: 'Description' },
        { key: 'level', label: 'Level', render: (val) => val != null ? String(val) : '—' },
        { key: 'status', label: 'Status', render: (val) => (
          <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{val}</span>
        )},
        { key: 'company', label: 'Company', render: (val) => val?.name || '—' },
        { key: 'createdAt', label: 'Created', render: (val) => val ? new Date(val).toLocaleDateString() : '—' },
      ]}
    />
  );
}
