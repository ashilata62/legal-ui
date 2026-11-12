import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  User,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Scale,
  Edit,
  Plus,
  ArrowLeft,
  DollarSign,
  AlertTriangle,
  FolderOpen,
  CheckSquare,
  Users,
  ShieldCheck,
  Send,
  Globe,
  Landmark,
  Lock
} from 'lucide-react';
import { useMatters } from '../../../context/MatterContext';
import { useTasks } from '../../../context/TaskContext';
import { useTime } from '../../../context/TimeContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { useToast } from '../../../components/ui/Toast';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { Tabs } from '../../../components/ui/Tabs';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { MatterForm } from '../forms/MatterForm';
import { TimeEntryForm } from '../../time-tracking/forms/TimeEntryForm';
import { ActivityTimeline } from '../../../components/shared/ActivityTimeline';
import { formatCurrency, formatHours } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { MOCK_DOCUMENTS } from '../../../data/mockDocuments';
import { StageProgressBar } from '../components/StageProgressBar';
import { RelatedPartiesTab } from '../components/RelatedPartiesTab';
import { RelativeDeadlineCalculator } from '../../calendar/components/RelativeDeadlineCalculator';
import { DocumentRequestModal } from '../components/DocumentRequestModal';

export function MatterDetails() {
  const { matterId } = useParams();
  const navigate = useNavigate();
  const { matters } = useMatters();
  const { tasks, addTask, updateTaskStatus } = useTasks();
  const { timeEntries } = useTime();
  const permissions = usePermissions();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isRelativeDeadlineOpen, setIsRelativeDeadlineOpen] = useState(false);
  const [isDocumentRequestOpen, setIsDocumentRequestOpen] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState(new Date().toISOString().split('T')[0]);
  const [newTaskPriority, setNewTaskPriority] = useState('High');

  const matter = matters.find(m => m.id === matterId) || matters[0];

  if (!matter) {
    return (
      <div className="p-8 text-center bg-white rounded border border-[#D9D6CF]">
        <h2 className="text-xl font-serif text-[#06244B]">Matter File Not Found</h2>
        <Button className="mt-4" onClick={() => navigate('/matters')}>
          Back to Matters
        </Button>
      </div>
    );
  }

  // Linked records
  const matterTasks = tasks.filter(t => t.matterId === matter.id);
  const matterTimeEntries = timeEntries.filter(t => t.matterId === matter.id);
  const matterDocuments = MOCK_DOCUMENTS.filter(d => d.matterId === matter.id);
  const totalLoggedHours = matterTimeEntries.reduce((sum, e) => sum + (e.hours || 0), 0);
  const totalLoggedAmount = matterTimeEntries.reduce((sum, e) => sum + (e.amount || 0), 0);

  const tabs = [
    { id: 'overview', label: 'Matter Overview', icon: Briefcase },
    { id: 'related-parties', label: 'Related Parties & Adversaries', icon: Users },
    { id: 'tasks', label: 'Tasks & Deadlines', count: matterTasks.length, icon: CheckSquare },
    { id: 'documents', label: 'Pleadings & Documents', count: matterDocuments.length, icon: FileText },
    { id: 'time', label: 'Time & Expenses', count: matterTimeEntries.length, icon: Clock },
    { id: 'comms', label: 'Communications', icon: MessageSquare },
    { id: 'notes', label: 'Work Product & Notes', icon: Scale },
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      matterId: matter.id,
      matterTitle: matter.title,
      clientId: matter.clientId,
      clientName: matter.clientName,
      assignedToId: 'usr-4',
      assignedToName: 'Marcus Vance',
      dueDate: newTaskDue,
      priority: newTaskPriority,
      status: 'Not Started',
    });

    setNewTaskTitle('');
    setIsNewTaskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
        <Link to="/matters" className="hover:text-[#06244B] flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Matters
        </Link>
      </div>

      {/* Matter Summary Header */}
      <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#06244B] text-white">
                {matter.matterNumber}
              </span>
              <StatusBadge status={matter.status} />
              <span className="text-xs font-semibold text-[#A4432B] px-2 py-0.5 rounded bg-[#A4432B]/10">
                {matter.practiceAreaName}
              </span>
              {(matter.isEthicalWallEnabled || matter.id === 'MAT-001') && (
                <span className="text-xs font-bold text-red-800 bg-red-100 border border-red-300 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-700" />
                  Ethical Wall Active (Utah RPC 1.10)
                </span>
              )}
            </div>

            <h1 className="text-2xl font-serif font-bold text-[#06244B] mt-2 leading-tight">
              {matter.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#667085] mt-1">
              Client Entity: <Link to={`/clients/${matter.clientId}`} className="font-semibold text-[#06244B] hover:underline">{matter.clientName}</Link> • Opened: {formatDate(matter.openDate, { short: true })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            {permissions.canCreateMatter && (
              <Button
                variant="outline"
                size="sm"
                icon={Edit}
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Matter
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              Add Task
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRelativeDeadlineOpen(true)}
              className="text-[#06244B]"
            >
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Rule 6 Deadlines</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDocumentRequestOpen(true)}
              className="text-[#06244B]"
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>Doc Requests</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={Clock}
              onClick={() => setIsLogTimeModalOpen(true)}
            >
              Log Time
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-[#D9D6CF]/60 text-xs">
          <div>
            <span className="text-[#667085] block font-medium">Responsible Lead Attorney:</span>
            <span className="text-sm font-semibold text-[#06244B]">{matter.responsibleAttorneyName}</span>
          </div>
          <div>
            <span className="text-[#667085] block font-medium">Billing Model:</span>
            <span className="text-sm font-semibold text-[#06244B]">
              {matter.billingType} {matter.hourlyRate ? `($${matter.hourlyRate}/hr)` : ''}
            </span>
          </div>
          <div>
            <span className="text-[#667085] block font-medium">Total Logged Time:</span>
            <span className="text-sm font-semibold text-[#06244B]">
              {formatHours(totalLoggedHours)} ({formatCurrency(totalLoggedAmount)})
            </span>
          </div>
          <div>
            <span className="text-[#667085] block font-medium">Next Court Appearance:</span>
            <span className={`text-sm font-semibold ${matter.nextCourtDate ? 'text-[#B42318]' : 'text-[#667085]'}`}>
              {matter.nextCourtDate ? formatDate(matter.nextCourtDate, { short: true }) : 'None Scheduled'}
            </span>
          </div>
        </div>
      </div>

      {/* Stage Progress Bar (Filevine Reference) */}
      <StageProgressBar matter={matter} />

      {/* Specialty Practice Docket Integration Banner */}
      {(matter.specializedDocketUrl || matter.practiceAreaName?.includes('Immigration') || matter.practiceAreaName?.includes('Bankruptcy')) && (
        <div className="bg-slate-50 border border-[#D9D6CF] rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            {matter.practiceAreaName?.includes('Immigration') ? (
              <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
            )}
            <div>
              <span className="font-bold text-xs text-[#06244B] block">
                Cross-Practice Specialty Docket Integration
              </span>
              <span className="text-[11px] text-[#667085]">
                {matter.practiceAreaName?.includes('Immigration')
                  ? 'Linked to Immigration Workspace (Forms I-130/I-485, USCIS receipts, Alien registration numbers, and translation questionnaires).'
                  : 'Linked to Bankruptcy Practice Workspace (Schedules A/B-J, Form 122 Means-Test, Utah exemptions, and Creditor Matrix).'}
              </span>
            </div>
          </div>
          <Link to={matter.specializedDocketUrl || (matter.practiceAreaName?.includes('Immigration') ? '/immigration/cases' : '/bankruptcy/cases')}>
            <Button size="sm" variant="outline" className="font-semibold text-xs border-[#06244B] text-[#06244B] hover:bg-[#06244B] hover:text-white">
              Launch {matter.practiceAreaName?.includes('Immigration') ? 'Immigration Docket' : 'Bankruptcy Docket'}
            </Button>
          </Link>
        </div>
      )}

      {/* Workspace Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle">
              <h3 className="font-serif text-base font-bold text-[#06244B] mb-2 border-b border-[#D9D6CF]/60 pb-2">
                Factual Scope &amp; Litigation Synopsis
              </h3>
              <p className="text-sm text-[#202A35] leading-relaxed">
                {matter.description || 'No description provided.'}
              </p>
            </div>

            {/* Court & Forum Details */}
            <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle">
              <h3 className="font-serif text-base font-bold text-[#06244B] mb-3 border-b border-[#D9D6CF]/60 pb-2">
                Judicial Forum &amp; Docket Identification
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[#667085] block font-medium">Court / Administrative Forum:</span>
                  <span className="text-sm font-semibold text-[#06244B]">{matter.courtName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#667085] block font-medium">Presiding Judge / Hearing Officer:</span>
                  <span className="text-sm font-semibold text-[#06244B]">{matter.judge || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#667085] block font-medium">Statute of Limitations / Bar Date:</span>
                  <span className="text-sm font-semibold text-[#B42318]">{matter.statuteOfLimitations ? formatDate(matter.statuteOfLimitations) : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[#667085] block font-medium">Litigation Budget:</span>
                  <span className="text-sm font-semibold text-[#287A55]">{formatCurrency(matter.budget)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Legal Team Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded border border-[#D9D6CF] shadow-subtle">
              <h3 className="font-serif text-base font-bold text-[#06244B] mb-3 border-b border-[#D9D6CF]/60 pb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#A4432B]" />
                <span>Assigned Matter Team</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 p-2 rounded bg-[#F5F0E5]/60">
                  <div className="w-8 h-8 rounded-full bg-[#06244B] text-white flex items-center justify-center font-bold text-xs">
                    {matter.responsibleAttorneyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-[#06244B]">{matter.responsibleAttorneyName}</p>
                    <p className="text-[10px] text-[#A4432B] font-semibold uppercase">Responsible Counsel</p>
                  </div>
                </div>

                {matter.assignedStaffNames?.map((staffName, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2 rounded hover:bg-[#F5F0E5]/40">
                    <div className="w-8 h-8 rounded-full bg-[#B8C0C4] text-[#06244B] flex items-center justify-center font-bold text-xs">
                      MV
                    </div>
                    <div>
                      <p className="font-semibold text-[#202A35]">{staffName}</p>
                      <p className="text-[10px] text-[#667085]">Litigation Paralegal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-[#06244B] text-white p-5 rounded shadow-card">
              <h4 className="font-serif font-bold text-sm text-[#F5F0E5]">Matter Quick Action</h4>
              <p className="text-xs text-[#B8C0C4] mt-1">Record deposition time, draft pleadings, or create reminders.</p>
              <Button
                variant="primary"
                size="sm"
                className="w-full mt-3"
                onClick={() => setIsLogTimeModalOpen(true)}
              >
                Log Time for this Matter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Related Parties & Adversaries Tab */}
      {activeTab === 'related-parties' && (
        <RelatedPartiesTab
          matterId={matter.id}
          matterTitle={matter.title}
        />
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#06244B]">
              Matter Tasks &amp; Deadlines ({matterTasks.length})
            </h3>
            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() => setIsNewTaskModalOpen(true)}
            >
              Add Task
            </Button>
          </div>

          <div className="bg-white rounded border border-[#D9D6CF] divide-y divide-[#D9D6CF]/50 shadow-subtle">
            {matterTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085]">
                No pending tasks created for this matter yet.
              </div>
            ) : (
              matterTasks.map((t) => {
                const isDone = t.status === 'Completed';
                return (
                  <div key={t.id} className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => updateTaskStatus(t.id, isDone ? 'In Progress' : 'Completed')}
                        className="w-4 h-4 rounded text-[#A4432B] focus:ring-[#A4432B] cursor-pointer"
                      />
                      <div>
                        <p className={`text-sm font-semibold ${isDone ? 'line-through text-[#667085]' : 'text-[#06244B]'}`}>
                          {t.title}
                        </p>
                        <p className="text-xs text-[#667085] mt-0.5">
                          Assigned to: {t.assignedToName} • Due: {formatDate(t.dueDate, { short: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.priority} />
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-[#06244B]">
              Pleadings, Discovery &amp; Orders ({matterDocuments.length})
            </h3>
            <Button size="sm" variant="outline" onClick={() => navigate('/documents')}>
              Upload Document
            </Button>
          </div>

          <div className="bg-white rounded border border-[#D9D6CF] divide-y divide-[#D9D6CF]/50 shadow-subtle">
            {matterDocuments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085]">
                No documents uploaded for this matter yet.
              </div>
            ) : (
              matterDocuments.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-[#F5F0E5] text-[#06244B]">
                      <FileText className="w-5 h-5 text-[#A4432B]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#06244B]">{doc.title}</p>
                      <p className="text-xs text-[#667085] mt-0.5">
                        {doc.fileName} • {doc.fileSize} • Uploaded by {doc.uploadedByName} on {formatDate(doc.uploadedAt, { short: true })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToast(`Opening secure document preview: ${doc.fileName}`, 'info')}
                    >
                      Preview
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'time' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#06244B]">
                Matter Billable Ledger ({formatHours(totalLoggedHours)})
              </h3>
              <p className="text-xs text-[#667085]">Total billable fees: {formatCurrency(totalLoggedAmount)}</p>
            </div>
            <Button
              size="sm"
              variant="primary"
              icon={Clock}
              onClick={() => setIsLogTimeModalOpen(true)}
            >
              Log Time
            </Button>
          </div>

          <div className="bg-white rounded border border-[#D9D6CF] divide-y divide-[#D9D6CF]/50 shadow-subtle overflow-hidden">
            {matterTimeEntries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#667085]">
                No time entries logged on this matter file yet.
              </div>
            ) : (
              matterTimeEntries.map((t) => (
                <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#06244B]">{t.userName}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-semibold text-[#A4432B]">{t.hours} hrs (${t.amount})</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[#667085]">{formatDate(t.date, { short: true })}</span>
                    </div>
                    <p className="text-xs text-[#202A35] mt-1">{t.description}</p>
                    {t.reviewComment && (
                      <p className="text-[11px] text-[#A4432B] mt-1 italic">Review note: "{t.reviewComment}"</p>
                    )}
                  </div>
                  <div>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'comms' && (
        <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle space-y-4">
          <h3 className="font-serif text-base font-bold text-[#06244B] border-b border-[#D9D6CF]/60 pb-2">
            Matter Correspondence &amp; Notices
          </h3>
          <div className="divide-y divide-[#D9D6CF]/40 text-xs">
            <div className="py-3">
              <div className="flex justify-between items-center font-semibold text-[#06244B]">
                <span>Notice of Appearance &amp; Certificate of Service</span>
                <span className="text-[#667085]">2025-01-24</span>
              </div>
              <p className="text-[#667085] mt-1">Transmitted via Utah Court XChange e-filing system to opposing counsel.</p>
            </div>
            <div className="py-3">
              <div className="flex justify-between items-center font-semibold text-[#06244B]">
                <span>Discovery Meet &amp; Confer Email Protocol</span>
                <span className="text-[#667085]">2025-02-10</span>
              </div>
              <p className="text-[#667085] mt-1">Email exchange regarding electronic format of telemetry database logs.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-white p-6 rounded border border-[#D9D6CF] shadow-subtle space-y-4">
          <h3 className="font-serif text-base font-bold text-[#06244B] border-b border-[#D9D6CF]/60 pb-2">
            Attorney Work Product &amp; Strategic Case Notes
          </h3>
          <div className="p-4 bg-[#F5F0E5]/60 rounded border border-[#D9D6CF] text-xs leading-relaxed text-[#202A35]">
            <p className="font-semibold text-[#06244B] mb-1">Defense Settlement Exposure Assessment:</p>
            Review of pretrial disclosures indicates opposing party may be seeking early mediation prior to expert discovery cutoff. Settlement authority threshold requested from client CEO at $120,000 baseline.
          </div>
          <p className="text-[11px] text-[#A4432B] font-semibold">
            Privileged &amp; Confidential Attorney Work Product • Do not disclose to non-firm personnel.
          </p>
        </div>
      )}

      {/* Edit Matter Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Matter: ${matter.matterNumber}`}
        maxWidth="max-w-3xl"
      >
        <MatterForm
          initialData={matter}
          onSuccess={() => setIsEditModalOpen(false)}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Log Time Modal */}
      <Modal
        isOpen={isLogTimeModalOpen}
        onClose={() => setIsLogTimeModalOpen(false)}
        title={`Log Billable Time: ${matter.matterNumber}`}
        maxWidth="max-w-2xl"
      >
        <TimeEntryForm
          defaultMatterId={matter.id}
          onSuccess={() => setIsLogTimeModalOpen(false)}
          onCancel={() => setIsLogTimeModalOpen(false)}
        />
      </Modal>

      {/* Quick Add Task Modal */}
      <Modal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        title="Create Task for Matter"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202A35] uppercase mb-1">
              Task Title
            </label>
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Prepare deposition outline"
              className="w-full text-sm p-2.5 rounded border border-[#D9D6CF] focus:outline-none focus:border-[#06244B]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202A35] uppercase mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={newTaskDue}
                onChange={(e) => setNewTaskDue(e.target.value)}
                className="w-full text-sm p-2 rounded border border-[#D9D6CF] focus:outline-none focus:border-[#06244B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202A35] uppercase mb-1">
                Priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-full text-sm p-2 rounded border border-[#D9D6CF] focus:outline-none focus:border-[#06244B]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#D9D6CF]">
            <Button size="sm" variant="outline" type="button" onClick={() => setIsNewTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Relative Deadlines Modal */}
      {isRelativeDeadlineOpen && (
        <RelativeDeadlineCalculator
          isOpen={isRelativeDeadlineOpen}
          onClose={() => setIsRelativeDeadlineOpen(false)}
          initialAnchorDate={matter.nextCourtDate || '2027-02-15'}
          matterNumber={matter.matterNumber}
          matterTitle={matter.title}
        />
      )}

      {/* Document Requests Modal */}
      {isDocumentRequestOpen && (
        <DocumentRequestModal
          isOpen={isDocumentRequestOpen}
          onClose={() => setIsDocumentRequestOpen(false)}
          matterTitle={matter.title}
          clientName={matter.clientName}
        />
      )}
    </div>
  );
}

