import React, { useState } from 'react';
import { Sparkles, Clock, ArrowRight, CheckCircle2, Calendar, Mail, FileText, Plus } from 'lucide-react';
import { useTime } from '../../../context/TimeContext';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../components/ui/Toast';
import { PageHeader } from '../../../components/shared/PageHeader';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/shared/StatusBadge';
import { formatHours, formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';

export function SuggestedBilling() {
  const { addTimeEntry } = useTime();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [suggestions, setSuggestions] = useState([
    {
      id: 'SUG-01',
      sourceType: 'Outlook Email',
      sourceIcon: Mail,
      date: '2026-11-05',
      matterNumber: '25-CV-0101',
      matterTitle: 'Wasatch Mountain Logistics v. Interstate Freightlines Inc.',
      clientName: 'Wasatch Mountain Logistics LLC',
      suggestedHours: 0.6,
      activityDescription: 'Email correspondence to opposing counsel regarding proposed cold-chain inspection schedule.',
      detectedRate: 500,
      converted: false,
    },
    {
      id: 'SUG-02',
      sourceType: 'Calendar Event',
      sourceIcon: Calendar,
      date: '2026-11-04',
      matterNumber: '25-DOM-0418',
      matterTitle: 'In re Marriage of Martinez and Sterling: Domestic Dissolution',
      clientName: 'Dr. Evelyn Martinez',
      suggestedHours: 1.2,
      activityDescription: 'Attended telephonic pre-hearing conference with mediator and counsel of record.',
      detectedRate: 375,
      converted: false,
    },
    {
      id: 'SUG-03',
      sourceType: 'Word Document',
      sourceIcon: FileText,
      date: '2026-11-04',
      matterNumber: '24-LND-0912',
      matterTitle: 'Apex Horizon v. Wasatch County Board of Adjustment (Water Rights Appeal)',
      clientName: 'Apex Horizon Real Estate Group',
      suggestedHours: 2.5,
      activityDescription: 'Drafted reply brief section addressing municipal groundwater recharge easements.',
      detectedRate: 550,
      converted: false,
    }
  ]);

  const handleConvert = (sug) => {
    addTimeEntry({
      userId: currentUser.id,
      userName: currentUser.name,
      clientId: 'CLI-1001',
      clientName: sug.clientName,
      matterId: 'MAT-2025-0101',
      matterTitle: sug.matterTitle,
      date: sug.date,
      hours: sug.suggestedHours,
      rate: sug.detectedRate,
      amount: sug.suggestedHours * sug.detectedRate,
      description: sug.activityDescription,
      isBillable: true,
      status: 'Submitted',
    });

    setSuggestions(prev => prev.map(s => s.id === sug.id ? { ...s, converted: true } : s));
    addToast(`Suggested entry converted to active billable time (${sug.suggestedHours} hrs).`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suggested Billing Entries"
        subtitle="Intelligent automated time suggestions detected from Outlook email exchanges, calendar attendance, and document editing sessions."
        breadcrumbs={[{ label: 'Tasks & Activities', to: '/tasks' }, { label: 'Suggested Billing' }]}
      />

      <div className="p-4 bg-white rounded border border-[#D9D6CF] shadow-subtle flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#06244B] text-[#F5F0E5]">
            <Sparkles className="w-5 h-5 text-[#A4432B]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-[#06244B]">
              Passive Time Capture Engine
            </h3>
            <p className="text-[#667085]">
              Review automated suggestions and click "Convert to Time Entry" to record billable hours without manual re-typing.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase text-[#A4432B] bg-[#A4432B]/10 px-2.5 py-1 rounded">
          {suggestions.filter(s => !s.converted).length} Pending Suggestions
        </span>
      </div>

      <div className="space-y-4">
        {suggestions.map((sug) => {
          const Icon = sug.sourceIcon;
          return (
            <div
              key={sug.id}
              className={`p-5 rounded border bg-white shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                sug.converted ? 'opacity-50 border-gray-200' : 'border-[#D9D6CF] hover:border-[#A4432B]'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded bg-[#F5F0E5] text-[#06244B] flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-[#A4432B]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F5F0E5] text-[#06244B] border border-[#D9D6CF]">
                      {sug.sourceType}
                    </span>
                    <span className="text-xs text-[#667085]">{formatDate(sug.date)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-bold text-[#06244B]">{sug.matterNumber}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#06244B]">
                    {sug.matterTitle}
                  </h4>
                  <p className="text-xs text-[#202A35] leading-relaxed">
                    {sug.activityDescription}
                  </p>
                  <p className="text-[11px] text-[#667085]">
                    Client: <strong>{sug.clientName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-sm font-bold text-[#A4432B] block">
                    {formatHours(sug.suggestedHours)}
                  </span>
                  <span className="text-xs font-semibold text-[#06244B]">
                    {formatCurrency(sug.suggestedHours * sug.detectedRate)}
                  </span>
                </div>

                <div>
                  {sug.converted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#287A55] font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Converted
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Plus}
                      onClick={() => handleConvert(sug)}
                    >
                      Convert to Entry
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

