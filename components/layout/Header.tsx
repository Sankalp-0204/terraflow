'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, Zap, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/context';
import { WARDS } from '@/lib/mockData';
import type { NavPage } from '@/types';

const PAGE_TITLES: Record<NavPage, { title: string; section: string }> = {
  'overview':       { title: 'Command Center',     section: 'Overview' },
  'live-map':       { title: 'Live Map',            section: 'Monitoring' },
  'fire-risk':      { title: 'Fire Risk',           section: 'Monitoring' },
  'air-quality':    { title: 'Air Quality',         section: 'Monitoring' },
  'compost-plants': { title: 'Compost Plants',      section: 'Monitoring' },
  'fleet':          { title: 'Fleet & Routes',      section: 'Operations' },
  'incidents':      { title: 'Incidents',           section: 'Operations' },
  'settings':       { title: 'Settings',            section: 'System' },
};

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

export function Header() {
  const { currentPage, selectedWard, setSelectedWard } = useApp();
  const [now, setNow] = useState<Date | null>(null);
  const [wardOpen, setWardOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const meta = PAGE_TITLES[currentPage];
  const selectedWardLabel = WARDS.find((w) => w.id === selectedWard)?.name ?? 'All Wards';
  const shortWardLabel = selectedWard === 'all'
    ? 'All Wards'
    : (WARDS.find((w) => w.id === selectedWard)?.name.replace(/Ward \d+ – /, '') ?? 'All Wards');

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }

  return (
    <header
      style={{
        height: 'var(--header-h)',
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '12px',
        zIndex: 10,
      }}
    >
      {/* Breadcrumb + title */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {meta.section}
        </span>
        <ChevronRight size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        <h1 style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {meta.title}
        </h1>
      </div>

      {/* Demo mode badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '5px',
        background: 'rgba(16,185,129,.08)',
        border: '1px solid rgba(16,185,129,.22)',
        borderRadius: '4px',
        padding: '3px 8px',
        flexShrink: 0,
      }}>
        <Zap size={10} color="var(--emerald-500)" />
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--emerald-500)', letterSpacing: '.05em' }}>
          DEMO
        </span>
      </div>

      {/* Ward filter */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          id="ward-filter-btn"
          onClick={() => setWardOpen((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            background: 'var(--bg-elevated)',
            border: `1px solid ${wardOpen ? 'var(--emerald-500)' : 'var(--border)'}`,
            borderRadius: '5px',
            padding: '4px 10px',
            color: 'var(--text-primary)', cursor: 'pointer',
            fontSize: '12px', fontFamily: 'var(--font-sans)',
            transition: 'border-color .15s',
          }}
        >
          <span style={{ color: 'var(--text-muted)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            Ward
          </span>
          <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {shortWardLabel}
          </span>
          <ChevronDown
            size={12}
            color="var(--text-muted)"
            style={{ transform: wardOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}
          />
        </button>

        {wardOpen && (
          <>
            {/* Click-away overlay */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
              onClick={() => setWardOpen(false)}
            />
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              minWidth: '200px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 50,
              overflow: 'hidden',
              animation: 'fadeIn .15s ease both',
            }}>
              {WARDS.map((ward) => (
                <button
                  key={ward.id}
                  onClick={() => { setSelectedWard(ward.id); setWardOpen(false); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', border: 'none',
                    background: selectedWard === ward.id ? 'rgba(16,185,129,.08)' : 'transparent',
                    color: selectedWard === ward.id ? 'var(--emerald-400)' : 'var(--text-primary)',
                    cursor: 'pointer', fontSize: '12px',
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
          </>
        )}
      </div>

      {/* Last updated + refresh */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        color: 'var(--text-muted)', fontSize: '11px', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          {now ? formatTime(now) : '--:--:--'}
        </span>
        <button
          onClick={handleRefresh}
          title="Refresh data"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '26px', height: '26px',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: '5px', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'background .12s, color .12s',
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
          <RefreshCw
            size={12}
            style={{ transition: 'transform .6s', transform: refreshing ? 'rotate(360deg)' : 'none' }}
          />
        </button>
      </div>
    </header>
  );
}
