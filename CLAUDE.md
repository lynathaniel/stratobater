# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Stratobater** is a guitar fretboard and music theory learning app built with React and TypeScript. It features:
- Interactive fretboard visualization with scale notes
- Ear training module with interval playback
- Web Audio API integration via Tone.js
- Music theory calculations via Tonal.js

**Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, Tonal.js, Tone.js

## Repository Structure

```
stratobater/
├── web/                    # Main frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Fretboard.tsx   # Fretboard visualization
│   │   │   └── EarTrainer.tsx  # Ear training interface
│   │   ├── utils/         # Utility functions
│   │   │   ├── fretboard.ts    # Fretboard calculations
│   │   │   └── earTrainer.ts   # Ear training logic
│   │   ├── store/         # Zustand state management
│   │   │   └── useStore.ts     # Global app state
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
├── api/                   # Backend API (separate service)
├── docs/                  # Documentation
├── DEVELOPING.md          # Development workflow
├── CONTRIBUTING.md        # Contribution guidelines
└── docker-compose.yml     # Docker setup
```

## Common Development Commands

All commands must be run from the `web/` directory.

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Type check (no build)
npx tsc --noEmit
# OR
npm run type-check  # if script exists

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### State Management
- **Zustand** store (`src/store/useStore.ts`) manages global state:
  - `root` - musical key (e.g., 'C', 'F#')
  - `scaleType` - scale type (e.g., 'major', 'minor')
  - `tuning` - guitar tuning (array of note strings)
  - `showRoots` / `showTriads` - boolean toggles for fretboard highlighting

### Key Components

1. **Fretboard** (`src/components/Fretboard.tsx`)
   - Renders interactive guitar fretboard
   - Uses `getFretboard()` utility to compute note data
   - Keyboard shortcuts: Arrow keys (key), [ ] (scale), R (roots), T (triads)
   - Displays static string labels on the left

2. **EarTrainer** (`src/components/EarTrainer.tsx`)
   - Generates interval questions randomly
   - Plays two notes using Tone.js PolySynth
   - "Drive mode" for hands-free continuous loop
   - Uses Web Speech API to announce interval names
   - Wake Lock API to prevent screen sleep during practice

### Utility Functions

- **`fretboard.ts`**:
  - `getStringNotes(openNote, fretCount)` - calculates notes on a string
  - `getScaleNotes(root, scaleType)` - returns scale notes from Tonal.js
  - `getFretboard(root, scaleType, tuning, fretCount)` - generates complete 2D array of fret data with properties: `note`, `noteName`, `interval`, `isRoot`, `isTriad`, `inScale`

- **`earTrainer.ts`**:
  - `INTERVALS` - array of interval shorthand strings
  - `INTERVAL_NAMES` - mapping to full names (e.g., '3M' → 'Major Third')
  - `generateIntervalQuestion(root, intervals?)` - returns random interval question

### Data Flow
1. Zustand store holds user-selectable state
2. Fretboard component reads from store, calls `getFretboard()` with current tuning/root/scale
3. Utility functions use Tonal.js for music theory calculations (Note.transpose, Scale.get, etc.)
4. Results rendered with Tailwind CSS utility classes

## Important Notes

### Commit Workflow
This project uses a **micro-atomic commit** workflow. Before committing:
1. Ensure type checking passes (`npx tsc --noEmit`)
2. Ensure linting passes (`npm run lint`)
3. Ensure build succeeds (`npm run build`)
4. Commit with schema: `[<type>]: <description>`

See `CONTRIBUTING.md` for details. Types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`.

### Docker
```bash
# From project root
docker-compose up --build
```

### No Tests Yet
There is currently no test setup. If adding tests, consider Vitest with React Testing Library.

### Tailwind CSS
Tailwind v4 with `@tailwindcss/postcss`. Configuration in `tailwind.config.js`. Dark theme centered on `neutral-900`.

### Browser APIs Used
- Web Audio (Tone.js)
- Speech Synthesis (SpeechSynthesisUtterance)
- Wake Lock (navigator.wakeLock.request)
- Keyboard events (for fretboard controls)

### Fretboard Rendering Details
- Strings rendered in reverse order (high E at top, low E at bottom)
- `fretboardData.slice().reverse()` used in Fretboard.tsx:112
- Static string labels show lowercase 'e' for high E string (E4), otherwise uppercase first letter
- Nut is fret 0 with special styling (wider, border)

## References
- `DEVELOPING.md` - Pre-commit verification steps
- `CONTRIBUTING.md` - Commit message format and workflow
- `web/README.md` - (if exists) additional project info
