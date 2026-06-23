'use client';

import OrgFormPage from '@/components/org-form-page';
import { masterDataApi } from '@/lib/api';

export default function NewMasterDataGroupPage() {
  return (
    <OrgFormPage
      title="Create Master Data Group"
      backHref="/dashboard/master-data"
      api={{
        create: (data) => masterDataApi.createGroup(data),
      }}
      fields={[
        { name: 'name', label: 'Group Name', type: 'text', required: true, placeholder: 'e.g. Risk Level' },
        { name: 'code', label: 'Group Code', type: 'text', required: true, placeholder: 'e.g. risk_level' },
        { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe the purpose of this group...' },
      ]}
    />
  );
}
