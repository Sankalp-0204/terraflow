import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'TerraFlow – Smart Municipal Waste Management',
  description:
    'TerraFlow is a smart-city command center for municipal waste management and environmental monitoring. Prevent open waste fires with real-time hotspot tracking, air quality monitoring, and fleet dispatch.',
  keywords: ['waste management', 'smart city', 'air quality', 'municipal', 'TerraFlow'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      </head>
      <body className="h-full flex overflow-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
