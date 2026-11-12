import React, { useState, useMemo } from 'react';
import { Clock, Plus, Filter, Search, CheckCircle2, DollarSign, Calendar, FileSpreadsheet } from 'lucide-react';
import { useTime } from '../../../context/TimeContext';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../components/ui/Toast';
import { PageHeader } from '../../../components/shared/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterBar } from '../../../components/shared/FilterBar';
import { Modal } from '../../../components/ui/Modal';
import { TimeEntryForm } from '../forms/TimeEntryForm';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrency, formatHours } from '../../../utils/formatCurrency';

export function TimeTracking() {
  const { timeEntries } = useTime();
  const { currentUser, allUsers } = useAuth();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const filteredEntries = useMemo(() => {
    return timeEntries.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.matterTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.userName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === '' || entry.status === statusFilter;
      const matchesUser = userFilter === '' || entry.userId === userFilter;

      return matchesSearch && matchesStatus && matchesUser;
    });
  }, [timeEntries, searchQuery, statusFilter, userFilter]);

  const totalHours = filteredEntries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const totalAmount = filteredEntries.reduce((sum, e) => sum + (e.amount || 0), 0);
  const billableHours = filteredEntries.filter(e => e.isBillable).reduce((sum, e) => sum + (e.hours || 0), 0);

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (val) => <span className="text-xs font-semibold text-[#06244B]">{formatDate(val, { short: true })}</span>,
    },
    {
      key: 'userName',
      label: 'Personnel',
      sortable: true,
      render: (val) => <span className="text-xs font-semibold text-[#202A35]">{val}</span>,
    },
    {
      key: 'matterTitle',
      label: 'Matter & Client',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-xs text-[#06244B] block max-w-xs truncate">{val}</span>
          <span className="text-[11px] text-[#667085]">{row.clientName}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Activity Description & UTBMS Scope',
      render: (val) => (
        <span className="text-xs text-[#202A35] max-w-md block line-clamp-2" title={val}>
          {val}
        </span>
      ),
    },
    {
      key: 'hours',
      label: 'Duration',
      sortable: true,
      align: 'right',
      render: (val) => <span className="text-xs font-bold text-[#A4432B]">{formatHours(val)}</span>,
    },
    {
      key: 'amount',
      label: 'Amount ($)',
      sortable: true,
      align: 'right',
      render: (val, row) => (
        <div className="text-xs text-right">
          <span className="font-bold text-[#06244B] block">{formatCurrency(val)}</span>
          <span className="text-[10px] text-[#667085]">${row.rate}/hr</span>
        </div>
      ),
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
        title="Time Tracking &amp; Activity Ledger"
        subtitle="Record daily attorney and staff billable activities, client conferences, and document preparation."
        breadcrumbs={[{ label: 'Tasks & Activities', to: '/tasks' }, { label: 'Time Tracking' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Clock}
            onClick={() => setIsLogModalOpen(true)}
          >
            Log Time Entry
          </Button>
        }
      />

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded border border-[#D9D6CF] shadow-subtle">
          <span className="text-xs font-semibold uppercase text-[#667085]">Filtered Total Hours</span>
          <p className="text-2xl font-serif font-bold text-[#06244B] mt-1">{formatHours(totalHours)}</p>
          <span className="text-[11px] text-[#287A55] font-semibold">{formatHours(billableHours)} billable</span>
        </div>

        <div className="p-4 bg-white rounded border border-[#D9D6CF] shadow-subtle">
          <span className="text-xs font-semibold uppercase text-[#667085]">Calculated Fee Value</span>
          <p className="text-2xl font-serif font-bold text-[#A4432B] mt-1">{formatCurrency(totalAmount)}</p>
          <span className="text-[11px] text-[#667085]">Based on attorney rate schedules</span>
        </div>

        <div className="p-4 bg-white rounded border border-[#D9D6CF] shadow-subtle">
          <span className="text-xs font-semibold uppercase text-[#667085]">Logged Entries</span>
          <p className="text-2xl font-serif font-bold text-[#06244B] mt-1">{filteredEntries.length} Records</p>
          <span className="text-[11px] text-[#A66A16] font-semibold">
            {filteredEntries.filter(e => e.status === 'Submitted').length} pending supervisory review
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by description, matter, or lawyer..."
          className="md:col-span-1"
        />

        <div className="md:col-span-2">
          <FilterBar
            filters={[
              {
                id: 'status',
                label: 'Status',
                value: statusFilter,
                options: [
                  { value: 'Draft', label: 'Draft' },
                  { value: 'Submitted', label: 'Submitted' },
                  { value: 'Approved', label: 'Approved' },
                  { value: 'Rejected', label: 'Rejected' },
                  { value: 'Exported', label: 'Exported to CosmoLex' },
                ],
                onChange: setStatusFilter,
              },
              {
                id: 'user',
                label: 'Timekeeper',
                value: userFilter,
                options: allUsers.map(u => ({ value: u.id, label: u.name })),
                onChange: setUserFilter,
              },
            ]}
            onReset={() => {
              setSearchQuery('');
              setStatusFilter('');
              setUserFilter('');
            }}
          />
        </div>
      </div>

      {/* Entries Table */}
      <DataTable
        columns={columns}
        data={filteredEntries}
        pageSize={8}
      />

      {/* Log Time Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Billable Time"
        subtitle="Record legal activity against a matter for supervisory review and billing."
        maxWidth="max-w-2xl"
      >
        <TimeEntryForm
          onSuccess={() => setIsLogModalOpen(false)}
          onCancel={() => setIsLogModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

