# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern, minimalist portfolio template built with Astro and Tailwind CSS v4. It's designed to be easily customizable through a single configuration file while maintaining a clean, professional appearance.

## Tech Stack

- **Astro**: Static site generator
- **Tailwind CSS v4**: Utility-first CSS framework using the new @tailwindcss/vite plugin
- **TypeScript**: For type-safe configuration
- **Tabler Icons**: Icon library

## Development Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Architecture

The project follows a component-based architecture with all customization centralized in `src/config.ts`:

- **Components** (`src/components/`): Individual Astro components for each section (Hero, About, Principles, ResearchInterests, Projects, Experience, Education), wrapped by `Section.astro`; Header/Footer are rendered by `Site.astro`
- **Main Layout** (`src/pages/index.astro`): Single-page layout that imports all components
- **Configuration** (`src/config.ts`): Single source of truth for all content and customization

### Key Architectural Decisions

1. **Single Configuration File**: All content is managed through `src/config.ts` to make customization simple
2. **Conditional Rendering**: Sections automatically hide if their data is removed from the config
3. **Component Independence**: Each section is a self-contained component that reads from the config
4. **Accent Color System**: Single `accentColor` in config propagates throughout the site via CSS custom properties

## Important Implementation Details

- The site uses Tailwind CSS v4 with the Vite plugin configuration
- No linting or testing framework is currently configured
- All components are in `.astro` format (not React/Vue/etc)
- Public pages (home, `/work/<slug>`, `/projects/<slug>`) use `src/layouts/Site.astro` + `src/styles/site.css`: system SF-style sans for text, IBM Plex Mono (400/500, Google Fonts) for labels and meta, light/dark themes via `data-theme` on `<html>` (saved toggle, else OS setting), and `[data-reveal]` scroll reveal that is skipped under `prefers-reduced-motion`
- Colors are CSS variables exposed as Tailwind colors (`bg`, `bg-2`, `tile`, `tile-2`, `fg`, `fg-2`, `fg-3`, `line`, `accent`); use those instead of `gray-*` so both themes work
- The dashboard keeps `src/layouts/Base.astro` + `global.css` (IBM Plex Mono, light only)
- Social links in the config are all optional and will conditionally render

## Private dashboard

`/dashboard` is a password-protected, server-rendered view of Jungwoo's Notion Hub (deploys to Vercel via `@astrojs/vercel`; every other page stays prerendered).

- `src/middleware.ts` guards `/dashboard/*` and `/api/dashboard/*` with an HMAC-signed cookie (`src/lib/auth.ts`).
- `src/lib/dashboard.ts` reads the Hub's data sources and performs the only writes: mark coursework/research done, add/archive Inbox notes. Writes check the page's parent data source before updating.
- Server secrets come from `astro:env/server`: `NOTION_DASHBOARD_TOKEN`, `DASHBOARD_PASSWORD`, `DASHBOARD_SECRET` (see `.env.example`). Without the password and secret the dashboard stays locked.

## Working with Components

When modifying components:
1. Components read directly from the imported `siteConfig` object
2. Use Tailwind utility classes for styling
3. Use the theme color tokens above, and check pages in both light and dark mode
4. Use Tabler-style stroke icons via `src/components/Icon.astro`

## Configuration Structure

The `src/config.ts` exports a `siteConfig` object with these sections:
- Basic info: name, title, description, accentColor
- Social links: email, linkedin, twitter, github (all optional)
- aboutMe: string
- skills: string[]
- projects: array of {name, description, highlight?, link, skills} — fallback only; at build time `src/lib/notion.ts` loads projects from the Notion "Projects" database when `NOTION_TOKEN` is set (see `.env.example`)
- experience: array of {company, title, dateRange, bullets}
- education: array of {school, degree, dateRange, achievements}