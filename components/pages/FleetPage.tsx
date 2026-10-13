'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { VEHICLES, ROUTES, WARDS } from '@/lib/mockData';
import { Card } from '@/components/ui/Card';
import { Truck, Battery, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import type { VehicleStatus } from '@/types';

const STATUS_COLORS: Record<VehicleStatus, { color: string; bg: string; label: string }> = {
  active:      { color: '#10b981', bg: 'rgba(16,185,129,.15)',  label: 'Active' },
  idle:        { color: '#60a5fa', bg: 'rgba(96,165,250,.15)',  label: 'Idle' },
  maintenance: { color: '#f59e0b', bg: 'rgba(245,158,11,.15)', label: 'Maintenance' },
  offline:     { color: '#6b7280', bg: 'rgba(107,114,128,.15)', label: 'Offline' },
};

function FuelBar({ level }: { level: number }) {
  const color = level < 25 ? '#ef4444' : level < 50 ? '#f59e0b' : '#10b981';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Battery size={12} color={color} />
      <div style={{ flex: 1, height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ width: `${level}%`, height: '100%', background: color, borderRadius: '2px' }} />
      </div>
      <span style={{ fontSize: '11px', color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{level}%</span>
    </div>
  );
}

export function FleetPage() {
  const { selectedWard } = useApp();

  const vehicles = useMemo(
    () => selectedWard === 'all' ? VEHICLES : VEHICLES.filter((v) => v.wardId === selectedWard),
    [selectedWard]
  );
  const routes = useMemo(
    () => selectedWard === 'all' ? ROUTES : ROUTES.filter((r) => r.wardId === selectedWard),
    [selectedWard]
  );

  const activeCount = vehicles.filter((v) => v.status === 'active').length;
  const totalCollected = vehicles.reduce((s, v) => s + v.wasteCollectedToday, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }} className="animate-fade-in">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Fleet',   value: vehicles.length,             color: 'var(--text-primary)', icon: Truck },
          { label: 'Active',        value: activeCount,                 color: '#10b981', icon: CheckCircle },
          { label: 'In Maintenance',value: vehicles.filter((v) => v.status === 'maintenance').length, color: '#f59e0b', icon: AlertCircle },
          { label: 'Waste Today',   value: `${totalCollected.toFixed(1)}t`, color: '#60a5fa', icon: Truck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>{item.label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 700, color: item.color }}>{item.value}</p>
                </div>
                <Icon size={20} color={item.color} style={{ opacity: 0.6 }} />
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>
        {/* Vehicles table */}
        <Card title="Fleet Status" subtitle="All collection vehicles">
          {vehicles.length === 0 ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', margin: 0 }}>No vehicles for selected ward.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Ward</th>
                    <th>Status</th>
                    <th>Collected</th>
                    <th>Fuel</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const s = STATUS_COLORS[v.status];
                    const ward = WARDS.find((w) => w.id === v.wardId);
                    return (
                      <tr key={v.id} style={{ cursor: 'default' }}>
                        <td>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{v.registrationNo}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{v.type}</div>
                          </div>
                        </td>
                        <td style={{ fontSize: '13px' }}>{v.driverName}</td>
                        <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ward?.name?.split(' – ')[1] ?? ward?.name}</td>
                        <td>
                          <span style={{
                            background: s.bg, color: s.color,
                            border: `1px solid ${s.color}44`, borderRadius: '4px',
                            padding: '2px 8px', fontSize: '11px', fontWeight: 700,
                          }}>{s.label}</span>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{v.wasteCollectedToday}t</td>
                        <td style={{ minWidth: '120px' }}><FuelBar level={v.fuelLevel} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Routes */}
        <Card title="Active Routes" subtitle="Collection route progress">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {routes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>No routes for selected ward.</p>
            ) : routes.map((route) => (
              <div key={route.id} style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{route.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      <MapPin size={10} style={{ display: 'inline', marginRight: '4px' }} />
                      {route.stops.length} stops · {route.distanceKm}km
                    </div>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: route.completionPercent >= 90 ? '#10b981' : route.completionPercent >= 50 ? '#f59e0b' : '#60a5fa' }}>
                    {route.completionPercent}%
                  </span>
                </div>
                <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${route.completionPercent}%`, height: '100%', borderRadius: '2px',
                    background: route.completionPercent >= 90 ? '#10b981' : route.completionPercent >= 50 ? '#f59e0b' : '#60a5fa',
                    transition: 'width .5s ease',
                  }} />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Scheduled: {route.scheduledTime}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
