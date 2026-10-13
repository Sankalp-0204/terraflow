'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, Zap } from 'lucide-react';
import { useApp } from '@/lib/context';
import { WARDS } from '@/lib/mockData';
import type { NavPage } from '@/types';

const PAGE_TITLES: Record<NavPage, string> = {
  'overview':       'Command Overview',
  'live-map':       'Live City Map',
  'fire-risk':      'Fire Risk Assessment',
  'air-quality':    'Air Quality Monitor',
  'compost-plants': 'Compost Plant Health',
  'fleet':          'Fleet & Routes',
  'incidents':      'Incident Management',
  'settings':       'System Settings',
};

function formatTimestamp(date: Date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

export function Header() {
  const { currentPage, selectedWard, setSelectedWard } = useApp();
  const [now, setNow] = useState<Date | null>(null);
  const [wardOpen, setWardOpen] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const selectedWardLabel = WARDS.find((w) => w.id === selectedWard)?.name ?? 'All Wards';

  return (
    <header
      style={{
        height: '56px', flexShrink: 0,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: '16px',
        zIndex: 10,
      }}
    >
      {/* Page title */}
      <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', flex: 1, margin: 0 }}>
        {PAGE_TITLES[currentPage]}
      </h1>

      {/* Demo mode badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'rgba(16,185,129,.1)', border: '1px solid rgba(16,185,129,.25)',
        borderRadius: '5px', padding: '4px 10px',
      }}>
        <Zap size={11} color="var(--emerald-400)" />
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--emerald-400)', letterSpacing: '.04em' }}>
          DEMO MODE
        </span>
      </div>

      {/* Ward filter */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setWardOpen((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: '6px', padding: '6px 12px',
            color: 'var(--text-primary)', cursor: 'pointer',
            fontSize: '13px', fontFamily: 'var(--font-sans)',
            transition: 'border-color .15s',
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Ward</span>
          <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px' }}>
            {selectedWardLabel}
          </span>
          <ChevronDown size={13} color="var(--text-muted)" />
        </button>

        {wardOpen && (
          <div
            style={{
              position: 'absolute', top: '100%', right: 0, marginTop: '4px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: '8px', minWidth: '220px',
              boxShadow: '0 8px 24px rgba(0,0,0,.5)',
              zIndex: 50,
              overflow: 'hidden',
              animation: 'fadeIn .15s ease both',
            }}
          >
            {WARDS.map((ward) => (
              <button
                key={ward.id}
                onClick={() => { setSelectedWard(ward.id); setWardOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '9px 14px', border: 'none',
                  background: selectedWard === ward.id ? 'rgba(16,185,129,.1)' : 'transparent',
                  color: selectedWard === ward.id ? 'var(--emerald-400)' : 'var(--text-primary)',
                  cursor: 'pointer', fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  transition: 'background .1s',
                }}
                onMouseEnter={(e) => {
                  if (selectedWard !== ward.id)
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-input)';
                }}
                onMouseLeave={(e) => {
                  if (selectedWard !== ward.id)
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {ward.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Last updated */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
        <RefreshCw size={12} />
        <span style={{ fontFamily: 'var(--font-mono)' }}>{now ? formatTimestamp(now) : '--:--:--'}</span>
      </div>
    </header>
  );
}
