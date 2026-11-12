import React, { useState } from 'react';
import { FolderOpen, Download, Filter, DollarSign, Calendar } from 'lucide-react';
import { useMatters } from '../../../context/MatterContext';
import { useToast } from '../../../components/ui/Toast';
import { PageHeader } from '../../../components/shared/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, formatHours } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

export function MatterReports() {
  const { matters } = useMatters();
  const { addToast } = useToast();

  const columns = [
    {
      key: 'matterNumber',
      label: 'Matter Docket & Caption',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-serif font-bold text-sm text-[#06244B] block">{row.title}</span>
          <span className="text-[11px] text-[#667085]">{val} • {row.clientName}</span>
        </div>
      ),
    },
    {
      key: 'practiceAreaName',
      label: 'Practice Area',
      sortable: true,
      render: (val) => <span className="text-xs text-[#202A35]">{val}</span>,
    },
    {
      key: 'budget',
      label: 'Budget',
      sortable: true,
      align: 'right',
      render: (val) => <span className="text-xs font-semibold text-[#06244B]">{formatCurrency(val)}</span>,
    },
    {
      key: 'totalBilled',
      label: 'Billed Fees to Date',
      sortable: true,
      align: 'right',
      render: (val, row) => {
        const percent = Math.min(100, Math.round((val / (row.budget || 50000)) * 100));
        return (
          <div className="text-right">
            <span className="text-xs font-bold text-[#A4432B] block">{formatCurrency(val)}</span>
            <span className="text-[10px] text-[#667085]">{percent}% of budget</span>
          </div>
        );
      },
    },
    {
      key: 'openDate',
      label: 'Open Date',
      sortable: true,
      render: (val) => <span className="text-xs text-[#667085]">{formatDate(val, { short: true })}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Case &amp; Matter Operational Reports"
        subtitle="Matter budget tracking, litigation lifecycle progress, and open case aging across all 9 practice areas."
        breadcrumbs={[{ label: 'Reports & Settings', to: '/reports/staff' }, { label: 'Matter Reports' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => addToast('Matter Lifecycle CSV Export generated.', 'success')}
          >
            Export CSV
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={matters}
        pageSize={10}
      />
    </div>
  );
}

