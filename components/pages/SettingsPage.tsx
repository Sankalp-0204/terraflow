'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Settings, Bell, Database, Shield, Info } from 'lucide-react';

export function SettingsPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '720px', margin: '0 auto' }} className="animate-fade-in">
      <Card title="System Settings" subtitle="TerraFlow configuration and preferences" style={{ marginBottom: '16px' }}>
        <div style={{
          padding: '14px 16px', background: 'rgba(16,185,129,.06)', border: '1px solid rgba(16,185,129,.2)',
          borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px',
        }}>
          <Info size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '1px' }} />
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This is a <strong style={{ color: 'var(--text-primary)' }}>hackathon demo</strong>. All data is simulated.
            Settings changes are not persisted to a backend. This panel demonstrates the intended UI for system configuration.
          </p>
        </div>

        <Section title="General" icon={Settings}>
          <SettingRow label="Dashboard refresh interval" description="How often KPIs auto-refresh" value="30 seconds" />
          <SettingRow label="City / Municipality" description="Primary coverage area" value="Hyderabad, Telangana" />
          <SettingRow label="Timezone" description="Local timezone for timestamps" value="IST (UTC+5:30)" />
        </Section>

        <Section title="Alerts & Notifications" icon={Bell}>
          <ToggleRow label="Critical incident alerts" description="Immediate notification for critical events" enabled={true} />
          <ToggleRow label="PM2.5 threshold alerts" description="Alert when PM2.5 exceeds 100 µg/m³" enabled={true} />
          <ToggleRow label="Compost plant warnings" description="Alert when capacity exceeds 90%" enabled={true} />
          <ToggleRow label="Daily collection reports" description="Email digest of daily collection data" enabled={false} />
        </Section>

        <Section title="Data Sources" icon={Database}>
          <SettingRow label="Air quality sensors" description="Monitoring station network" value="TSPCB Network (simulated)" />
          <SettingRow label="Waste hotspot detection" description="Accumulation detection algorithm" value="Volume + Age scoring (simulated)" />
          <SettingRow label="Fleet GPS provider" description="Vehicle tracking integration" value="Demo mode – no live GPS" />
        </Section>

        <Section title="Access & Security" icon={Shield}>
          <SettingRow label="Access level" description="Current user role" value="Administrator" />
          <SettingRow label="Audit logging" description="Record all user actions" value="Enabled" />
        </Section>
      </Card>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Icon size={14} color="var(--text-muted)" />
        <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)' }}>
          {title}
        </h3>
      </div>
      <div style={{ border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, description, value }: { label: string; description: string; value: string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>
      </div>
      <span style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border)', flexShrink: 0, marginLeft: '16px' }}>
        {value}
      </span>
    </div>
  );
}

function ToggleRow({ label, description, enabled }: { label: string; description: string; enabled: boolean }) {
  const [on, setOn] = React.useState(enabled);
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        style={{
          width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
          background: on ? 'var(--emerald-500)' : 'var(--bg-elevated)',
          position: 'relative', transition: 'background .25s',
          flexShrink: 0, marginLeft: '16px',
          outline: 'none',
          boxShadow: on ? '0 0 0 1px rgba(16,185,129,.5)' : '0 0 0 1px var(--border)',
        }}
        aria-label={`${label} ${on ? 'enabled' : 'disabled'}`}
      >
        <div style={{
          width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '3px',
          left: on ? '21px' : '3px',
          transition: 'left .25s',
        }} />
      </button>
    </div>
  );
}
