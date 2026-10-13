import React from 'react';
import type { Severity, IncidentStatus, RiskLevel } from '@/types';

interface SeverityBadgeProps { severity: Severity | RiskLevel; }
interface StatusBadgeProps  { status: IncidentStatus; }

const SEV_MAP: Record<string, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
};

const STAT_MAP: Record<string, string> = {
  'open':        'badge-open',
  'in-progress': 'badge-in-progress',
  'resolved':    'badge-resolved',
  'escalated':   'badge-escalated',
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return <span className={SEV_MAP[severity] ?? 'badge-low'}>{severity}</span>;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={STAT_MAP[status] ?? 'badge-open'}>{label}</span>;
}
