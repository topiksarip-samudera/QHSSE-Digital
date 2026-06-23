'use client';

import OrgFormPage from '@/components/org-form-page';
import { masterDataApi } from '@/lib/api';
import { use } from 'react';

export default function EditMasterDataItemPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = use(params);
  return (
    <OrgFormPage
      title="Edit Master Data Item"
      backHref={`/dashboard/master-data/${id}`}
      api={{
        get: () => masterDataApi.getItem(itemId),
        update: (_: string, data: Record<string, any>) => masterDataApi.updateItem(itemId, data),
      }}
      id={itemId}
      fields={[
        { name: 'name', label: 'Item Name', type: 'text', required: true },
        { name: 'code', label: 'Item Code', type: 'text' },
        { name: 'value', label: 'Value', type: 'text' },
        { name: 'sortOrder', label: 'Sort Order', type: 'number' },
        { name: 'status', label: 'Status', type: 'select', options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]},
      ]}
    />
  );
}
