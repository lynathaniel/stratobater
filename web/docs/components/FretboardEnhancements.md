# Fretboard Enhancements

## Overview

The Fretboard component has been enhanced with advanced features including chord visualization, Roman numeral analysis, note label modes, and improved keyboard controls. This document details the enhancements made to the original fretboard implementation.

## User Documentation

### New Features

#### Chord Visualization

- **Roman Numeral Buttons**: Click to visualize diatonic chords (I-vii°)
- **Quality Indicators**: See chord quality at a glance (△, -, °)
- **Chord Extensions**: Add 6th, 7th, 9th, 11th, or 13th extensions
- **Chord Tone Highlighting**: Different colors for root, third, fifth, and extension notes
- **Toggle Chord Mode**: Press `C` or use the toggle to show/hide chord visualization

#### Note Label Modes

- **Note Names**: Display note names (C, D, E, F#, etc.)
- **Scale Degrees**: Display scale degrees (1, 2, 3, 4, 5, 6, 7)
- **Hidden**: Hide all note labels
- **Toggle**: Press `L` to cycle through label modes

#### Enhanced Keyboard Controls

- **K**: Open key selector modal
- **S**: Open scale selector modal
- **C**: Toggle chord mode
- **L**: Cycle through note label modes
- **Arrow Keys**: Navigate keys (←/→) and scales ([/])

#### Improved Visual Feedback

- **Chord Tone Colors**: 
  - Red: Root notes
  - Blue: Third notes
  - Green: Fifth notes
  - Purple: Extension notes
- **Quality Symbols**: Roman numeral buttons show chord quality
- **Active State**: Visual indication of selected chord and extension

### How to Use

#### Visualizing Chords

1. **Select a Key and Scale**: Use arrow keys or the modals
2. **Enable Chord Mode**: Press `C` or click the toggle
3. **Select a Chord**: Click a Roman numeral button
4. **Add Extensions**: Use the extension selector
5. **View Chord Tones**: Chord tones are highlighted on the fretboard

#### Changing Note Labels

1. **Cycle Label Modes**: Press `L` to switch between:
   - Note names (C, D, E, F#)
   - Scale degrees (1, 2, 3, 4, 5, 6, 7)
   - Hidden (no labels)

#### Using Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Cycle through keys |
| `[` / `]` | Cycle through scales |
| `R` | Toggle root highlighting |
| `T` | Toggle triad highlighting |
| `C` | Toggle chord mode |
| `L` | Cycle note label modes |
| `K` | Open key selector |
| `S` | Open scale selector |

## Technical Documentation

### Architecture

The enhanced Fretboard component follows a layered architecture:

```
Fretboard Component
├── State Layer (Zustand)
│   ├── Key/Scale selection
│   ├── Chord visualization settings
│   └── Note label mode
├── Calculation Layer (fretboard.ts)
│   ├── Scale note calculation
│   ├── Chord tone calculation
│   └── Roman numeral generation
└── Presentation Layer (Fretboard.tsx)
    ├── Fret rendering
    ├── Note display
    └── UI controls
```

### Component Structure

#### Fretboard Component

Main component that renders the fretboard and manages user interactions.

**State:**
```typescript
const { root, scaleType, tuning, showRoots, showTriads, showChordMode, noteLabelMode, selectedRomanDegree, chordExtension } = useStore();
```

**Key Features:**
- Renders 22-fret guitar neck
- Displays scale notes with highlighting
- Shows chord tones when chord mode is active
- Handles keyboard shortcuts
- Integrates with DualModeSelector

#### Roman Numeral Buttons

Row of buttons at the top of the fretboard for chord selection.

**Implementation:**
```typescript
const romanButtons = getRomanNumeralButtons(scaleType);

{romanButtons.map((button) => (
  <button
    key={button.degree}
    onClick={() => setSelectedRomanDegree(button.degree)}
    className={selectedRomanDegree === button.degree ? 'active' : ''}
  >
    {button.roman}
  </button>
))}
```

#### Extension Selector

Dropdown for selecting chord extensions.

**Options:**
- None (triad only)
- 6th
- 7th
- 9th
- 11th
- 13th

#### Note Label Display

Conditional rendering based on `noteLabelMode`:

```typescript
const getNoteLabel = (fret: FretData) => {
  switch (noteLabelMode) {
    case 'noteNames':
      return fret.noteName;
    case 'scaleDegrees':
      return fret.scaleDegree.toString();
    case 'none':
      return '';
    default:
      return fret.noteName;
  }
};
```

### Enhanced Data Structures

#### FretData Interface

```typescript
interface FretData {
  note: number;              // MIDI note number
  noteName: string;          // Note name (e.g., 'C', 'F#')
  interval: string;          // Interval from root (e.g., '1P', '3M')
  isRoot: boolean;           // Is this a scale root?
  isTriad: boolean;          // Is this a triad tone?
  inScale: boolean;          // Is this note in the scale?
  scaleDegree: number;       // Scale degree (1-7)
  accidentalPrefix: string;  // Accidental prefix ('', '#', 'b')
  isChordTone: boolean;      // Is this a chord tone?
  chordToneRole: ChordToneRole;  // Role in chord (if chord mode active)
}
```

#### ChordToneRole Type

```typescript
type ChordToneRole = 'root' | 'third' | 'fifth' | 'extension' | null;
```

### Keyboard Event Handling

**Event Listener:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        // Cycle to previous key
        break;
      case 'ArrowRight':
        e.preventDefault();
        // Cycle to next key
        break;
      case '[':
        e.preventDefault();
        // Cycle to previous scale
        break;
      case ']':
        e.preventDefault();
        // Cycle to next scale
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        toggleShowRoots();
        break;
      case 't':
      case 'T':
        e.preventDefault();
        toggleShowTriads();
        break;
      case 'c':
      case 'C':
        e.preventDefault();
        toggleChordMode();
        break;
      case 'l':
      case 'L':
        e.preventDefault();
        cycleNoteLabelMode();
        break;
      case 'k':
      case 'K':
        e.preventDefault();
        openKeySelector();
        break;
      case 's':
      case 'S':
        e.preventDefault();
        openScaleSelector();
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [/* dependencies */]);
```

### Note Label Mode Cycling

**Implementation:**
```typescript
const cycleNoteLabelMode = () => {
  const modes: NoteLabelMode[] = ['noteNames', 'scaleDegrees', 'none'];
  const currentIndex = modes.indexOf(noteLabelMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  setNoteLabelMode(modes[nextIndex]);
};
```

### Chord Tone Color Mapping

**Color Scheme:**
```typescript
const getChordToneColor = (role: ChordToneRole) => {
  switch (role) {
    case 'root':
      return 'bg-red-500';
    case 'third':
      return 'bg-blue-500';
    case 'fifth':
      return 'bg-green-500';
    case 'extension':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
};
```

### Integration with DualModeSelector

**State Updates:**
```typescript
const handleKeySelect = (key: string) => {
  setRoot(key);
  closeKeySelector();
};

const handleScaleSelect = (scale: string) => {
  setScaleType(scale);
  closeScaleSelector();
};
```

**Modal State:**
```typescript
const [isKeySelectorOpen, setIsKeySelectorOpen] = useState(false);
const [isScaleSelectorOpen, setIsScaleSelectorOpen] = useState(false);
```

## Developer Documentation

### Adding New Note Label Modes

To add a new note label mode:

1. **Update NoteLabelMode type**:
   ```typescript
   type NoteLabelMode = 'noteNames' | 'scaleDegrees' | 'none' | 'newMode';
   ```

2. **Update mode cycling**:
   ```typescript
   const modes: NoteLabelMode[] = ['noteNames', 'scaleDegrees', 'none', 'newMode'];
   ```

3. **Update label rendering**:
   ```typescript
   const getNoteLabel = (fret: FretData) => {
     switch (noteLabelMode) {
       case 'newMode':
         return getNewLabel(fret);
       // ... existing cases
     }
   };
   ```

4. **Update UI** to show the new mode

### Customizing Chord Tone Colors

To customize chord tone colors:

1. **Update color mapping**:
   ```typescript
   const getChordToneColor = (role: ChordToneRole) => {
     switch (role) {
       case 'root':
         return 'bg-custom-red';
       // ... other cases
     }
   };
   ```

2. **Update Tailwind config** if using custom colors:
   ```javascript
   // tailwind.config.js
   module.exports = {
     theme: {
       extend: {
         colors: {
           'custom-red': '#ff0000',
         },
       },
     },
   };
   ```

### Adding New Keyboard Shortcuts

To add a new keyboard shortcut:

1. **Add case to keyboard handler**:
   ```typescript
   case 'x':
   case 'X':
     e.preventDefault();
     handleNewShortcut();
     break;
   ```

2. **Implement handler function**:
   ```typescript
   const handleNewShortcut = () => {
     // Your logic here
   };
   ```

3. **Update documentation** to reflect the new shortcut

### Performance Considerations

- Fretboard rendering is O(n × m) where n is strings and m is frets
- Chord calculations add O(n) overhead per render
- Consider memoizing expensive calculations if performance issues arise
- Virtualization not needed for 22 frets × 6 strings = 132 notes

### Accessibility

**ARIA Attributes:**
```typescript
<div
  role="application"
  aria-label="Guitar fretboard"
  aria-keyshortcuts="ArrowLeft ArrowRight [ ] R T C L K S"
>
  {/* Fretboard content */}
</div>
```

**Keyboard Navigation:**
- All features accessible via keyboard
- Focus management for modals
- Clear visual feedback for focused elements

### Testing

Test cases to consider:

1. **Chord visualization**: Verify correct chord tones for each Roman numeral
2. **Extension calculation**: Verify correct extension notes
3. **Note label modes**: Verify correct labels for each mode
4. **Keyboard shortcuts**: Verify all shortcuts work correctly
5. **State persistence**: Verify settings survive page reload
6. **Responsive design**: Verify layout works on different screen sizes
7. **Accessibility**: Verify ARIA attributes and keyboard navigation
8. **Performance**: Verify smooth rendering with all features enabled

### Dependencies

- **@tonaljs/tonal**: Music theory calculations
- **Zustand**: State management with persistence
- **React**: UI rendering and state management
- **Tailwind CSS**: Styling

### Related Files

- `web/src/components/Fretboard.tsx` - Main fretboard component
- `web/src/utils/fretboard.ts` - Fretboard calculations
- `web/src/store/useStore.ts` - State management
- `web/src/components/DualModeSelector/` - Key/scale selector

### Future Enhancements

Potential improvements to the fretboard:

1. **Finger position suggestions**: Suggest optimal finger positions
2. **Scale pattern visualization**: Show scale patterns across the fretboard
3. **Arpeggio visualization**: Show arpeggio patterns
4. **Interval visualization**: Show intervals between notes
5. **Custom tunings**: Allow users to create custom tunings
6. **Left-handed mode**: Mirror the fretboard for left-handed players
7. **Fret markers**: Add fret markers (3, 5, 7, 9, 12, etc.)
8. **Note duration**: Show note duration when playing
9. **Recording**: Record and playback fretboard interactions
10. **Export**: Export fretboard as image or PDF

### Migration from Original Fretboard

If migrating from the original fretboard implementation:

1. **Update state management**: Add new state properties for chord visualization
2. **Update data structures**: Add new properties to FretData interface
3. **Update rendering**: Add chord tone highlighting and Roman numeral buttons
4. **Update keyboard handlers**: Add new keyboard shortcuts
5. **Update styling**: Add new styles for chord tones and UI elements
6. **Test thoroughly**: Verify all features work correctly

### Breaking Changes

Be aware of these breaking changes when updating:

1. **FretData interface**: Added new properties (`isChordTone`, `chordToneRole`)
2. **State structure**: Added new state properties for chord visualization
3. **Keyboard shortcuts**: Added new shortcuts that may conflict with existing ones
4. **Styling**: Changed color scheme for chord tones

### Backward Compatibility

To maintain backward compatibility:

1. **Provide default values** for new state properties
2. **Make new features optional** via toggles
3. **Preserve existing keyboard shortcuts** when adding new ones
4. **Use feature flags** for experimental features
