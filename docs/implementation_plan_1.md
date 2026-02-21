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

## 4. Implementation Instructions for Gemini CLI

**Phase 1: Project Structure & Scaffolding (TS)**
> "Create the root directories: `web/`, `api/`, `docs/`. Initialize a Vite React TypeScript project inside `web/`. Install dependencies: `zustand`, `@tonaljs/tonal`, `tone`, `clsx`, `lucide-react`, `tailwind-merge`. Configure Tailwind CSS v4 using `@tailwindcss/postcss`."

**Phase 2: Core Logic (The 'Brain')**
> "Create a Zustand store in `web/src/store/useStore.ts` with strict typing for `StoreState` (root, scale, tuning) and `Actions`. Write a utility in `web/src/utils/fretboard.ts` using Tonal.js that returns a 2D array of `FretData` representing the guitar neck (6 strings x 22 frets)."

**Phase 3: UI - Fretboard (TSX)**
> "Build the `Fretboard.tsx` component. Use CSS Grid/Flexbox and Tailwind. Map over the 2D array. Implement the 'Note Circle' visual style where cells are transparent and notes are centered circles. Add keyboard listeners for `ArrowLeft`/`ArrowRight` (key change) and `r`/`t` (toggles)."

**Phase 4: Audio & Ear Trainer (TSX)**
> "Create `EarTrainer.tsx`. Initialize a `Tone.PolySynth` on user interaction. Build the 'Drive Mode' toggle that starts a loop to play random intervals from a selected pool. implement logic: Play Question -> Wait -> Speak Answer -> Repeat. Add `navigator.wakeLock` handling."

**Phase 5: Containerization**
> "Create a multi-stage `web/Dockerfile`. Stage 1: `node:18-alpine` to build. Stage 2: `nginx:alpine` to serve `/dist` on port 8080. Create a `docker-compose.yml` in the root to orchestrate local dev."
