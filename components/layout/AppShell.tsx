'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AppProvider } from '@/lib/context';
import { PageRouter } from './PageRouter';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShellInner>{children}</AppShellInner>
    </AppProvider>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg-base)' }}>
          <PageRouter />
        </main>
      </div>
    </div>
  );
}
