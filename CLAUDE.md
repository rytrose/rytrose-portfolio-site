# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run lint   # ESLint
```

No test suite is configured.

## Architecture

This is a Next.js portfolio site with four main pages: home (`/`), projects (`/projects`), about (`/about`), and an interactive graffiti canvas (`/graffiti`).

### Graffiti Canvas

The most complex feature. Users collaboratively draw on a shared canvas backed by AWS S3. Canvas state is serialized as YAML, compressed with lz-string, and stored at `s3://rytrose-personal-website/`. Drawing uses Fabric.js with a custom spray-paint brush (`utils/fabric/models/GraffitiBrush.js`) that emits particles (`GraffitiParticle.js`) grouped into strokes (`GraffitiGroup.js`).

Sound synthesis runs through Elementary Audio (`@elemaudio/web-renderer`) with Tone.js for setup. Each brush stroke's HSL color maps to pitch/octave; stroke density maps to note probability. See `utils/sound/GraffitiSound.js`.

Visitor state (paint color, brush settings) is persisted in localStorage via `hooks/useVisitor.js` with a `useReducer` pattern.

### State Management

No external state library — plain React hooks throughout. Persistent state lives in S3 (canvas) and localStorage (visitor preferences).

### Key Custom Hooks

- `useVisitor()` — visitor UUID + paint state in localStorage
- `useFabric(options)` — Fabric.js canvas lifecycle with cleanup
- `useResizeObserver()` — responsive canvas resizing
- `useTailwindBreakpoint(breakpoint)` — detects Tailwind breakpoint matches

### AWS / S3

Images and graffiti state are stored in S3 bucket `rytrose-personal-website`. The API route `pages/api/graffiti.js` handles reads/writes. S3 client is initialized in `utils/s3.js`. Required env vars:

```
RYTROSE_AWS_ACCESS_KEY_ID
RYTROSE_AWS_SECRET_ACCESS_KEY
RYTROSE_ADMIN_KEY
```

Remote image domain for Next.js Image: `https://rytrose-personal-website.s3.amazonaws.com/portfolio-site/**`

### Styling

Tailwind CSS with two custom fonts: Poppins (`font-sans`) and DM Serif Text (`font-serif`). Custom breakpoint `can-hover` for hover-capable devices. Font variables are injected in `pages/_app.js` and consumed via CSS variables in `styles/globals.css`.

### Notable Config

- `reactStrictMode: false` in `next.config.js` (intentional — Fabric.js canvas has issues with double-mount in strict mode)
- Color palette generation uses `utils/color.js` with `prando` for deterministic randomness seeded by date
