import React, { useState } from 'react';
import { FileText, ShieldCheck, CheckCircle2, AlertTriangle, Printer, Lock, Download, DollarSign, Award } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';

export function FilingPackageAssemblerModal({ isOpen, onClose, immigrationCase, onPackageCleared }) {
  const { addToast } = useToast();
  const [activeStep, setActiveStep] = useState(1);
  const [isAttorneyCleared, setIsAttorneyCleared] = useState(immigrationCase?.filingPackage?.clearedByAttorney || false);
  const [clearingAttorney, setClearingAttorney] = useState(immigrationCase?.assignedAttorneyName || 'Sarah Jenkins, Esq.');
  const [ethicsConfirmation, setEthicsConfirmation] = useState(false);
  const [showPrintCover, setShowPrintCover] = useState(false);

  if (!immigrationCase) return null;

  const pkg = immigrationCase.filingPackage || {
    packageId: 'PKG-IMM-2026-DEFAULT',
    status: 'In Assembly',
    g28Executed: true,
    checkVoucherAmount: 1975,
    exhibitTabs: [
      { tab: 'Tab A', title: 'Form G-28 Notice of Entry of Appearance as Counsel' },
      { tab: 'Tab B', title: 'Primary Petitions (Form I-130 & Form I-485)' },
      { tab: 'Tab C', title: 'Form I-765 Employment Authorization Application' },
      { tab: 'Tab D', title: 'Form I-864 Affidavit of Support with Tax Transcripts' },
      { tab: 'Tab E', title: 'Certified Civil Documents (Marriage & Birth Certificates)' },
      { tab: 'Tab F', title: 'Passport Photographs & Translation Affidavits' }
    ]
  };

  const handleClearPackage = () => {
    if (!ethicsConfirmation) {
      addToast('Please confirm attorney review of statutory eligibility and attachments.', 'error');
      return;
    }
    setIsAttorneyCleared(true);
    if (onPackageCleared) {
      onPackageCleared(immigrationCase.id, clearingAttorney);
    }
    addToast(
      `Package ${pkg.packageId} officially cleared and certified by ${clearingAttorney}! Package locked for filing.`,
      'success'
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`USCIS Filing Package Assembly: ${immigrationCase.matterNumber}`}
      subtitle={`Beneficiary: ${immigrationCase.beneficiaryName} | Category: ${immigrationCase.category}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-xs text-[#202A35]">
        {/* Simulation Banner */}
        <div className="bg-amber-50 border border-amber-200 p-2.5 rounded flex items-center justify-between text-amber-900">
          <span>
            <strong>[DEMO SIMULATION]:</strong> Filing package assembly and attorney clearance gateway. Prepares indexed exhibits, Form G-28, check vouchers, and formal submission cover page.
          </span>
          <span className="font-bold bg-amber-200 px-2 py-0.5 rounded text-[10px]">PROTOTYPE</span>
        </div>

        {/* Stepper Header */}
        <div className="grid grid-cols-4 gap-2 border-b border-[#D9D6CF] pb-3">
          {[
            { num: 1, label: 'Form Petitions' },
            { num: 2, label: 'Indexed Exhibits' },
            { num: 3, label: 'Fee Vouchers' },
            { num: 4, label: 'Attorney Clearance' },
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-2 rounded text-left transition-all ${
                activeStep === s.num
                  ? 'bg-[#06244B] text-white font-bold'
                  : 'bg-slate-50 text-[#667085] hover:bg-slate-100 font-medium'
              }`}
            >
              <span className="block text-[10px] uppercase opacity-80">Step {s.num}</span>
              <span className="text-xs">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Step 1: Petitions */}
        {activeStep === 1 && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#06244B]">1. Petitions &amp; G-28 Appearance Verification</h4>
            <div className="p-3 bg-slate-50 rounded border border-[#D9D6CF] space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <div>
                  <span className="font-bold text-[#06244B] block">Form G-28: Notice of Appearance as Counsel</span>
                  <span className="text-[11px] text-[#667085]">Lead Counsel: {immigrationCase.assignedAttorneyName} (Utah State Bar)</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Executed &amp; Signed ✓
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <div>
                  <span className="font-bold text-[#06244B] block">Primary Petition: {immigrationCase.petitionType}</span>
                  <span className="text-[11px] text-[#667085]">Petitioner: {immigrationCase.petitionerName}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  Forms Generated ✓
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Exhibit Tabs */}
        {activeStep === 2 && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#06244B]">2. Indexed Exhibit Tabs &amp; Evidence Binder</h4>
            <div className="border border-[#D9D6CF] rounded overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F5F0E5] text-[#06244B] font-bold">
                  <tr>
                    <th className="p-2">Exhibit Tab</th>
                    <th className="p-2">Document Description</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9D6CF]">
                  {pkg.exhibitTabs.map((tab, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-[#A4432B] font-mono">{tab.tab}</td>
                      <td className="p-2 font-medium text-[#202A35]">{tab.title}</td>
                      <td className="p-2">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                          Tabbed &amp; Indexed ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Step 3: Fee Vouchers */}
        {activeStep === 3 && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#06244B]">3. Statutory USCIS Filing Fee Vouchers</h4>
            <div className="p-4 bg-slate-50 rounded border border-[#D9D6CF] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span>Form I-130 Petition Fee:</span>
                <span className="font-mono font-bold">$535.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Form I-485 Adjustment of Status Fee:</span>
                <span className="font-mono font-bold">$1,440.00</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Form I-765 &amp; I-131 Standalone / Concurrent Fees:</span>
                <span className="font-mono font-semibold text-[#667085]">$0.00 (Concurrent filing category)</span>
              </div>
              <div className="pt-2 border-t border-[#D9D6CF] flex justify-between items-center font-bold text-sm text-[#06244B]">
                <span>Total Statutory Check Voucher:</span>
                <span className="text-[#A4432B]">${pkg.checkVoucherAmount?.toLocaleString() || '1,975.00'}</span>
              </div>
              <div className="p-2.5 bg-[#F5F0E5] rounded border border-[#D9D6CF] text-[11px] text-[#667085]">
                Drawn on: <strong>Heugly &amp; Bludworth Client Trust / Cost Advanced Account</strong>, payable to <strong>"U.S. Department of Homeland Security"</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Attorney Clearance */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-[#06244B] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#A4432B]" />
              4. Supervising Attorney Package Clearance &amp; Sign-Off
            </h4>

            {isAttorneyCleared ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>OFFICIALLY CLEARED FOR FILING WITH USCIS</span>
                </div>
                <p className="text-emerald-950 text-xs">
                  This immigration package was reviewed, verified, and certified by <strong>{clearingAttorney}</strong>. Paralegal editing is locked and submission cover letter is generated.
                </p>
                <div className="pt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Printer}
                    onClick={() => setShowPrintCover(!showPrintCover)}
                  >
                    {showPrintCover ? 'Hide Submission Cover' : 'View / Print Submission Cover'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-[#D9D6CF] rounded-lg space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#202A35] uppercase mb-1">
                    Reviewing &amp; Certifying Attorney
                  </label>
                  <select
                    value={clearingAttorney}
                    onChange={(e) => setClearingAttorney(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-[#D9D6CF] bg-white font-medium"
                  >
                    <option value="Sarah Jenkins, Esq.">Sarah Jenkins, Esq. (Immigration Lead Partner)</option>
                    <option value="Thomas Bludworth, Esq.">Thomas Bludworth, Esq. (Managing Partner)</option>
                    <option value="Eleanor Heugly, Esq.">Eleanor Heugly, Esq. (Senior Partner)</option>
                  </select>
                </div>

                <div className="flex items-start gap-2 p-3 bg-white rounded border border-[#D9D6CF]">
                  <input
                    type="checkbox"
                    id="ethicsCheck"
                    checked={ethicsConfirmation}
                    onChange={(e) => setEthicsConfirmation(e.target.checked)}
                    className="w-4 h-4 text-[#A4432B] rounded mt-0.5 focus:ring-[#A4432B]"
                  />
                  <label htmlFor="ethicsCheck" className="text-xs text-[#202A35] leading-relaxed cursor-pointer">
                    <strong>Attorney Attestation:</strong> I have reviewed the Form G-28 appearance, statutory eligibility of the petitioner and beneficiary, completeness of indexed exhibit tabs, and accuracy of fee check vouchers. I authorize dispatch to the USCIS Service Center.
                  </label>
                </div>

                <Button
                  size="md"
                  variant="primary"
                  icon={ShieldCheck}
                  onClick={handleClearPackage}
                  className="w-full"
                >
                  Certify &amp; Clear Package for Filing
                </Button>
              </div>
            )}

            {/* Printable Cover Page View */}
            {showPrintCover && (
              <div className="p-5 bg-white border border-[#06244B] rounded-lg shadow space-y-3 font-serif text-xs text-[#06244B]">
                <div className="text-center border-b border-[#06244B] pb-2">
                  <div className="font-bold text-sm tracking-wide">HEUGLY &amp; BLUDWORTH, ATTORNEYS AT LAW</div>
                  <div className="text-[10px]">175 South Main Street, Suite 900, Salt Lake City, Utah 84111</div>
                </div>
                <div className="space-y-1">
                  <div><strong>VIA FEDEX PRIORITY OVERNIGHT</strong></div>
                  <div>USCIS Nebraska Service Center</div>
                  <div>Attn: I-485 / I-130 Immediate Relative Processing</div>
                </div>
                <div>
                  <strong>RE: </strong> FORM I-130 / I-485 CONCURRENT ADJUSTMENT OF STATUS PACKAGE<br />
                  <strong>Petitioner: </strong> {immigrationCase.petitionerName}<br />
                  <strong>Beneficiary: </strong> {immigrationCase.beneficiaryName} (A# {immigrationCase.alienNumber})
                </div>
                <p className="leading-relaxed">
                  Dear Adjudications Officer: Please find enclosed our Form G-28 Notice of Appearance and concurrent adjustment of status petition on behalf of the above-referenced beneficiary. All required statutory fees and indexed exhibit binders are attached.
                </p>
                <div className="pt-4 border-t border-slate-200">
                  <div>Respectfully submitted,</div>
                  <div className="font-bold mt-2">{clearingAttorney}</div>
                  <div className="text-[10px] text-[#667085]">Utah State Bar Certified Counsel for Petitioner &amp; Applicant</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pt-3 border-t border-[#D9D6CF] flex justify-between items-center">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <div className="flex gap-2">
            {activeStep > 1 && (
              <Button size="sm" variant="outline" onClick={() => setActiveStep(prev => prev - 1)}>
                Previous Step
              </Button>
            )}
            {activeStep < 4 && (
              <Button size="sm" variant="primary" onClick={() => setActiveStep(prev => prev + 1)}>
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

