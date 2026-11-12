import React, { useState } from 'react';
import { Globe, Plus, Search, Filter, AlertTriangle, FileText, CheckCircle2, Clock, ArrowRight, Eye } from 'lucide-react';
import { PageHeader } from '../../../components/shared/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterBar } from '../../../components/shared/FilterBar';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { MOCK_IMMIGRATION_CASES } from '../../../data/mockImmigrationCases';
import { formatDate } from '../../../utils/formatDate';
import { Link } from 'react-router-dom';
import { ImmigrationCaseDrawer } from '../components/ImmigrationCaseDrawer';
import { useToast } from '../../../components/ui/Toast';

export function ImmigrationCasesList() {
  const [cases, setCases] = useState(MOCK_IMMIGRATION_CASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const { addToast } = useToast();

  // New Case form state
  const [newTitle, setNewTitle] = useState('');
  const [newBeneficiary, setNewBeneficiary] = useState('');
  const [newPetitioner, setNewPetitioner] = useState('');
  const [newAlienNumber, setNewAlienNumber] = useState('');
  const [newCategory, setNewCategory] = useState('Family-Based Adjustment of Status');
  const [newReceiptNumber, setNewReceiptNumber] = useState('');

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newTitle || !newBeneficiary) {
      addToast('Please enter petition title and beneficiary name.', 'error');
      return;
    }

    const created = {
      id: `IMM-2026-00${cases.length + 1}`,
      matterNumber: `IMM-2026-00${cases.length + 1}`,
      title: newTitle,
      category: newCategory,
      petitionType: newCategory,
      petitionerName: newPetitioner || 'Self-Petitioning',
      beneficiaryName: newBeneficiary,
      alienNumber: newAlienNumber || 'Pending A-Number',
      receiptNumber: newReceiptNumber || `IOE-26-900-${Math.floor(10000 + Math.random() * 90000)}`,
      priorityDate: new Date().toISOString().split('T')[0],
      currentStage: 'Filing Package Prepared',
      serviceCenter: 'Nebraska Service Center (LIN)',
      filingDate: new Date().toISOString().split('T')[0],
      status: 'In Progress',
      assignedAttorneyId: 'usr-3',
      assignedAttorneyName: 'Sarah Jenkins, Esq.',
      assignedParalegalId: 'usr-4',
      assignedParalegalName: 'Marcus Vance',
      notes: 'Newly initiated immigration matter docket.',
      travelHistory: [],
      evidenceChecklist: [
        { id: 'ev-init-1', category: 'Civil Document', title: 'Certified Birth Certificate', status: 'Pending Review', file: null, required: true },
        { id: 'ev-init-2', category: 'Legal Appearance', title: 'Executed Form G-28 Appearance of Counsel', status: 'Verified & Admitted', file: 'g28_executed.pdf', required: true }
      ],
      filingPackage: {
        status: 'Paralegal Drafting',
        packageId: `PKG-IMM-2026-0${cases.length + 1}`,
        clearedByAttorney: false,
        exhibitTabs: [
          { tab: 'Tab A', title: 'Form G-28 Notice of Entry of Appearance' },
          { tab: 'Tab B', title: 'Immigration Petitions & Exhibits' }
        ]
      }
    };

    setCases(prev => [created, ...prev]);
    addToast(`Immigration matter ${created.matterNumber} created successfully!`, 'success');
    setIsAddCaseOpen(false);
    setNewTitle('');
    setNewBeneficiary('');
    setNewPetitioner('');
    setNewAlienNumber('');
  };

  const handleUpdateCase = (updated) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedCase(updated);
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.alienNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || c.category === categoryFilter;
    const matchesStatus = statusFilter === '' || c.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const columns = [
    {
      key: 'matterNumber',
      label: 'Case # & Beneficiary',
      sortable: true,
      render: (val, row) => (
        <div>
          <button
            onClick={() => setSelectedCase(row)}
            className="font-bold text-xs text-[#06244B] hover:text-[#A4432B] text-left block"
          >
            {val}
          </button>
          <span className="font-semibold text-sm text-[#06244B] block">{row.beneficiaryName}</span>
          <span className="text-[11px] text-[#667085] block">{row.alienNumber}</span>
        </div>
      ),
    },
    {
      key: 'title',
      label: 'Petition Type & Category',
      sortable: true,
      render: (val, row) => (
        <div>
          <button
            onClick={() => setSelectedCase(row)}
            className="font-medium text-xs text-[#06244B] hover:text-[#A4432B] text-left block"
          >
            {val}
          </button>
          <span className="text-[11px] text-[#A4432B] font-semibold">{row.category}</span>
        </div>
      ),
    },
    {
      key: 'petitionerName',
      label: 'Petitioner / Sponsor',
      sortable: true,
      render: (val) => <span className="text-xs text-[#202A35]">{val}</span>,
    },
    {
      key: 'receiptNumber',
      label: 'USCIS Receipt #',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono text-xs font-semibold text-[#06244B] block">{val}</span>
          <span className="text-[10px] text-[#667085]">{row.serviceCenter}</span>
        </div>
      ),
    },
    {
      key: 'currentStage',
      label: 'Current Stage',
      render: (val, row) => (
        <div>
          <span className="text-xs font-medium text-[#06244B] bg-[#F5F0E5] px-2 py-0.5 rounded border border-[#D9D6CF] inline-block">
            {val}
          </span>
          {row.filingPackage?.clearedByAttorney && (
            <span className="block text-[10px] font-bold text-emerald-700 mt-0.5">
              Attorney Cleared ✓
            </span>
          )}
        </div>
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
      label: 'Action',
      align: 'right',
      render: (_, row) => (
        <Button
          size="sm"
          variant="outline"
          icon={Eye}
          onClick={() => setSelectedCase(row)}
        >
          View File
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Disclaimer banner */}
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>[DEMO SIMULATION] Specialty Practice Workspace:</strong> Immigration Management prototype modeled after Docketwise. All USCIS receipt tracking, A-numbers, and filing packages operate strictly client-side.
          </span>
        </div>
        <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
          PROTOTYPE
        </span>
      </div>

      <PageHeader
        title="Immigration Practice Workspace"
        subtitle="Family-based petitions, employment visas, removal defense, and USCIS receipt tracking (Docketwise Model)."
        breadcrumbs={[
          { label: 'Clients & Matters', to: '/matters' },
          { label: 'Immigration Workspace' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddCaseOpen(true)}
            >
              New Petition
            </Button>
            <Link to="/immigration/receipts">
              <Button variant="outline" size="sm" icon={Search}>
                Receipt Tracker
              </Button>
            </Link>
            <Link to="/immigration/forms">
              <Button variant="outline" size="sm" icon={FileText}>
                Form Library
              </Button>
            </Link>
            <Link to="/immigration/questionnaires">
              <Button variant="outline" size="sm" icon={Globe}>
                Bilingual Intake
              </Button>
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">Active Petitions</span>
          <span className="text-2xl font-bold text-[#06244B] mt-1 block">{cases.length}</span>
          <span className="text-[11px] text-emerald-700 font-medium">Family, Employment & Court Defense</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">Pending USCIS Receipts</span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">5</span>
          <span className="text-[11px] text-[#667085]">Nebraska, Texas & Vermont Centers</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">RFEs Due &lt;30 Days</span>
          <span className="text-2xl font-bold text-red-700 mt-1 block">1</span>
          <span className="text-[11px] text-red-600 font-semibold">Dr. Klaus Richter (EB-2 NIW)</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">Naturalization Interviews</span>
          <span className="text-2xl font-bold text-[#06244B] mt-1 block">1</span>
          <span className="text-[11px] text-emerald-700 font-medium">Nov 24 (Fatima Al-Mansoor)</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by beneficiary, A-Number, or receipt..."
        />
        <div className="md:col-span-2">
          <FilterBar
            filters={[
              {
                id: 'category',
                label: 'Category',
                value: categoryFilter,
                options: [
                  { value: 'Family-Based Adjustment of Status', label: 'Family-Based Adjustment' },
                  { value: 'Employment-Based Immigrant', label: 'Employment-Based' },
                  { value: 'Non-Immigrant Employment', label: 'Non-Immigrant (H-1B)' },
                  { value: 'Humanitarian / Asylum', label: 'Asylum' },
                  { value: 'Naturalization', label: 'Naturalization (N-400)' },
                  { value: 'Immigration Court Defense', label: 'EOIR Court Defense' },
                ],
                onChange: setCategoryFilter,
              },
              {
                id: 'status',
                label: 'Status',
                value: statusFilter,
                options: [
                  { value: 'In Progress', label: 'In Progress' },
                  { value: 'RFE Issued', label: 'RFE Issued' },
                  { value: 'Approved', label: 'Approved' },
                ],
                onChange: setStatusFilter,
              },
            ]}
            onReset={() => {
              setSearchQuery('');
              setCategoryFilter('');
              setStatusFilter('');
            }}
          />
        </div>
      </div>

      {/* Cases Table */}
      <DataTable
        columns={columns}
        data={filteredCases}
        keyField="id"
        emptyMessage="No immigration cases found matching your criteria."
      />

      {/* Case Management Drawer */}
      {selectedCase && (
        <ImmigrationCaseDrawer
          isOpen={Boolean(selectedCase)}
          onClose={() => setSelectedCase(null)}
          immigrationCase={selectedCase}
          onUpdateCase={handleUpdateCase}
        />
      )}

      {/* New Immigration Petition Modal */}
      <Modal
        isOpen={isAddCaseOpen}
        onClose={() => setIsAddCaseOpen(false)}
        title="Initiate New Immigration Petition Docket"
        subtitle="Open new family, employment, or defense case file"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
          <div>
            <Input
              label="Petition Title / Proceeding Description"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Maria Santos: Form I-130 / I-485 Immediate Relative Adjustment"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Beneficiary Full Legal Name"
                value={newBeneficiary}
                onChange={(e) => setNewBeneficiary(e.target.value)}
                placeholder="Foreign National Applicant"
                required
              />
            </div>
            <div>
              <Input
                label="Petitioner / Qualifying Sponsor"
                value={newPetitioner}
                onChange={(e) => setNewPetitioner(e.target.value)}
                placeholder="U.S. Citizen / Employer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202A35] uppercase mb-1">
                Immigration Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded border border-[#D9D6CF] bg-white font-medium"
              >
                <option value="Family-Based Adjustment of Status">Family-Based Adjustment (I-130/I-485)</option>
                <option value="Employment-Based Immigrant">Employment-Based (EB-1, EB-2 NIW, EB-3)</option>
                <option value="Non-Immigrant Employment">Non-Immigrant Work Visa (H-1B, L-1, O-1)</option>
                <option value="Humanitarian / Asylum">Affirmative Asylum (I-589)</option>
                <option value="Naturalization">Naturalization (N-400)</option>
                <option value="Immigration Court Defense">EOIR Removal Defense (EOIR-42B)</option>
              </select>
            </div>
            <div>
              <Input
                label="Alien Registration Number (A-Number)"
                value={newAlienNumber}
                onChange={(e) => setNewAlienNumber(e.target.value)}
                placeholder="A-###-###-### (if assigned)"
              />
            </div>
          </div>

          <div>
            <Input
              label="USCIS Receipt Number (if issued)"
              value={newReceiptNumber}
              onChange={(e) => setNewReceiptNumber(e.target.value)}
              placeholder="e.g. LIN-26-900-##### (Optional)"
            />
          </div>

          <div className="pt-3 border-t border-[#D9D6CF] flex justify-end gap-2">
            <Button size="sm" variant="outline" type="button" onClick={() => setIsAddCaseOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Create Petition Docket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

