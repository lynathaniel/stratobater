# Stratobater

**Stratobater** is an interactive guitar fretboard and music theory learning application built with React and TypeScript. It provides tools for visualizing scales on the fretboard and training your ear with interval recognition.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

##Overview

Stratobater helps guitarists and music students understand music theory by providing:

- An interactive fretboard visualizer with dynamic scale rendering
- An ear trainer with interval playback and speech synthesis
- Customizable tunings, keys, and scales

The app is designed to be both educational and practical, with features like keyboard shortcuts for quick navigation and a "Drive Mode" for hands-free ear training practice.

## Features

### 🎸 Fretboard Visualizer

- **22-fret guitar neck** with realistic string spacing and gauge visualization
- **Dynamic scale rendering** - see all notes of any scale in any key
- **Custom tunings** - standard tuning out of the box, configurable via state
- **Advanced chord visualization:**
  - **Roman numeral analysis** - diatonic chords (I-vii°) with quality indicators (△, -, °)
  - **Chord extensions** - support for 6th, 7th, 9th, 11th, and 13th extensions
  - **Chord tone highlighting** - visual distinction between root, third, fifth, and extension notes
  - **Interactive chord selection** - click Roman numeral buttons to visualize specific chords
- **Note highlighting:**
  - Red circles for root notes
  - Blue circles for tonic triad notes
  - Gray circles for other scale tones
  - Special highlighting for chord tones when chord mode is active
- **Toggle controls** to show/hide roots, triads, and chord mode
- **Keyboard shortcuts:**
  - `←` / `→` - cycle through keys
  - `[` / `]` - cycle through scales
  - `R` - toggle root highlighting
  - `T` - toggle triad highlighting
  - `K` - open key selector modal
  - `S` - open scale selector modal
- **Responsive design** with horizontal scrolling on mobile
- **Static string labels** on the left (including lowercase 'e' for high E)
- **Note label modes** - switch between note names, scale degrees, or hidden labels

### 👂 Ear Trainer

- **Interval identification practice** - play two notes and guess the interval
- **Multiple intervals** - from minor 2nd to perfect octave
- **Audio engine** powered by Tone.js with high-quality synthesis
- **Speech synthesis** - hear interval names spoken aloud
- **Drive Mode** - hands-free continuous loop for focused practice
  - Pattern: Play root → Play interval → pause → play answer → speak interval name
  - Automatic looping with configurable timing
- **Wake Lock support** - prevents screen sleep during practice on mobile devices

### 🎛️ Advanced UI Controls

- **DualModeSelector** - sophisticated key/scale selection with two modes:
  - **Selection Mode** - quick selection from available keys/scales
  - **Edit Mode** - advanced customization with drag-and-drop reordering
- **Configurable items system:**
  - Toggle visibility of individual keys/scales
  - Bulk visibility operations with Shift-click
  - Drag-and-drop reordering for personalized layouts
  - Reset functionality to restore defaults
- **Keyboard navigation** - full keyboard support in modals with arrow keys
- **Auto-scroll** - focused items automatically scroll into view
- **Persistent state** - all customizations saved to local storage

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| State Management | Zustand (with persistence) |
| Routing | wouter |
| Music Theory | @tonaljs/tonal |
| Audio | tone (Tone.js) |
| Icons | lucide-react |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Utilities | clsx, tailwind-merge |
| Containerization | Docker + Nginx |
| Testing | Vitest, @testing-library/react, Playwright |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd web
npm install
```

### Development

```bash
cd web
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build

```bash
cd web
npm run build
```

### Docker

```bash
docker-compose up --build
```

## Development

Before committing, ensure:

1. Type check passes: `npx tsc --noEmit`
2. Linting passes: `npm run lint`
3. Build succeeds: `npm run build`
4. Tests pass: `npm run test`

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the micro-atomic commit workflow and [DEVELOPING.md](./DEVELOPING.md) for detailed development guidelines.

## Architecture

### State Management
- **Zustand** store (`src/store/useStore.ts`) manages global state with persistence:
  - `root` - musical key (e.g., 'C', 'F#')
  - `scaleType` - scale type (e.g., 'major', 'minor')
  - `tuning` - guitar tuning (array of note strings)
  - `showRoots` / `showTriads` / `showChordMode` - boolean toggles for fretboard highlighting
  - `noteLabelMode` - display mode for note labels ('noteNames', 'scaleDegrees', 'none')
  - `keyItems` / `scaleItems` - configurable arrays with visibility and ordering
  - `selectedRomanDegree` - currently selected Roman numeral for chord visualization (1-7)
  - `chordExtension` - chord extension type ('6th', '7th', '9th', '11th', '13th', or null)

### Key Components

1. **Fretboard** (`src/components/Fretboard.tsx`)
   - Renders interactive guitar fretboard with chord visualization
   - Uses `getFretboard()` utility to compute note data including chord tones
   - Keyboard shortcuts: Arrow keys (key), [ ] (scale), R (roots), T (triads), K (keys), S (scales)
   - Displays static string labels on the left
   - Integrates with DualModeSelector for key/scale selection

2. **EarTrainer** (`src/components/EarTrainer.tsx`)
   - Generates interval questions randomly
   - Plays two notes using Tone.js PolySynth
   - "Drive mode" for hands-free continuous loop
   - Uses Web Speech API to announce interval names
   - Wake Lock API to prevent screen sleep during practice

3. **DualModeSelector** (`src/components/DualModeSelector/`)
   - Advanced modal for key/scale selection and customization
   - Two modes: Selection Mode (quick selection) and Edit Mode (advanced customization)
   - Drag-and-drop reordering using @dnd-kit
   - Bulk visibility operations with Shift-click
   - Full keyboard navigation with auto-scroll
   - Persistent state management

### Utility Functions

- **`fretboard.ts`**:
  - `getStringNotes(openNote, fretCount)` - calculates notes on a string
  - `getScaleNotes(root, scaleType)` - returns scale notes from Tonal.js
  - `getFretboard(root, scaleType, tuning, fretCount, selectedRomanDegree, chordExtension)` - generates complete 2D array of fret data with properties: `note`, `noteName`, `interval`, `isRoot`, `isTriad`, `inScale`, `scaleDegree`, `accidentalPrefix`, `isChordTone`, `chordToneRole`
  - `getDiatonicChordQuality(scaleType, degree)` - returns chord quality for a scale degree
  - `getRomanNumeralButtons(scaleType)` - generates Roman numeral buttons with quality symbols
  - `getChordToneDegrees(romanDegree, extension)` - calculates which scale degrees are chord tones
  - `getChordRoot(root, scaleType, romanDegree)` - calculates the root note of a chord

- **`earTrainer.ts`**:
  - `INTERVALS` - array of interval shorthand strings
  - `INTERVAL_NAMES` - mapping to full names (e.g., '3M' → 'Major Third')
  - `generateIntervalQuestion(root, intervals?)` - returns random interval question

### Data Flow
1. Zustand store holds user-selectable state including chord visualization settings
2. Fretboard component reads from store, calls `getFretboard()` with current tuning/root/scale/chord settings
3. Utility functions use Tonal.js for music theory calculations (Note.transpose, Scale.get, etc.)
4. Results rendered with Tailwind CSS utility classes
5. DualModeSelector updates store with key/scale visibility and ordering changes
6. All state changes persist to local storage via Zustand middleware

## Important Notes

### Chord Visualization System
The chord visualization system uses Roman numeral analysis to represent diatonic chords within a scale:
- **Roman numerals** (I-vii°) indicate the scale degree of each chord's root
- **Quality symbols** (△, -, °) indicate chord type:
  - △ (triangle) = Major chord
  - - (minus) = Minor chord
  - ° (degree) = Diminished chord
- **Extensions** add color tones to basic triads:
  - 6th = adds the 6th scale degree
  - 7th = adds the 7th scale degree
  - 9th = adds the 9th scale degree (same as 2nd, one octave up)
  - 11th = adds the 11th scale degree (same as 4th, one octave up)
  - 13th = adds the 13th scale degree (same as 6th, one octave up)
- **Chord tone roles** are calculated based on the selected Roman numeral and extension:
  - Root = chord's root note (based on Roman numeral degree)
  - Third = chord's third (major or minor based on quality)
  - Fifth = chord's fifth (perfect, diminished, or augmented based on quality)
  - Extension = the added extension note (6th, 7th, 9th, 11th, or 13th)

### Commit Workflow
This project uses a **micro-atomic commit** workflow. Before committing:
1. Ensure type checking passes (`npx tsc --noEmit`)
2. Ensure linting passes (`npm run lint`)
3. Ensure build succeeds (`npm run build`)
4. Ensure tests pass (`npm run test`)
5. Commit with schema: `[<type>]: <description>`

See `CONTRIBUTING.md` for details. Types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`, `test`.

### Docker
```bash
# From project root
docker-compose up --build
```

### Testing
```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed
```

### Tailwind CSS
Tailwind v4 with `@tailwindcss/postcss`. Configuration in `tailwind.config.js`. Dark theme centered on `neutral-900`.

### Browser APIs Used
- Web Audio (Tone.js)
- Speech Synthesis (SpeechSynthesisUtterance)
- Wake Lock (navigator.wakeLock.request)
- Keyboard events (for fretboard controls)
- Local Storage (via Zustand persistence middleware)

### Fretboard Rendering Details
- Strings rendered in reverse order (high E at top, low E at bottom)
- `fretboardData.slice().reverse()` used in Fretboard.tsx
- Static string labels show lowercase 'e' for high E string (E4), otherwise uppercase first letter
- Nut is fret 0 with special styling (wider, border)
- Chord tones are highlighted with different colors based on their role (root, third, fifth, extension)

## Project Structure

```
stratobater/
├── web/                    # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Fretboard.tsx       # Fretboard visualization with chord support
│   │   │   ├── EarTrainer.tsx      # Ear training interface
│   │   │   ├── MainLayout.tsx      # App shell with navigation
│   │   │   └── DualModeSelector/   # Advanced key/scale selector
│   │   │       ├── index.tsx       # Main modal component
│   │   │       ├── SelectionModeList.tsx  # Quick selection mode
│   │   │       ├── EditModeList.tsx       # Advanced edit mode
│   │   │       └── DraggableItem.tsx      # Drag-and-drop item
│   │   ├── pages/
│   │   │   └── Landing.tsx    # Home / landing page
│   │   ├── utils/         # Music theory & audio utilities
│   │   │   ├── fretboard.ts       # Fretboard calculations & chord theory
│   │   │   └── earTrainer.ts      # Interval generation, question logic
│   │   ├── store/         # Zustand state
│   │   │   └── useStore.ts        # Global app state with persistence
│   │   ├── App.tsx        # Router + route definitions
│   │   └── main.tsx       # Entry point
│   ├── docs/              # Component documentation (for agent context)
│   │   └── components/     # Detailed component architecture docs
│   ├── package.json
│   └── vite.config.ts
├── api/                   # Future backend service
├── docs/                  # Project documentation
│   ├── TODO.md           # Planned improvements
│   └── implementation_plan_1.md  # Original implementation plan
├── docker-compose.yml
├── CONTRIBUTING.md        # Micro-atomic commit workflow
└── DEVELOPING.md          # Development workflow & coding standards
```

## Contributing

We follow a strict **Micro-Atomic Commit** workflow. Each commit should represent a single, isolated logical change.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT
