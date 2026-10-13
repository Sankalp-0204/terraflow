'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { COMPOST_PLANTS } from '@/lib/mockData';
import { Card } from '@/components/ui/Card';
import { Leaf, Thermometer, Wind, AlertTriangle, CheckCircle } from 'lucide-react';

function CapacityBar({ current, capacity, color }: { current: number; capacity: number; color: string }) {
  const pct = Math.min((current / capacity) * 100, 100);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <span>{current} t/d</span>
        <span>{capacity} t/d max</span>
      </div>
      <div style={{ height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px', transition: 'width .5s ease' }} />
      </div>
      <div style={{ textAlign: 'right', fontSize: '10px', color, fontWeight: 600, marginTop: '2px' }}>{pct.toFixed(0)}%</div>
    </div>
  );
}

export function CompostPlantsPage() {
  const { selectedWard } = useApp();

  const plants = useMemo(
    () => selectedWard === 'all' ? COMPOST_PLANTS : COMPOST_PLANTS.filter((p) => p.wardId === selectedWard),
    [selectedWard]
  );

  const STATUS_COLOR: Record<string, string> = {
    optimal: '#10b981', warning: '#f59e0b', critical: '#ef4444', offline: '#6b7280',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }} className="animate-fade-in">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Plants', value: plants.length, icon: Leaf, color: '#10b981', bg: 'rgba(16,185,129,.1)' },
          { label: 'Optimal',  value: plants.filter((p) => p.status === 'optimal').length,  icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,.1)' },
          { label: 'Warning',  value: plants.filter((p) => p.status === 'warning').length,  icon: AlertTriangle, color: '#f59e0b', bg: 'rgba(245,158,11,.1)' },
          { label: 'Critical', value: plants.filter((p) => p.status === 'critical').length, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,.1)' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '8px', background: item.bg, borderRadius: '8px', flexShrink: 0 }}>
                  <Icon size={18} color={item.color} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '24px', fontWeight: 700, color: item.color }}>{item.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Plant cards */}
      {plants.length === 0 ? (
        <Card><p style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>No compost plants for selected ward.</p></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {plants.map((plant) => {
            const statusColor = STATUS_COLOR[plant.status];
            const capColor = plant.currentLoad / plant.capacity > 0.9 ? '#ef4444' : plant.currentLoad / plant.capacity > 0.75 ? '#f59e0b' : '#10b981';
            return (
              <Card key={plant.id} style={{ padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{plant.name}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>Last inspected: {plant.lastInspection}</p>
                  </div>
                  <span style={{
                    background: `${statusColor}22`, color: statusColor,
                    border: `1px solid ${statusColor}44`, borderRadius: '4px',
                    padding: '3px 10px', fontSize: '11px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '.04em',
                  }}>
                    {plant.status}
                  </span>
                </div>

                {/* Capacity */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)' }}>Capacity Load</p>
                  <CapacityBar current={plant.currentLoad} capacity={plant.capacity} color={capColor} />
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <Stat icon={Thermometer} label="Temp" value={`${plant.temperature}°C`} alert={plant.temperature > 65} />
                  <Stat icon={Wind} label="Methane" value={`${plant.methaneLevel} ppm`} alert={plant.methaneLevel > 350} />
                  <Stat icon={Leaf} label="Efficiency" value={`${plant.efficiency}%`} alert={plant.efficiency < 70} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, alert }: { icon: React.ElementType; label: string; value: string; alert: boolean }) {
  return (
    <div style={{ background: 'var(--bg-elevated)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
      <Icon size={14} color={alert ? '#ef4444' : 'var(--text-muted)'} style={{ margin: '0 auto 4px', display: 'block' }} />
      <div style={{ fontSize: '13px', fontWeight: 700, color: alert ? '#f87171' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  );
}
