'use client';

import OrgFormPage from '@/components/org-form-page';
import { masterDataApi } from '@/lib/api';
import { use } from 'react';

export default function EditMasterDataGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <OrgFormPage
      title="Edit Master Data Group"
      backHref={`/dashboard/master-data/${id}`}
      api={{
        get: (id) => masterDataApi.getGroup(id),
        update: (id, data) => masterDataApi.updateGroup(id, data),
      }}
      id={id}
      fields={[
        { name: 'name', label: 'Group Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]},
      ]}
    />
  );
}
