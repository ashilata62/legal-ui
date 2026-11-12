import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Edit,
  Eye,
  Activity,
  Briefcase,
  DollarSign,
  FileText,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { PINavigationHeader } from '../components/PINavigationHeader';
import { DamagesModal } from '../components/DamagesModal';
import { Button } from '../../../components/ui/Button';
import { DataTable } from '../../../components/ui/DataTable';
import { MOCK_PI_CASES, MOCK_DAMAGES_RECORDS } from '../../../data/mockPersonalInjury';
import { mockStorage } from '../../../services/mockStorage';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useToast } from '../../../components/ui/Toast';

export function ClientDamages() {
  const { addToast } = useToast();
  const [cases] = useState(() => mockStorage.get('pi_cases', MOCK_PI_CASES));
  const [damagesList, setDamagesList] = useState(() => mockStorage.get('pi_damages', MOCK_DAMAGES_RECORDS));
  const [activeCaseId, setActiveCaseId] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDamage, setSelectedDamage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRecord, setExpandedRecord] = useState(null);

  const filteredDamages = damagesList.filter((d) => {
    if (!d) return false;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      d.matterTitle?.toLowerCase().includes(q) ||
      d.injuries?.some(i => i?.bodyArea?.toLowerCase().includes(q) || i?.description?.toLowerCase().includes(q)) ||
      d.employment?.employer?.toLowerCase().includes(q);
    const matchesCase = activeCaseId === 'ALL' || d.matterId === activeCaseId;
    return matchesSearch && matchesCase;
  });

  const handleSaveDamage = (savedRecord) => {
    setDamagesList((prev) => {
      const exists = prev.some((d) => d.id === savedRecord.id);
      let updated;
      if (exists) {
        updated = prev.map((d) => (d.id === savedRecord.id ? savedRecord : d));
        addToast('Damages & injury record updated.', 'success');
      } else {
        updated = [savedRecord, ...prev];
        addToast('New injury & economic damages profile created.', 'success');
      }
      mockStorage.set('pi_damages', updated);
      return updated;
    });
  };

  const openAddModal = () => {
    setSelectedDamage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (dmg) => {
    setSelectedDamage(dmg);
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: 'matterTitle',
      label: 'PI Matter & Client',
      sortable: true,
      render: (val, d) => (
        <div>
          <span className="font-bold text-[#06244B] block">{d?.matterTitle || val || 'Untitled Matter'}</span>
          <span className="text-[11px] text-[#667085]">
            {d?.employment?.jobTitle || 'Employment TBD'} at {d?.employment?.employer || 'Employer N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'injuries',
      label: 'Primary Anatomical Injuries',
      render: (val, d) => {
        const injuries = Array.isArray(d?.injuries) ? d.injuries : Array.isArray(val) ? val : [];
        return (
          <div className="space-y-1">
            {injuries.slice(0, 2).map((inj, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-[#06244B] bg-[#F5F0E5] px-1.5 py-0.5 rounded text-[11px]">
                  {inj.bodyArea || 'General'}
                </span>
                <span className="text-slate-600 truncate max-w-xs">{inj.description || 'Not Available'}</span>
              </div>
            ))}
            {injuries.length > 2 && (
              <span className="text-[10px] text-slate-500 font-medium">
                +{injuries.length - 2} additional diagnosed injuries
              </span>
            )}
            {injuries.length === 0 && (
              <span className="text-xs text-[#667085] italic">No injuries recorded</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'functionalLimitations',
      label: 'Documented Physical Impairments',
      render: (val, d) => (
        <span className="text-xs text-slate-700 truncate block max-w-xs leading-relaxed">
          {d?.functionalLimitations || val || 'None Documented'}
        </span>
      ),
    },
    {
      key: 'lostWages',
      label: 'Calculated Wage Loss',
      align: 'right',
      sortable: true,
      render: (_, d) => (
        <div>
          <span className="font-bold text-[#A4432B] block">
            {formatCurrency(d?.employment?.totalLostWages || 0)}
          </span>
          <span className="text-[11px] text-slate-500">{d?.employment?.daysMissed ?? 0} work days missed</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (_, d) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="text-xs py-1"
            onClick={() => setExpandedRecord(expandedRecord?.id === d?.id ? null : d)}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            {expandedRecord?.id === d?.id ? 'Collapse' : 'Details'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs py-1 text-[#06244B]"
            onClick={() => openEditModal(d)}
          >
            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PINavigationHeader
        activeCaseId={activeCaseId}
        onCaseChange={setActiveCaseId}
        cases={cases}
        title="Client &amp; Damages Management"
        subtitle="Anatomical injury profiles, objective diagnostic MRI/CT findings, functional disability ratings, and verified economic wage loss calculations."
        actions={
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={openAddModal}
          >
            Add Damages Profile
          </Button>
        }
      />

      {/* Main Table Card */}
      <div className="bg-white p-5 rounded border border-[#D9D6CF] shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#D9D6CF]">
          <div>
            <h2 className="text-base font-serif font-bold text-[#06244B]">
              Injury &amp; Economic Damages Profiles ({filteredDamages.length})
            </h2>
            <p className="text-xs text-[#667085]">
              Documented bodily injuries and verified economic loss components for each matter.
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#667085]" />
            <input
              type="text"
              placeholder="Search injury, body area, employer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1.5 rounded border border-[#D9D6CF] focus:outline-none focus:ring-1 focus:ring-[#A4432B] w-56 sm:w-72"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredDamages}
          pageSize={10}
          emptyMessage="No damages records found."
        />
      </div>

      {/* Expanded Damages Deep Dive Card */}
      {expandedRecord && (
        <div className="bg-white p-6 rounded-lg border-2 border-[#06244B] shadow-elevated space-y-5">
          <div className="flex items-start justify-between border-b border-[#D9D6CF] pb-4">
            <div>
              <span className="text-xs font-bold text-[#A4432B] uppercase tracking-wider">
                Comprehensive Damages Dossier
              </span>
              <h3 className="text-xl font-serif font-bold text-[#06244B]">
                {expandedRecord.matterTitle}
              </h3>
              <p className="text-xs text-[#667085] mt-0.5">
                Employer: {expandedRecord.employment?.employer} • Verified Wage Loss: {formatCurrency(expandedRecord.employment?.totalLostWages || 0)}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setExpandedRecord(null)}>
              Close Dossier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Column 1: Itemized Body Injuries */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#06244B] uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#A4432B]" /> Anatomical Injury Breakdown
              </h4>
              <div className="space-y-2">
                {(expandedRecord.injuries || []).map((inj, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#06244B]">{inj.bodyArea}</span>
                      <span className="text-[10px] font-bold text-red-800 bg-red-100 px-1.5 py-0.5 rounded">
                        {inj.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{inj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Eggshell & Functional Limitations */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#06244B] uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#A4432B]" /> Impairments &amp; Prior Health
              </h4>
              <div className="bg-[#F5F0E5]/60 p-3.5 rounded border border-[#D9D6CF] space-y-2">
                <span className="font-semibold text-xs text-[#06244B] block">
                  Prior Medical History (Utah Eggshell Rule)
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {expandedRecord.preExistingConditions || 'None reported.'}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-2">
                <span className="font-semibold text-xs text-[#06244B] block">
                  Documented Functional Limitations
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {expandedRecord.functionalLimitations}
                </p>
              </div>
            </div>

            {/* Column 3: Diagnostic Evidence & Wage Audit */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#06244B] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#A4432B]" /> Diagnostic Imaging &amp; Wage Audit
              </h4>
              <div className="space-y-2">
                {(expandedRecord.supportingMedicalEvidence || []).map((ev, idx) => (
                  <div key={idx} className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
                    <div className="flex justify-between font-bold text-emerald-950 text-[11px]">
                      <span>{ev.document}</span>
                      <span className="text-emerald-700 font-normal">{ev.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">{ev.facility}</p>
                    <p className="text-[11px] font-semibold text-emerald-900 mt-1">"{ev.finding}"</p>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700 space-y-1">
                <span className="font-bold text-[#06244B] block">Wage Verification Status:</span>
                <p className="text-slate-600">{expandedRecord.employment?.wageVerificationStatus}</p>
                <p className="font-semibold text-slate-900">
                  {expandedRecord.employment?.daysMissed} Days @ ${expandedRecord.employment?.hourlyRate}/hr = {formatCurrency(expandedRecord.employment?.totalLostWages || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <DamagesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDamage}
        damagesRecord={selectedDamage}
        cases={cases}
      />
    </div>
  );
}

