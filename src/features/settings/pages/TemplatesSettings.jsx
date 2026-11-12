import React from 'react';
import { FileText, Layers, Plus, Download, Eye } from 'lucide-react';
import { PageHeader } from '../../../components/shared/PageHeader';
import { Button } from '../../../components/ui/Button';
import { DataTable } from '../../../components/ui/DataTable';
import { useToast } from '../../../components/ui/Toast';

export function TemplatesSettings() {
  const { addToast } = useToast();

  const templates = [
    { id: 'TPL-01', name: 'Master Client Engagement & Hourly Retainer Agreement', category: 'Engagement', format: 'DOCX / PDF', lastUpdated: '2025-01-10' },
    { id: 'TPL-02', name: 'Utah Third District Notice of Appearance & Electronic Service', category: 'Litigation Pleadings', format: 'DOCX', lastUpdated: '2025-02-14' },
    { id: 'TPL-03', name: 'Deposition Subpoena Duces Tecum for Corporate Records', category: 'Discovery', format: 'DOCX', lastUpdated: '2025-04-20' },
    { id: 'TPL-04', name: 'Utah Irrevocable Dynasty Trust Master Instrument', category: 'Estate Planning', format: 'DOCX', lastUpdated: '2025-06-18' },
    { id: 'TPL-05', name: 'Mutual Non-Disclosure & Proprietary Inventions Agreement', category: 'Corporate', format: 'DOCX', lastUpdated: '2025-08-05' },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Template Title & Scope',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#A4432B]" />
          <div>
            <span className="font-semibold text-xs text-[#06244B] block">{val}</span>
            <span className="text-[10px] text-[#667085]">{row.id} • {row.format}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Practice Group',
      sortable: true,
      render: (val) => (
        <span className="text-xs px-2 py-0.5 rounded bg-[#F5F0E5] text-[#06244B] border border-[#D9D6CF]">
          {val}
        </span>
      ),
    },
    {
      key: 'lastUpdated',
      label: 'Revision Date',
      sortable: true,
      render: (val) => <span className="text-xs text-[#667085]">{val}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: () => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => addToast('Template downloaded for editing.', 'info')}>
            Download
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document &amp; Workflow Templates"
        subtitle="Standardized legal pleadings, agreements, engagement instruments, and statutory notices."
        breadcrumbs={[{ label: 'Reports & Settings', to: '/settings/users' }, { label: 'Templates' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => addToast('Upload template dialog opened.', 'info')}
          >
            Upload New Template
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={templates}
        pageSize={8}
      />
    </div>
  );
}

