'use client';

import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts';
import type { RiskDistributionItem } from '@/types';

interface RiskChartProps {
  data: RiskDistributionItem[];
  height?: number;
}

export function RiskDistributionChart({ data, height = 180 }: RiskChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} vertical={false} />
        <XAxis
          dataKey="level"
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={24}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as RiskDistributionItem;
            return (
              <div style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '10px 14px', fontSize: '12px',
              }}>
                <span style={{ color: d.color, fontWeight: 700 }}>{d.level}</span>
                <span style={{ color: 'var(--text-primary)', marginLeft: '12px' }}>{d.count} zones</span>
              </div>
            );
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
