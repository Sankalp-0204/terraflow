'use client';

import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { PollutionDataPoint } from '@/types';

interface PollutionChartProps {
  data: PollutionDataPoint[];
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
    }}>
      <p style={{ margin: '0 0 8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', gap: '12px', marginBottom: '4px' }}>
          <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
          <span style={{ color: 'var(--text-primary)', marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>
            {p.name === 'PM2.5' ? `${p.value} µg/m³` : `${p.value} ppm`}
          </span>
        </div>
      ))}
    </div>
  );
}

export function PollutionChart({ data, height = 220 }: PollutionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="coGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
        <XAxis
          dataKey="time"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={3}
        />
        <YAxis
          yAxisId="pm25"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <YAxis
          yAxisId="co"
          orientation="right"
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          yAxisId="pm25"
          type="monotone"
          dataKey="pm25"
          name="PM2.5"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#pm25Grad)"
          dot={false}
          activeDot={{ r: 4, fill: '#10b981' }}
        />
        <Area
          yAxisId="co"
          type="monotone"
          dataKey="co"
          name="CO"
          stroke="#f59e0b"
          strokeWidth={2}
          fill="url(#coGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#f59e0b' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
