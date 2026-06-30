'use client';

export default function ContractorMasterDataPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contractor Master Data</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Contract Statuses', items: ['registered', 'prequalified', 'approved', 'suspended', 'blacklisted'] },
          { title: 'Risk Levels', items: ['low', 'medium', 'high'] },
          { title: 'Document Statuses', items: ['active', 'expired'] },
          { title: 'Worker Statuses', items: ['active', 'suspended', 'blacklisted'] },
          { title: 'Equipment Statuses', items: ['compliant', 'overdue', 'flagged'] },
          { title: 'Audit Results', items: ['pass', 'conditional', 'fail'] },
          { title: 'Performance Ratings', items: ['excellent', 'good', 'satisfactory', 'poor', 'unacceptable'] },
          { title: 'Rating Periods', items: ['monthly', 'quarterly', 'annually'] },
        ].map(group => (
          <div key={group.title} className="p-4 bg-card border rounded-md">
            <h3 className="font-semibold mb-2">{group.title}</h3>
            <div className="space-y-1">
              {group.items.map(item => (
                <div key={item} className="flex items-center gap-2 px-2 py-1 bg-muted rounded text-sm">
                  <span className="capitalize">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
