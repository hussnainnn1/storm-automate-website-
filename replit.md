# Storm Automate

Premium marketing website for Storm Automate, an AI automation systems partner that helps established appointment-based businesses plug revenue leaks between lead response and booked appointments.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/storm-automate run dev` — run the Storm Automate website
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

- `artifacts/storm-automate/src/App.tsx` — homepage sections, workflow visualization, interactive leak assessment, FAQ, and lead form
- `artifacts/storm-automate/src/index.css` — Storm Automate visual tokens, responsive utilities, and motion
- `artifacts/storm-automate/index.html` — SEO metadata, canonical URL, social metadata, and Organization/WebSite JSON-LD
- `artifacts/storm-automate/public/` — Storm wordmark asset, favicon, robots.txt, and sitemap.xml
- `attached_assets/` — the original Storm Automate build brief and Nova Echo visual reference brief

## Architecture decisions

- The first release is a presentation-first React/Vite site with no backend dependency.
- The site uses an original connected-system visual language instead of copying the Nova Echo reference.
- Lead assessment and strategy-call forms are deliberately client-side only until a real scheduling, email, or CRM destination is connected.
- Empty business facts remain explicit placeholders; the site does not invent testimonials, clients, results, or contact details.

## Product

- Explains Storm Automate's revenue-leak positioning within the first viewport.
- Shows the lead-to-revenue system through animated workflow visuals and operational examples.
- Lets visitors explore common revenue leaks and run a client-side diagnostic.
- Captures the full lead qualification context in a validated local-only strategy-call form.
- Includes responsive navigation, FAQ interactions, accessible controls, and SEO foundations.

## User preferences

- Keep Storm Automate spelled exactly as the brand name.
- Position independently owned med spas as the primary niche without making Storm Automate a med-spa-only product.
- Avoid fabricated social proof, business metrics, partnerships, or contact details.

## Gotchas

- The strategy-call form is not wired to email, a calendar, a CRM, or a database yet; it only demonstrates the intended UX and confirms locally in the browser.
- The production build command expects `PORT` and `BASE_PATH`, which are provided by the managed workflow.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
