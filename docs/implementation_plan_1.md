# STRATOBATER_SPEC.md

## 1. Project Overview
**Stratobater** is a specialized, progressive web application designed to bridge the gap between music theory visualization and ear training. It is optimized for both desktop and mobile use, specifically featuring a hands-free "Drive Mode" for aural practice.

## 2. Tech Stack & Infrastructure
- **Frontend Framework:** React (via Vite) + **TypeScript**
- **State Management:** Zustand
- **Music Theory Engine:** `@tonaljs/tonal`
- **Audio Engine:** `tone` (Tone.js)
- **Styling:** Tailwind CSS (v4)
- **Icons:** `lucide-react`
- **Deployment:** Containerized via Docker (multi-stage with Nginx) for Google Cloud Run (port 8080).
- **Structure:** Monorepo-lite (`web/` for frontend, `api/` for future backend).

## 3. Core Requirements (P0)

### Module 1: Fretboard Visualizer
- **Interactive Grid:** A 22-fret guitar neck.
- **Responsiveness:** Horizontal scroll on mobile (`overflow-x-auto`).
- **Dynamic Logic:** Use Tonal.js to calculate notes/intervals based on `root`, `scale`, and `tuning` state.
- **Highlighting:** Ability to toggle visibility for Roots and Triads simultaneously.
- **Keybindings (Use `useEffect` listener):** - `Left/Right Arrows`: Cycle through Keys.
  - `[` and `]`: Cycle through the curated Scale Pool.
  - `r`: Toggle Root highlighting.
  - `t`: Toggle Triad highlighting.
- **Visual Style:** Notes rendered as colored circles (Red=Root, Blue=Triad, Gray=Scale) on top of transparent fret cells (allowing string line to show through).

### Module 2: Ear Trainer
- **Quiz Types:** Interval, Chord Quality, and Scale identification.
- **Customization:** Checkboxes to select which specific intervals/chords are in the active quiz.
- **Hands-Free Drive Mode:** - An automated audio loop using `Tone.Transport` or `Tone.Loop`.
  - Pattern: Play Question -> 4s Pause -> Play/Speak Answer -> 2s Pause -> Loop.
  - **Crucial:** Integrate the `navigator.wakeLock` API to prevent mobile screen sleep.

## 4. Actionable Implementation Plan

This plan follows the **Micro-Atomic Commit** workflow defined in `CONTRIBUTING.md`. Each checkbox represents a single, isolated task or commit.

### Phase 1: Project Initialization & Configuration
- [x] `chore: Create directory structure (web/, api/)`
- [x] `chore: Initialize Vite React TypeScript project in web/`
- [x] `chore: Install core dependencies (zustand, clsx, lucide-react, tailwind-merge)`
- [x] `chore: Install music theory dependencies (@tonaljs/tonal, tone)`
- [x] `chore: Install dev dependencies (tailwindcss, @tailwindcss/postcss, postcss, autoprefixer)`
- [x] `chore: Initialize Tailwind CSS configuration`
- [x] `feat: Configure Tailwind theme and paths`
- [x] `chore: Add basic Dockerfile for web`
- [x] `chore: Add docker-compose.yml`

### Phase 2: Core State & Logic
- [x] `feat: Create Zustand store file structure`
- [x] `feat: Define initial StoreState interface (root, scale, tuning)`
- [x] `feat: Implement basic store actions (setRoot, setScale)`
- [x] `feat: Create fretboard utility file`
- [x] `feat: Implement string tuning logic in utility`
- [x] `feat: Implement scale calculation logic using Tonal.js`
- [x] `feat: Implement fretboard data generation (2D array)`

### Phase 3: Fretboard UI
- [x] `feat: Create Fretboard component scaffolding`
- [x] `feat: Render basic fretboard grid (css grid/flex)`
- [x] `feat: Style fretboard cells (fret wire, nut)`
- [x] `feat: Render note indicators (circles)`
- [x] `feat: Implement note coloring logic (Root vs Interval)`
- [x] `feat: Connect Fretboard to Zustand store`
- [x] `feat: Add horizontal scrolling for mobile`
- [x] `feat: Implement keyboard shortcuts (ArrowLeft/Right)`
- [x] `feat: Implement visibility toggles (r/t)`

### Phase 4: Ear Trainer & Audio
- [x] `feat: Create EarTrainer component scaffolding`
- [x] `feat: Initialize Tone.js synth`
- [x] `feat: Implement interval generation logic`
- [x] `feat: Create "Drive Mode" toggle UI`
- [x] `feat: Implement audio loop (Question -> Wait -> Answer)`
- [ ] `feat: Add speech synthesis for answers`
- [ ] `feat: Integrate Wake Lock API`

### Phase 5: Polish & Deployment Prep
- [ ] `feat: Add responsive layout wrapper`
- [ ] `feat: Add Lucide icons for UI controls`
- [ ] `chore: Configure Nginx for production build`
- [ ] `chore: Finalize Dockerfile multi-stage build`
