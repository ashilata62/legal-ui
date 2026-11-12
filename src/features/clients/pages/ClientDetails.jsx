import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FolderOpen,
  FileText,
  Clock,
  Edit,
  Plus,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useClients } from '../../../context/ClientContext';
import { useMatters } from '../../../context/MatterContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { useToast } from '../../../components/ui/Toast';
import { PageHeader } from '../../../components/shared/PageHeader';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { ClientForm } from '../forms/ClientForm';
import { MatterForm } from '../../matters/forms/MatterForm';
import { ActivityTimeline } from '../../../components/shared/ActivityTimeline';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { RelatedPartiesTab } from '../../matters/components/RelatedPartiesTab';
import { EngagementLetterModal } from '../components/EngagementLetterModal';

export function ClientDetails() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { clients } = useClients();
  const { getMattersByClient } = useMatters();
  const permissions = usePermissions();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('matters');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewMatterModalOpen, setIsNewMatterModalOpen] = useState(false);
  const [isEngagementLetterOpen, setIsEngagementLetterOpen] = useState(false);

  const client = clients.find(c => c.id === clientId) || clients[0];
  const clientMatters = client ? getMattersByClient(client.id) : [];

  if (!client) {
    return (
      <div className="p-8 text-center bg-white rounded border border-[#D9D6CF]">
        <h2 className="text-xl font-serif text-[#06244B]">Client Record Not Found</h2>
        <Button className="mt-4" onClick={() => navigate('/clients')}>
          Back to Clients
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'matters', label: 'Related Matters', count: clientMatters.length, icon: FolderOpen },
    { id: 'related-parties', label: 'Related Entities & Adversaries', icon: User },
    { id: 'contact', label: 'Contact & Addresses', icon: User },
    { id: 'documents', label: 'Client Documents', count: 3, icon: FileText },
    { id: 'notes', label: 'Internal Notes', icon: MessageSquare },
    { id: 'activity', label: 'Activity History', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
        <Link to="/clients" className="hover:text-[#06244B] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Clients
        </Link>
      </div>

      {/* Client Overview Header Card */}
      <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-[#06244B] text-[#F5F0E5] flex items-center justify-center font-serif font-bold text-xl flex-shrink-0 shadow-sm">
              {client.type === 'Organization' ? <Building2 className="w-7 h-7 text-[#A4432B]" /> : client.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-serif font-bold text-[#06244B]">
                  {client.name}
                </h1>
                <StatusBadge status={client.status} />
                <span className="text-xs px-2 py-0.5 rounded bg-[#F5F0E5] text-[#06244B] font-semibold border border-[#D9D6CF]">
                  {client.id}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#667085] mt-2">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#A4432B]" /> Contact: <strong>{client.primaryContact || 'N/A'}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#06244B]" /> {client.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#06244B]" /> {client.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            {permissions.canCreateClient && (
              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Profile
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              icon={FileText}
              onClick={() => setIsEngagementLetterOpen(true)}
            >
              Engagement Letter
            </Button>

            {permissions.canCreateMatter && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsNewMatterModalOpen(true)}
              >
                New Matter for Client
              </Button>
            )}
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#D9D6CF]/60 text-xs">
          <div>
            <span className="text-[#667085] block font-medium">Assigned Counsel:</span>
            <span className="text-sm font-semibold text-[#06244B]">{client.assignedAttorneyName}</span>
          </div>
          <div>
            <span className="text-[#667085] block font-medium">Client Since:</span>
            <span className="text-sm font-semibold text-[#06244B]">{formatDate(client.createdAt, { short: true })}</span>
          </div>
          <div>
            <span className="text-[#667085] block font-medium">Active Matters:</span>
            <span className="text-sm font-semibold text-[#06244B]">{clientMatters.length} Files</span>
          </div>
          <div>
            <span className="text-[#667085] block font-medium">Ledger Balance:</span>
            <span className={`text-sm font-semibold ${client.outstandingBalance > 0 ? 'text-[#B42318]' : 'text-[#287A55]'}`}>
              {formatCurrency(client.outstandingBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      {activeTab === 'matters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-[#06244B]">
              Active Matters ({clientMatters.length})
            </h2>
            {permissions.canCreateMatter && (
              <Button
                size="sm"
                variant="outline"
                icon={Plus}
                onClick={() => setIsNewMatterModalOpen(true)}
              >
                Create Matter
              </Button>
            )}
          </div>

          {clientMatters.length === 0 ? (
            <div className="p-8 text-center bg-white rounded border border-[#D9D6CF]">
              <FolderOpen className="w-8 h-8 text-[#667085] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-[#06244B]">No matters open for this client.</p>
              <p className="text-xs text-[#667085] mt-1">Open an active matter to begin tracking tasks, documents, and billable time.</p>
              <Button className="mt-4" size="sm" onClick={() => setIsNewMatterModalOpen(true)}>
                Open First Matter
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientMatters.map((matter) => (
                <div
                  key={matter.id}
                  onClick={() => navigate(`/matters/${matter.id}`)}
                  className="bg-white p-5 rounded border border-[#D9D6CF] shadow-subtle hover:border-[#A4432B] hover:shadow-card transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#A4432B] uppercase tracking-wider">
                      {matter.matterNumber}
                    </span>
                    <StatusBadge status={matter.status} />
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#06244B] mt-1 group-hover:text-[#A4432B] transition-colors">
                    {matter.title}
                  </h3>

                  <p className="text-xs text-[#667085] mt-1 line-clamp-2">
                    {matter.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D9D6CF]/50 flex items-center justify-between text-xs text-[#667085]">
                    <span>Practice: <strong className="text-[#06244B]">{matter.practiceAreaName}</strong></span>
                    <span>Attorney: <strong className="text-[#06244B]">{matter.responsibleAttorneyName}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Related Parties & Adversaries Tab */}
      {activeTab === 'related-parties' && (
        <RelatedPartiesTab
          clientId={client.id}
          clientName={client.name}
        />
      )}

      {activeTab === 'contact' && (
        <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-serif text-base font-bold text-[#06244B] mb-3 border-b border-[#D9D6CF]/60 pb-2">
              Primary Office &amp; Notice Address
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A4432B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#06244B] block">Physical Location</span>
                  <span className="text-[#667085]">{client.address || '1420 South Foothill Blvd, Salt Lake City, UT 84108'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#06244B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#06244B] block">Billing &amp; Notice Email</span>
                  <span className="text-[#667085]">{client.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#06244B] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#06244B] block">Direct Telephone</span>
                  <span className="text-[#667085]">{client.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-base font-bold text-[#06244B] mb-3 border-b border-[#D9D6CF]/60 pb-2">
              Engagement Terms &amp; Counsel Relationship
            </h3>
            <div className="space-y-2 text-xs">
              <p><strong className="text-[#06244B]">Responsible Partner:</strong> {client.assignedAttorneyName}</p>
              <p><strong className="text-[#06244B]">Fee Agreement Status:</strong> Countersigned engagement agreement on file</p>
              <p><strong className="text-[#06244B]">Trust Retainer Deposit:</strong> Verified in CosmoLex accounting portal</p>
              <p><strong className="text-[#06244B]">Client Entity Type:</strong> {client.type}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white p-5 rounded border border-[#D9D6CF] shadow-subtle">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-base font-bold text-[#06244B]">Client Master Records</h3>
            <Button size="sm" variant="outline" onClick={() => navigate('/documents')}>
              Browse All Documents
            </Button>
          </div>
          <div className="divide-y divide-[#D9D6CF]/50 text-xs">
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-[#06244B]">Engagement Letter &amp; Hourly Fee Schedule.pdf</p>
                <p className="text-[#667085]">Uploaded on 2025-01-16 by Rachel Adams • 520 KB</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => addToast('Opening secure document preview: Engagement Letter.pdf', 'info')}>
                Preview
              </Button>
            </div>
            <div className="py-3 flex justify-between items-center">
              <div>
                <p className="font-bold text-[#06244B]">Corporate Certificate of Good Standing &amp; Articles.pdf</p>
                <p className="text-[#667085]">Uploaded on 2025-01-18 by Marcus Vance • 1.8 MB</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => addToast('Opening secure document preview: Corporate Certificate.pdf', 'info')}>
                Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle space-y-4">
          <h3 className="font-serif text-base font-bold text-[#06244B] border-b border-[#D9D6CF]/60 pb-2">
            Confidential Internal Client Notes
          </h3>
          <div className="p-4 bg-[#F5F0E5]/60 rounded border border-[#D9D6CF] text-xs leading-relaxed text-[#202A35]">
            {client.notes || 'No confidential internal notes entered for this client.'}
          </div>
          <p className="text-[11px] text-[#A4432B] font-semibold">
            Confidential Attorney Work Product • Strictly protected under Utah Rule of Professional Conduct 1.6. Never exposed to Client Portal.
          </p>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle">
          <h3 className="font-serif text-base font-bold text-[#06244B] mb-4">
            Chronological Matter &amp; Communication History
          </h3>
          <ActivityTimeline
            activities={[
              {
                title: 'Engagement Initialized',
                timestamp: client.createdAt,
                type: 'document',
                description: 'Client intake cleared conflict review and signed master fee agreement.',
                author: client.assignedAttorneyName,
              },
              {
                title: 'Initial Matter Opened',
                timestamp: '2025-01-20',
                type: 'task',
                description: 'First lawsuit matter opened in Utah Third District Court.',
                author: 'Thomas Bludworth, Esq.',
              },
            ]}
          />
        </div>
      )}

      {/* Edit Client Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Client: ${client.name}`}
      >
        <ClientForm
          initialData={client}
          onSuccess={() => setIsEditModalOpen(false)}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* New Matter Modal pre-assigned to this client */}
      <Modal
        isOpen={isNewMatterModalOpen}
        onClose={() => setIsNewMatterModalOpen(false)}
        title={`Create New Matter for ${client.name}`}
        maxWidth="max-w-3xl"
      >
        <MatterForm
          defaultClientId={client.id}
          onSuccess={() => setIsNewMatterModalOpen(false)}
          onCancel={() => setIsNewMatterModalOpen(false)}
        />
      </Modal>

      {/* Engagement Letter Generator Modal */}
      {isEngagementLetterOpen && (
        <EngagementLetterModal
          isOpen={isEngagementLetterOpen}
          onClose={() => setIsEngagementLetterOpen(false)}
          clientName={client.name}
          contactPerson={client.primaryContact || client.name}
          email={client.email}
          attorneyName={client.assignedAttorneyName || 'Thomas Bludworth, Esq.'}
        />
      )}
    </div>
  );
}

