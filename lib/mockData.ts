import type {
  Ward,
  WasteHotspot,
  AirQualityReading,
  CompostPlant,
  Incident,
  CollectionVehicle,
  CollectionRoute,
  PollutionDataPoint,
  KPIData,
  RiskDistributionItem,
} from '@/types';

// ─── Wards ───────────────────────────────────────────────────────────────────
export const WARDS: Ward[] = [
  { id: 'all', name: 'All Wards', population: 0, area: 0 },
  { id: 'w1', name: 'Ward 1 – Ashok Nagar', population: 48200, area: 3.2 },
  { id: 'w2', name: 'Ward 2 – Banjara Hills', population: 62500, area: 4.7 },
  { id: 'w3', name: 'Ward 3 – Charminar', population: 71000, area: 2.9 },
  { id: 'w4', name: 'Ward 4 – Dilsukhnagar', population: 55400, area: 3.8 },
  { id: 'w5', name: 'Ward 5 – ECIL Cross Roads', population: 39800, area: 5.1 },
  { id: 'w6', name: 'Ward 6 – Film Nagar', population: 28300, area: 6.2 },
];

// ─── Waste Hotspots ──────────────────────────────────────────────────────────
export const WASTE_HOTSPOTS: WasteHotspot[] = [
  {
    id: 'h1', wardId: 'w3', lat: 17.3616, lng: 78.4747,
    severity: 'critical', wasteVolume: 48, daysSinceCollection: 9,
    fireRiskScore: 87, label: 'Charminar Market',
  },
  {
    id: 'h2', wardId: 'w1', lat: 17.4399, lng: 78.4983,
    severity: 'high', wasteVolume: 31, daysSinceCollection: 6,
    fireRiskScore: 63, label: 'Ashok Nagar Junction',
  },
  {
    id: 'h3', wardId: 'w4', lat: 17.3687, lng: 78.5247,
    severity: 'high', wasteVolume: 27, daysSinceCollection: 5,
    fireRiskScore: 58, label: 'Dilsukhnagar Bus Stand',
  },
  {
    id: 'h4', wardId: 'w2', lat: 17.4126, lng: 78.4488,
    severity: 'medium', wasteVolume: 18, daysSinceCollection: 3,
    fireRiskScore: 34, label: 'Road No. 12 Dumpyard',
  },
  {
    id: 'h5', wardId: 'w5', lat: 17.4786, lng: 78.5531,
    severity: 'medium', wasteVolume: 15, daysSinceCollection: 3,
    fireRiskScore: 29, label: 'ECIL Road Side',
  },
  {
    id: 'h6', wardId: 'w6', lat: 17.4126, lng: 78.3909,
    severity: 'low', wasteVolume: 8, daysSinceCollection: 1,
    fireRiskScore: 12, label: 'Film Nagar Park',
  },
  {
    id: 'h7', wardId: 'w3', lat: 17.3502, lng: 78.4831,
    severity: 'critical', wasteVolume: 55, daysSinceCollection: 11,
    fireRiskScore: 93, label: 'Old Bridge Colony',
  },
  {
    id: 'h8', wardId: 'w1', lat: 17.4502, lng: 78.5012,
    severity: 'low', wasteVolume: 6, daysSinceCollection: 2,
    fireRiskScore: 9, label: 'Nehru Park Corner',
  },
];

// ─── Air Quality ─────────────────────────────────────────────────────────────
export const AIR_QUALITY_READINGS: AirQualityReading[] = WARDS.filter(
  (w) => w.id !== 'all'
).map((ward, i) => ({
  timestamp: '2026-10-13T14:30:00.000Z',
  pm25: [68, 42, 124, 77, 51, 35][i] ?? 55,
  pm10: [112, 68, 198, 130, 84, 54][i] ?? 90,
  co: [2.1, 1.4, 4.8, 3.2, 1.9, 1.1][i] ?? 2.0,
  no2: [44, 28, 88, 55, 32, 21][i] ?? 40,
  aqi: [152, 87, 220, 168, 112, 76][i] ?? 120,
  wardId: ward.id,
}));

// ─── Pollution Trend (last 24 h) ─────────────────────────────────────────────
export function generatePollutionTrend(wardId: string): PollutionDataPoint[] {
  const seed = wardId === 'all' ? 1 : parseInt(wardId.replace('w', ''), 10);
  const base25 = [68, 42, 124, 77, 51, 35][seed - 1] ?? 60;
  const baseCo = [2.1, 1.4, 4.8, 3.2, 1.9, 1.1][seed - 1] ?? 2.0;

  // Use deterministic noise based on seed + index to avoid unstable new Date()/Math.random()
  function seededNoise(idx: number): number {
    const x = Math.sin(seed * 100 + idx * 37.7) * 43758.5453;
    return ((x - Math.floor(x)) - 0.5) * 0.3;
  }

  return Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const label = `${String(hour).padStart(2, '0')}:00`;
    const pm25 = +(base25 * (0.7 + 0.5 * Math.sin((i / 24) * Math.PI) + seededNoise(i))).toFixed(1);
    const co = +(baseCo * (0.8 + 0.35 * Math.sin((i / 24) * Math.PI) + seededNoise(i + 100))).toFixed(2);
    const aqi = Math.round(pm25 * 1.8 + co * 8);
    return { time: label, pm25, co, aqi };
  });
}

// ─── Compost Plants ───────────────────────────────────────────────────────────
export const COMPOST_PLANTS: CompostPlant[] = [
  {
    id: 'cp1', name: 'Charminar Compost Unit', wardId: 'w3',
    lat: 17.3590, lng: 78.4800, capacity: 120, currentLoad: 118,
    temperature: 67, methaneLevel: 420, status: 'critical',
    lastInspection: '2026-10-09', efficiency: 58,
  },
  {
    id: 'cp2', name: 'Banjara Hills Green Plant', wardId: 'w2',
    lat: 17.4130, lng: 78.4400, capacity: 80, currentLoad: 52,
    temperature: 55, methaneLevel: 180, status: 'optimal',
    lastInspection: '2026-10-12', efficiency: 91,
  },
  {
    id: 'cp3', name: 'Dilsukhnagar Transfer Station', wardId: 'w4',
    lat: 17.3700, lng: 78.5300, capacity: 100, currentLoad: 88,
    temperature: 61, methaneLevel: 310, status: 'warning',
    lastInspection: '2026-10-11', efficiency: 74,
  },
  {
    id: 'cp4', name: 'ECIL Road Processing Yard', wardId: 'w5',
    lat: 17.4800, lng: 78.5490, capacity: 60, currentLoad: 34,
    temperature: 52, methaneLevel: 145, status: 'optimal',
    lastInspection: '2026-10-13', efficiency: 95,
  },
  {
    id: 'cp5', name: 'Film Nagar Organic Hub', wardId: 'w6',
    lat: 17.4140, lng: 78.3850, capacity: 40, currentLoad: 38,
    temperature: 58, methaneLevel: 250, status: 'warning',
    lastInspection: '2026-10-10', efficiency: 79,
  },
];

// ─── Incidents ────────────────────────────────────────────────────────────────
export const INCIDENTS: Incident[] = [
  {
    id: 'i1', wardId: 'w3', type: 'open-fire', severity: 'critical',
    status: 'escalated',
    title: 'Open waste fire at Old Bridge Colony',
    description:
      'Large open fire detected at the illegal dumpyard near Old Bridge Colony. Smoke visible from 2 km radius. AQI spiked to 248 locally. Fire brigade dispatched.',
    reportedAt: '2026-10-13T11:14:00Z',
    updatedAt: '2026-10-13T13:40:00Z',
    location: 'Old Bridge Colony, Ward 3',
    lat: 17.3502, lng: 78.4831,
    assignedTo: 'Fire Station 7 + GHMC Zone 3',
    responderCount: 6,
    estimatedResolution: '2026-10-13T16:00:00Z',
  },
  {
    id: 'i2', wardId: 'w3', type: 'air-quality', severity: 'critical',
    status: 'in-progress',
    title: 'PM2.5 exceeds 200 µg/m³ in Charminar area',
    description:
      'Monitoring station at Charminar Market recorded PM2.5 of 224 µg/m³ at 10:30 AM, well beyond the NAAQS 24-hour limit of 60 µg/m³. Correlated with nearby hotspot combustion.',
    reportedAt: '2026-10-13T10:32:00Z',
    updatedAt: '2026-10-13T14:05:00Z',
    location: 'Charminar Market vicinity, Ward 3',
    lat: 17.3616, lng: 78.4747,
    assignedTo: 'TSPCB Mobile Unit',
    responderCount: 2,
  },
  {
    id: 'i3', wardId: 'w1', type: 'illegal-dumping', severity: 'high',
    status: 'open',
    title: 'Illegal commercial waste dumping detected',
    description:
      'CCTV footage confirmed unauthorized dumping of construction debris by a private contractor at Ashok Nagar Junction. Waste volume estimated at 18 cubic metres.',
    reportedAt: '2026-10-13T08:20:00Z',
    updatedAt: '2026-10-13T08:20:00Z',
    location: 'Ashok Nagar Junction, Ward 1',
    lat: 17.4399, lng: 78.4983,
    assignedTo: undefined,
    responderCount: 0,
  },
  {
    id: 'i4', wardId: 'w4', type: 'overflow', severity: 'high',
    status: 'in-progress',
    title: 'Dumpyard overflow at Dilsukhnagar Bus Stand',
    description:
      'Collection bin capacity exceeded by 180%. Waste spilling onto pedestrian footpath. Risk of self-ignition elevated due to decomposing organic matter.',
    reportedAt: '2026-10-13T07:55:00Z',
    updatedAt: '2026-10-13T13:10:00Z',
    location: 'Dilsukhnagar Bus Stand, Ward 4',
    lat: 17.3687, lng: 78.5247,
    assignedTo: 'GHMC Collection Team D',
    responderCount: 3,
    estimatedResolution: '2026-10-13T15:30:00Z',
  },
  {
    id: 'i5', wardId: 'w3', type: 'compost-alert', severity: 'high',
    status: 'open',
    title: 'Charminar compost plant at critical capacity',
    description:
      'Plant operating at 98% of capacity. Methane levels at 420 ppm (threshold: 350 ppm). Urgent waste diversion to alternate facilities required.',
    reportedAt: '2026-10-13T09:45:00Z',
    updatedAt: '2026-10-13T09:45:00Z',
    location: 'Charminar Compost Unit, Ward 3',
    lat: 17.3590, lng: 78.4800,
    assignedTo: undefined,
    responderCount: 0,
  },
  {
    id: 'i6', wardId: 'w2', type: 'overflow', severity: 'medium',
    status: 'in-progress',
    title: 'Bin overflow on Road No. 12',
    description:
      'Residential collection bins overflowing at Road No. 12 residential sector. Collection was missed due to vehicle breakdown on 11 Oct.',
    reportedAt: '2026-10-13T06:30:00Z',
    updatedAt: '2026-10-13T12:00:00Z',
    location: 'Road No. 12, Banjara Hills',
    lat: 17.4126, lng: 78.4488,
    assignedTo: 'GHMC Collection Team B',
    responderCount: 2,
    estimatedResolution: '2026-10-13T17:00:00Z',
  },
  {
    id: 'i7', wardId: 'w5', type: 'illegal-dumping', severity: 'medium',
    status: 'open',
    title: 'Roadside dumping near ECIL',
    description:
      'Household mixed waste being dumped on road margin near ECIL Cross Roads. Estimated volume: 5 cubic metres.',
    reportedAt: '2026-10-13T05:10:00Z',
    updatedAt: '2026-10-13T05:10:00Z',
    location: 'ECIL Cross Roads, Ward 5',
    lat: 17.4786, lng: 78.5531,
    assignedTo: undefined,
    responderCount: 0,
  },
  {
    id: 'i8', wardId: 'w6', type: 'overflow', severity: 'low',
    status: 'resolved',
    title: 'Minor bin overflow at Film Nagar Park',
    description:
      'Single overflowing bin collected and area sanitized by morning crew.',
    reportedAt: '2026-10-13T04:00:00Z',
    updatedAt: '2026-10-13T06:45:00Z',
    location: 'Film Nagar Park, Ward 6',
    lat: 17.4126, lng: 78.3909,
    assignedTo: 'GHMC Collection Team F',
    responderCount: 1,
  },
];

// ─── Fleet ───────────────────────────────────────────────────────────────────
export const VEHICLES: CollectionVehicle[] = [
  {
    id: 'v1', registrationNo: 'TS09 EA 4421', type: 'compactor',
    wardId: 'w1', status: 'active', lat: 17.442, lng: 78.501,
    driverName: 'Ramesh Kumar', lastCollectionAt: '2026-10-13T12:30:00Z',
    wasteCollectedToday: 4.2, fuelLevel: 72, routeId: 'r1',
  },
  {
    id: 'v2', registrationNo: 'TS09 EA 4422', type: 'tipper',
    wardId: 'w3', status: 'active', lat: 17.358, lng: 78.478,
    driverName: 'Suresh Babu', lastCollectionAt: '2026-10-13T11:15:00Z',
    wasteCollectedToday: 6.8, fuelLevel: 45, routeId: 'r2',
  },
  {
    id: 'v3', registrationNo: 'TS09 EB 1102', type: 'compactor',
    wardId: 'w2', status: 'active', lat: 17.415, lng: 78.445,
    driverName: 'Anitha Devi', lastCollectionAt: '2026-10-13T13:00:00Z',
    wasteCollectedToday: 3.5, fuelLevel: 88, routeId: 'r3',
  },
  {
    id: 'v4', registrationNo: 'TS09 EB 2234', type: 'mini-truck',
    wardId: 'w4', status: 'idle', lat: 17.371, lng: 78.527,
    driverName: 'Naresh Reddy', lastCollectionAt: '2026-10-13T09:30:00Z',
    wasteCollectedToday: 2.1, fuelLevel: 61, routeId: undefined,
  },
  {
    id: 'v5', registrationNo: 'TS09 EC 5531', type: 'compactor',
    wardId: 'w5', status: 'maintenance', lat: 17.479, lng: 78.552,
    driverName: 'Priya Lakshmi', lastCollectionAt: '2026-10-12T16:00:00Z',
    wasteCollectedToday: 0, fuelLevel: 20, routeId: undefined,
  },
  {
    id: 'v6', registrationNo: 'TS09 EC 7841', type: 'tipper',
    wardId: 'w6', status: 'active', lat: 17.411, lng: 78.389,
    driverName: 'Mohan Das', lastCollectionAt: '2026-10-13T13:20:00Z',
    wasteCollectedToday: 1.8, fuelLevel: 79, routeId: 'r4',
  },
];

export const ROUTES: CollectionRoute[] = [
  {
    id: 'r1', wardId: 'w1', name: 'Ashok Nagar Morning Route',
    vehicleId: 'v1', scheduledTime: '06:00',
    completionPercent: 68, distanceKm: 12.4,
    stops: [
      { lat: 17.440, lng: 78.498, label: 'Sector A' },
      { lat: 17.443, lng: 78.502, label: 'Sector B' },
      { lat: 17.445, lng: 78.506, label: 'Sector C' },
    ],
  },
  {
    id: 'r2', wardId: 'w3', name: 'Charminar High-Priority Run',
    vehicleId: 'v2', scheduledTime: '05:30',
    completionPercent: 42, distanceKm: 8.7,
    stops: [
      { lat: 17.360, lng: 78.475, label: 'Market Sector' },
      { lat: 17.363, lng: 78.479, label: 'Residential Block' },
    ],
  },
  {
    id: 'r3', wardId: 'w2', name: 'Banjara Hills PM Route',
    vehicleId: 'v3', scheduledTime: '14:00',
    completionPercent: 25, distanceKm: 15.2,
    stops: [
      { lat: 17.413, lng: 78.442, label: 'Zone 1' },
      { lat: 17.416, lng: 78.448, label: 'Zone 2' },
      { lat: 17.410, lng: 78.452, label: 'Zone 3' },
    ],
  },
  {
    id: 'r4', wardId: 'w6', name: 'Film Nagar Standard Loop',
    vehicleId: 'v6', scheduledTime: '07:00',
    completionPercent: 90, distanceKm: 9.3,
    stops: [
      { lat: 17.413, lng: 78.387, label: 'Block A' },
      { lat: 17.415, lng: 78.392, label: 'Block B' },
    ],
  },
];

// ─── Aggregated KPIs ──────────────────────────────────────────────────────────
export function getKPIData(wardId: string): KPIData {
  const filteredHotspots = wardId === 'all'
    ? WASTE_HOTSPOTS
    : WASTE_HOTSPOTS.filter((h) => h.wardId === wardId);

  const filteredIncidents = wardId === 'all'
    ? INCIDENTS
    : INCIDENTS.filter((i) => i.wardId === wardId);

  const filteredAQ = wardId === 'all'
    ? AIR_QUALITY_READINGS
    : AIR_QUALITY_READINGS.filter((a) => a.wardId === wardId);

  const filteredVehicles = wardId === 'all'
    ? VEHICLES
    : VEHICLES.filter((v) => v.wardId === wardId);

  const avgPm25 =
    filteredAQ.length > 0
      ? +(filteredAQ.reduce((s, a) => s + a.pm25, 0) / filteredAQ.length).toFixed(1)
      : 0;

  const highRisk = filteredHotspots.filter(
    (h) => h.severity === 'critical' || h.severity === 'high'
  ).length;

  const activeIncidents = filteredIncidents.filter(
    (i) => i.status !== 'resolved'
  ).length;

  const resolvedToday = filteredIncidents.filter(
    (i) => i.status === 'resolved'
  ).length;

  const activeVehicles = filteredVehicles.filter(
    (v) => v.status === 'active'
  ).length;

  const totalWaste = filteredVehicles.reduce(
    (s, v) => s + v.wasteCollectedToday,
    0
  );

  // Collection efficiency = completed routes / scheduled
  const efficiency = Math.round(
    filteredVehicles.length > 0
      ? (activeVehicles / filteredVehicles.length) * 100
      : 0
  );

  return {
    wasteHotspots: filteredHotspots.length,
    highRiskZones: highRisk,
    avgPm25,
    activeIncidents,
    collectionEfficiency: efficiency,
    totalWasteToday: +totalWaste.toFixed(1),
    resolvedToday,
    activeVehicles,
  };
}

// ─── Risk Distribution ────────────────────────────────────────────────────────
export function getRiskDistribution(wardId: string): RiskDistributionItem[] {
  const filtered =
    wardId === 'all'
      ? WASTE_HOTSPOTS
      : WASTE_HOTSPOTS.filter((h) => h.wardId === wardId);

  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  filtered.forEach((h) => counts[h.severity]++);

  return [
    { level: 'Critical', count: counts.critical, color: '#ef4444' },
    { level: 'High', count: counts.high, color: '#f97316' },
    { level: 'Medium', count: counts.medium, color: '#eab308' },
    { level: 'Low', count: counts.low, color: '#22c55e' },
  ];
}
