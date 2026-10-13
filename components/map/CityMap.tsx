'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import type { WasteHotspot, CompostPlant } from '@/types';

interface CityMapProps {
  hotspots: WasteHotspot[];
  plants?: CompostPlant[];
  height?: string;
  zoom?: number;
  center?: [number, number];
  onHotspotClick?: (hotspot: WasteHotspot) => void;
}

const RISK_COLORS: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
};

export function CityMap({
  hotspots,
  plants = [],
  height = '400px',
  zoom = 12,
  center = [28.6139, 77.2090],
  onHotspotClick,
}: CityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null);
  const markersRef = useRef<unknown[]>([]);
  const hotspotsRef = useRef(hotspots);
  const plantsRef = useRef(plants);
  const onClickRef = useRef(onHotspotClick);

  hotspotsRef.current = hotspots;
  plantsRef.current = plants;
  onClickRef.current = onHotspotClick;

  const addMarkers = useCallback((L: typeof import('leaflet'), map: ReturnType<typeof import('leaflet')['map']>) => {
    // Clear old markers
    markersRef.current.forEach((m: unknown) => {
      (m as ReturnType<typeof L.marker>).remove();
    });
    markersRef.current = [];

    // Add hotspot markers
    hotspotsRef.current.forEach((hs) => {
      const color = RISK_COLORS[hs.severity] ?? '#22c55e';
      const size = hs.severity === 'critical' ? 20 : hs.severity === 'high' ? 16 : 13;

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:${size}px;
            height:${size}px;
            background:${color};
            border-radius:50%;
            border:2px solid rgba(255,255,255,.3);
            box-shadow:0 0 0 ${hs.severity === 'critical' ? '6' : '4'}px ${color}44;
            cursor:pointer;
            position:relative;
            ${hs.severity === 'critical' ? `animation:pulse-ring 2s infinite;` : ''}
          "></div>`,
        iconSize: [size + 4, size + 4],
        iconAnchor: [(size + 4) / 2, (size + 4) / 2],
      });

      const marker = L.marker([hs.lat, hs.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:180px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px;color:#e6edf3">${hs.label}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:11px;color:#8b949e;">
            <span>Risk Level</span><span style="color:${color};font-weight:600;text-transform:uppercase">${hs.severity}</span>
            <span>Volume</span><span style="color:#e6edf3">${hs.wasteVolume} m³</span>
            <span>Days Uncollected</span><span style="color:#e6edf3">${hs.daysSinceCollection}d</span>
            <span>Fire Risk Score</span><span style="color:${color};font-weight:600">${hs.fireRiskScore}/100</span>
          </div>
        </div>
      `);
      if (onClickRef.current) {
        const hsRef = hs;
        marker.on('click', () => onClickRef.current?.(hsRef));
      }
      markersRef.current.push(marker);
    });

    // Add compost plant markers
    plantsRef.current.forEach((plant) => {
      const plantColor = {
        optimal: '#10b981', warning: '#f59e0b', critical: '#ef4444', offline: '#6b7280',
      }[plant.status] ?? '#10b981';

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:14px;height:14px;
          background:${plantColor};
          border-radius:3px;
          border:2px solid rgba(255,255,255,.25);
          box-shadow:0 0 0 3px ${plantColor}33;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([plant.lat, plant.lng], { icon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:180px;">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px;color:#e6edf3">🌿 ${plant.name}</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;font-size:11px;color:#8b949e;">
            <span>Status</span><span style="color:${plantColor};font-weight:600;text-transform:capitalize">${plant.status}</span>
            <span>Load</span><span style="color:#e6edf3">${plant.currentLoad}/${plant.capacity} t/d</span>
            <span>Methane</span><span style="color:${plant.methaneLevel > 350 ? '#f87171' : '#8b949e'}">${plant.methaneLevel} ppm</span>
            <span>Efficiency</span><span style="color:#e6edf3">${plant.efficiency}%</span>
          </div>
        </div>
      `);
      markersRef.current.push(marker);
    });
  }, []);

  // Initialize map once
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    import('leaflet').then((L) => {
      if (mapRef.current) return;

      const map = L.map(containerRef.current!, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: false,
      });

      // Use OSM tiles with dark filter applied inline
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Apply dark filter directly to the tile pane element
      const tilePane = map.getPane('tilePane');
      if (tilePane) {
        tilePane.style.filter = 'brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7)';
      }

      mapRef.current = map;
      addMarkers(L, map);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((L) => {
      if (!mapRef.current) return;
      addMarkers(L, mapRef.current);
    });
  }, [hotspots, plants, addMarkers]);

  return (
    <div style={{ position: 'relative', height, width: '100%', borderRadius: '6px', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '12px', left: '12px',
        background: 'rgba(13,17,23,.92)', border: '1px solid var(--border)',
        borderRadius: '6px', padding: '10px 12px',
        display: 'flex', flexDirection: 'column', gap: '6px',
        zIndex: 1000,
      }}>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '2px' }}>
          Legend
        </span>
        {Object.entries(RISK_COLORS).map(([level, color]) => (
          <div key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{level} Risk</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '2px', paddingTop: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#10b981', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Compost Plant</span>
        </div>
      </div>
    </div>
  );
}
