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

const ACCENT = {
  emerald: { border: 'rgba(16,185,129,.25)',  top: '#10B981', icon: 'rgba(16,185,129,.12)', iconColor: '#10B981', value: '#34D399' },
  red:     { border: 'rgba(239,68,68,.25)',   top: '#EF4444', icon: 'rgba(239,68,68,.12)',  iconColor: '#EF4444', value: '#F87171' },
  amber:   { border: 'rgba(245,158,11,.25)',  top: '#F59E0B', icon: 'rgba(245,158,11,.12)', iconColor: '#F59E0B', value: '#FBBF24' },
  blue:    { border: 'rgba(96,165,250,.25)',  top: '#60A5FA', icon: 'rgba(96,165,250,.12)', iconColor: '#60A5FA', value: '#93C5FD' },
  default: { border: 'var(--border)',         top: 'transparent', icon: 'var(--bg-elevated)', iconColor: 'var(--text-muted)', value: 'var(--text-primary)' },
};

export function KPICard({ label, value, unit, icon: Icon, trendValue, accent = 'default', description }: KPICardProps) {
  const c = ACCENT[accent];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid ${c.border}`,
      borderRadius: '8px',
      padding: '14px 16px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      {/* Top accent line */}
      {accent !== 'default' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: c.top,
        }} />
      )}

      {/* Label + icon row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '.07em',
          color: 'var(--text-muted)',
        }}>
          {label}
        </span>
        <div style={{
          width: '28px', height: '28px', borderRadius: '6px',
          background: c.icon,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={14} color={c.iconColor} />
        </div>
      </div>

      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{
          fontSize: '24px', fontWeight: 700,
          color: c.value, lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{unit}</span>
        )}
      </div>

      {/* Description / trend */}
      {(description || trendValue) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {description && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{description}</span>
          )}
          {trendValue && (
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{trendValue}</span>
          )}
        </div>
      )}
    </div>
  );
}
