# TransitPH

TransitPH is a commuter-focused CALABARZON transit companion for discovering jeepney routes, terminals, saved journeys, and local weather.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/transitph/` — Expo mobile app and local commuter experience
- `artifacts/transitph/lib/data.ts` — seeded CALABARZON terminals, routes, and weather data
- `artifacts/transitph/context/TransitContext.tsx` — local authentication, saved routes, search limits, and admin CRUD state
- `artifacts/transitph/app/` — Expo Router screens for login, tabs, route details, terminals, and admin management

## Architecture decisions

- TransitPH is frontend-first for the prototype; AsyncStorage keeps the demo usable without a backend.
- Demo data is labeled in the UI because terminal and fare information has not been verified against official sources.
- Admin writes and saved routes are local and deliberately isolated behind the admin role.

## Product

Commuters can search sample jeepney routes, inspect terminal locations, view trip estimates and walking instructions, check weather by CALABARZON location, and save frequent routes. Admin demo accounts can manage the local terminal and route directory.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
