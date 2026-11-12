import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, Eye, Edit, Building2, User, Phone, Mail, FolderOpen } from 'lucide-react';
import { useClients } from '../../../context/ClientContext';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import { PageHeader } from '../../../components/shared/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterBar } from '../../../components/shared/FilterBar';
import { Modal } from '../../../components/ui/Modal';
import { ClientForm } from '../forms/ClientForm';
import { formatCurrency } from '../../../utils/formatCurrency';

export function ClientsList() {
  const navigate = useNavigate();
  const { clients } = useClients();
  const { allUsers } = useAuth();
  const permissions = usePermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [attorneyFilter, setAttorneyFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  // Attorneys for filter
  const attorneys = allUsers.filter(u => u.role === 'attorney' || u.role === 'super_admin');

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch =
        searchQuery === '' ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === '' || client.status === statusFilter;
      const matchesAttorney = attorneyFilter === '' || client.assignedAttorneyId === attorneyFilter;

      return matchesSearch && matchesStatus && matchesAttorney;
    });
  }, [clients, searchQuery, statusFilter, attorneyFilter]);

  const columns = [
    {
      key: 'name',
      label: 'Client Name & Reference',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#F5F0E5] border border-[#D9D6CF] flex items-center justify-center text-[#06244B] flex-shrink-0">
            {row.type === 'Organization' ? <Building2 className="w-4 h-4 text-[#A4432B]" /> : <User className="w-4 h-4 text-[#06244B]" />}
          </div>
          <div>
            <span className="font-semibold text-[#06244B] hover:text-[#A4432B] block cursor-pointer">
              {row.name}
            </span>
            <span className="text-[11px] text-[#667085]">{row.id} • {row.type}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'primaryContact',
      label: 'Primary Contact & Comms',
      render: (val, row) => (
        <div>
          <p className="font-medium text-xs text-[#202A35]">{row.primaryContact || '—'}</p>
          <div className="flex items-center gap-2 text-[11px] text-[#667085] mt-0.5">
            <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#A4432B]" /> {row.email}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#06244B]" /> {row.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'assignedAttorneyName',
      label: 'Assigned Counsel',
      sortable: true,
      render: (val) => (
        <span className="text-xs font-semibold text-[#06244B]">{val || 'Unassigned'}</span>
      ),
    },
    {
      key: 'totalMatters',
      label: 'Matters',
      sortable: true,
      align: 'center',
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-[#F5F0E5] text-[#06244B]">
          <FolderOpen className="w-3 h-3 text-[#A4432B]" />
          {val}
        </span>
      ),
    },
    {
      key: 'outstandingBalance',
      label: 'Ledger Balance',
      sortable: true,
      align: 'right',
      render: (val) => (
        <span className={`text-xs font-semibold ${val > 0 ? 'text-[#B42318]' : 'text-[#287A55]'}`}>
          {formatCurrency(val)}
        </span>
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
            onClick={() => navigate(`/clients/${row.id}`)}
            className="p-1 rounded text-[#06244B] hover:bg-[#F5F0E5] hover:text-[#A4432B]"
            title="View Client Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {permissions.canCreateClient && (
            <button
              onClick={() => setEditingClient(row)}
              className="p-1 rounded text-[#667085] hover:bg-[#F5F0E5] hover:text-[#06244B]"
              title="Edit Client"
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
        title="Client Directory"
        subtitle="Active corporations, trusts, and individuals represented by Heugly &amp; Bludworth."
        breadcrumbs={[{ label: 'Clients & Matters', to: '/clients' }, { label: 'All Clients' }]}
        actions={
          permissions.canCreateClient && (
            <Button
              variant="primary"
              size="sm"
              icon={UserPlus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Client
            </Button>
          )
        }
      />

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by client name, reference ID, email..."
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
                  { value: 'Active', label: 'Active (Retained)' },
                  { value: 'Prospective', label: 'Prospective' },
                  { value: 'Inactive', label: 'Inactive / Closed' },
                ],
                onChange: setStatusFilter,
              },
              {
                id: 'attorney',
                label: 'Assigned Counsel',
                value: attorneyFilter,
                options: attorneys.map(a => ({ value: a.id, label: a.name })),
                onChange: setAttorneyFilter,
              },
            ]}
            onReset={() => {
              setSearchQuery('');
              setStatusFilter('');
              setAttorneyFilter('');
            }}
          />
        </div>
      </div>

      {/* Clients Data Grid */}
      <DataTable
        columns={columns}
        data={filteredClients}
        pageSize={8}
        onRowClick={(client) => navigate(`/clients/${client.id}`)}
        emptyMessage="No clients found matching the applied search or filters."
      />

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Client"
        subtitle="Enter client contact, representation details, and relationship counsel."
        maxWidth="max-w-2xl"
      >
        <ClientForm
          onSuccess={() => setIsAddModalOpen(false)}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={Boolean(editingClient)}
        onClose={() => setEditingClient(null)}
        title={`Edit Client: ${editingClient?.name}`}
        subtitle="Update corporate or individual client details."
        maxWidth="max-w-2xl"
      >
        {editingClient && (
          <ClientForm
            initialData={editingClient}
            onSuccess={() => setEditingClient(null)}
            onCancel={() => setEditingClient(null)}
          />
        )}
      </Modal>
    </div>
  );
}

