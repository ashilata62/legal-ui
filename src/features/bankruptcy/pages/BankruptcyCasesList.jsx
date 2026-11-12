import React, { useState } from 'react';
import { Landmark, Plus, Search, Filter, AlertTriangle, FileSpreadsheet, Calculator, FileText, Eye } from 'lucide-react';
import { PageHeader } from '../../../components/shared/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterBar } from '../../../components/shared/FilterBar';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { MOCK_BANKRUPTCY_CASES } from '../../../data/mockBankruptcyCases';
import { Link } from 'react-router-dom';
import { BankruptcyCaseDrawer } from '../components/BankruptcyCaseDrawer';
import { useToast } from '../../../components/ui/Toast';

export function BankruptcyCasesList() {
  const [cases, setCases] = useState(MOCK_BANKRUPTCY_CASES);
  const [searchQuery, setSearchQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const { addToast } = useToast();

  // New Debtor Form State
  const [debtorName, setDebtorName] = useState('');
  const [jointDebtorName, setJointDebtorName] = useState('');
  const [chapter, setChapter] = useState('Chapter 7');
  const [householdSize, setHouseholdSize] = useState(2);
  const [annualGrossIncome, setAnnualGrossIncome] = useState(65000);

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!debtorName.trim()) {
      addToast('Please enter primary debtor name.', 'error');
      return;
    }

    const newCase = {
      id: `BNK-2026-00${cases.length + 1}`,
      caseNumber: `26-25${Math.floor(100 + Math.random() * 900)}-JTM`,
      debtorName,
      jointDebtorName: jointDebtorName ? jointDebtorName : 'None (Individual)',
      chapter,
      filingType: chapter === 'Chapter 13' ? 'Wage Earner Adjustment' : 'Individual Liquidation',
      filingDate: new Date().toISOString().split('T')[0],
      courtVenue: 'United States Bankruptcy Court, District of Utah (Salt Lake City)',
      assignedJudge: 'Hon. Joel T. Marker',
      trusteeName: chapter === 'Chapter 13' ? 'Lon A. Jenkins, Standing Chapter 13 Trustee' : 'D. Ray Strong, Standing Ch. 7 Trustee',
      meeting341Date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      meeting341Status: 'Scheduled',
      claimsBarDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      householdSize: Number(householdSize),
      annualGrossIncome: Number(annualGrossIncome),
      meansTestStatus: Number(annualGrossIncome) <= 91220 ? 'Below Utah Median (Passed Form 122A-1)' : 'Above Median',
      totalAssets: 35000,
      totalSecuredDebt: 12000,
      totalPriorityDebt: 0,
      totalUnsecuredDebt: 45000,
      status: 'In Progress',
      emergencyFiling: false,
      creditCounselingFiled: true,
      financialManagementFiled: false,
      assignedAttorneyId: 'usr-2',
      assignedAttorneyName: 'Thomas Bludworth, Esq.',
      assignedParalegalId: 'usr-4',
      assignedParalegalName: 'Marcus Vance',
      notes: 'Newly filed bankruptcy proceeding.',
    };

    setCases(prev => [newCase, ...prev]);
    addToast(`Bankruptcy case ${newCase.caseNumber} for ${debtorName} created!`, 'success');
    setIsAddCaseOpen(false);
    setDebtorName('');
    setJointDebtorName('');
  };

  const handleUpdateCase = (updated) => {
    setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedCase(updated);
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      searchQuery === '' ||
      c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.debtorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trusteeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesChapter = chapterFilter === '' || c.chapter === chapterFilter;
    return matchesSearch && matchesChapter;
  });

  const columns = [
    {
      key: 'caseNumber',
      label: 'Case # & Debtor',
      sortable: true,
      render: (val, row) => (
        <div>
          <button
            onClick={() => setSelectedCase(row)}
            className="font-mono font-bold text-xs text-[#06244B] hover:text-[#A4432B] text-left block"
          >
            {val}
          </button>
          <span className="font-semibold text-sm text-[#06244B] block">{row.debtorName}</span>
          {row.jointDebtorName !== 'None (Individual)' && (
            <span className="text-[11px] text-[#667085] block">&amp; {row.jointDebtorName}</span>
          )}
        </div>
      ),
    },
    {
      key: 'chapter',
      label: 'Chapter & Type',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-bold text-xs text-[#A4432B]">{val}</span>
          <span className="text-[11px] text-[#667085] block">{row.filingType}</span>
          {row.emergencyFiling && (
            <span className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.2 rounded text-[10px] font-bold inline-block mt-0.5">
              Emergency 14-Day Clock
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'meeting341Date',
      label: '341 Meeting & Status',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-semibold text-xs text-[#06244B]">{val}</span>
          <span className="text-[10px] text-[#667085] block leading-tight">{row.meeting341Status}</span>
        </div>
      ),
    },
    {
      key: 'trusteeName',
      label: 'Standing Trustee',
      render: (val) => <span className="text-xs text-[#202A35]">{val}</span>,
    },
    {
      key: 'meansTestStatus',
      label: 'Means-Test / Plan',
      render: (val, row) => (
        <div>
          <span className="text-[11px] font-medium text-[#06244B] block">{val}</span>
          {row.monthlyPlanPayment && (
            <span className="text-[10px] font-bold text-emerald-700">
              ${row.monthlyPlanPayment}/mo ({row.planTermMonths} mos)
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
          View Case
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Landmark className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>[DEMO SIMULATION] Bankruptcy Practice Workspace:</strong> Model for Chapter 7, 13, and 11 representation. Adheres to District of Utah Local Rules &amp; U.S. Trustee Form 122 guidelines.
          </span>
        </div>
        <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
          PROTOTYPE
        </span>
      </div>

      <PageHeader
        title="Bankruptcy Practice Workspace"
        subtitle="Debtor petitions, Schedules A/B through J ledgers, Means-Test Form 122, and Chapter 13 plan modeling."
        breadcrumbs={[
          { label: 'Clients & Matters', to: '/matters' },
          { label: 'Bankruptcy Workspace' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsAddCaseOpen(true)}
            >
              New Debtor Filing
            </Button>
            <Link to="/bankruptcy/means-test">
              <Button variant="outline" size="sm" icon={Calculator}>
                Means-Test
              </Button>
            </Link>
            <Link to="/bankruptcy/exemptions">
              <Button variant="outline" size="sm" icon={Landmark}>
                Utah Exemptions
              </Button>
            </Link>
            <Link to="/bankruptcy/plan">
              <Button variant="outline" size="sm" icon={Calculator}>
                Chapter 13 Plan
              </Button>
            </Link>
            <Link to="/bankruptcy/creditor-matrix">
              <Button variant="outline" size="sm" icon={FileText}>
                Creditor Matrix
              </Button>
            </Link>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">Active Dockets</span>
          <span className="text-2xl font-bold text-[#06244B] mt-1 block">{cases.length}</span>
          <span className="text-[11px] text-emerald-700 font-medium">District of Utah (Salt Lake City)</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">Chapter 7 Liquidations</span>
          <span className="text-2xl font-bold text-[#06244B] mt-1 block">3</span>
          <span className="text-[11px] text-[#667085]">Passed Form 122A-1 Median Test</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">Chapter 13 Active Plans</span>
          <span className="text-2xl font-bold text-emerald-700 mt-1 block">2</span>
          <span className="text-[11px] text-[#667085]">36 &amp; 60 Month Standing Trustee Plans</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#D9D6CF] shadow-sm">
          <span className="text-xs text-[#667085] uppercase font-bold block">Section 341 Hearings</span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">2</span>
          <span className="text-[11px] text-amber-800 font-semibold">Scheduled via Zoom Video</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by case #, debtor, or trustee..."
        />
        <div className="md:col-span-2">
          <FilterBar
            filters={[
              {
                id: 'chapter',
                label: 'Chapter',
                value: chapterFilter,
                options: [
                  { value: 'Chapter 7', label: 'Chapter 7' },
                  { value: 'Chapter 13', label: 'Chapter 13' },
                  { value: 'Chapter 11', label: 'Chapter 11' },
                ],
                onChange: setChapterFilter,
              },
            ]}
            onReset={() => {
              setSearchQuery('');
              setChapterFilter('');
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCases}
        keyField="id"
        emptyMessage="No bankruptcy cases found."
      />

      {/* Case Detail & Docket Drawer */}
      <BankruptcyCaseDrawer
        isOpen={Boolean(selectedCase)}
        onClose={() => setSelectedCase(null)}
        bankruptcyCase={selectedCase}
        onUpdateCase={handleUpdateCase}
      />

      {/* New Debtor Filing Modal */}
      <Modal
        isOpen={isAddCaseOpen}
        onClose={() => setIsAddCaseOpen(false)}
        title="Initiate New Debtor Bankruptcy Docket"
        subtitle="U.S. Bankruptcy Court, District of Utah (Salt Lake City)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
          <div>
            <Input
              label="Primary Debtor Full Legal Name"
              value={debtorName}
              onChange={(e) => setDebtorName(e.target.value)}
              placeholder="e.g. Rachel Lynn Walker"
              required
            />
          </div>

          <div>
            <Input
              label="Joint Debtor / Spouse (Optional)"
              value={jointDebtorName}
              onChange={(e) => setJointDebtorName(e.target.value)}
              placeholder="Leave blank if individual filing"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202A35] uppercase mb-1">
                Filing Chapter
              </label>
              <select
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full text-xs p-2 rounded border border-[#D9D6CF] bg-white font-medium"
              >
                <option value="Chapter 7">Chapter 7 (Liquidation)</option>
                <option value="Chapter 13">Chapter 13 (Wage Earner)</option>
                <option value="Chapter 11">Chapter 11 (Subchapter V)</option>
              </select>
            </div>
            <div>
              <Input
                label="Household Size"
                type="number"
                min="1"
                max="10"
                value={householdSize}
                onChange={(e) => setHouseholdSize(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <Input
              label="Estimated Annual Gross Income ($)"
              type="number"
              value={annualGrossIncome}
              onChange={(e) => setAnnualGrossIncome(Number(e.target.value))}
              placeholder="e.g. 65000"
              required
            />
            <span className="text-[10px] text-[#667085] mt-1 block">
              Used for initial Form 122 median income screening test.
            </span>
          </div>

          <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <span className="font-bold block">[DEMO SIMULATION] Automatic Stay Notice:</span>
            <span>
              Filing automatically invokes 11 U.S.C. § 362 stay halting state court collections, garnishments, and foreclosure sales.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#D9D6CF]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddCaseOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Plus}
            >
              Initiate Docket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

