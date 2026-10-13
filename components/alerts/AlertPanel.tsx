'use client';

import React from 'react';
import type { Incident } from '@/types';
import { AlertTriangle, Flame, X } from 'lucide-react';
import { useApp } from '@/lib/context';

interface AlertPanelProps {
  incidents: Incident[];
}

export function AlertPanel({ incidents }: AlertPanelProps) {
  const { setSelectedIncidentId } = useApp();
  const urgent = incidents.filter(
    (i) => (i.severity === 'critical' || i.severity === 'high') && i.status !== 'resolved'
  );

  if (urgent.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.25)',
      borderRadius: '8px', padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444',
          animation: 'pulse-ring 2s infinite',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#f87171' }}>
          {urgent.length} Active Alert{urgent.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {urgent.map((incident) => (
          <div
            key={incident.id}
            onClick={() => setSelectedIncidentId(incident.id)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '10px 12px', borderRadius: '6px',
              background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.12)',
              cursor: 'pointer', transition: 'background .15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(239,68,68,.1)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = 'rgba(239,68,68,.06)')}
          >
            {incident.type === 'open-fire' ? (
              <Flame size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
            ) : (
              <AlertTriangle size={14} color={incident.severity === 'critical' ? '#ef4444' : '#f97316'} style={{ flexShrink: 0, marginTop: '1px' }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {incident.title}
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                {incident.location} · {incident.status === 'escalated' ? '🔴 Escalated' : incident.status === 'in-progress' ? '🟡 In Progress' : '⚪ Open'}
              </p>
            </div>
            <X size={12} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px', opacity: 0.5 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
