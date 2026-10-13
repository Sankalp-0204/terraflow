// ─── Core domain types for TerraFlow ───────────────────────────────────────

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'open' | 'in-progress' | 'resolved' | 'escalated';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type MarkerType = 'hotspot' | 'compost' | 'fire-risk' | 'collection';
export type VehicleStatus = 'active' | 'idle' | 'maintenance' | 'offline';

export interface Ward {
  id: string;
  name: string;
  population: number;
  area: number; // sq km
}

export interface WasteHotspot {
  id: string;
  wardId: string;
  lat: number;
  lng: number;
  severity: RiskLevel;
  wasteVolume: number; // cubic meters
  daysSinceCollection: number;
  fireRiskScore: number; // 0-100
  label: string;
}

export interface AirQualityReading {
  timestamp: string;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  aqi: number;
  wardId: string;
}

export interface CompostPlant {
  id: string;
  name: string;
  wardId: string;
  lat: number;
  lng: number;
  capacity: number; // tonnes/day
  currentLoad: number; // tonnes/day
  temperature: number; // °C
  methaneLevel: number; // ppm
  status: 'optimal' | 'warning' | 'critical' | 'offline';
  lastInspection: string;
  efficiency: number; // percentage
}

export interface Incident {
  id: string;
  wardId: string;
  type: 'open-fire' | 'illegal-dumping' | 'overflow' | 'air-quality' | 'compost-alert';
  severity: Severity;
  status: IncidentStatus;
  title: string;
  description: string;
  reportedAt: string;
  updatedAt: string;
  location: string;
  lat: number;
  lng: number;
  assignedTo?: string;
  responderCount?: number;
  estimatedResolution?: string;
}

export interface CollectionVehicle {
  id: string;
  registrationNo: string;
  type: 'compactor' | 'tipper' | 'mini-truck';
  wardId: string;
  status: VehicleStatus;
  lat: number;
  lng: number;
  driverName: string;
  lastCollectionAt: string;
  wasteCollectedToday: number; // tonnes
  fuelLevel: number; // percentage
  routeId?: string;
}

export interface CollectionRoute {
  id: string;
  wardId: string;
  name: string;
  vehicleId: string;
  stops: Array<{ lat: number; lng: number; label: string }>;
  scheduledTime: string;
  completionPercent: number;
  distanceKm: number;
}

export interface PollutionDataPoint {
  time: string;
  pm25: number;
  co: number;
  aqi: number;
}

export interface KPIData {
  wasteHotspots: number;
  highRiskZones: number;
  avgPm25: number;
  activeIncidents: number;
  collectionEfficiency: number;
  totalWasteToday: number;
  resolvedToday: number;
  activeVehicles: number;
}

export interface RiskDistributionItem {
  level: string;
  count: number;
  color: string;
}

export type NavPage =
  | 'overview'
  | 'live-map'
  | 'fire-risk'
  | 'air-quality'
  | 'compost-plants'
  | 'fleet'
  | 'incidents'
  | 'settings';
