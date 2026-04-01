# Component Documentation

This directory contains detailed documentation for Stratobater's components, designed to help agents understand the architecture, implementation details, and relationships between components.

## Documentation Files

### Core Components

- **[ChordVisualization.md](./ChordVisualization.md)** - Comprehensive documentation for the chord visualization system, including Roman numeral analysis, chord extensions, and chord tone highlighting.

- **[DualModeSelector.md](./DualModeSelector.md)** - Complete documentation for the DualModeSelector component, including Selection Mode, Edit Mode, drag-and-drop functionality, and keyboard navigation.

- **[FretboardEnhancements.md](./FretboardEnhancements.md)** - Documentation for fretboard enhancements, including chord visualization, note label modes, keyboard controls, and visual feedback.

- **[StoreEnhancements.md](./StoreEnhancements.md)** - Documentation for the Zustand store enhancements, including persistent state, configurable items, and state management patterns.

## Component Architecture

### Component Hierarchy

```
App
├── MainLayout
│   ├── Fretboard
│   │   ├── Roman Numeral Buttons
│   │   ├── Extension Selector
│   │   └── Note Label Controls
│   └── EarTrainer
└── DualModeSelector
    ├── SelectionModeList
    └── EditModeList
        └── DraggableItem
```

### Data Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
Zustand Store Action
    ↓
State Update
    ↓
Component Re-render
    ↓
Utility Function Call
    ↓
Tonal.js Calculation
    ↓
Result Display
```

### State Management

All state is managed through Zustand with persistence:

- **Core State**: Key, scale, tuning
- **Chord Visualization**: Roman degree, extension, chord mode
- **Note Labels**: Label mode
- **Highlighting**: Roots, triads
- **Configurable Items**: Keys, scales (with visibility and ordering)

## Key Concepts

### Chord Visualization

The chord visualization system uses Roman numeral analysis to represent diatonic chords:

- **Roman Numerals**: I-vii° indicate scale degree
- **Quality Symbols**: △ (major), - (minor), ° (diminished)
- **Extensions**: 6th, 7th, 9th, 11th, 13th add color tones
- **Chord Tones**: Root, third, fifth, extension

### Configurable Items

Keys and scales are configurable items with:

- **Visibility**: Show/hide individual items
- **Ordering**: Drag-and-drop reordering
- **Persistence**: Saved to local storage
- **Reset**: Restore defaults

### Note Label Modes

Three display modes for note labels:

- **Note Names**: C, D, E, F#, etc.
- **Scale Degrees**: 1, 2, 3, 4, 5, 6, 7
- **Hidden**: No labels

### Keyboard Navigation

Comprehensive keyboard support:

- **Arrow Keys**: Navigate keys and scales
- **R/T**: Toggle roots/triads
- **C**: Toggle chord mode
- **L**: Cycle note label modes
- **K/S**: Open key/scale selector

## Development Guidelines

### Adding New Features

1. **Update State**: Add new state properties to `useStore.ts`
2. **Update Utilities**: Add calculation functions to `fretboard.ts`
3. **Update Components**: Add UI elements to relevant components
4. **Update Documentation**: Document the new feature
5. **Test**: Test thoroughly with different scenarios

### Component Patterns

1. **State Management**: Use Zustand for global state
2. **Persistence**: Use Zustand middleware for persistence
3. **Keyboard Events**: Use useEffect for keyboard listeners
4. **Drag-and-Drop**: Use @dnd-kit for drag-and-drop
5. **Music Theory**: Use Tonal.js for calculations

### Testing Considerations

1. **State Updates**: Verify state updates correctly
2. **Persistence**: Verify state persists across reloads
3. **Keyboard Navigation**: Verify all shortcuts work
4. **Accessibility**: Verify ARIA attributes and focus management
5. **Performance**: Verify smooth rendering with all features

## Related Documentation

- **[../../README.md](../../README.md)** - Main project documentation
- **[../../CONTRIBUTING.md](../../CONTRIBUTING.md)** - Contribution guidelines
- **[../../DEVELOPING.md](../../DEVELOPING.md)** - Development workflow

## Quick Reference

### File Locations

- **Components**: `web/src/components/`
- **Utilities**: `web/src/utils/`
- **Store**: `web/src/store/useStore.ts`
- **Documentation**: `web/docs/components/`

### Key Functions

- `getFretboard()` - Generate fretboard data
- `getDiatonicChordQuality()` - Get chord quality
- `getRomanNumeralButtons()` - Generate Roman numeral buttons
- `getChordToneDegrees()` - Calculate chord tones
- `getChordRoot()` - Calculate chord root note

### State Properties

- `root` - Current key
- `scaleType` - Current scale
- `selectedRomanDegree` - Selected chord (1-7)
- `chordExtension` - Current extension
- `showChordMode` - Chord mode toggle
- `noteLabelMode` - Note label display mode
- `showRoots` - Root highlighting
- `showTriads` - Triad highlighting
- `keyItems` - Configurable keys
- `scaleItems` - Configurable scales

## Getting Started

1. Read the main [README.md](../../README.md) for project overview
2. Read [ChordVisualization.md](./ChordVisualization.md) for chord system details
3. Read [DualModeSelector.md](./DualModeSelector.md) for selector details
4. Read [FretboardEnhancements.md](./FretboardEnhancements.md) for fretboard details
5. Read [StoreEnhancements.md](./StoreEnhancements.md) for state management details

## Support

For questions or issues:

1. Check existing documentation
2. Review component source code
3. Check [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines
4. Review [DEVELOPING.md](../../DEVELOPING.md) for workflow

## Version History

- **v1.0** - Initial component documentation
- **v1.1** - Added chord visualization documentation
- **v1.2** - Added DualModeSelector documentation
- **v1.3** - Added FretboardEnhancements documentation
- **v1.4** - Added StoreEnhancements documentation
