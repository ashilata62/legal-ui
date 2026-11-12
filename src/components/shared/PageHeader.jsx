import React from 'react';
import { Breadcrumbs } from '../layout/Breadcrumbs';

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className = '',
}) {
  return (
    <div className={`mb-6 pb-4 border-b border-[#D9D6CF]/60 ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-2" />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#06244B] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-[#667085] max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

