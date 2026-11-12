import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, AlertTriangle, CheckCircle2, HardDrive, Smartphone, Sparkles, Database, FileText } from 'lucide-react';
import { PageHeader } from '../../../components/shared/PageHeader';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../components/ui/Toast';
import { usePermissions } from '../../../hooks/usePermissions';
import { MfaSetupModal } from '../components/MfaSetupModal';
import { BackupRestoreModal } from '../components/BackupRestoreModal';

export function SecuritySettings() {
  const { addToast } = useToast();
  const permissions = usePermissions();

  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipRestricted, setIpRestricted] = useState(false);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!permissions.canEditSettings) {
      addToast('Super Admin authorization required to modify firm security policy.', 'error');
      return;
    }
    addToast('Firm security policy updated.', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Security &amp; Data Governance"
        subtitle="Confidentiality controls, session timeout policies, and Utah Rule of Professional Conduct 1.6 compliance."
        breadcrumbs={[{ label: 'Reports & Settings', to: '/settings/users' }, { label: 'Security' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={Smartphone}
              onClick={() => setIsMfaModalOpen(true)}
            >
              Configure MFA (SBO-02)
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={HardDrive}
              onClick={() => setIsBackupModalOpen(true)}
            >
              Backups &amp; Disaster Recovery
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSave} className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle space-y-6">
        <div className="border-b border-[#D9D6CF]/60 pb-4">
          <h3 className="font-serif font-bold text-base text-[#06244B]">
            Authentication &amp; Session Policies (SBO-01, SBO-02, SBO-03)
          </h3>
          <p className="text-xs text-[#667085] mt-0.5">Enforce firm-wide standards for law firm workstations and mobile portal devices.</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded bg-[#F5F0E5]/60 border border-[#D9D6CF]">
            <div>
              <span className="font-bold text-[#06244B] block text-sm">Two-Factor Authentication (2FA / MFA - TOTP)</span>
              <span className="text-[#667085]">Require TOTP authenticator app or hardware FIDO2 key for all attorney and staff accounts.</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setIsMfaModalOpen(true)}
                className="text-[11px] py-1"
              >
                Enroll TOTP Key
              </Button>
              <input
                type="checkbox"
                checked={mfaEnforced}
                onChange={(e) => setMfaEnforced(e.target.checked)}
                className="w-4 h-4 rounded text-[#A4432B] focus:ring-[#A4432B] cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#F5F0E5]/60 border border-[#D9D6CF]">
            <div>
              <span className="font-bold text-[#06244B] block text-sm">Inactivity Session Timeout</span>
              <span className="text-[#667085]">Automatically lock unattended workstations to prevent unauthorized client record disclosure.</span>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="p-1.5 rounded border border-[#D9D6CF] bg-white text-xs font-semibold text-[#06244B]"
            >
              <option value="15">15 Minutes</option>
              <option value="30">30 Minutes (Recommended)</option>
              <option value="60">60 Minutes</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded bg-[#F5F0E5]/60 border border-[#D9D6CF]">
            <div>
              <span className="font-bold text-[#06244B] block text-sm">IP Range Restrictions</span>
              <span className="text-[#667085]">Restrict CosmoLex accounting bridge export authorizations to firm office VPN ranges.</span>
            </div>
            <input
              type="checkbox"
              checked={ipRestricted}
              onChange={(e) => setIpRestricted(e.target.checked)}
              className="w-4 h-4 rounded text-[#A4432B] focus:ring-[#A4432B] cursor-pointer"
            />
          </div>
        </div>

        {/* AI & Cloud Provider Compliance Disclosure Card (SBO-12) */}
        <div className="p-4 bg-slate-50 rounded border border-[#D9D6CF] space-y-2">
          <div className="flex items-center gap-2 text-[#06244B] font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#A4432B]" />
            <span>External AI &amp; Cloud Provider Compliance Disclosure (SBO-12)</span>
          </div>
          <p className="text-xs text-[#202A35] leading-relaxed">
            In compliance with <strong>Utah Rule of Professional Conduct 1.6 (Confidentiality)</strong> and <strong>ABA Formal Opinion 512 (Generative AI Tools)</strong>:
          </p>
          <ul className="text-xs text-[#667085] space-y-1 list-disc list-inside">
            <li><strong>Zero Public Model Training:</strong> Client communications, bio-data, and case files are strictly excluded from public AI training corpuses.</li>
            <li><strong>Data Retention Zero-Day:</strong> External LLM inference pipelines enforce zero persistent logging on third-party servers.</li>
            <li><strong>100% Firm Intellectual Property:</strong> All pleadings, work product, notes, and templates remain the sole exclusive property of Heugly &amp; Bludworth.</li>
          </ul>
        </div>

        {/* Compliance Certification */}
        <div className="p-4 bg-emerald-950 text-emerald-100 rounded border border-emerald-800 text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white">Utah RPC 1.6 &amp; ABA Formal Opinion 477R Compliance</p>
            <p className="text-emerald-200 mt-0.5 leading-relaxed">
              Software parameters adhere to standard legal industry cybersecurity guidance for transmitting and storing client confidential and proprietary commercial matter data.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#D9D6CF]">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!permissions.canEditSettings}
          >
            Save Security Controls
          </Button>
        </div>
      </form>

      {/* MFA Modal */}
      <MfaSetupModal
        isOpen={isMfaModalOpen}
        onClose={() => setIsMfaModalOpen(false)}
      />

      {/* Backup & Disaster Recovery Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </div>
  );
}

