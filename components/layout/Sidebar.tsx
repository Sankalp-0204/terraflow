'use client';

import React from 'react';
import {
  LayoutDashboard, Map, Flame, Wind, Leaf,
  Truck, AlertTriangle, Settings, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useApp } from '@/lib/context';
import type { NavPage } from '@/types';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',        label: 'Overview',       icon: LayoutDashboard },
  { id: 'live-map',        label: 'Live Map',        icon: Map },
  { id: 'fire-risk',       label: 'Fire Risk',       icon: Flame, badge: '2', badgeColor: '#ef4444' },
  { id: 'air-quality',     label: 'Air Quality',     icon: Wind },
  { id: 'compost-plants',  label: 'Compost Plants',  icon: Leaf },
  { id: 'fleet',           label: 'Fleet & Routes',  icon: Truck },
  { id: 'incidents',       label: 'Incidents',       icon: AlertTriangle, badge: '6', badgeColor: '#f59e0b' },
  { id: 'settings',        label: 'Settings',        icon: Settings },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar } = useApp();

  return (
    <aside
      style={{
        width: sidebarCollapsed ? '60px' : '220px',
        minWidth: sidebarCollapsed ? '60px' : '220px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width .25s ease, min-width .25s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 20,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          padding: sidebarCollapsed ? '0 16px' : '0 16px',
          borderBottom: '1px solid var(--border)',
          gap: '10px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '28px', height: '28px', flexShrink: 0,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '7px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Leaf size={16} color="#fff" />
        </div>
        {!sidebarCollapsed && (
          <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            TerraFlow
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: sidebarCollapsed ? '10px 14px' : '9px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: active ? 'rgba(16,185,129,.12)' : 'transparent',
                color: active ? 'var(--emerald-400)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                transition: 'background .15s, color .15s',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                }
              }}
            >
              {/* Active indicator */}
              {active && (
                <div style={{
                  position: 'absolute', left: 0, top: '20%', bottom: '20%',
                  width: '3px', background: 'var(--emerald-500)', borderRadius: '0 2px 2px 0',
                }} />
              )}
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!sidebarCollapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: item.badgeColor ? `${item.badgeColor}22` : 'var(--bg-elevated)',
                      color: item.badgeColor ?? 'var(--text-secondary)',
                      border: `1px solid ${item.badgeColor ? `${item.badgeColor}44` : 'var(--border)'}`,
                      borderRadius: '10px',
                      padding: '1px 6px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 8px', flexShrink: 0 }}>
        <button
          onClick={toggleSidebar}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'flex-end',
            width: '100%', padding: '8px', borderRadius: '6px', border: 'none',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
            transition: 'background .15s, color .15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-elevated)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)';
          }}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
