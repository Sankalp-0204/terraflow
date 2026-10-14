import React from 'react';

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={`badge badge-${severity}`}>
      {severity}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const cls = status === 'in-progress' ? 'badge badge-in-progress'
    : status === 'resolved'   ? 'badge badge-resolved'
    : status === 'escalated'  ? 'badge badge-escalated'
    : 'badge badge-open';
  const label = status === 'in-progress' ? 'In Progress'
    : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={cls}>{label}</span>;
}
