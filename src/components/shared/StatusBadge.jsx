import React from 'react';
import { Badge } from '../ui/Badge';

export function StatusBadge({ status, type = 'general' }) {
  if (!status) return <Badge variant="default">—</Badge>;

  // Mapping based on common legal management statuses
  const normalized = status.toLowerCase();

  let variant = 'default';

  if (
    normalized.includes('active') ||
    normalized.includes('cleared') ||
    normalized.includes('completed') ||
    normalized.includes('approved') ||
    normalized.includes('paid') ||
    normalized.includes('synchronized')
  ) {
    variant = 'success';
  } else if (
    normalized.includes('pending') ||
    normalized.includes('in review') ||
    normalized.includes('submitted') ||
    normalized.includes('waiting') ||
    normalized.includes('in progress') ||
    normalized.includes('partially paid') ||
    normalized.includes('trial prep') ||
    normalized.includes('discovery')
  ) {
    variant = 'warning';
  } else if (
    normalized.includes('overdue') ||
    normalized.includes('rejected') ||
    normalized.includes('conflict identified') ||
    normalized.includes('cancelled')
  ) {
    variant = 'danger';
  } else if (
    normalized.includes('draft') ||
    normalized.includes('sent') ||
    normalized.includes('inactive') ||
    normalized.includes('not started')
  ) {
    variant = 'default';
  } else if (normalized.includes('exported')) {
    variant = 'info';
  }

  return (
    <Badge variant={variant} size="sm">
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70 inline-block" />
      {status}
    </Badge>
  );
}

