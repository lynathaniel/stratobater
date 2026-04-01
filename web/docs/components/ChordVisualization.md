# Chord Visualization System

## Overview

The chord visualization system provides interactive Roman numeral analysis and chord extension support for the fretboard. Users can select diatonic chords by their Roman numeral (I-vii°) and visualize chord tones with extensions.

## User Documentation

### Features

- **Roman Numeral Buttons**: Click any Roman numeral (I-vii°) to visualize that chord on the fretboard
- **Quality Indicators**: Each button shows chord quality:
  - △ (triangle) = Major chord
  - - (minus) = Minor chord
  - ° (degree) = Diminished chord
- **Chord Extensions**: Add color tones to chords:
  - 6th, 7th, 9th, 11th, 13th extensions available
  - Extensions add notes beyond the basic triad
- **Chord Tone Highlighting**: Different colors for different chord tones:
  - Root notes (red)
  - Third notes (blue)
  - Fifth notes (green)
  - Extension notes (purple)
- **Toggle Controls**: 
  - Show/hide chord mode
  - Switch between different extensions

### How to Use

1. **Select a Chord**: Click any Roman numeral button at the top of the fretboard
2. **Add Extensions**: Use the extension selector to add 6th, 7th, 9th, 11th, or 13th
3. **Toggle Chord Mode**: Press `C` or use the toggle to show/hide chord visualization
4. **View Chord Tones**: Chord tones are highlighted on the fretboard with color coding

### Roman Numeral Reference

| Scale Degree | Major Scale | Natural Minor | Harmonic Minor |
|--------------|-------------|---------------|---------------|
| I            | C Major     | A Minor       | A Minor       |
| ii           | D Minor     | B Diminished  | B Diminished  |
| iii          | E Minor     | C Major       | C+ Augmented  |
| IV           | F Major     | D Minor       | D Minor       |
| V            | G Major     | E Minor       | E Major       |
| vi           | A Minor     | F Major       | F Major       |
| vii°         | B Diminished | G Major       | G# Diminished |

## Technical Documentation

### Architecture

The chord visualization system is built on three layers:

1. **State Layer** (Zustand store): Stores selected Roman degree and extension
2. **Calculation Layer** (fretboard.ts): Computes chord tones and quality
3. **Presentation Layer** (Fretboard.tsx): Renders visualization

### Key Functions

#### `getDiatonicChordQuality(scaleType, degree)`

Returns the quality of a diatonic chord at a given scale degree.

**Parameters:**
- `scaleType`: Scale type ('major', 'minor', etc.)
- `degree`: Scale degree (1-7)

**Returns:** Chord quality string ('major', 'minor', 'diminished', 'augmented')

**Logic:**
- Major scale: I, IV, V = major; ii, iii, vi = minor; vii° = diminished
- Natural minor: i, iv, v = minor; III, VI, VII = major; ii° = diminished
- Harmonic minor: i, iv = minor; III, VI = major; V = major; vii° = diminished; ii° = diminished; III+ = augmented

#### `getRomanNumeralButtons(scaleType)`

Generates an array of Roman numeral button configurations.

**Parameters:**
- `scaleType`: Scale type ('major', 'minor', etc.)

**Returns:** Array of objects with:
- `degree`: Scale degree (1-7)
- `roman`: Roman numeral string ('I', 'ii', 'iii°', etc.)
- `quality`: Chord quality ('major', 'minor', 'diminished', 'augmented')

**Quality Symbols:**
- Major: '△' (triangle)
- Minor: '-' (minus)
- Diminished: '°' (degree)
- Augmented: '+' (plus)

#### `getChordToneDegrees(romanDegree, extension)`

Calculates which scale degrees are chord tones for a given Roman numeral and extension.

**Parameters:**
- `romanDegree`: Roman numeral degree (1-7)
- `extension`: Extension type ('6th', '7th', '9th', '11th', '13th', or null)

**Returns:** Array of scale degree numbers (1-7) representing chord tones

**Logic:**
- Basic triad: root, third, fifth (based on chord quality)
- Extensions add additional scale degrees:
  - 6th: adds degree 6
  - 7th: adds degree 7
  - 9th: adds degree 2 (same as 9th)
  - 11th: adds degree 4 (same as 11th)
  - 13th: adds degree 6 (same as 13th)

#### `getChordRoot(root, scaleType, romanDegree)`

Calculates the root note of a chord based on the scale root and Roman numeral degree.

**Parameters:**
- `root`: Scale root note (e.g., 'C', 'F#')
- `scaleType`: Scale type ('major', 'minor', etc.)
- `romanDegree`: Roman numeral degree (1-7)

**Returns:** Root note of the chord (e.g., 'C', 'D', 'E')

**Logic:**
- Gets scale notes using Tonal.js
- Returns the note at the specified degree (1-indexed)

### Data Structures

#### Chord Tone Role

Each fret position includes a `chordToneRole` property when chord mode is active:

```typescript
type ChordToneRole = 'root' | 'third' | 'fifth' | 'extension' | null;
```

#### Fret Data Structure

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

### State Management

Chord visualization state is managed in `useStore.ts`:

```typescript
interface ChordVisualizationState {
  selectedRomanDegree: number | null;  // Currently selected Roman numeral (1-7)
  chordExtension: string | null;        // Current extension ('6th', '7th', etc.)
  showChordMode: boolean;              // Whether chord mode is active
  setSelectedRomanDegree: (degree: number | null) => void;
  setChordExtension: (extension: string | null) => void;
  toggleChordMode: () => void;
}
```

## Developer Documentation

### Adding New Extensions

To add a new chord extension:

1. **Update the extension selector UI** in `Fretboard.tsx`:
   ```typescript
   const extensions = ['6th', '7th', '9th', '11th', '13th', 'newExtension'];
   ```

2. **Update `getChordToneDegrees`** in `fretboard.ts`:
   ```typescript
   if (extension === 'newExtension') {
     chordToneDegrees.push(newScaleDegree);
   }
   ```

3. **Update extension display logic** if needed

### Adding New Scale Types

To add chord support for a new scale type:

1. **Update `getDiatonicChordQuality`** in `fretboard.ts`:
   ```typescript
   if (scaleType === 'newScale') {
     // Define chord qualities for each degree
     const qualities = ['major', 'minor', /* ... */];
     return qualities[degree - 1];
   }
   ```

2. **Test with different Roman numerals** to ensure correct quality display

### Customizing Chord Tone Colors

Chord tone colors are defined in `Fretboard.tsx`:

```typescript
const getChordToneColor = (role: ChordToneRole) => {
  switch (role) {
    case 'root': return 'bg-red-500';
    case 'third': return 'bg-blue-500';
    case 'fifth': return 'bg-green-500';
    case 'extension': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};
```

### Testing Chord Visualization

Test cases to consider:

1. **Roman numeral selection**: Verify correct chord tones for each degree
2. **Extension calculation**: Verify correct extension notes for each extension type
3. **Quality display**: Verify correct quality symbols for each scale type
4. **Chord root calculation**: Verify correct root notes for each Roman numeral
5. **Scale degree mapping**: Verify correct scale degrees for chord tones

### Performance Considerations

- Chord calculations are performed on every fretboard render
- Consider memoizing `getRomanNumeralButtons` if performance issues arise
- Chord tone calculations are O(n) where n is the number of frets
- State updates trigger re-renders of the entire fretboard

### Dependencies

- **@tonaljs/tonal**: Music theory calculations (Note.transpose, Scale.get)
- **Zustand**: State management with persistence
- **React**: UI rendering and state management

### Related Files

- `web/src/components/Fretboard.tsx` - Main fretboard component with chord UI
- `web/src/utils/fretboard.ts` - Chord calculation functions
- `web/src/store/useStore.ts` - Chord visualization state
- `web/src/App.tsx` - App routing and layout

### Future Enhancements

Potential improvements to the chord visualization system:

1. **Inversion support**: Display chord inversions (first, second, third)
2. **Voicing suggestions**: Suggest optimal fretboard voicings
3. **Chord progression builder**: Create and play chord progressions
4. **Jazz extensions**: Add jazz-specific extensions (alt, sus, add9)
5. **Guitar-specific voicings**: Suggest guitar-friendly chord shapes
6. **Chord analysis**: Analyze chord quality from fretboard positions
