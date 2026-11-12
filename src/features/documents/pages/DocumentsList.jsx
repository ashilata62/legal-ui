import React, { useState, useMemo } from 'react';
import { Upload, FileText, Search, Filter, Eye, Download, ShieldCheck, Plus, CheckCircle2 } from 'lucide-react';
import { MOCK_DOCUMENTS } from '../../../data/mockDocuments';
import { useClients } from '../../../context/ClientContext';
import { useMatters } from '../../../context/MatterContext';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../components/ui/Toast';
import { PageHeader } from '../../../components/shared/PageHeader';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterBar } from '../../../components/shared/FilterBar';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { formatDate } from '../../../utils/formatDate';

export function DocumentsList() {
  const { clients } = useClients();
  const { matters } = useMatters();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Pleadings');
  const [uploadMatterId, setUploadMatterId] = useState(matters[0]?.id || '');
  const [selectedFileName, setSelectedFileName] = useState('');

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.matterTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = categoryFilter === '' || doc.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [documents, searchQuery, categoryFilter]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadMatterId) {
      addToast('Please provide a document title and select a matter.', 'error');
      return;
    }

    const matter = matters.find(m => m.id === uploadMatterId);
    const newDoc = {
      id: `DOC-${documents.length + 401}`,
      title: uploadTitle,
      fileName: selectedFileName || `${uploadTitle.replace(/\s+/g, '_')}.pdf`,
      fileType: 'PDF',
      fileSize: '1.4 MB',
      category: uploadCategory,
      clientId: matter?.clientId || 'CLI-1001',
      clientName: matter?.clientName || 'Wasatch Mountain Logistics LLC',
      matterId: matter?.id,
      matterTitle: matter?.title,
      uploadedById: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedAt: new Date().toISOString(),
      isConfidential: true,
    };

    setDocuments(prev => [newDoc, ...prev]);
    addToast(`Document "${uploadTitle}" uploaded and indexed to ${matter?.matterNumber}.`, 'success');
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setSelectedFileName('');
  };

  const columns = [
    {
      key: 'title',
      label: 'Document Title & File',
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-[#06244B] text-white">
            <FileText className="w-4 h-4 text-[#A4432B]" />
          </div>
          <div>
            <span
              onClick={() => setPreviewDoc(row)}
              className="font-serif font-bold text-[#06244B] hover:text-[#A4432B] block cursor-pointer text-sm"
            >
              {val}
            </span>
            <span className="text-[11px] text-[#667085]">{row.fileName} • {row.fileSize}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (val) => (
        <span className="text-xs px-2 py-0.5 rounded bg-[#F5F0E5] text-[#06244B] font-semibold border border-[#D9D6CF]">
          {val}
        </span>
      ),
    },
    {
      key: 'matterTitle',
      label: 'Related Matter & Client',
      render: (val, row) => (
        <div>
          <span className="text-xs font-semibold text-[#06244B] block max-w-xs truncate">{val}</span>
          <span className="text-[11px] text-[#667085]">{row.clientName}</span>
        </div>
      ),
    },
    {
      key: 'uploadedByName',
      label: 'Uploaded By',
      sortable: true,
      render: (val, row) => (
        <div className="text-xs">
          <span className="font-medium text-[#202A35]">{val}</span>
          <span className="text-[10px] text-[#667085] block">{formatDate(row.uploadedAt, { short: true })}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (val, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setPreviewDoc(row)}
            className="p-1.5 rounded text-[#06244B] hover:bg-[#F5F0E5]"
            title="Preview"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => addToast(`Mock download initiated for ${row.fileName}`, 'info')}
            className="p-1.5 rounded text-[#06244B] hover:bg-[#F5F0E5]"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Management"
        subtitle="Centralized firm repository for pleadings, discovery disclosures, contracts, transcripts, and court orders."
        breadcrumbs={[{ label: 'Clients & Matters', to: '/clients' }, { label: 'Documents' }]}
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={Upload}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Document
          </Button>
        }
      />

      {/* Info notice about demo storage */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0" />
          <span>Demonstration Document Index. Records are securely mapped to client matter identifiers.</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Mock File System</span>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by title, file name, or matter..."
          className="md:col-span-1"
        />

        <div className="md:col-span-2">
          <FilterBar
            filters={[
              {
                id: 'category',
                label: 'Category',
                value: categoryFilter,
                options: [
                  { value: 'Pleadings', label: 'Pleadings & Complaints' },
                  { value: 'Discovery', label: 'Discovery & Telemetry' },
                  { value: 'Orders', label: 'Court Orders & Scheduling' },
                  { value: 'Contracts', label: 'Contracts & Agreements' },
                  { value: 'Financial', label: 'Financial Disclosures' },
                ],
                onChange: setCategoryFilter,
              },
            ]}
            onReset={() => {
              setSearchQuery('');
              setCategoryFilter('');
            }}
          />
        </div>
      </div>

      {/* Documents Table */}
      <DataTable
        columns={columns}
        data={filteredDocs}
        pageSize={8}
      />

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload Document"
        subtitle="Associate pleadings or evidence with a legal matter."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <Input
              label="Document Title"
              required
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. Defendant Response to Motion to Compel"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Select
                label="Category"
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                options={[
                  { value: 'Pleadings', label: 'Pleadings' },
                  { value: 'Discovery', label: 'Discovery' },
                  { value: 'Orders', label: 'Court Orders' },
                  { value: 'Contracts', label: 'Contracts' },
                ]}
              />
            </div>

            <div>
              <Select
                label="Related Matter"
                required
                value={uploadMatterId}
                onChange={(e) => setUploadMatterId(e.target.value)}
                options={matters.map(m => ({ value: m.id, label: `${m.matterNumber} - ${m.title}` }))}
              />
            </div>
          </div>

          {/* Mock File selector */}
          <div className="p-5 border-2 border-dashed border-[#D9D6CF] rounded text-center bg-[#F5F0E5]/40">
            <Upload className="w-8 h-8 text-[#A4432B] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#06244B]">
              {selectedFileName ? selectedFileName : 'Drag & drop legal document or click to browse'}
            </p>
            <p className="text-[11px] text-[#667085] mt-1">PDF, DOCX, XLSX up to 50MB</p>
            <input
              type="file"
              onChange={(e) => setSelectedFileName(e.target.files[0]?.name || '')}
              className="mt-3 text-xs text-[#667085] file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#06244B] file:text-white cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#D9D6CF]">
            <Button size="sm" variant="outline" type="button" onClick={() => setIsUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Upload Document Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        title={previewDoc?.title || 'Document Preview'}
        subtitle={`${previewDoc?.fileName} • ${previewDoc?.category} • ${previewDoc?.fileSize}`}
        maxWidth="max-w-2xl"
      >
        {previewDoc && (
          <div className="space-y-4 text-xs text-[#202A35]">
            <div className="p-4 bg-[#F5F0E5] rounded border border-[#D9D6CF]">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-[#06244B] text-sm font-serif">Document Metadata</span>
                <span className="px-2 py-0.5 rounded bg-white font-semibold text-[#A4432B] border border-[#D9D6CF]">
                  {previewDoc.category}
                </span>
              </div>
              <p><strong>Matter:</strong> {previewDoc.matterTitle}</p>
              <p><strong>Client:</strong> {previewDoc.clientName}</p>
              <p><strong>Uploaded By:</strong> {previewDoc.uploadedByName} on {formatDate(previewDoc.uploadedAt)}</p>
            </div>

            {/* Document simulated preview page */}
            <div className="p-8 bg-white border border-[#D9D6CF] rounded shadow-subtle min-h-[220px] font-mono text-[11px] leading-relaxed text-[#202A35]">
              <div className="text-center font-bold mb-4 uppercase">
                IN THE UTAH JUDICIAL DISTRICT COURT<br />
                STATE OF UTAH
              </div>
              <div className="flex justify-between border-b border-gray-300 pb-3 mb-4">
                <div>
                  {previewDoc.clientName.toUpperCase()},<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;Plaintiff,<br />
                  v.<br />
                  DEFENDANT ENTITY,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;Defendant.
                </div>
                <div>
                  Case No. 25-CV-0101<br />
                  Judge Presiding<br />
                  FILED ELECTRONICALLY
                </div>
              </div>
              <p className="text-center font-bold uppercase mb-3">
                {previewDoc.title}
              </p>
              <p className="italic text-gray-500 text-center py-4">
                [Full multi-page authenticated legal instrument rendered in secure PDF viewer]
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#D9D6CF]">
              <span className="text-[10px] text-[#667085]">Confidential Attorney-Client Privileged</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPreviewDoc(null)}>
                  Close
                </Button>
                <Button size="sm" variant="primary" onClick={() => addToast('Document downloaded.', 'success')}>
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

