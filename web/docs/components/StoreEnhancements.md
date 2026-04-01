# Store Enhancements

## Overview

The Zustand store has been enhanced with comprehensive state management for chord visualization, configurable items, note label modes, and persistence. This document details the enhancements made to the original store implementation.

## User Documentation

### Persistent State

All user preferences and customizations are automatically saved to local storage:

- **Key and scale selections**: Remember your last selected key and scale
- **Chord visualization settings**: Remember selected Roman numeral and extension
- **Visibility preferences**: Remember which keys and scales are visible
- **Custom ordering**: Remember custom order of keys and scales
- **Note label mode**: Remember your preferred note label display
- **Toggle states**: Remember which highlighting options are enabled

### Configurable Items

Keys and scales can be customized:

- **Visibility**: Show or hide individual keys and scales
- **Ordering**: Reorder keys and scales to your preference
- **Reset**: Restore default visibility and ordering
- **Bulk operations**: Toggle multiple items at once

### State Features

#### Chord Visualization

- **Selected Roman Degree**: Currently selected chord (1-7)
- **Chord Extension**: Current extension type (6th, 7th, 9th, 11th, 13th, or null)
- **Chord Mode Toggle**: Show/hide chord visualization

#### Note Label Modes

- **Note Names**: Display note names (C, D, E, F#, etc.)
- **Scale Degrees**: Display scale degrees (1, 2, 3, 4, 5, 6, 7)
- **Hidden**: Hide all note labels

#### Highlighting Toggles

- **Show Roots**: Highlight root notes
- **Show Triads**: Highlight triad notes
- **Show Chord Mode**: Highlight chord tones

## Technical Documentation

### Architecture

The enhanced store follows a modular architecture with separate slices for different concerns:

```
useStore
├── Core State
│   ├── root
│   ├── scaleType
│   └── tuning
├── Chord Visualization
│   ├── selectedRomanDegree
│   ├── chordExtension
│   └── showChordMode
├── Note Labels
│   └── noteLabelMode
├── Highlighting
│   ├── showRoots
│   └── showTriads
├── Configurable Items
│   ├── keyItems
│   ├── scaleItems
│   └── reset functions
└── Persistence
    └── Local storage middleware
```

### Store Structure

#### State Interface

```typescript
interface StoreState {
  // Core State
  root: string;
  scaleType: string;
  tuning: string[];

  // Chord Visualization
  selectedRomanDegree: number | null;
  chordExtension: string | null;
  showChordMode: boolean;

  // Note Labels
  noteLabelMode: NoteLabelMode;

  // Highlighting
  showRoots: boolean;
  showTriads: boolean;

  // Configurable Items
  keyItems: ConfigurableItem[];
  scaleItems: ConfigurableItem[];

  // Actions
  setRoot: (root: string) => void;
  setScaleType: (scaleType: string) => void;
  setTuning: (tuning: string[]) => void;
  setSelectedRomanDegree: (degree: number | null) => void;
  setChordExtension: (extension: string | null) => void;
  toggleChordMode: () => void;
  setNoteLabelMode: (mode: NoteLabelMode) => void;
  toggleShowRoots: () => void;
  toggleShowTriads: () => void;
  setKeyItems: (items: ConfigurableItem[]) => void;
  setScaleItems: (items: ConfigurableItem[]) => void;
  resetKeyItems: () => void;
  resetScaleItems: () => void;
}
```

#### ConfigurableItem Interface

```typescript
interface ConfigurableItem {
  id: string;           // Unique identifier
  label: string;        // Display label
  value: string;        // Value used in state
  visible: boolean;     // Visibility status
}
```

#### NoteLabelMode Type

```typescript
type NoteLabelMode = 'noteNames' | 'scaleDegrees' | 'none';
```

### Default Values

#### Default Keys

```typescript
const DEFAULT_KEYS: ConfigurableItem[] = [
  { id: 'C', label: 'C', value: 'C', visible: true },
  { id: 'C#', label: 'C#', value: 'C#', visible: true },
  { id: 'D', label: 'D', value: 'D', visible: true },
  { id: 'D#', label: 'D#', value: 'D#', visible: true },
  { id: 'E', label: 'E', value: 'E', visible: true },
  { id: 'F', label: 'F', value: 'F', visible: true },
  { id: 'F#', label: 'F#', value: 'F#', visible: true },
  { id: 'G', label: 'G', value: 'G', visible: true },
  { id: 'G#', label: 'G#', value: 'G#', visible: true },
  { id: 'A', label: 'A', value: 'A', visible: true },
  { id: 'A#', label: 'A#', value: 'A#', visible: true },
  { id: 'B', label: 'B', value: 'B', visible: true },
];
```

#### Default Scales

```typescript
const DEFAULT_SCALES: ConfigurableItem[] = [
  { id: 'major', label: 'Major', value: 'major', visible: true },
  { id: 'minor', label: 'Minor', value: 'minor', visible: true },
  { id: 'harmonic minor', label: 'Harmonic Minor', value: 'harmonic minor', visible: true },
  { id: 'melodic minor', label: 'Melodic Minor', value: 'melodic minor', visible: true },
  { id: 'dorian', label: 'Dorian', value: 'dorian', visible: true },
  { id: 'phrygian', label: 'Phrygian', value: 'phrygian', visible: true },
  { id: 'lydian', label: 'Lydian', value: 'lydian', visible: true },
  { id: 'mixolydian', label: 'Mixolydian', value: 'mixolydian', visible: true },
  { id: 'locrian', label: 'Locrian', value: 'locrian', visible: true },
];
```

#### Default Tuning

```typescript
const DEFAULT_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
```

### Persistence Implementation

#### Zustand Middleware

```typescript
import { persist } from 'zustand/middleware';

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // State and actions
    }),
    {
      name: 'stratobater-storage', // Local storage key
      partialize: (state) => ({
        // Persist only specific state
        root: state.root,
        scaleType: state.scaleType,
        selectedRomanDegree: state.selectedRomanDegree,
        chordExtension: state.chordExtension,
        showChordMode: state.showChordMode,
        noteLabelMode: state.noteLabelMode,
        showRoots: state.showRoots,
        showTriads: state.showTriads,
        keyItems: state.keyItems,
        scaleItems: state.scaleItems,
      }),
    }
  )
);
```

#### Partial Persistence

Only user-facing state is persisted. Internal state (like modal open/close) is not persisted:

```typescript
partialize: (state) => ({
  // Persisted state
  root: state.root,
  scaleType: state.scaleType,
  // ... other user preferences
  
  // NOT persisted:
  // - Modal open/close state
  // - Temporary UI state
  // - Focus state
})
```

### Action Implementations

#### Core Actions

```typescript
setRoot: (root) => set({ root }),
setScaleType: (scaleType) => set({ scaleType }),
setTuning: (tuning) => set({ tuning }),
```

#### Chord Visualization Actions

```typescript
setSelectedRomanDegree: (degree) => set({ selectedRomanDegree: degree }),
setChordExtension: (extension) => set({ chordExtension: extension }),
toggleChordMode: () => set((state) => ({ showChordMode: !state.showChordMode })),
```

#### Note Label Actions

```typescript
setNoteLabelMode: (mode) => set({ noteLabelMode: mode }),
```

#### Highlighting Actions

```typescript
toggleShowRoots: () => set((state) => ({ showRoots: !state.showRoots })),
toggleShowTriads: () => set((state) => ({ showTriads: !state.showTriads })),
```

#### Configurable Items Actions

```typescript
setKeyItems: (items) => set({ keyItems: items }),
setScaleItems: (items) => set({ scaleItems: items }),
resetKeyItems: () => set({ keyItems: DEFAULT_KEYS }),
resetScaleItems: () => set({ scaleItems: DEFAULT_SCALES }),
```

### State Selectors

For optimized component re-renders, use selectors:

```typescript
// In component
const root = useStore((state) => state.root);
const scaleType = useStore((state) => state.scaleType);
const selectedRomanDegree = useStore((state) => state.selectedRomanDegree);

// Or use shallow comparison for multiple values
import { shallow } from 'zustand/shallow';

const { root, scaleType, selectedRomanDegree } = useStore(
  (state) => ({
    root: state.root,
    scaleType: state.scaleType,
    selectedRomanDegree: state.selectedRomanDegree,
  }),
  shallow
);
```

## Developer Documentation

### Adding New State Properties

To add a new state property:

1. **Update StoreState interface**:
   ```typescript
   interface StoreState {
     // ... existing properties
     newProperty: string;
     setNewProperty: (value: string) => void;
   }
   ```

2. **Add default value**:
   ```typescript
   const useStore = create<StoreState>()(
     persist(
       (set) => ({
         // ... existing state
         newProperty: 'defaultValue',
         setNewProperty: (value) => set({ newProperty: value }),
       }),
       {
         // ... persist config
         partialize: (state) => ({
           // ... existing persisted state
           newProperty: state.newProperty,
         }),
       }
     )
   );
   ```

3. **Update components** to use the new property

### Adding New Configurable Items

To add a new configurable item type:

1. **Define default items**:
   ```typescript
   const DEFAULT_NEW_ITEMS: ConfigurableItem[] = [
     { id: 'item1', label: 'Item 1', value: 'item1', visible: true },
     // ... more items
   ];
   ```

2. **Add to store**:
   ```typescript
   interface StoreState {
     // ... existing properties
     newItems: ConfigurableItem[];
     setNewItems: (items: ConfigurableItem[]) => void;
     resetNewItems: () => void;
   }

   const useStore = create<StoreState>()(
     persist(
       (set) => ({
         // ... existing state
         newItems: DEFAULT_NEW_ITEMS,
         setNewItems: (items) => set({ newItems: items }),
         resetNewItems: () => set({ newItems: DEFAULT_NEW_ITEMS }),
       }),
       {
         // ... persist config
         partialize: (state) => ({
           // ... existing persisted state
           newItems: state.newItems,
         }),
       }
     )
   );
   ```

3. **Create UI component** for managing the items

### Customizing Persistence

To customize what gets persisted:

```typescript
partialize: (state) => ({
  // Only persist these properties
  root: state.root,
  scaleType: state.scaleType,
  // Exclude temporary state
  // - modalOpen: state.modalOpen
  // - focusedIndex: state.focusedIndex
}),
```

To add custom serialization:

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // ... state
    }),
    {
      name: 'stratobater-storage',
      storage: createJSONStorage(() => localStorage),
      serialize: (state) => {
        // Custom serialization
        return JSON.stringify(state);
      },
      deserialize: (str) => {
        // Custom deserialization
        return JSON.parse(str);
      },
    }
  )
);
```

### Migrating State

To migrate existing state to a new structure:

```typescript
const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // ... state
    }),
    {
      name: 'stratobater-storage',
      migrate: (persistedState: any, version: number) => {
        // Migrate from version 0 to 1
        if (version === 0) {
          return {
            ...persistedState,
            // Add new properties with defaults
            newProperty: 'defaultValue',
          };
        }
        return persistedState;
      },
      version: 1,
    }
  )
);
```

### Resetting State

To reset all state to defaults:

```typescript
const resetStore = () => {
  useStore.setState({
    root: 'C',
    scaleType: 'major',
    tuning: DEFAULT_TUNING,
    selectedRomanDegree: null,
    chordExtension: null,
    showChordMode: false,
    noteLabelMode: 'noteNames',
    showRoots: true,
    showTriads: true,
    keyItems: DEFAULT_KEYS,
    scaleItems: DEFAULT_SCALES,
  });
};

// Clear persisted storage
const clearStorage = () => {
  localStorage.removeItem('stratobater-storage');
  resetStore();
};
```

### Performance Considerations

- **Selector optimization**: Use selectors to prevent unnecessary re-renders
- **Shallow comparison**: Use `shallow` for multiple value selectors
- **Debounce updates**: Consider debouncing rapid state updates
- **Partial persistence**: Only persist necessary state to reduce storage size

### Testing

Test cases to consider:

1. **State updates**: Verify state updates correctly
2. **Persistence**: Verify state persists across page reloads
3. **Reset functions**: Verify reset functions restore defaults
4. **Configurable items**: Verify item visibility and ordering persist
5. **Chord visualization**: Verify chord settings persist
6. **Note labels**: Verify note label mode persists
7. **Migration**: Verify state migration works correctly
8. **Selectors**: Verify selectors prevent unnecessary re-renders

### Dependencies

- **zustand**: State management
- **zustand/middleware**: Persistence middleware
- **zustand/shallow**: Shallow comparison for selectors

### Related Files

- `web/src/store/useStore.ts` - Main store implementation
- `web/src/components/Fretboard.tsx` - Uses store state
- `web/src/components/DualModeSelector/` - Manages configurable items
- `web/src/utils/fretboard.ts` - Uses store for calculations

### Future Enhancements

Potential improvements to the store:

1. **DevTools integration**: Add Redux DevTools integration
2. **State history**: Implement undo/redo functionality
3. **State validation**: Add runtime validation for state
4. **Computed state**: Add computed/selectable state
5. **Async actions**: Add support for async actions
6. **State snapshots**: Save and load state snapshots
7. **State export/import**: Export/import state as JSON
8. **State synchronization**: Sync state across tabs
9. **State compression**: Compress persisted state
10. **State encryption**: Encrypt sensitive state

### Best Practices

1. **Keep state minimal**: Only store what's necessary
2. **Use selectors**: Optimize component re-renders
3. **Persist wisely**: Only persist user-facing state
4. **Type everything**: Use TypeScript for type safety
5. **Document state**: Document state properties and actions
6. **Test state**: Test state updates and persistence
7. **Version state**: Use versioning for state migrations
8. **Handle errors**: Handle storage errors gracefully

### Common Patterns

#### Toggle Pattern

```typescript
toggleFeature: () => set((state) => ({ 
  featureEnabled: !state.featureEnabled 
})),
```

#### Update Item in Array Pattern

```typescript
updateItem: (id, updates) => set((state) => ({
  items: state.items.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ),
})),
```

#### Reset Pattern

```typescript
resetItems: () => set({ items: DEFAULT_ITEMS }),
```

#### Conditional Update Pattern

```typescript
conditionalUpdate: (condition, value) => set((state) => ({
  value: condition ? value : state.value,
})),
```

### Debugging

#### Logging State Changes

```typescript
const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        // ... state
      }),
      {
        name: 'stratobater-storage',
      }
    ),
    { name: 'StratobaterStore' }
  )
);
```

#### Inspecting State

```typescript
// In browser console
const state = useStore.getState();
console.log(state);

// Subscribe to changes
useStore.subscribe((state) => {
  console.log('State changed:', state);
});
```

### Breaking Changes

Be aware of these breaking changes when updating:

1. **State structure**: Changes to state structure may require migration
2. **Persistence key**: Changing the persistence key clears existing state
3. **Action signatures**: Changes to action signatures break components
4. **Default values**: Changes to default values affect new users

### Backward Compatibility

To maintain backward compatibility:

1. **Use versioning**: Version your persisted state
2. **Migrate state**: Migrate old state to new structure
3. **Provide defaults**: Provide defaults for new properties
4. **Deprecate gradually**: Deprecate old properties gradually
5. **Document changes**: Document breaking changes clearly
