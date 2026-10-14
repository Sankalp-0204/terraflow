'use client';

import React, { useState } from 'react';
import type { Incident } from '@/types';
import { AlertTriangle, Flame, Wind, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/context';

interface AlertPanelProps {
  incidents: Incident[];
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  high:     '#F97316',
  medium:   '#F59E0B',
  low:      '#22C55E',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  escalated:   { label: 'Escalated',   color: '#EF4444' },
  'in-progress': { label: 'In Progress', color: '#F59E0B' },
  open:        { label: 'Open',        color: '#8B98A7' },
  resolved:    { label: 'Resolved',    color: '#22C55E' },
};

function TypeIcon({ type, color }: { type: string; color: string }) {
  const props = { size: 13, color, style: { flexShrink: 0 } };
  if (type === 'open-fire')   return <Flame {...props} />;
  if (type === 'air-quality') return <Wind {...props} />;
  return <AlertTriangle {...props} />;
}

export function AlertPanel({ incidents }: AlertPanelProps) {
  const { setSelectedIncidentId, setCurrentPage } = useApp();
  const [expanded, setExpanded] = useState(false);

  const urgent = incidents.filter(
    (i) => (i.severity === 'critical' || i.severity === 'high') && i.status !== 'resolved'
  );

  if (urgent.length === 0) return null;

  const shown = expanded ? urgent : urgent.slice(0, 3);
  const hasMore = urgent.length > 3;

  const criticalCount = urgent.filter((i) => i.severity === 'critical').length;
  const headerColor = criticalCount > 0 ? '#EF4444' : '#F97316';

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${criticalCount > 0 ? 'rgba(239,68,68,.25)' : 'rgba(249,115,22,.2)'}`,
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        background: criticalCount > 0 ? 'rgba(239,68,68,.04)' : 'rgba(249,115,22,.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: headerColor,
            animation: 'pulse-dot 1.8s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '.06em', color: headerColor,
          }}>
            Active Alerts
          </span>
          <span style={{
            background: `${headerColor}20`,
            border: `1px solid ${headerColor}35`,
            color: headerColor,
            borderRadius: '10px',
            padding: '1px 7px',
            fontSize: '10px',
            fontWeight: 700,
          }}>
            {urgent.length}
          </span>
          {criticalCount > 0 && (
            <span style={{
              background: 'rgba(239,68,68,.12)',
              border: '1px solid rgba(239,68,68,.25)',
              color: '#F87171',
              borderRadius: '10px',
              padding: '1px 7px',
              fontSize: '10px',
              fontWeight: 700,
            }}>
              {criticalCount} critical
            </span>
          )}
        </div>

        <button
          onClick={() => setCurrentPage('incidents')}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'transparent', border: 'none',
            color: 'var(--text-muted)', fontSize: '11px',
            cursor: 'pointer', padding: '2px 0',
            transition: 'color .12s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        >
          View all <ArrowRight size={11} />
        </button>
      </div>

      {/* Alert rows */}
      <div>
        {shown.map((incident, idx) => {
          const sevColor = SEVERITY_COLORS[incident.severity] ?? '#8B98A7';
          const statusMeta = STATUS_LABELS[incident.status] ?? { label: incident.status, color: '#8B98A7' };
          const isLast = idx === shown.length - 1;

          return (
            <div
              key={incident.id}
              onClick={() => setSelectedIncidentId(incident.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 14px',
                cursor: 'pointer',
                borderBottom: isLast && !hasMore ? 'none' : '1px solid var(--border-subtle)',
                transition: 'background .12s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              {/* Severity stripe */}
              <div style={{
                width: '3px', height: '32px', borderRadius: '2px',
                background: sevColor, flexShrink: 0,
              }} />

              {/* Icon */}
              <TypeIcon type={incident.type} color={sevColor} />

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: '12px', fontWeight: 600,
                  color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {incident.title}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {incident.location}
                </p>
              </div>

              {/* Status + severity badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <span className={`badge badge-${incident.severity}`}>
                  {incident.severity}
                </span>
                <span style={{
                  fontSize: '10px', fontWeight: 600,
                  color: statusMeta.color,
                  whiteSpace: 'nowrap',
                }}>
                  {statusMeta.label}
                </span>
              </div>
            </div>
          );
        })}

        {/* Expand / collapse */}
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              width: '100%',
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderTop: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'background .12s, color .12s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
            }}
          >
            {expanded
              ? 'Show less'
              : `+${urgent.length - 3} more alert${urgent.length - 3 !== 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  );
}
