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

### Fretboard Visualizer

- **22-fret guitar neck** with realistic string spacing
- **Dynamic scale rendering** - see all notes of any scale in any key
- **Custom tunings** - standard tuning out of the box, configurable via state
- **Note highlighting:**
  - Red circles for root notes
  - Blue circles for tonic triad notes
  - Gray circles for other scale tones
- **Toggle controls** to show/hide roots and triads
- **Keyboard shortcuts:**
  - `←` / `→` - cycle through keys
  - `[` / `]` - cycle through scales
  - `R` - toggle root highlighting
  - `T` - toggle triad highlighting
- **Responsive design** with horizontal scrolling on mobile
- **Static string labels** on the left (including lowercase 'e' for high E)

### Ear Trainer

- **Interval identification practice** - play two notes and guess the interval
- **Multiple intervals** - from minor 2nd to perfect octave
- **Audio engine** powered by Tone.js with high-quality synthesis
- **Speech synthesis** - hear interval names spoken aloud
- **Drive Mode** - hands-free continuous loop for focused practice
  - Pattern: Play root → Play interval → pause → play answer → speak interval name
  - Automatic looping with configurable timing
- **Wake Lock support** - prevents screen sleep during practice on mobile devices

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| State Management | Zustand |
| Routing | wouter |
| Music Theory | @tonaljs/tonal |
| Audio | tone (Tone.js) |
| Icons | lucide-react |
| Containerization | Docker + Nginx |

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

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the micro-atomic commit workflow.

## Project Structure

```
stratobater/
├── web/                    # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Fretboard.tsx
│   │   │   └── EarTrainer.tsx
│   │   ├── pages/
│   │   │   └── Landing.tsx
│   │   ├── utils/         # Music theory & audio utilities
│   │   │   ├── fretboard.ts
│   │   │   └── earTrainer.ts
│   │   ├── store/         # Zustand state
│   │   │   └── useStore.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── api/                   # Future backend service
├── docs/                  # Documentation
│   └── TODO.md           # Planned improvements
├── docker-compose.yml
├── CONTRIBUTING.md
└── DEVELOPING.md
```

## Contributing

We follow a strict **Micro-Atomic Commit** workflow. Each commit should represent a single, isolated logical change.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT
