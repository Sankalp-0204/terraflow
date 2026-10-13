'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { NavPage } from '@/types';
import { WARDS } from '@/lib/mockData';

interface AppContextValue {
  currentPage: NavPage;
  setCurrentPage: (page: NavPage) => void;
  selectedWard: string;
  setSelectedWard: (wardId: string) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  selectedIncidentId: string | null;
  setSelectedIncidentId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [selectedWard, setSelectedWard] = useState('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const toggleSidebar = useCallback(() => setSidebarCollapsed((v) => !v), []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedWard,
        setSelectedWard,
        sidebarCollapsed,
        toggleSidebar,
        selectedIncidentId,
        setSelectedIncidentId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { WARDS };
