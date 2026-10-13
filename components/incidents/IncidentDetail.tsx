'use client';

import React from 'react';
import type { Incident } from '@/types';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badges';
import { WARDS } from '@/lib/mockData';
import { X, MapPin, User, Clock, AlertTriangle } from 'lucide-react';

interface IncidentDetailProps {
  incident: Incident;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function IncidentDetail({ incident, onClose }: IncidentDetailProps) {
  const ward = WARDS.find((w) => w.id === incident.wardId);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn .2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border)',
        borderRadius: '12px', width: '100%', maxWidth: '560px',
        maxHeight: '80vh', overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,.6)',
        animation: 'fadeIn .2s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
        }}>
          <AlertTriangle
            size={20}
            color={
              incident.severity === 'critical' ? '#ef4444' :
              incident.severity === 'high' ? '#f97316' :
              incident.severity === 'medium' ? '#eab308' : '#22c55e'
            }
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {incident.title}
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '6px', padding: '4px', cursor: 'pointer',
              color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Description */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)' }}>
              Description
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {incident.description}
            </p>
          </div>

          {/* Meta grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <MetaItem icon={MapPin} label="Location" value={incident.location} />
            <MetaItem icon={Clock} label="Reported" value={formatDate(incident.reportedAt)} />
            <MetaItem icon={Clock} label="Last Updated" value={formatDate(incident.updatedAt)} />
            {ward && <MetaItem icon={MapPin} label="Ward" value={ward.name} />}
            {incident.assignedTo && (
              <MetaItem icon={User} label="Assigned To" value={incident.assignedTo} />
            )}
            {incident.responderCount !== undefined && (
              <MetaItem icon={User} label="Responders" value={`${incident.responderCount} personnel`} />
            )}
            {incident.estimatedResolution && (
              <MetaItem icon={Clock} label="Est. Resolution" value={formatDate(incident.estimatedResolution)} />
            )}
          </div>

          {/* Coordinates */}
          <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: '6px', display: 'flex', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Latitude</span>
              <p style={{ margin: '2px 0 0', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{incident.lat.toFixed(4)}</p>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Longitude</span>
              <p style={{ margin: '2px 0 0', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{incident.lng.toFixed(4)}</p>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>Incident ID</span>
              <p style={{ margin: '2px 0 0', fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{incident.id.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
        <Icon size={11} color="var(--text-muted)" />
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{value}</p>
    </div>
  );
}
