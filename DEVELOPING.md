# Developing Stratobater

This guide outlines the development workflow, coding standards, and best practices for contributing to Stratobater.

## Prerequisites

- **Node.js** (v18+)
- **npm** or **yarn**
- **Docker** (for containerization tasks)

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Coding Conventions](#coding-conventions)
- [Component Guidelines](#component-guidelines)
- [State Management](#state-management)
- [Styling with Tailwind](#styling-with-tailwind)
- [Music Theory Utilities](#music-theory-utilities)
- [Audio with Tone.js](#audio-with-tonejs)
- [Browser APIs](#browser-apis)
- [Performance Considerations](#performance-considerations)
- [Verification Steps](#verification-steps)
- [Git Workflow](#git-workflow)

## Quick Start

```bash
# Install dependencies
cd web
npm install

# Start development server
npm run dev

# Run checks before committing
npm run type-check
npm run lint
npm run build
```

## Project Structure

```
web/src/
├── components/          # React components (UI-centric)
│   ├── Fretboard.tsx   # Fretboard visualizer
│   ├── EarTrainer.tsx  # Ear training interface
│   └── MainLayout.tsx  # App shell with navigation
├── pages/              # Page components (route-based)
│   └── Landing.tsx    # Home / landing page
├── utils/              # Pure utility functions (no React)
│   ├── fretboard.ts   # Fretboard calculations
│   └── earTrainer.ts  # Interval generation, question logic
├── store/              # Zustand store
│   └── useStore.ts    # Global application state
├── App.tsx            # Router + route definitions
├── main.tsx           # Entry point
└── index.css          # Global styles (minimal)
```

**Key Principle:** Keep business logic in `utils/`, UI in `components/`, and global state in `store/`.

## Coding Conventions

### Imports

Order imports consistently:
1. External packages (React, third-party libs)
2. Internal absolute imports (from `src/`)
3. Relative imports (from same/directories)

Example:
```tsx
import React from 'react';
import { Note } from '@tonaljs/tonal';
import { useStore } from '../store/useStore';
import { getFretboard } from '../utils/fretboard';
```

### Types and Interfaces

- Define explicit interfaces for data structures
- Export shared types from utility files (e.g., `FretData` from `fretboard.ts`)
- Use TypeScript's type inference where obvious, explicit types for public APIs

### Component Design

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract business logic into custom hooks or utility functions
- Destructure props and store values for clarity
- Use `React.useEffect` for side effects, cleanup when necessary

Example pattern (from `Fretboard.tsx`):
```tsx
export const Fretboard: React.FC = () => {
  const { root, scaleType, tuning, showRoots, showTriads, setRoot, setScaleType } = useStore();
  const fretboardData = getFretboard(root, scaleType, tuning);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { /* ... */ };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [root, scaleType, setRoot, setScaleType, toggleShowRoots, toggleShowTriads]);

  // Component body...
};
```

## State Management

- Global state lives in `store/useStore.ts` using Zustand
- State should be serializable (avoid functions, class instances)
- Keep state minimal; derive computed values in components/utils
- Actions should be simple and predictable

Example:
```ts
export const useStore = create<StoreState & StoreActions>((set) => ({
  root: 'C',
  scaleType: 'major',
  tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  showRoots: true,
  showTriads: false,
  setRoot: (root) => set({ root }),
  toggleShowRoots: () => set((state) => ({ showRoots: !state.showRoots })),
}));
```

## Styling with Tailwind

- Use Tailwind utility classes exclusively (no custom CSS unless unavoidable)
- Prefer Tailwind's arbitrary values for precise spacing (e.g., `h-[2px]`, `top-1/2`)
- Use `clsx` for conditional class names
- Follow the design system colors: `neutral-*`, `red-*`, `blue-*`, `green-*`
- Default dark theme: background `neutral-900`, text `white`/`neutral-*`
- Common sizes: `h-12` for fret rows, `w-16` for nut, `w-8 h-8` for note circles

Example:
```tsx
<div className={clsx(
  "h-12 flex items-center justify-center relative",
  fretIndex === 0 ? "w-16 flex-none border-r-4 border-neutral-400" : "flex-1"
)}>
```

## Music Theory Utilities

- All music theory logic lives in `utils/` (pure functions)
- Use `@tonaljs/tonal` for note/scale/chord calculations
- Functions should be deterministic: same input → same output
- Document return types with JSDoc or TypeScript interfaces

Example from `fretboard.ts`:
```ts
export const getStringNotes = (openNote: string, fretCount: number = 22): string[] => {
  return Array.from({ length: fretCount + 1 }, (_, i) => {
    const interval = Interval.fromSemitones(i);
    return Note.transpose(openNote, interval);
  });
};

export interface FretData {
  note: string;       // e.g., "C#4"
  noteName: string;   // pitch class e.g., "C#"
  interval: string | null;
  isRoot: boolean;
  isTriad: boolean;
  inScale: boolean;
}
```

## Audio with Tone.js

- Initialize Tone.js only after user interaction (button click)
- Use `Tone.start()` to unlock audio context
- Clean up audio resources when unmounting or stopping
- For continuous playback, use `Tone.Transport` / `Tone.Loop`
- Store synth instances in refs to persist across renders

Example pattern (from `EarTrainer.tsx`):
```tsx
const [started, setStarted] = useState(false);
const synth = useRef<Tone.PolySynth | null>(null);

const handleStart = async () => {
  await Tone.start();
  synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
  setStarted(true);
};
```

## Browser APIs

When using browser-specific APIs:

- **Check for support** with feature detection (`'wakeLock' in navigator`)
- **Handle errors gracefully** with try/catch
- **Clean up resources** on cleanup functions
- **Type casting** may be needed for newer APIs
- **User gesture required** for audio, wake lock, etc.

Examples:
```ts
// Web Speech API
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = 0.9;
window.speechSynthesis.speak(utterance);

// Wake Lock
if ('wakeLock' in navigator) {
  wakeLock = await navigator.wakeLock.request('screen');
}
```

## Performance Considerations

- Memoize expensive calculations if used in render (e.g., `getFretboard()` could be memoized with `useMemo`)
- Avoid creating new objects/arrays in render without `useMemo`/`useCallback`
- For fretboard rendering (22 frets × 6 strings = 132 cells), current approach is acceptable
- Use `useRef` for non-state values that persist across renders (synth, timers)
- Clean up event listeners, audio, and wake locks in `useEffect` cleanup

## Verification Steps

Before committing or opening a PR, ensure:

1. **Type Check** (no TypeScript errors)
   ```bash
   cd web
   npm run type-check  # or: npx tsc --noEmit
   ```

2. **Lint** (code style and potential issues)
   ```bash
   npm run lint
   ```
   Fix auto-fixable issues: `npm run lint -- --fix`

3. **Build** (confirm production build succeeds)
   ```bash
   npm run build
   ```

4. **Manual Testing** (run the app and verify changes)
   ```bash
   npm run dev
   ```

## Git Workflow

We follow a **Micro-Atomic Commit** workflow (see [CONTRIBUTING.md](../CONTRIBUTING.md)). Each commit should represent one logical change.

Commit message format:
```
[<type>]: <description>
```

Types: `feat`, `fix`, `docs`, `chore`, `style`, `refactor`

Example:
```
feat: Add keyboard shortcuts for fretboard
fix: Align string labels with fretboard rows
chore: Update dependencies to latest
```

**Steps:**
1. Make small, focused changes
2. Verify all checks pass locally
3. Stage and commit immediately
4. Push to remote

## Docker Development

For containerized development/testing:

```bash
# Build and run
docker-compose up --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The web service runs on `http://localhost:8080`.

## Common Pitfalls

1. **Forgetting to unlock audio context**: Tone.js requires user interaction before audio can play. Always initialize audio in a click handler.
2. **Memory leaks**: Clean up event listeners, audio nodes, and wake locks in `useEffect` returns.
3. **Alignment issues**: The fretboard uses `flex` with `h-12` rows. Labels should use `justify-start` (not `justify-around`) to align with rows.
4. **String line thickness**: The horizontal string lines use variable heights `[1,2,2,3,4,5]` matching string gauge, set via inline style.

## Future Considerations

- Add tests with Vitest + React Testing Library
- Implement more robust error handling for audio
- Add TypeScript strict mode across all files
- Consider using React Compiler (experimental)
- Add i18n support for internationalization

---

Need help? Check [CONTRIBUTING.md](../CONTRIBUTING.md) for commit guidelines and [README.md](../README.md) for feature overview.
