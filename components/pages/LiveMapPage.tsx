'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '@/lib/context';
import { WASTE_HOTSPOTS, COMPOST_PLANTS } from '@/lib/mockData';
import { CityMap } from '@/components/map/CityMap';
import { SeverityBadge } from '@/components/ui/Badges';
import { MapPin, Flame } from 'lucide-react';
import type { WasteHotspot } from '@/types';

export function LiveMapPage() {
  const { selectedWard } = useApp();
  const [selectedHotspot, setSelectedHotspot] = useState<WasteHotspot | null>(null);

  const filteredHotspots = useMemo(
    () => selectedWard === 'all' ? WASTE_HOTSPOTS : WASTE_HOTSPOTS.filter((h) => h.wardId === selectedWard),
    [selectedWard]
  );
  const filteredPlants = useMemo(
    () => selectedWard === 'all' ? COMPOST_PLANTS : COMPOST_PLANTS.filter((p) => p.wardId === selectedWard),
    [selectedWard]
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }} className="animate-fade-in">
      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <CityMap
          hotspots={filteredHotspots}
          plants={filteredPlants}
          height="100%"
          zoom={12}
          onHotspotClick={setSelectedHotspot}
        />
      </div>

      {/* Side panel */}
      <div style={{
        width: '280px', flexShrink: 0,
        background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)' }}>
            Hotspots
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{filteredHotspots.length} sites</p>
        </div>
        <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredHotspots.map((hs) => (
            <div
              key={hs.id}
              onClick={() => setSelectedHotspot(hs)}
              style={{
                padding: '12px', borderRadius: '6px',
                background: selectedHotspot?.id === hs.id ? 'var(--bg-elevated)' : 'transparent',
                border: `1px solid ${selectedHotspot?.id === hs.id ? 'var(--border)' : 'transparent'}`,
                cursor: 'pointer', transition: 'background .15s',
              }}
              onMouseEnter={(e) => {
                if (selectedHotspot?.id !== hs.id)
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                if (selectedHotspot?.id !== hs.id)
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{hs.label}</span>
                <SeverityBadge severity={hs.severity} />
              </div>
              <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={10} /> {hs.wasteVolume}m³
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Flame size={10} color={hs.fireRiskScore > 70 ? '#ef4444' : hs.fireRiskScore > 40 ? '#f97316' : '#8b949e'} />
                  Fire: {hs.fireRiskScore}/100
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Compost plants */}
        <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)' }}>
            Compost Plants ({filteredPlants.length})
          </h3>
          {filteredPlants.map((p) => {
            const colors = { optimal: '#10b981', warning: '#f59e0b', critical: '#ef4444', offline: '#6b7280' };
            const color = colors[p.status];
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{Math.round((p.currentLoad / p.capacity) * 100)}% capacity</div>
                </div>
                <span style={{ fontSize: '10px', color, fontWeight: 600, textTransform: 'capitalize' }}>{p.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
