'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { WASTE_HOTSPOTS } from '@/lib/mockData';
import { Card } from '@/components/ui/Card';
import { SeverityBadge } from '@/components/ui/Badges';
import { Flame, Thermometer, Wind, AlertTriangle } from 'lucide-react';

function FireRiskBar({ score }: { score: number }) {
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : score >= 25 ? '#eab308' : '#22c55e';
  return (
    <div style={{ width: '100%', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width .5s ease' }} />
    </div>
  );
}

export function FireRiskPage() {
  const { selectedWard } = useApp();
  const hotspots = useMemo(
    () => (selectedWard === 'all' ? WASTE_HOTSPOTS : WASTE_HOTSPOTS.filter((h) => h.wardId === selectedWard))
      .sort((a, b) => b.fireRiskScore - a.fireRiskScore),
    [selectedWard]
  );

  const criticalCount = hotspots.filter((h) => h.fireRiskScore >= 75).length;
  const highCount = hotspots.filter((h) => h.fireRiskScore >= 50 && h.fireRiskScore < 75).length;

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }} className="animate-fade-in">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <Card style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(239,68,68,.1)', borderRadius: '8px' }}>
              <Flame size={20} color="#ef4444" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Critical Fire Risk</p>
              <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 700, color: '#f87171' }}>{criticalCount}</p>
            </div>
          </div>
        </Card>
        <Card style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(249,115,22,.1)', borderRadius: '8px' }}>
              <AlertTriangle size={20} color="#f97316" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>High Fire Risk</p>
              <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 700, color: '#fb923c' }}>{highCount}</p>
            </div>
          </div>
        </Card>
        <Card style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(16,185,129,.1)', borderRadius: '8px' }}>
              <Wind size={20} color="#10b981" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Total Sites Monitored</p>
              <p style={{ margin: '4px 0 0', fontSize: '26px', fontWeight: 700, color: '#34d399' }}>{hotspots.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fire risk table */}
      <Card title="Fire Risk Assessment" subtitle="Hotspots ranked by fire risk score (highest first)">
        {hotspots.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No data for selected ward.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {hotspots.map((hs, idx) => {
              const color = hs.fireRiskScore >= 75 ? '#ef4444' : hs.fireRiskScore >= 50 ? '#f97316' : hs.fireRiskScore >= 25 ? '#eab308' : '#22c55e';
              return (
                <div
                  key={hs.id}
                  style={{
                    padding: '16px', borderBottom: idx < hotspots.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    display: 'grid', gridTemplateColumns: '32px 1fr 120px 80px 120px',
                    alignItems: 'center', gap: '12px',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{hs.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {hs.wasteVolume}m³ waste · {hs.daysSinceCollection}d uncollected
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fire Risk</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color, fontFamily: 'var(--font-mono)' }}>{hs.fireRiskScore}</span>
                    </div>
                    <FireRiskBar score={hs.fireRiskScore} />
                  </div>
                  <SeverityBadge severity={hs.severity} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <Thermometer size={12} color={hs.daysSinceCollection > 7 ? '#ef4444' : '#8b949e'} />
                    {hs.daysSinceCollection > 7 ? (
                      <span style={{ color: '#f87171', fontWeight: 600 }}>Urgent collection</span>
                    ) : (
                      <span>Schedule soon</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
