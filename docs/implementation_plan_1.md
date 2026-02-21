# STRATOBATER_SPEC.md

## 1. Project Overview
**Stratobater** is a specialized, progressive web application designed to bridge the gap between music theory visualization and ear training. It is optimized for both desktop and mobile use, specifically featuring a hands-free "Drive Mode" for aural practice.

## 2. Tech Stack & Infrastructure
- **Frontend Framework:** React (via Vite)
- **State Management:** Zustand
- **Music Theory Engine:** `@tonaljs/tonal`
- **Audio Engine:** `tone` (Tone.js)
- **Styling:** Tailwind CSS
- **Icons:** `lucide-react`
- **Deployment:** Containerized via Docker (multi-stage with Nginx) for Google Cloud Run (port 8080).

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

### Module 2: Ear Trainer
- **Quiz Types:** Interval, Chord Quality, and Scale identification.
- **Customization:** Checkboxes to select which specific intervals/chords are in the active quiz.
- **Hands-Free Drive Mode:** - An automated audio loop using `Tone.Transport` or `Tone.Loop`.
  - Pattern: Play Question -> 4s Pause -> Play/Speak Answer -> 2s Pause -> Loop.
  - **Crucial:** Integrate the `navigator.wakeLock` API to prevent mobile screen sleep.

## 4. Implementation Instructions for Gemini CLI

**Prompt 1: Scaffolding & Setup**
> "Read STRATOBATER_SPEC.md. Initialize a Vite React project. Install dependencies: @tonaljs/tonal, tone, zustand, lucide-react, clsx, tailwind-merge. Setup Tailwind CSS. Create the standard React folder structure (components, store, utils)."

**Prompt 2: State & Theory Engine**
> "Create a Zustand store in `src/store/useStore.js`. State must include: `root` (default 'C'), `scaleType` (default 'major pentatonic'), `tuning` (default standard), and `activeModule`. Next, write a utility in `src/utils/fretboard.js` using Tonal.js that returns a 2D array representing the guitar neck (6 strings x 22 frets) with note, exact octave, and interval metadata for each fret."

**Prompt 3: UI - Fretboard**
> "Build the Fretboard component using CSS Grid/Flexbox and Tailwind. It must map over the 2D array from our theory engine. Include the logic to highlight the background color of frets if their interval is a root (e.g., '1P') or triad (e.g., '3M', '5P'). Make the container scrollable horizontally for mobile."

**Prompt 4: Audio & Ear Trainer**
> "Create the EarTrainer component. Initialize a `Tone.PolySynth` on user interaction. Build the 'Drive Mode' toggle that starts a `Tone.Loop` to play random intervals from a selected pool. Include the logic to request a Wake Lock from the browser when Drive Mode starts."

**Prompt 5: Containerization**
> "Create a multi-stage `Dockerfile` in the root. Stage 1 should use `node:18-alpine` to build the Vite app. Stage 2 should use `nginx:alpine` to serve the `/dist` folder on port 8080. Generate a basic `nginx.conf` to handle React client-side routing."
