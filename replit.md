# LeadScraper

## Overview

LeadScraper is a full-stack web application that extracts business leads from Google Maps. Users enter a keyword (e.g., "plumber") and a location (e.g., "New York"), and the app launches a background scraping job using Puppeteer to collect business names, addresses, phone numbers, websites, ratings, and reviews. Results are stored in a PostgreSQL database and can be viewed in a polished dashboard or downloaded as CSV.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with two main pages: Dashboard (`/`) and Scrape Details (`/scrapes/:id`)
- **State Management / Data Fetching**: TanStack React Query with polling — scrape lists refresh every 5 seconds, individual scrape details poll every 3 seconds while status is "pending"
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS and CSS variables for theming
- **Styling**: Tailwind CSS with a dark theme (deep indigo/purple palette), custom fonts (Plus Jakarta Sans, Space Grotesk), glass-card effects, and gradient accents
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 running on Node.js with TypeScript (executed via `tsx`)
- **HTTP Server**: Node's `http.createServer` wrapping Express (allows future WebSocket support)
- **API Pattern**: RESTful JSON API under `/api/` prefix. Routes are defined in `server/routes.ts` with shared route definitions in `shared/routes.ts`
- **Scraping Engine**: Puppeteer with headless Chromium. Scraping runs asynchronously in the background after a scrape job is created. The scraper navigates to Google Maps, scrolls through results, and extracts business data
- **Dev Server**: Vite dev server is integrated as Express middleware in development mode (via `server/vite.ts`), with HMR support
- **Production**: Client is built to `dist/public`, server is bundled with esbuild to `dist/index.cjs`

### Database
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema** (in `shared/schema.ts`):
  - `scrapes` table: `id` (serial PK), `keyword` (text), `location` (text), `status` (enum: pending/completed/failed), `createdAt` (timestamp)
  - `leads` table: `id` (serial PK), `scrapeId` (FK to scrapes), `name`, `address`, `phone`, `website`, `rating`, `reviews` (all text), `isAd` (boolean)
  - One-to-many relationship: one scrape has many leads
- **Migrations**: Managed via `drizzle-kit push` (`npm run db:push`)
- **Connection**: `pg.Pool` with connection string from `DATABASE_URL`

### Shared Code (`shared/`)
- `schema.ts`: Drizzle table definitions, Zod insert schemas, and TypeScript types — shared between client and server
- `routes.ts`: API route definitions with paths, methods, Zod input/output schemas — used by both frontend hooks and backend handlers for type safety

### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/scrapes` | List all scrapes (ordered by newest) |
| POST | `/api/scrapes` | Create a new scrape job (starts background scraping) |
| GET | `/api/scrapes/:id` | Get scrape details with associated leads |
| GET | `/api/scrapes/:id/download` | Download leads as CSV |

### Storage Layer
- `server/storage.ts` defines an `IStorage` interface and a `DatabaseStorage` implementation
- This abstraction allows swapping storage backends if needed
- Exported as a singleton `storage` instance

### Build System
- **Dev**: `tsx server/index.ts` with Vite middleware for HMR
- **Build**: Custom `script/build.ts` that runs Vite build for client, then esbuild for server. Server dependencies are selectively bundled (allowlist pattern) to reduce cold start times
- **Production**: `node dist/index.cjs` serves static files from `dist/public`

## External Dependencies

### Required Services
- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Must be provisioned before the app starts.
- **Chromium**: Required for Puppeteer-based web scraping. The scraper attempts to find Chromium via `which chromium`.

### Key NPM Dependencies
- **Server**: Express 5, Drizzle ORM, pg (PostgreSQL client), Puppeteer, Zod
- **Client**: React, Vite, TanStack React Query, Wouter, shadcn/ui (Radix UI), Tailwind CSS, React Hook Form, Lucide React icons, date-fns, Framer Motion
- **Shared**: drizzle-zod, zod

### Replit-specific Plugins
- `@replit/vite-plugin-runtime-error-modal`: Shows runtime errors in dev
- `@replit/vite-plugin-cartographer`: Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner`: Dev banner (dev only)