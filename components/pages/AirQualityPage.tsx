'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context';
import { AIR_QUALITY_READINGS, generatePollutionTrend, WARDS } from '@/lib/mockData';
import { Card } from '@/components/ui/Card';
import { PollutionChart } from '@/components/charts/PollutionChart';
import { Wind, Activity } from 'lucide-react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

function AQIGauge({ aqi }: { aqi: number }) {
  const color = aqi > 200 ? '#ef4444' : aqi > 150 ? '#f97316' : aqi > 100 ? '#eab308' : aqi > 50 ? '#22c55e' : '#10b981';
  const label = aqi > 200 ? 'Hazardous' : aqi > 150 ? 'Very Unhealthy' : aqi > 100 ? 'Unhealthy' : aqi > 50 ? 'Moderate' : 'Good';
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{aqi}</div>
      <div style={{ fontSize: '13px', color, fontWeight: 600, marginTop: '4px' }}>{label}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>AQI Index</div>
    </div>
  );
}

export function AirQualityPage() {
  const { selectedWard } = useApp();

  const readings = useMemo(
    () => selectedWard === 'all' ? AIR_QUALITY_READINGS : AIR_QUALITY_READINGS.filter((r) => r.wardId === selectedWard),
    [selectedWard]
  );

  const avgReading = useMemo(() => {
    if (readings.length === 0) return null;
    return {
      pm25: +(readings.reduce((s, r) => s + r.pm25, 0) / readings.length).toFixed(1),
      pm10: +(readings.reduce((s, r) => s + r.pm10, 0) / readings.length).toFixed(1),
      co:   +(readings.reduce((s, r) => s + r.co, 0)  / readings.length).toFixed(2),
      no2:  +(readings.reduce((s, r) => s + r.no2, 0)  / readings.length).toFixed(1),
      aqi:  Math.round(readings.reduce((s, r) => s + r.aqi, 0) / readings.length),
    };
  }, [readings]);

  const pollutionData = useMemo(() => generatePollutionTrend(selectedWard), [selectedWard]);

  const radarData = useMemo(() => {
    if (!avgReading) return [];
    return [
      { subject: 'PM2.5', value: Math.min((avgReading.pm25 / 150) * 100, 100) },
      { subject: 'PM10',  value: Math.min((avgReading.pm10 / 250) * 100, 100) },
      { subject: 'CO',    value: Math.min((avgReading.co / 9) * 100, 100) },
      { subject: 'NO2',   value: Math.min((avgReading.no2 / 100) * 100, 100) },
    ];
  }, [avgReading]);

  if (!avgReading) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No air quality data for selected ward.</div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }} className="animate-fade-in">
      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 280px', gap: '16px', marginBottom: '16px', alignItems: 'start' }}>
        {/* AQI gauge card */}
        <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Activity size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)' }}>Air Quality Index</span>
          </div>
          <AQIGauge aqi={avgReading.aqi} />
        </Card>

        {/* Pollutant values */}
        <Card title="Pollutant Levels" subtitle="Average across monitored stations">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'PM2.5', value: avgReading.pm25, unit: 'µg/m³', limit: 60,  color: '#10b981' },
              { label: 'PM10',  value: avgReading.pm10, unit: 'µg/m³', limit: 100, color: '#60a5fa' },
              { label: 'CO',    value: avgReading.co,   unit: 'ppm',    limit: 9,   color: '#f59e0b' },
              { label: 'NO2',   value: avgReading.no2,  unit: 'µg/m³', limit: 80,  color: '#a78bfa' },
            ].map((item) => {
              const pct = Math.min((item.value / item.limit) * 100, 100);
              const over = item.value > item.limit;
              return (
                <div key={item.label} style={{ padding: '14px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: over ? '#ef4444' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {item.value} <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text-muted)' }}>{item.unit}</span>
                    </span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--bg-input)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: over ? '#ef4444' : item.color, borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Limit: {item.limit} {item.unit} {over && <span style={{ color: '#f87171', fontWeight: 600 }}>⚠ EXCEEDED</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Radar chart */}
        <Card title="Pollution Profile" subtitle="% of safe limit">
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={70}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Radar name="AQ" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Pollution trend */}
      <Card title="24-Hour Pollution Trend" subtitle="Simulated sensor readings — PM2.5 (µg/m³) and CO (ppm)">
        <PollutionChart data={pollutionData} height={260} />
      </Card>

      {/* Ward breakdown */}
      {selectedWard === 'all' && (
        <Card title="Ward-by-Ward Comparison" subtitle="Current AQI and PM2.5 readings" style={{ marginTop: '16px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ward</th>
                  <th>AQI</th>
                  <th>PM2.5 (µg/m³)</th>
                  <th>CO (ppm)</th>
                  <th>NO2 (µg/m³)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {AIR_QUALITY_READINGS.map((r) => {
                  const ward = WARDS.find((w) => w.id === r.wardId);
                  const color = r.aqi > 200 ? '#ef4444' : r.aqi > 150 ? '#f97316' : r.aqi > 100 ? '#eab308' : '#22c55e';
                  const label = r.aqi > 200 ? 'Hazardous' : r.aqi > 150 ? 'Very Unhealthy' : r.aqi > 100 ? 'Unhealthy' : 'Moderate';
                  return (
                    <tr key={r.wardId}>
                      <td style={{ fontWeight: 500 }}>{ward?.name}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>{r.aqi}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: r.pm25 > 60 ? '#f87171' : 'var(--text-primary)' }}>{r.pm25}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: r.co > 4 ? '#f87171' : 'var(--text-primary)' }}>{r.co}</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{r.no2}</td>
                      <td><span style={{ fontSize: '11px', fontWeight: 600, color }}>{label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
