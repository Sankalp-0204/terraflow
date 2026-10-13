import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  accent?: 'emerald' | 'red' | 'amber' | 'blue' | 'default';
  description?: string;
}

const ACCENT_COLORS = {
  emerald: { bg: 'rgba(16,185,129,.08)', icon: 'rgba(16,185,129,.15)', iconColor: '#10b981', value: '#34d399' },
  red:     { bg: 'rgba(239,68,68,.08)',  icon: 'rgba(239,68,68,.15)',  iconColor: '#ef4444', value: '#f87171' },
  amber:   { bg: 'rgba(245,158,11,.08)', icon: 'rgba(245,158,11,.15)', iconColor: '#f59e0b', value: '#fbbf24' },
  blue:    { bg: 'rgba(96,165,250,.08)', icon: 'rgba(96,165,250,.15)', iconColor: '#60a5fa', value: '#93c5fd' },
  default: { bg: 'transparent',          icon: 'var(--bg-elevated)',   iconColor: 'var(--text-muted)', value: 'var(--text-primary)' },
};

export function KPICard({ label, value, unit, icon: Icon, trendValue, accent = 'default', description }: KPICardProps) {
  const colors = ACCENT_COLORS[accent];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'border-color .2s',
      }}
    >
      {/* Top accent line */}
      {accent !== 'default' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: colors.iconColor,
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>
          {label}
        </span>
        <div style={{
          width: '32px', height: '32px', borderRadius: '7px',
          background: colors.icon,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={16} color={colors.iconColor} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '28px', fontWeight: 700, color: colors.value, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>
        )}
      </div>

      {(description || trendValue) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {description && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{description}</span>
          )}
          {trendValue && (
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
