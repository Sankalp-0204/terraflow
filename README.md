# TerraFlow 🌿

**Smart Municipal Waste Management & Environmental Monitoring System**

A hackathon-grade smart-city command centre that helps prevent open waste fires by connecting waste accumulation data, air pollution monitoring, compost plant health, and municipal incident response.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Map | Leaflet + OpenStreetMap |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL + Row Level Security) |
| API | Next.js Route Handlers (server-side) |

---

## Features

- **Command Overview** — KPI cards, live alert panel, interactive hotspot map, pollution trends, incidents table
- **Live City Map** — Full-screen Leaflet map with colour-coded waste hotspots and compost plant markers
- **Fire Risk Assessment** — Hotspots ranked by fire risk score with urgency indicators
- **Air Quality Monitor** — AQI gauge, pollutant breakdown, radar profile, 24-hour trend chart
- **Compost Plants** — Per-plant capacity, methane, temperature and efficiency metrics
- **Fleet & Routes** — Vehicle status table with fuel bars and route completion progress
- **Incident Management** — Filterable incident table with full-detail modal; create / acknowledge / assign / resolve
- **Settings** — Toggle switches for notification preferences

---

## Quick Start (Demo Mode — no Supabase needed)

```bash
git clone https://github.com/YOUR_USERNAME/terraflow.git
cd terraflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All data is simulated; no database required.

---

## Full Setup (with Supabase backend)

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **anon key** from *Project Settings → API*.
3. Also copy the **service role key** (keep this secret — server-only).

### 2. Run the SQL migration

In the Supabase **SQL Editor**, paste and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, indexes, foreign keys, RLS policies, and seeds demo data.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_DEMO_MODE=false
```

### 4. Start the app

```bash
npm run dev
```

The header banner switches from **DEMO MODE** to **LIVE MODE** when Supabase is connected.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/dashboard` | KPIs, hotspots, air quality, incidents |
| `GET` | `/api/sensors` | Sensor list + latest readings |
| `GET` | `/api/sensor-readings` | Time-series readings (ward filter) |
| `GET` | `/api/incidents` | All incidents (ward + status + severity filters) |
| `POST` | `/api/incidents` | Create new incident |
| `PATCH` | `/api/incidents/[id]` | Update status / assign / resolve |
| `GET` | `/api/wards` | Ward list |
| `GET` | `/api/truck-assignments` | Truck assignments per incident |
| `POST` | `/api/truck-assignments` | Assign truck to incident |

---

## Project Structure

```
terraflow-app/
├── app/
│   ├── api/               ← Next.js Route Handlers (server-side only)
│   │   ├── dashboard/
│   │   ├── incidents/
│   │   ├── sensors/
│   │   ├── sensor-readings/
│   │   ├── wards/
│   │   └── truck-assignments/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/            ← UI components (all client-side)
├── lib/
│   ├── supabase/          ← Supabase client utilities
│   │   ├── client.ts      ← Browser-safe anon client
│   │   └── server.ts      ← Server-only service-role client
│   ├── mockData.ts        ← Demo-mode fallback data
│   └── context.tsx        ← React app context
├── supabase/
│   └── migrations/        ← SQL migration files
└── types/
    └── index.ts           ← Shared TypeScript types
```

---

## Demo vs Live Mode

| Feature | Demo Mode | Live Mode |
|---|---|---|
| Data source | `lib/mockData.ts` | Supabase PostgreSQL |
| Incident writes | Blocked with notice | Persisted to DB |
| Sensor readings | Deterministic mock | Real sensor table |
| Header badge | 🟡 DEMO MODE | 🟢 LIVE MODE |

---

## License

MIT
