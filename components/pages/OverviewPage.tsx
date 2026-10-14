'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context';
import {
  getKPIData, generatePollutionTrend, getRiskDistribution,
  WASTE_HOTSPOTS, INCIDENTS, COMPOST_PLANTS, VEHICLES,
} from '@/lib/mockData';
import { KPICard } from '@/components/ui/KPICard';
import { CityMap } from '@/components/map/CityMap';
import { PollutionChart } from '@/components/charts/PollutionChart';
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { AlertPanel } from '@/components/alerts/AlertPanel';
import {
  MapPin, AlertTriangle, Wind, Flame, Truck,
  ArrowRight, Circle,
} from 'lucide-react';
import { SeverityBadge, StatusBadge } from '@/components/ui/Badges';

// ─── Small section card ───────────────────────────────────────────────────────
function SectionCard({
  title,
  action,
  children,
  style,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '11px 14px',
        borderBottom: '1px solid var(--border)',
      }}>
        <span className="section-title">{title}</span>
        {action}
      </div>
      <div style={{ padding: '12px 14px' }}>
        {children}
      </div>
    </div>
  );
}

// ─── Mini incident row ────────────────────────────────────────────────────────
function IncidentRow({ incident, onOpen }: { incident: (typeof INCIDENTS)[0]; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '8px',
        padding: '7px 0',
        borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        transition: 'opacity .12s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '0.8'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = '1'; }}
    >
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%', marginTop: '4px',
        background: incident.severity === 'critical' ? '#EF4444'
          : incident.severity === 'high' ? '#F97316'
          : incident.severity === 'medium' ? '#F59E0B' : '#22C55E',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: '12px', fontWeight: 500,
          color: 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {incident.title}
        </p>
        <p style={{ margin: '1px 0 0', fontSize: '10px', color: 'var(--text-muted)' }}>
          {incident.location}
        </p>
      </div>
      <div style={{ flexShrink: 0 }}>
        <StatusBadge status={incident.status} />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function OverviewPage() {
  const { selectedWard, selectedIncidentId, setSelectedIncidentId, setCurrentPage } = useApp();

  const kpi           = useMemo(() => getKPIData(selectedWard), [selectedWard]);
  const pollutionData = useMemo(() => generatePollutionTrend(selectedWard), [selectedWard]);
  const riskData      = useMemo(() => getRiskDistribution(selectedWard), [selectedWard]);

  const filteredHotspots = useMemo(
    () => selectedWard === 'all' ? WASTE_HOTSPOTS : WASTE_HOTSPOTS.filter((h) => h.wardId === selectedWard),
    [selectedWard]
  );
  const filteredIncidents = useMemo(
    () => selectedWard === 'all' ? INCIDENTS : INCIDENTS.filter((i) => i.wardId === selectedWard),
    [selectedWard]
  );
  const filteredPlants = useMemo(
    () => selectedWard === 'all' ? COMPOST_PLANTS : COMPOST_PLANTS.filter((p) => p.wardId === selectedWard),
    [selectedWard]
  );
  const filteredVehicles = useMemo(
    () => selectedWard === 'all' ? VEHICLES : VEHICLES.filter((v) => v.wardId === selectedWard),
    [selectedWard]
  );

  const selectedIncident = useMemo(
    () => selectedIncidentId ? INCIDENTS.find((i) => i.id === selectedIncidentId) ?? null : null,
    [selectedIncidentId]
  );

  const recentIncidents = useMemo(
    () => [...filteredIncidents].sort((a, b) =>
      new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    ).slice(0, 5),
    [filteredIncidents]
  );

  const activeVehicles  = filteredVehicles.filter((v) => v.status === 'active').length;
  const totalWaste      = filteredVehicles.reduce((s, v) => s + v.wasteCollectedToday, 0);
  const fleetPct        = filteredVehicles.length > 0
    ? Math.round((activeVehicles / filteredVehicles.length) * 100)
    : 0;

  return (
    <div style={{ padding: '16px', maxWidth: '1440px', margin: '0 auto' }} className="animate-fade-in">

      {/* ── KPI Row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        marginBottom: '14px',
      }}>
        <KPICard
          label="Waste Hotspots"
          value={kpi.wasteHotspots}
          icon={MapPin}
          accent="default"
          description="Active accumulation sites"
        />
        <KPICard
          label="High-Risk Zones"
          value={kpi.highRiskZones}
          icon={Flame}
          accent={kpi.highRiskZones > 2 ? 'red' : 'amber'}
          description="Critical + high severity"
        />
        <KPICard
          label="Avg PM2.5"
          value={kpi.avgPm25}
          unit="µg/m³"
          icon={Wind}
          accent={kpi.avgPm25 > 100 ? 'red' : kpi.avgPm25 > 60 ? 'amber' : 'emerald'}
          description={kpi.avgPm25 > 100 ? 'Hazardous' : kpi.avgPm25 > 60 ? 'Unhealthy' : 'Moderate'}
        />
        <KPICard
          label="Active Incidents"
          value={kpi.activeIncidents}
          icon={AlertTriangle}
          accent={kpi.activeIncidents > 4 ? 'red' : kpi.activeIncidents > 2 ? 'amber' : 'emerald'}
          description={`${kpi.resolvedToday} resolved today`}
        />
        <KPICard
          label="Fleet Active"
          value={`${kpi.activeVehicles}/6`}
          unit="vehicles"
          icon={Truck}
          accent="emerald"
          description={`${totalWaste.toFixed(1)}t collected`}
        />
      </div>

      {/* ── Compact alerts ── */}
      <div style={{ marginBottom: '14px' }}>
        <AlertPanel incidents={filteredIncidents} />
      </div>

      {/* ── Two-column main grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '12px',
        alignItems: 'start',
      }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>

          {/* Live Hotspot Map */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <span className="section-title">Live Hotspot Map</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  Waste accumulation &amp; fire risk sites · Delhi NCR
                </span>
              </div>
              <button
                onClick={() => setCurrentPage('live-map')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', fontSize: '11px',
                  cursor: 'pointer', transition: 'color .12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--emerald-400)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
              >
                Full map <ArrowRight size={11} />
              </button>
            </div>
            <CityMap
              hotspots={filteredHotspots}
              plants={filteredPlants}
              height="360px"
            />
          </div>

          {/* Air Quality Trends */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '11px 14px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <span className="section-title">Air Quality Trends</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                  PM2.5 (µg/m³) &amp; CO (ppm) — 24-hour simulated readings
                </span>
              </div>
              <button
                onClick={() => setCurrentPage('air-quality')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', fontSize: '11px',
                  cursor: 'pointer', transition: 'color .12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--emerald-400)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
              >
                Full report <ArrowRight size={11} />
              </button>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <PollutionChart data={pollutionData} height={200} />
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Risk Distribution */}
          <SectionCard title="Risk Distribution" action={
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {filteredHotspots.length} sites
            </span>
          }>
            <RiskDistributionChart data={riskData} height={130} />
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '6px', marginTop: '10px',
            }}>
              {riskData.map((r) => (
                <div key={r.level} style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: '5px',
                  padding: '8px 10px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <Circle size={8} fill={r.color} color={r.color} style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: r.color, lineHeight: 1 }}>
                      {r.count}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {r.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Recent Incidents */}
          <SectionCard
            title="Recent Incidents"
            action={
              <button
                onClick={() => setCurrentPage('incidents')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', fontSize: '11px',
                  cursor: 'pointer', transition: 'color .12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
              >
                All <ArrowRight size={11} />
              </button>
            }
          >
            <div>
              {recentIncidents.length === 0 ? (
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
                  No incidents for this ward
                </p>
              ) : (
                recentIncidents.map((inc, idx) => (
                  <div key={inc.id} style={{ borderBottom: idx < recentIncidents.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <IncidentRow
                      incident={inc}
                      onOpen={() => setSelectedIncidentId(inc.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          {/* Fleet Status */}
          <SectionCard
            title="Fleet Status"
            action={
              <button
                onClick={() => setCurrentPage('fleet')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', fontSize: '11px',
                  cursor: 'pointer', transition: 'color .12s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
              >
                Manage <ArrowRight size={11} />
              </button>
            }
          >
            {/* Fleet summary */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <div>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--emerald-400)' }}>
                  {activeVehicles}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                  / {filteredVehicles.length} active
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {totalWaste.toFixed(1)} t today
              </span>
            </div>

            {/* Overall progress bar */}
            <div style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fleet utilisation</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>{fleetPct}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  background: fleetPct > 80 ? 'var(--emerald-500)' : fleetPct > 50 ? 'var(--amber-500)' : 'var(--red-500)',
                  width: `${fleetPct}%`,
                  transition: 'width .4s ease',
                }} />
              </div>
            </div>

            {/* Per-vehicle rows */}
            {filteredVehicles.slice(0, 4).map((v) => (
              <div key={v.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 0',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {v.registrationNo}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '5px' }}>
                    {v.type}
                  </span>
                </div>
                <span style={{
                  fontSize: '10px', fontWeight: 600,
                  color: v.status === 'active' ? 'var(--emerald-400)'
                    : v.status === 'idle' ? 'var(--amber-400)'
                    : 'var(--red-400)',
                }}>
                  {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                </span>
              </div>
            ))}
            {filteredVehicles.length > 4 && (
              <p style={{ margin: '6px 0 0', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                +{filteredVehicles.length - 4} more vehicles
              </p>
            )}
          </SectionCard>
        </div>
      </div>

      {/* Incident detail modal */}
      {selectedIncident && (
        <IncidentDetail
          incident={selectedIncident}
          onClose={() => setSelectedIncidentId(null)}
        />
      )}
    </div>
  );
}
