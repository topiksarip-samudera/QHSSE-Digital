'use client';

import OrgFormPage from '@/components/org-form-page';
import { masterDataApi } from '@/lib/api';
import { use } from 'react';

export default function NewMasterDataItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <OrgFormPage
      title="Add Master Data Item"
      backHref={`/dashboard/master-data/${id}`}
      api={{
        create: (data) => masterDataApi.createItem({ ...data, groupId: id }),
      }}
      fields={[
        { name: 'name', label: 'Item Name', type: 'text', required: true, placeholder: 'e.g. Extreme' },
        { name: 'code', label: 'Item Code', type: 'text', placeholder: 'e.g. EXTREME' },
        { name: 'value', label: 'Value', type: 'text', placeholder: 'e.g. extreme' },
        { name: 'sortOrder', label: 'Sort Order', type: 'number', placeholder: '0' },
      ]}
    />
  );
}
