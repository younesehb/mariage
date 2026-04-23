# zaffa

> A wedding-planning web app for the Moroccan diaspora in Belgium.
> Find salles, traiteurs, ziana, nachid, and more — then run the whole planning process in one place (budget, invités, checklist).

**Status**: MVP, fixture-backed (no live backend yet). Public repo, proprietary for now.

## Stack

- **Next.js 16** + **React 19.2** (App Router, RSC)
- **TypeScript**, **Tailwind v4**, **@base-ui/react** primitives, `tw-animate-css` for motion
- **MapLibre + react-map-gl** with OpenStreetMap tiles
- **Bun** as package manager + runtime
- No backend, no tests — fixtures in `web/lib/fixtures/`, state in `localStorage`

## Getting started

```bash
cd web
bun install
bun dev      # http://localhost:3000
```

**Verification** = `bun run build` passes. There is no test runner.

```bash
bun run build   # type-check + compile
bun run lint    # eslint (flat config)
```

## Repository layout

```
.
├── web/                 # the app (Next.js 16)
│   ├── app/             # route tree; (site) / admin / pro as route groups
│   ├── components/      # UI components (listing-card, venue-map, …)
│   ├── lib/             # fixtures, planner logic, types, category metadata
│   └── AGENTS.md        # Next.js 16 warning for AI tools
├── CLAUDE.md            # architecture + conventions (for Claude Code)
├── design.md            # canonical design-system reference
└── docs/
    ├── specs/           # feature specs
    └── plans/           # implementation plans
```

## Key design principles

- **One accent colour** (garnet); greens/ambers/reds are strictly semantic.
- **Two fonts**: Fraunces (serif headlines) + Inter (body). Never Inter for `h1`.
- **Halal is implicit** — no toggle. Alcohol/certification flags are intentionally absent.
- **Instagram first, WhatsApp second, email third** for vendor contact (order is load-bearing).
- **Two-day weddings first-class** — men/women split supported throughout the data model.
- **FR is source-of-truth**, NL is a peer (not machine-translated). Arabic/RTL is out of scope for v1.

More context: [`design.md`](./design.md) · [`CLAUDE.md`](./CLAUDE.md)

## License

All rights reserved. Not open-source; public for visibility only.
