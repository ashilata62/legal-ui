import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, Search, Filter, Eye, Edit, Briefcase, Calendar, Clock, DollarSign } from 'lucide-react';
import { useMatters } from '../../../context/MatterContext';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import { PRACTICE_AREAS } from '../../../data/practiceAreas';
import { PageHeader } from '../../../components/shared/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterBar } from '../../../components/shared/FilterBar';
import { Modal } from '../../../components/ui/Modal';
import { MatterForm } from '../forms/MatterForm';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency } from '../../../utils/formatCurrency';

export function MattersList() {
  const navigate = useNavigate();
  const { matters } = useMatters();
  const { allUsers } = useAuth();
  const permissions = usePermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [attorneyFilter, setAttorneyFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMatter, setEditingMatter] = useState(null);

  const attorneys = allUsers.filter(u => u.role === 'attorney' || u.role === 'super_admin' || u.role === 'supervisor');

  const filteredMatters = useMemo(() => {
    return matters.filter(matter => {
      const matchesSearch =
        searchQuery === '' ||
        matter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matter.matterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        matter.clientName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPA = practiceAreaFilter === '' || matter.practiceAreaId === practiceAreaFilter;
      const matchesStatus = statusFilter === '' || matter.status === statusFilter;
      const matchesAttorney = attorneyFilter === '' || matter.responsibleAttorneyId === attorneyFilter;

      return matchesSearch && matchesPA && matchesStatus && matchesAttorney;
    });
  }, [matters, searchQuery, practiceAreaFilter, statusFilter, attorneyFilter]);

  const columns = [
    {
      key: 'matterNumber',
      label: 'Matter ID & Caption',
      sortable: true,
      render: (val, row) => (
        <div className="min-w-[200px]">
          <span className="font-serif font-bold text-[#06244B] hover:text-[#A4432B] block cursor-pointer text-sm leading-snug">
            {row.title}
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#667085] mt-1">
            <span className="font-semibold text-[#A4432B] whitespace-nowrap">{row.matterNumber}</span>
            <span>•</span>
            <span>Client: <strong className="text-[#06244B]">{row.clientName}</strong></span>
          </div>
        </div>
      ),
    },
    {
      key: 'practiceAreaName',
      label: 'Practice Area (9 Confirmed)',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-medium text-[#202A35] max-w-[200px] block truncate">
          {val}
        </span>
      ),
    },
    {
      key: 'responsibleAttorneyName',
      label: 'Lead Attorney',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-semibold text-[#06244B] whitespace-nowrap">{val}</span>
      ),
    },
    {
      key: 'billingType',
      label: 'Billing',
      sortable: true,
      render: (val, row) => (
        <div className="text-xs">
          <span className="font-semibold text-[#06244B]">{val}</span>
          {val === 'Hourly' && <span className="text-[10px] text-[#667085] block">${row.hourlyRate}/hr</span>}
          {val === 'Flat Fee' && <span className="text-[10px] text-[#667085] block">{formatCurrency(row.flatFeeAmount)}</span>}
        </div>
      ),
    },
    {
      key: 'openDate',
      label: 'Open Date',
      sortable: true,
      render: (val) => (
        <span className="text-xs text-[#667085] whitespace-nowrap">{formatDate(val, { short: true })}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (val, row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/matters/${row.id}`)}
            className="p-1 rounded text-[#06244B] hover:bg-[#F5F0E5] hover:text-[#A4432B]"
            title="Open Matter Workspace"
          >
            <Eye className="w-4 h-4" />
          </button>
          {permissions.canCreateMatter && (
            <button
              onClick={() => setEditingMatter(row)}
              className="p-1 rounded text-[#667085] hover:bg-[#F5F0E5] hover:text-[#06244B]"
              title="Edit Matter"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Matters &amp; Case Files"
        subtitle="Manage legal representations, litigation proceedings, and corporate files across all 9 practice areas."
        breadcrumbs={[{ label: 'Clients & Matters', to: '/matters' }, { label: 'All Matters' }]}
        actions={
          permissions.canCreateMatter && (
            <Button
              variant="primary"
              size="sm"
              icon={FolderPlus}
              onClick={() => setIsAddModalOpen(true)}
            >
              New Legal Matter
            </Button>
          )
        }
      />

      {/* Search and Filters */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search matter title, case number, or client..."
          className="xl:col-span-4"
        />

        <div className="xl:col-span-8">
          <FilterBar
            filters={[
              {
                id: 'practiceArea',
                label: 'Practice Area',
                value: practiceAreaFilter,
                options: PRACTICE_AREAS.map(p => ({ value: p.id, label: p.name })),
                onChange: setPracticeAreaFilter,
              },
              {
                id: 'status',
                label: 'Status',
                value: statusFilter,
                options: [
                  { value: 'Active', label: 'Active' },
                  { value: 'In Discovery', label: 'In Discovery' },
                  { value: 'Trial Prep', label: 'Trial Prep' },
                  { value: 'On Hold', label: 'On Hold' },
                  { value: 'Concluded', label: 'Concluded' },
                ],
                onChange: setStatusFilter,
              },
              {
                id: 'attorney',
                label: 'Lead Attorney',
                value: attorneyFilter,
                options: attorneys.map(a => ({ value: a.id, label: a.name })),
                onChange: setAttorneyFilter,
              },
            ]}
            onReset={() => {
              setSearchQuery('');
              setPracticeAreaFilter('');
              setStatusFilter('');
              setAttorneyFilter('');
            }}
          />
        </div>
      </div>

      {/* Matters Table */}
      <DataTable
        columns={columns}
        data={filteredMatters}
        pageSize={8}
        onRowClick={(matter) => navigate(`/matters/${matter.id}`)}
        emptyMessage="No legal matters found matching the specified search or filters."
      />

      {/* Add Matter Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Open New Legal Matter"
        subtitle="Complete matter intake details and establish litigation budget."
        maxWidth="max-w-3xl"
      >
        <MatterForm
          onSuccess={() => setIsAddModalOpen(false)}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Matter Modal */}
      <Modal
        isOpen={Boolean(editingMatter)}
        onClose={() => setEditingMatter(null)}
        title={`Edit Matter: ${editingMatter?.matterNumber}`}
        subtitle="Modify matter assignment, status, court, or billing arrangement."
        maxWidth="max-w-3xl"
      >
        {editingMatter && (
          <MatterForm
            initialData={editingMatter}
            onSuccess={() => setEditingMatter(null)}
            onCancel={() => setEditingMatter(null)}
          />
        )}
      </Modal>
    </div>
  );
}

