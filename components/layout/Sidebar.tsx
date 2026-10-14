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

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Monitoring',
    items: [
      { id: 'live-map',       label: 'Live Map',       icon: Map },
      { id: 'fire-risk',      label: 'Fire Risk',      icon: Flame, badge: '2', badgeColor: '#EF4444' },
      { id: 'air-quality',    label: 'Air Quality',    icon: Wind },
      { id: 'compost-plants', label: 'Compost Plants', icon: Leaf },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'fleet',     label: 'Fleet & Routes', icon: Truck },
      { id: 'incidents', label: 'Incidents',      icon: AlertTriangle, badge: '6', badgeColor: '#F59E0B' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar } = useApp();

  return (
    <aside
      style={{
        width: sidebarCollapsed ? '52px' : 'var(--sidebar-w)',
        minWidth: sidebarCollapsed ? '52px' : 'var(--sidebar-w)',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width .22s ease, min-width .22s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 'var(--header-h)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 14px',
          borderBottom: '1px solid var(--border)',
          gap: '10px',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '26px', height: '26px', flexShrink: 0,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Leaf size={14} color="#fff" />
        </div>
        {!sidebarCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', letterSpacing: '-.01em' }}>
              TerraFlow
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginTop: '1px' }}>
              Municipal Command
            </div>
          </div>
        )}
      </div>

      {/* Nav sections */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={section.label} style={{ marginBottom: si < NAV_SECTIONS.length - 1 ? '4px' : '0' }}>
            {/* Section label */}
            {!sidebarCollapsed && (
              <div style={{
                padding: '10px 8px 4px',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                color: 'var(--text-muted)',
              }}>
                {section.label}
              </div>
            )}
            {sidebarCollapsed && si > 0 && (
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '6px 8px' }} />
            )}

            {/* Nav items */}
            {section.items.map((item) => {
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
                    gap: '9px',
                    padding: sidebarCollapsed ? '9px 0' : '7px 10px',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    borderRadius: '5px',
                    border: 'none',
                    cursor: 'pointer',
                    background: active ? 'rgba(16,185,129,.1)' : 'transparent',
                    color: active ? 'var(--emerald-400)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontWeight: active ? 600 : 400,
                    transition: 'background .12s, color .12s',
                    width: '100%',
                    textAlign: 'left',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    marginBottom: '1px',
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
                  {/* Active indicator bar */}
                  {active && (
                    <div style={{
                      position: 'absolute', left: 0, top: '18%', bottom: '18%',
                      width: '3px', background: 'var(--emerald-500)', borderRadius: '0 2px 2px 0',
                    }} />
                  )}
                  <Icon size={15} style={{ flexShrink: 0, marginLeft: active && !sidebarCollapsed ? '3px' : undefined }} />
                  {!sidebarCollapsed && (
                    <>
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.badge && (
                        <span style={{
                          background: item.badgeColor ? `${item.badgeColor}20` : 'var(--bg-elevated)',
                          color: item.badgeColor ?? 'var(--text-secondary)',
                          border: `1px solid ${item.badgeColor ? `${item.badgeColor}40` : 'var(--border)'}`,
                          borderRadius: '10px',
                          padding: '1px 6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '8px', flexShrink: 0 }}>
        <button
          onClick={toggleSidebar}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', padding: '7px', borderRadius: '5px', border: 'none',
            background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer',
            transition: 'background .12s, color .12s',
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
          {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  );
}
