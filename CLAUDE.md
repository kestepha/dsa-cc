# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page character creator ("Heldenerschaffung") for **Das Schwarze Auge (DSA)**, the German pen-and-paper RPG. Built with Vite, React 18, TypeScript, TailwindCSS, and Zustand. All UI text, data, and domain terminology (property names, step labels, etc.) are in German — match that when adding features.

## Commands

```bash
npm install       # install dependencies
npm run dev       # start dev server with HMR at http://localhost:5173
npm run build     # type-check (tsc -b) then production build via Vite
npm run preview   # preview the production build locally
```

There is no lint script and no test suite configured. `npm run build` is the only available correctness check (TypeScript compiler in `--build` mode followed by Vite build) — run it to catch type errors after making changes.

## Architecture

The app is a single Zustand store (`src/store/characterStore.ts`) driving a 5-step wizard rendered by `App.tsx`. Each step is a standalone component in `src/components/` that reads/writes the store directly (no prop drilling): `ErfahrungsgradSelector` → `SpeciesSelector` → `CultureSelector` → `ProfessionSelector` → `PropertyEditor`, plus `APCostSummary` as a persistent sidebar.

**Data flow for rule logic:** static game data lives in `src/data/*.ts` (`erfahrungsgrade.ts`, `species.ts`, `cultures.ts`, `professions.ts`) as plain typed arrays — this is the place to add/edit game content. All derived calculations (AP costs, property sums, min/max checks) live in `src/utils/apCalculator.ts` and are pure functions that take IDs/values and look up the data arrays themselves; the store never computes these inline, it just calls into `apCalculator`. Types for both the data shapes and the live character state are centralized in `src/types/character.ts`.

**Key domain mechanics to preserve when touching this code:**
- Properties (MU, KL, IN, CH, FF, GE, KO, KK) start at a base value of 8. AP cost to raise a property is non-linear: 15 AP/point up to 14, then increasing cost per point above 14 (see `getPropertyCostFromBase` / `getPropertyIncrementCost`).
- Species apply `propertyMods` to the base properties, including `CHOICE` mods where the player picks which property receives a modifier (tracked via `speciesChoice.propertyChoices`, keyed by a deterministic `${speciesId}_${pos|neg}_${sortedChoices}` string built in both `characterStore.ts` and `apCalculator.ts` — keep these key-generation sites in sync if changed).
- `Erfahrungsgrad` (experience level) caps total AP, max single property value, and max property sum — enforced in `canIncreaseProperty`/`canIncreaseProperty` style guards before mutating store state.
- Culture and Profession selectors filter available options by `speciesIds`/`speciesConstraint`/`cultureConstraint` on the data entries — changing species resets culture/profession selection in the store (`setSpecies`).
- Character import/export (in `App.tsx`) round-trips the `Character` shape as JSON; only minimal shape validation is done on import (`erfahrungsgradId`, `properties`, `speciesChoice` presence).

**Styling:** Tailwind utility classes plus a themed component layer defined in `src/index.css` (`@layer components`): `dark-panel`, `parchment-panel`, `fantasy-btn`/`fantasy-btn-outline`/`fantasy-btn-danger`, `selection-card`/`selection-card-active`, `property-btn-increase`/`-decrease`, `ap-badge*`, `section-title`/`subsection-title`. Prefer reusing these over writing new ad-hoc utility chains — they encode the fantasy/parchment visual theme (colors `parchment`, `abyss`, `gold`, `blood`, `forest` defined in `tailwind.config.js`).

## Rule reference

The implemented rules follow the official DSA rules wiki:
- https://dsa.ulisses-regelwiki.de/Heldenerschaffung.html
- https://dsa.ulisses-regelwiki.de/Erfahrung.html

When adding or changing game mechanics, check these as the source of truth rather than guessing at DSA rules.
