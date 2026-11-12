import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export function FilterBar({
  filters = [], // [{ id, label, value, options, onChange }]
  onReset,
  children,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-center gap-3 p-3 bg-white rounded border border-[#D9D6CF] shadow-subtle ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#06244B] uppercase tracking-wider pl-1">
        <Filter className="w-3.5 h-3.5 text-[#A4432B]" />
        <span>Filters:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {filters.map((filter) => (
          <div key={filter.id} className="w-full sm:w-auto min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filter.value || ''}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full text-xs py-1.5 px-2.5 bg-[#F5F0E5]/60 border border-[#D9D6CF] rounded text-[#202A35] focus:outline-none focus:border-[#06244B]"
            >
              <option value="">{filter.label}: All</option>
              {filter.options.map((opt) => (
                <option key={opt.value ?? opt.id ?? opt} value={opt.value ?? opt.id ?? opt}>
                  {opt.label ?? opt.name ?? opt}
                </option>
              ))}
            </select>
          </div>
        ))}
        {children}
      </div>

      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-[#667085] hover:text-[#A4432B] font-medium py-1 px-2 rounded hover:bg-[#F5F0E5] transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}

