'use client';

import React from 'react';
import { useApp } from '@/lib/context';
import { OverviewPage } from '@/components/pages/OverviewPage';
import { LiveMapPage } from '@/components/pages/LiveMapPage';
import { FireRiskPage } from '@/components/pages/FireRiskPage';
import { AirQualityPage } from '@/components/pages/AirQualityPage';
import { CompostPlantsPage } from '@/components/pages/CompostPlantsPage';
import { FleetPage } from '@/components/pages/FleetPage';
import { IncidentsPage } from '@/components/pages/IncidentsPage';
import { SettingsPage } from '@/components/pages/SettingsPage';

export function PageRouter() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'overview':       return <OverviewPage />;
    case 'live-map':       return <LiveMapPage />;
    case 'fire-risk':      return <FireRiskPage />;
    case 'air-quality':    return <AirQualityPage />;
    case 'compost-plants': return <CompostPlantsPage />;
    case 'fleet':          return <FleetPage />;
    case 'incidents':      return <IncidentsPage />;
    case 'settings':       return <SettingsPage />;
    default:               return <OverviewPage />;
  }
}
