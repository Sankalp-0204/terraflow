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
  { id: 'w1', name: 'Ward 1 – Connaught Place', population: 52400, area: 2.8 },
  { id: 'w2', name: 'Ward 2 – Lajpat Nagar',   population: 68700, area: 3.5 },
  { id: 'w3', name: 'Ward 3 – Karol Bagh',      population: 74200, area: 3.1 },
  { id: 'w4', name: 'Ward 4 – Rohini',          population: 61000, area: 5.4 },
  { id: 'w5', name: 'Ward 5 – Dwarka',          population: 45300, area: 6.8 },
  { id: 'w6', name: 'Ward 6 – Saket',           population: 31800, area: 4.2 },
];

// ─── Waste Hotspots ──────────────────────────────────────────────────────────
export const WASTE_HOTSPOTS: WasteHotspot[] = [
  {
    id: 'h1', wardId: 'w3', lat: 28.6514, lng: 77.1907,
    severity: 'critical', wasteVolume: 52, daysSinceCollection: 10,
    fireRiskScore: 91, label: 'Karol Bagh Market',
  },
  {
    id: 'h2', wardId: 'w2', lat: 28.5671, lng: 77.2431,
    severity: 'critical', wasteVolume: 47, daysSinceCollection: 8,
    fireRiskScore: 85, label: 'Lajpat Nagar Junction',
  },
  {
    id: 'h3', wardId: 'w4', lat: 28.7041, lng: 77.1025,
    severity: 'high', wasteVolume: 33, daysSinceCollection: 6,
    fireRiskScore: 67, label: 'Rohini Sector 7 Dump',
  },
  {
    id: 'h4', wardId: 'w1', lat: 28.6315, lng: 77.2167,
    severity: 'high', wasteVolume: 22, daysSinceCollection: 5,
    fireRiskScore: 54, label: 'Connaught Place Back Lane',
  },
  {
    id: 'h5', wardId: 'w5', lat: 28.5921, lng: 77.0460,
    severity: 'medium', wasteVolume: 17, daysSinceCollection: 4,
    fireRiskScore: 38, label: 'Dwarka Sector 10 Yard',
  },
  {
    id: 'h6', wardId: 'w3', lat: 28.6562, lng: 77.2310,
    severity: 'medium', wasteVolume: 14, daysSinceCollection: 3,
    fireRiskScore: 31, label: 'Old Delhi Khatik Chowk',
  },
  {
    id: 'h7', wardId: 'w6', lat: 28.5244, lng: 77.2167,
    severity: 'low', wasteVolume: 9,  daysSinceCollection: 2,
    fireRiskScore: 15, label: 'Saket District Centre',
  },
  {
    id: 'h8', wardId: 'w2', lat: 28.5494, lng: 77.2513,
    severity: 'low', wasteVolume: 6,  daysSinceCollection: 1,
    fireRiskScore: 8,  label: 'Nehru Place Side Road',
  },
];

// ─── Air Quality ─────────────────────────────────────────────────────────────
export const AIR_QUALITY_READINGS: AirQualityReading[] = WARDS.filter(
  (w) => w.id !== 'all'
).map((ward, i) => ({
  timestamp: '2026-10-13T14:30:00.000Z',
  pm25: [148, 112, 187, 96,  74,  55][i] ?? 110,
  pm10: [224, 178, 298, 154, 118, 88 ][i] ?? 160,
  co:   [3.8, 2.9, 5.6, 2.4, 1.8, 1.3][i] ?? 3.0,
  no2:  [88,  66,  112, 52,  38,  27 ][i] ?? 65,
  aqi:  [210, 162, 268, 140, 108, 82 ][i] ?? 160,
  wardId: ward.id,
}));

// ─── Pollution Trend (last 24 h) ─────────────────────────────────────────────
export function generatePollutionTrend(wardId: string): PollutionDataPoint[] {
  const seed = wardId === 'all' ? 1 : parseInt(wardId.replace('w', ''), 10);
  const base25 = [148, 112, 187, 96, 74, 55][seed - 1] ?? 110;
  const baseCo = [3.8, 2.9, 5.6, 2.4, 1.8, 1.3][seed - 1] ?? 3.0;

  function seededNoise(idx: number): number {
    const x = Math.sin(seed * 100 + idx * 37.7) * 43758.5453;
    return ((x - Math.floor(x)) - 0.5) * 0.3;
  }

  return Array.from({ length: 24 }, (_, i) => {
    const hour  = i;
    const label = `${String(hour).padStart(2, '0')}:00`;
    const pm25  = +(base25 * (0.7 + 0.5 * Math.sin((i / 24) * Math.PI) + seededNoise(i))).toFixed(1);
    const co    = +(baseCo * (0.8 + 0.35 * Math.sin((i / 24) * Math.PI) + seededNoise(i + 100))).toFixed(2);
    const aqi   = Math.round(pm25 * 1.8 + co * 8);
    return { time: label, pm25, co, aqi };
  });
}

// ─── Compost Plants ───────────────────────────────────────────────────────────
export const COMPOST_PLANTS: CompostPlant[] = [
  {
    id: 'cp1', name: 'Karol Bagh Compost Unit',    wardId: 'w3',
    lat: 28.6480, lng: 77.1950, capacity: 130, currentLoad: 127,
    temperature: 69, methaneLevel: 440, status: 'critical',
    lastInspection: '2026-10-09', efficiency: 54,
  },
  {
    id: 'cp2', name: 'Lajpat Nagar Green Plant',   wardId: 'w2',
    lat: 28.5650, lng: 77.2460, capacity: 90,  currentLoad: 58,
    temperature: 54, methaneLevel: 170, status: 'optimal',
    lastInspection: '2026-10-12', efficiency: 93,
  },
  {
    id: 'cp3', name: 'Rohini Transfer Station',    wardId: 'w4',
    lat: 28.7060, lng: 77.1050, capacity: 110, currentLoad: 96,
    temperature: 63, methaneLevel: 320, status: 'warning',
    lastInspection: '2026-10-11', efficiency: 71,
  },
  {
    id: 'cp4', name: 'Dwarka Processing Yard',     wardId: 'w5',
    lat: 28.5900, lng: 77.0490, capacity: 70,  currentLoad: 38,
    temperature: 51, methaneLevel: 140, status: 'optimal',
    lastInspection: '2026-10-13', efficiency: 96,
  },
  {
    id: 'cp5', name: 'Saket Organic Hub',          wardId: 'w6',
    lat: 28.5260, lng: 77.2190, capacity: 45,  currentLoad: 41,
    temperature: 59, methaneLevel: 260, status: 'warning',
    lastInspection: '2026-10-10', efficiency: 77,
  },
];

// ─── Incidents ────────────────────────────────────────────────────────────────
export const INCIDENTS: Incident[] = [
  {
    id: 'i1', wardId: 'w3', type: 'open-fire', severity: 'critical',
    status: 'escalated',
    title: 'Open waste fire at Karol Bagh Market',
    description:
      'Large open fire detected at the illegal dumpyard behind Karol Bagh Market. Smoke visible from 3 km radius. AQI spiked to 312 locally. Delhi Fire Service and DPCC teams dispatched.',
    reportedAt:  '2026-10-13T11:14:00Z',
    updatedAt:   '2026-10-13T13:40:00Z',
    location:    'Karol Bagh Market, Ward 3',
    lat: 28.6514, lng: 77.1907,
    assignedTo:  'Delhi Fire Station 12 + MCD Zone 3',
    responderCount: 8,
    estimatedResolution: '2026-10-13T16:00:00Z',
  },
  {
    id: 'i2', wardId: 'w3', type: 'air-quality', severity: 'critical',
    status: 'in-progress',
    title: 'PM2.5 exceeds 300 µg/m³ near Old Delhi',
    description:
      'DPCC monitoring station at Old Delhi recorded PM2.5 of 312 µg/m³ at 10:30 AM — more than 5× the NAAQS 24-hour limit. Correlated with nearby hotspot combustion and stubble burning drift.',
    reportedAt:  '2026-10-13T10:32:00Z',
    updatedAt:   '2026-10-13T14:05:00Z',
    location:    'Old Delhi Khatik Chowk, Ward 3',
    lat: 28.6562, lng: 77.2310,
    assignedTo:  'DPCC Mobile Monitoring Unit',
    responderCount: 3,
  },
  {
    id: 'i3', wardId: 'w2', type: 'illegal-dumping', severity: 'high',
    status: 'open',
    title: 'Illegal construction debris dumping at Lajpat Nagar',
    description:
      'CCTV footage confirmed unauthorized dumping of construction debris by a private contractor at Lajpat Nagar Junction. Waste volume estimated at 22 cubic metres.',
    reportedAt:  '2026-10-13T08:20:00Z',
    updatedAt:   '2026-10-13T08:20:00Z',
    location:    'Lajpat Nagar Junction, Ward 2',
    lat: 28.5671, lng: 77.2431,
    assignedTo:  undefined,
    responderCount: 0,
  },
  {
    id: 'i4', wardId: 'w4', type: 'overflow', severity: 'high',
    status: 'in-progress',
    title: 'Dumpyard overflow at Rohini Sector 7',
    description:
      'Collection bin capacity exceeded by 200%. Waste spilling onto pedestrian footpath in Rohini Sector 7. Risk of self-ignition elevated due to decomposing organic matter.',
    reportedAt:  '2026-10-13T07:55:00Z',
    updatedAt:   '2026-10-13T13:10:00Z',
    location:    'Rohini Sector 7, Ward 4',
    lat: 28.7041, lng: 77.1025,
    assignedTo:  'MCD Collection Team D',
    responderCount: 4,
    estimatedResolution: '2026-10-13T15:30:00Z',
  },
  {
    id: 'i5', wardId: 'w3', type: 'compost-alert', severity: 'high',
    status: 'open',
    title: 'Karol Bagh compost plant at critical capacity',
    description:
      'Plant operating at 98% of capacity. Methane levels at 440 ppm (threshold: 350 ppm). Urgent waste diversion to Dwarka Processing Yard required.',
    reportedAt:  '2026-10-13T09:45:00Z',
    updatedAt:   '2026-10-13T09:45:00Z',
    location:    'Karol Bagh Compost Unit, Ward 3',
    lat: 28.6480, lng: 77.1950,
    assignedTo:  undefined,
    responderCount: 0,
  },
  {
    id: 'i6', wardId: 'w1', type: 'overflow', severity: 'medium',
    status: 'in-progress',
    title: 'Bin overflow near Connaught Place metro',
    description:
      'Residential collection bins overflowing near CP Metro Gate 4. Collection was missed due to vehicle breakdown on 11 Oct.',
    reportedAt:  '2026-10-13T06:30:00Z',
    updatedAt:   '2026-10-13T12:00:00Z',
    location:    'Connaught Place, Ward 1',
    lat: 28.6315, lng: 77.2167,
    assignedTo:  'MCD Collection Team B',
    responderCount: 2,
    estimatedResolution: '2026-10-13T17:00:00Z',
  },
  {
    id: 'i7', wardId: 'w5', type: 'illegal-dumping', severity: 'medium',
    status: 'open',
    title: 'Roadside dumping near Dwarka Sector 10',
    description:
      'Household mixed waste being dumped on road margin near Dwarka Sector 10 underpass. Estimated volume: 7 cubic metres.',
    reportedAt:  '2026-10-13T05:10:00Z',
    updatedAt:   '2026-10-13T05:10:00Z',
    location:    'Dwarka Sector 10, Ward 5',
    lat: 28.5921, lng: 77.0460,
    assignedTo:  undefined,
    responderCount: 0,
  },
  {
    id: 'i8', wardId: 'w6', type: 'overflow', severity: 'low',
    status: 'resolved',
    title: 'Minor bin overflow at Saket District Centre',
    description:
      'Single overflowing bin collected and area sanitized by the morning MCD crew.',
    reportedAt:  '2026-10-13T04:00:00Z',
    updatedAt:   '2026-10-13T06:45:00Z',
    location:    'Saket District Centre, Ward 6',
    lat: 28.5244, lng: 77.2167,
    assignedTo:  'MCD Collection Team F',
    responderCount: 1,
  },
];

// ─── Fleet ───────────────────────────────────────────────────────────────────
export const VEHICLES: CollectionVehicle[] = [
  {
    id: 'v1', registrationNo: 'DL01 GA 4421', type: 'compactor',
    wardId: 'w1', status: 'active', lat: 28.633, lng: 77.219,
    driverName: 'Rajesh Sharma', lastCollectionAt: '2026-10-13T12:30:00Z',
    wasteCollectedToday: 4.8, fuelLevel: 74, routeId: 'r1',
  },
  {
    id: 'v2', registrationNo: 'DL03 GB 4422', type: 'tipper',
    wardId: 'w3', status: 'active', lat: 28.650, lng: 77.192,
    driverName: 'Sunil Verma', lastCollectionAt: '2026-10-13T11:15:00Z',
    wasteCollectedToday: 7.2, fuelLevel: 48, routeId: 'r2',
  },
  {
    id: 'v3', registrationNo: 'DL02 GC 1102', type: 'compactor',
    wardId: 'w2', status: 'active', lat: 28.569, lng: 77.245,
    driverName: 'Priya Singh', lastCollectionAt: '2026-10-13T13:00:00Z',
    wasteCollectedToday: 3.9, fuelLevel: 86, routeId: 'r3',
  },
  {
    id: 'v4', registrationNo: 'DL04 GD 2234', type: 'mini-truck',
    wardId: 'w4', status: 'idle', lat: 28.706, lng: 77.104,
    driverName: 'Anil Kumar', lastCollectionAt: '2026-10-13T09:30:00Z',
    wasteCollectedToday: 2.4, fuelLevel: 63, routeId: undefined,
  },
  {
    id: 'v5', registrationNo: 'DL05 GE 5531', type: 'compactor',
    wardId: 'w5', status: 'maintenance', lat: 28.592, lng: 77.047,
    driverName: 'Kavita Devi', lastCollectionAt: '2026-10-12T16:00:00Z',
    wasteCollectedToday: 0, fuelLevel: 22, routeId: undefined,
  },
  {
    id: 'v6', registrationNo: 'DL06 GF 7841', type: 'tipper',
    wardId: 'w6', status: 'active', lat: 28.525, lng: 77.218,
    driverName: 'Mohan Lal', lastCollectionAt: '2026-10-13T13:20:00Z',
    wasteCollectedToday: 2.1, fuelLevel: 81, routeId: 'r4',
  },
];

export const ROUTES: CollectionRoute[] = [
  {
    id: 'r1', wardId: 'w1', name: 'Connaught Place Morning Route',
    vehicleId: 'v1', scheduledTime: '06:00',
    completionPercent: 72, distanceKm: 11.6,
    stops: [
      { lat: 28.632, lng: 77.218, label: 'Inner Circle' },
      { lat: 28.634, lng: 77.221, label: 'Middle Circle' },
      { lat: 28.636, lng: 77.224, label: 'Outer Circle' },
    ],
  },
  {
    id: 'r2', wardId: 'w3', name: 'Karol Bagh High-Priority Run',
    vehicleId: 'v2', scheduledTime: '05:30',
    completionPercent: 38, distanceKm: 9.2,
    stops: [
      { lat: 28.651, lng: 77.190, label: 'Market Block' },
      { lat: 28.654, lng: 77.194, label: 'Residential Zone' },
    ],
  },
  {
    id: 'r3', wardId: 'w2', name: 'Lajpat Nagar PM Route',
    vehicleId: 'v3', scheduledTime: '14:00',
    completionPercent: 28, distanceKm: 14.8,
    stops: [
      { lat: 28.565, lng: 77.242, label: 'Central Market' },
      { lat: 28.568, lng: 77.246, label: 'Part II' },
      { lat: 28.571, lng: 77.250, label: 'Part IV' },
    ],
  },
  {
    id: 'r4', wardId: 'w6', name: 'Saket Standard Loop',
    vehicleId: 'v6', scheduledTime: '07:00',
    completionPercent: 88, distanceKm: 10.1,
    stops: [
      { lat: 28.524, lng: 77.215, label: 'Select City Walk Area' },
      { lat: 28.527, lng: 77.220, label: 'MGF Metropolitan' },
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
    { level: 'High',     count: counts.high,     color: '#f97316' },
    { level: 'Medium',   count: counts.medium,   color: '#eab308' },
    { level: 'Low',      count: counts.low,      color: '#22c55e' },
  ];
}
