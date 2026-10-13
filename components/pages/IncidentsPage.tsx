'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/lib/context';
import { INCIDENTS } from '@/lib/mockData';
import { Card } from '@/components/ui/Card';
import { IncidentsTable } from '@/components/incidents/IncidentsTable';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import type { IncidentStatus, Severity } from '@/types';

const SEVERITY_OPTIONS: Array<Severity | 'all'> = ['all', 'critical', 'high', 'medium', 'low'];
const STATUS_OPTIONS: Array<IncidentStatus | 'all'> = ['all', 'open', 'in-progress', 'escalated', 'resolved'];

export function IncidentsPage() {
  const { selectedWard, selectedIncidentId, setSelectedIncidentId } = useApp();
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');

  const incidents = useMemo(() => {
    let list = selectedWard === 'all' ? INCIDENTS : INCIDENTS.filter((i) => i.wardId === selectedWard);
    if (severityFilter !== 'all') list = list.filter((i) => i.severity === severityFilter);
    if (statusFilter !== 'all')   list = list.filter((i) => i.status === statusFilter);
    return list;
  }, [selectedWard, severityFilter, statusFilter]);

  const selectedIncident = useMemo(
    () => selectedIncidentId ? INCIDENTS.find((i) => i.id === selectedIncidentId) ?? null : null,
    [selectedIncidentId]
  );

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px', borderRadius: '4px', border: '1px solid',
    borderColor: active ? 'var(--emerald-500)' : 'var(--border)',
    background: active ? 'rgba(16,185,129,.12)' : 'var(--bg-elevated)',
    color: active ? 'var(--emerald-400)' : 'var(--text-secondary)',
    cursor: 'pointer', fontSize: '12px', fontWeight: active ? 700 : 400,
    fontFamily: 'var(--font-sans)', textTransform: 'capitalize',
    transition: 'all .15s',
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
      {/* Filters */}
      <Card style={{ padding: '14px 18px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginRight: '8px' }}>Severity</span>
            <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap' }}>
              {SEVERITY_OPTIONS.map((s) => (
                <button key={s} onClick={() => setSeverityFilter(s)} style={filterBtnStyle(severityFilter === s)}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>
          <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginRight: '8px' }}>Status</span>
            <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)} style={filterBtnStyle(statusFilter === s)}>
                  {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s}
                </button>
              ))}
            </div>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>{incidents.length} incidents</span>
        </div>
      </Card>

      {/* Table */}
      <Card title="All Incidents" subtitle="Click any row to view full details">
        <IncidentsTable incidents={incidents} onRowClick={setSelectedIncidentId} />
      </Card>

      {/* Detail modal */}
      {selectedIncident && (
        <IncidentDetail incident={selectedIncident} onClose={() => setSelectedIncidentId(null)} />
      )}
    </div>
  );
}
