'use client';

import React, { useEffect, useState } from 'react';
import type { Incident } from '@/types';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badges';
import { WARDS } from '@/lib/mockData';
import { Flame, AlertTriangle, Trash2, Wind, Leaf } from 'lucide-react';

interface IncidentsTableProps {
  incidents: Incident[];
  onRowClick: (id: string) => void;
  limit?: number;
}

const TYPE_META: Record<Incident['type'], { label: string; Icon: React.ElementType; color: string }> = {
  'open-fire':      { label: 'Open Fire',       Icon: Flame,         color: '#ef4444' },
  'illegal-dumping':{ label: 'Illegal Dumping',  Icon: Trash2,        color: '#f97316' },
  'overflow':       { label: 'Overflow',          Icon: AlertTriangle, color: '#eab308' },
  'air-quality':    { label: 'Air Quality',       Icon: Wind,          color: '#60a5fa' },
  'compost-alert':  { label: 'Compost Alert',     Icon: Leaf,          color: '#10b981' },
};

function relativeTime(isoString: string, now: number) {
  const diff = now - new Date(isoString).getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 0) return `${h}h ${m}m ago`;
  if (m > 0) return `${m}m ago`;
  return 'Just now';
}

export function IncidentsTable({ incidents, onRowClick, limit }: IncidentsTableProps) {
  const display = limit ? incidents.slice(0, limit) : incidents;
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (display.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <AlertTriangle size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
        <p style={{ margin: 0, fontSize: '13px' }}>No incidents found for the selected filter.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Ward</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Reported</th>
          </tr>
        </thead>
        <tbody>
          {display.map((incident) => {
            const meta = TYPE_META[incident.type];
            const Icon = meta.Icon;
            const ward = WARDS.find((w) => w.id === incident.wardId);
            return (
              <tr key={incident.id} onClick={() => onRowClick(incident.id)}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={14} color={meta.color} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{meta.label}</span>
                  </div>
                </td>
                <td style={{ maxWidth: '240px' }}>
                  <span style={{
                    display: 'block', overflow: 'hidden', textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap', color: 'var(--text-primary)', fontWeight: 500,
                  }}>
                    {incident.title}
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                  {ward?.name ?? incident.wardId}
                </td>
                <td><SeverityBadge severity={incident.severity} /></td>
                <td><StatusBadge status={incident.status} /></td>
                <td style={{ color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                  {now > 0 ? relativeTime(incident.reportedAt, now) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
