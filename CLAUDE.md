# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Stack

- **Next.js 14** with App Router (not Pages Router)
- **TypeScript** with path alias `@/*` → `./src/*`
- **Styled-components 6** for all styling (no Tailwind)
- **Framer Motion** for scroll-driven and interactive animations
- **Swiper** for carousels, **Lottie** for JSON animations, **GSAP** for advanced animations

## Architecture

Single-page portfolio with section-based anchor navigation (`#sobre`, `#projetos`, `#contato`). One additional route: `/handlink`.

### Key directories

- `src/app/components/` — One folder per section (Header, Hero, About, Projects, Jobs, Services, Techs). Each folder has `index.tsx` + `styles.ts`.
- `src/app/components/ui/` — Shared primitives: `default.ts` (Area, Box, Content, Button, MotionBox) and `typography.ts` (Heading, Text).
- `src/app/styles/` — `theme.ts` (colors, sizes, fonts), `global.ts` (createGlobalStyle), `styled.d.ts` (typed theme).
- `src/app/lib/` — `fonts.ts` (Next.js Google Font imports), `registry.tsx` (StyledComponentsRegistry for SSR).
- `src/app/providers.tsx` — Client-side ThemeProvider + StyledComponentsRegistry wrapper.
- `src/meta/` — Static data (e.g., `services.ts`).
- `src/lotties/` — Lottie JSON animation files.

### Styling conventions

- All styles are co-located in `styles.ts` next to the component.
- Use `$`-prefixed transient props for styled-components (e.g., `$width`, `$color`) to avoid passing them to the DOM.
- Theme is typed via `styled.d.ts`; access colors via `${({ theme }) => theme.colors.primary}` and sizes via `theme.sizes.*`.
- Responsive breakpoints: 1440px, 1024px, 834px, 428px — defined as media queries inside styled-components.

### Component conventions

- Mark components with `'use client'` when they use hooks, browser APIs, or animation libraries.
- Static/display-only sections can remain server components.
- Project data is hardcoded inside `Carrousel.tsx`; services data lives in `src/meta/services.ts`.

### Animation approach

- **Scroll parallax**: Use Framer Motion `useScroll` + `useTransform` (see Hero/Waves).
- **Enter animations**: Framer Motion `useAnimation` triggered by scroll events.
- **Ripple buttons**: Add `md-ripples` class to `<button>` elements to activate `@gabrielfins/ripple-effect`.
