'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context';
import {
  getKPIData, generatePollutionTrend, getRiskDistribution,
  WASTE_HOTSPOTS, INCIDENTS, COMPOST_PLANTS,
} from '@/lib/mockData';
import { KPICard } from '@/components/ui/KPICard';
import { Card } from '@/components/ui/Card';
import { CityMap } from '@/components/map/CityMap';
import { PollutionChart } from '@/components/charts/PollutionChart';
import { RiskDistributionChart } from '@/components/charts/RiskDistributionChart';
import { IncidentsTable } from '@/components/incidents/IncidentsTable';
import { IncidentDetail } from '@/components/incidents/IncidentDetail';
import { AlertPanel } from '@/components/alerts/AlertPanel';
import {
  MapPin, AlertTriangle, Wind, Flame, Truck,
} from 'lucide-react';

export function OverviewPage() {
  const { selectedWard, selectedIncidentId, setSelectedIncidentId } = useApp();

  const kpi = useMemo(() => getKPIData(selectedWard), [selectedWard]);
  const pollutionData = useMemo(() => generatePollutionTrend(selectedWard), [selectedWard]);
  const riskData = useMemo(() => getRiskDistribution(selectedWard), [selectedWard]);

  const filteredHotspots = useMemo(
    () => selectedWard === 'all' ? WASTE_HOTSPOTS : WASTE_HOTSPOTS.filter((h) => h.wardId === selectedWard),
    [selectedWard]
  );
  const filteredIncidents = useMemo(
    () => selectedWard === 'all' ? INCIDENTS : INCIDENTS.filter((i) => i.wardId === selectedWard),
    [selectedWard]
  );
  const selectedIncident = useMemo(
    () => selectedIncidentId ? INCIDENTS.find((i) => i.id === selectedIncidentId) ?? null : null,
    [selectedIncidentId]
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }} className="animate-fade-in">
      {/* KPI Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginBottom: '20px',
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
          value={`${kpi.activeVehicles}/${kpi.activeVehicles + (selectedWard === 'all' ? 2 : 0)}`}
          unit="vehicles"
          icon={Truck}
          accent="emerald"
          description={`${kpi.totalWasteToday}t collected`}
        />
      </div>

      {/* Alerts */}
      <div style={{ marginBottom: '20px' }}>
        <AlertPanel incidents={filteredIncidents} />
      </div>

      {/* Map + Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '16px' }}>
        {/* Map */}
        <Card title="Live Hotspot Map" subtitle="Waste accumulation & fire risk sites">
          <CityMap
            hotspots={filteredHotspots}
            plants={COMPOST_PLANTS.filter((p) => selectedWard === 'all' || p.wardId === selectedWard)}
            height="380px"
          />
        </Card>

        {/* Side charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card title="Risk Distribution" subtitle="Hotspots by severity level">
            <RiskDistributionChart data={riskData} height={160} />
          </Card>
          <Card style={{ padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {riskData.map((r) => (
                <div key={r.level} style={{
                  background: 'var(--bg-elevated)', borderRadius: '6px',
                  padding: '12px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: r.color, fontVariantNumeric: 'tabular-nums' }}>{r.count}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{r.level}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Pollution Trend */}
      <div style={{ marginBottom: '16px' }}>
        <Card title="Pollution Trends (24h)" subtitle="PM2.5 (µg/m³) and CO (ppm) — simulated sensor readings">
          <PollutionChart data={pollutionData} height={220} />
        </Card>
      </div>

      {/* Incidents Table */}
      <Card
        title="Recent Incidents"
        subtitle="Click a row to view details"
        action={
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {filteredIncidents.length} total
          </span>
        }
      >
        <IncidentsTable
          incidents={filteredIncidents}
          onRowClick={setSelectedIncidentId}
          limit={6}
        />
      </Card>

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
