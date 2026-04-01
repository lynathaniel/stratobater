import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NoteLabelMode = 'noteNames' | 'scaleDegrees' | 'none';

export type ChordExtension = '6th' | '7th' | '9th' | '11th' | '13th';

export interface RomanNumeralButton {
  degree: number;        // 1-7 representing scale degree
  roman: string;         // 'I', 'ii', etc.
  quality: 'major' | 'minor' | 'diminished';
  qualitySymbol: string; // Musical symbols: '△', '-', '°'
}

// New data structure for configurable items with visibility and ordering
export interface ConfigurableItem {
  id: string;
  label: string;
  isVisible: boolean;
  isCurrent: boolean;
}

// Constants for keys and scales
export const KEYS: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scales
export const SCALES_BY_BRIGHTNESS: string[] = [
  'Major',
  'Minor',
  'Major Pentatonic',
  'Minor Pentatonic',
  'Major Blues',
  'Minor Blues',
  'Ionian',
  'Dorian',
  'Phrygian',
  'Lydian',
  'Mixolydian',
  'Aeolian',
  'Locrian',
  'Chromatic'
];

// Migration functions for transitioning from simple arrays to ConfigurableItem[]
const getInitialKeyItems = (): ConfigurableItem[] => {
  return KEYS.map((key) => ({
    id: key,
    label: key,
    isVisible: true,
    isCurrent: key === 'C' // default root
  }));
};

const getInitialScaleItems = (): ConfigurableItem[] => {
  return SCALES_BY_BRIGHTNESS.map((scale) => ({
    id: scale,
    label: scale,
    isVisible: true,
    isCurrent: scale === 'Major' // default scale
  }));
};

export interface StoreState {
  root: string;
  scaleType: string;
  tuning: string[];
  showRoots: boolean;
  showTriads: boolean;
  showChordMode: boolean;
  noteLabelMode: NoteLabelMode;
  // New state for configurable items
  keyItems: ConfigurableItem[];
  scaleItems: ConfigurableItem[];
  // Chord visualization state
  selectedRomanDegree: number | null;
  chordExtension: ChordExtension | null;
}

export interface StoreActions {
  setRoot: (root: string) => void;
  setScaleType: (scaleType: string) => void;
  setTuning: (tuning: string[]) => void;
  toggleShowRoots: () => void;
  toggleShowTriads: () => void;
  toggleShowChordMode: () => void;
  setNoteLabelMode: (mode: NoteLabelMode) => void;
  // New actions for configurable items
  setSelectedKey: (key: string) => void;
  setSelectedScale: (scale: string) => void;
  toggleKeyVisibility: (key: string) => void;
  toggleScaleVisibility: (scale: string) => void;
  toggleBulkKeyVisibility: (key: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => void;
  toggleBulkScaleVisibility: (scale: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => void;
  reorderKeys: (newOrder: ConfigurableItem[]) => void;
  reorderScales: (newOrder: ConfigurableItem[]) => void;
  resetKeyOrder: () => void;
  resetScaleOrder: () => void;
  resetKeys: () => void;
  resetScales: () => void;
  // Chord visualization actions
  setSelectedRomanDegree: (degree: number | null) => void;
  setChordExtension: (extension: ChordExtension | null) => void;
}

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
  root: 'C',
  scaleType: 'Major',
  tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  showRoots: true,
  showTriads: false,
  showChordMode: false,
  noteLabelMode: 'noteNames',
  keyItems: getInitialKeyItems(),
  scaleItems: getInitialScaleItems(),
  selectedRomanDegree: 1,
  chordExtension: null,
  setRoot: (root: string) => set({ root }),
  setScaleType: (scaleType: string) => set({ scaleType }),
  setTuning: (tuning: string[]) => set({ tuning }),
  toggleShowRoots: () => set((state) => ({ showRoots: !state.showRoots })),
  toggleShowTriads: () => set((state) => ({ showTriads: !state.showTriads })),
  toggleShowChordMode: () => set((state) => ({ showChordMode: !state.showChordMode })),
  setNoteLabelMode: (noteLabelMode: NoteLabelMode) => set({ noteLabelMode }),
  // New actions for configurable items
  setSelectedKey: (key: string) => set((state) => ({
    keyItems: state.keyItems.map(item => ({
      ...item,
      isCurrent: item.id === key
    })),
    // Also update root for backward compatibility
    root: key
  })),
  setSelectedScale: (scale: string) => set((state) => ({
    scaleItems: state.scaleItems.map(item => ({
      ...item,
      isCurrent: item.id === scale
    })),
    // Also update scaleType for backward compatibility
    scaleType: scale
  })),
  toggleKeyVisibility: (key: string) => set((state) => {
    // Perform the toggle without blocking
    let newKeyItems = state.keyItems.map(item =>
      item.id === key ? { ...item, isVisible: !item.isVisible } : item
    );

    // Auto-reactive: If all items are hidden, make the current visible again
    const hasAnyVisible = newKeyItems.some(item => item.isVisible);
    if (!hasAnyVisible) {
      const currentIndex = newKeyItems.findIndex(item => item.isCurrent);
      if (currentIndex !== -1) {
        newKeyItems = newKeyItems.map((item, i) =>
          i === currentIndex ? { ...item, isVisible: true } : item
        );
      }
    }

    return { keyItems: newKeyItems };
  }),
  toggleScaleVisibility: (scale: string) => set((state) => {
    // Perform the toggle without blocking
    let newScaleItems = state.scaleItems.map(item =>
      item.id === scale ? { ...item, isVisible: !item.isVisible } : item
    );

    // Auto-reactive: If all items are hidden, make the current visible again
    const hasAnyVisible = newScaleItems.some(item => item.isVisible);
    if (!hasAnyVisible) {
      const currentIndex = newScaleItems.findIndex(item => item.isCurrent);
      if (currentIndex !== -1) {
        newScaleItems = newScaleItems.map((item, i) =>
          i === currentIndex ? { ...item, isVisible: true } : item
        );
      }
    }

    return { scaleItems: newScaleItems };
  }),
  toggleBulkKeyVisibility: (key: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => set((state) => {
    // If not shift held, delegate to single toggle with auto-reactive
    if (!isShiftHeld) {
      let newKeyItems = state.keyItems.map(item =>
        item.id === key ? { ...item, isVisible: !item.isVisible } : item
      );

      // Auto-reactive: If all items are hidden, make the current visible again
      const hasAnyVisible = newKeyItems.some(item => item.isVisible);
      if (!hasAnyVisible) {
        const currentIndex = newKeyItems.findIndex(item => item.isCurrent);
        if (currentIndex !== -1) {
          newKeyItems = newKeyItems.map((item, i) =>
            i === currentIndex ? { ...item, isVisible: true } : item
          );
        }
      }

      return { keyItems: newKeyItems };
    }

    // Determine "currently applied" index (the one to exclude from bulk toggle)
    let currentAppliedIndex = currentlyAppliedIndex;
    if (currentAppliedIndex === undefined) {
      currentAppliedIndex = state.keyItems.findIndex(item => item.isCurrent);
    }

    const targetItem = state.keyItems.find(item => item.id === key);
    if (!targetItem) return state;
    const targetIndex = state.keyItems.findIndex(item => item.id === key);

    // If target item is the currently applied item, fall back to single toggle with auto-reactive
    if (targetIndex === currentAppliedIndex) {
      let newKeyItems = state.keyItems.map(item =>
        item.id === key ? { ...item, isVisible: !item.isVisible } : item
      );

      // Auto-reactive: If all items are hidden, make the current visible again
      const hasAnyVisible = newKeyItems.some(item => item.isVisible);
      if (!hasAnyVisible) {
        const currentIndex = newKeyItems.findIndex(item => item.isCurrent);
        if (currentIndex !== -1) {
          newKeyItems = newKeyItems.map((item, i) =>
            i === currentIndex ? { ...item, isVisible: true } : item
          );
        }
      }

      return { keyItems: newKeyItems };
    }

    // Get all non-current items
    const nonCurrentItems = currentAppliedIndex !== -1
      ? state.keyItems.filter((_, i) => i !== currentAppliedIndex)
      : state.keyItems;

    // Check if all non-current items have the same visibility state
    const firstVisibleState = nonCurrentItems[0]?.isVisible;
    const allSameState = nonCurrentItems.every(item => item.isVisible === firstVisibleState);

    // Determine new visibility state:
    // - If all same state, toggle to opposite of target
    // - If mixed states, use target's state
    const newVisibilityState = allSameState ? !targetItem.isVisible : targetItem.isVisible;

    // Apply new visibility to all items except currently applied
    let newKeyItems = state.keyItems.map((item, i) => {
      if (i === currentAppliedIndex) return item; // Don't change currently applied item
      return { ...item, isVisible: newVisibilityState };
    });

    // Auto-reactive: If all items are hidden, make the current visible again
    const hasAnyVisible = newKeyItems.some(item => item.isVisible);
    if (!hasAnyVisible) {
      const currentIndex = newKeyItems.findIndex(item => item.isCurrent);
      if (currentIndex !== -1) {
        newKeyItems = newKeyItems.map((item, i) =>
          i === currentIndex ? { ...item, isVisible: true } : item
        );
      }
    }

    return { keyItems: newKeyItems };
  }),
  toggleBulkScaleVisibility: (scale: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => set((state) => {
    // If not shift held, delegate to single toggle with auto-reactive
    if (!isShiftHeld) {
      let newScaleItems = state.scaleItems.map(item =>
        item.id === scale ? { ...item, isVisible: !item.isVisible } : item
      );

      // Auto-reactive: If all items are hidden, make the current visible again
      const hasAnyVisible = newScaleItems.some(item => item.isVisible);
      if (!hasAnyVisible) {
        const currentIndex = newScaleItems.findIndex(item => item.isCurrent);
        if (currentIndex !== -1) {
          newScaleItems = newScaleItems.map((item, i) =>
            i === currentIndex ? { ...item, isVisible: true } : item
          );
        }
      }

      return { scaleItems: newScaleItems };
    }

    // Determine "currently applied" index (the one to exclude from bulk toggle)
    let currentAppliedIndex = currentlyAppliedIndex;
    if (currentAppliedIndex === undefined) {
      currentAppliedIndex = state.scaleItems.findIndex(item => item.isCurrent);
    }

    const targetItem = state.scaleItems.find(item => item.id === scale);
    if (!targetItem) return state;
    const targetIndex = state.scaleItems.findIndex(item => item.id === scale);

    // If target item is the currently applied item, fall back to single toggle with auto-reactive
    if (targetIndex === currentAppliedIndex) {
      let newScaleItems = state.scaleItems.map(item =>
        item.id === scale ? { ...item, isVisible: !item.isVisible } : item
      );

      // Auto-reactive: If all items are hidden, make the current visible again
      const hasAnyVisible = newScaleItems.some(item => item.isVisible);
      if (!hasAnyVisible) {
        const currentIndex = newScaleItems.findIndex(item => item.isCurrent);
        if (currentIndex !== -1) {
          newScaleItems = newScaleItems.map((item, i) =>
            i === currentIndex ? { ...item, isVisible: true } : item
          );
        }
      }

      return { scaleItems: newScaleItems };
    }

    // Get all non-current items
    const nonCurrentItems = currentAppliedIndex !== -1
      ? state.scaleItems.filter((_, i) => i !== currentAppliedIndex)
      : state.scaleItems;

    // Check if all non-current items have the same visibility state
    const firstVisibleState = nonCurrentItems[0]?.isVisible;
    const allSameState = nonCurrentItems.every(item => item.isVisible === firstVisibleState);

    // Determine new visibility state:
    // - If all same state, toggle to opposite of target
    // - If mixed states, use target's state
    const newVisibilityState = allSameState ? !targetItem.isVisible : targetItem.isVisible;

    // Apply new visibility to all items except currently applied
    let newScaleItems = state.scaleItems.map((item, i) => {
      if (i === currentAppliedIndex) return item; // Don't change currently applied item
      return { ...item, isVisible: newVisibilityState };
    });

    // Auto-reactive: If all items are hidden, make the current visible again
    const hasAnyVisible = newScaleItems.some(item => item.isVisible);
    if (!hasAnyVisible) {
      const currentIndex = newScaleItems.findIndex(item => item.isCurrent);
      if (currentIndex !== -1) {
        newScaleItems = newScaleItems.map((item, i) =>
          i === currentIndex ? { ...item, isVisible: true } : item
        );
      }
    }

    return { scaleItems: newScaleItems };
  }),
  reorderKeys: (newOrder: ConfigurableItem[]) => set({ keyItems: newOrder }),
  reorderScales: (newOrder: ConfigurableItem[]) => set({ scaleItems: newOrder }),
  resetKeyOrder: () => set((state) => ({
    // Reset order preserves visibility and current selection
    keyItems: KEYS.map((key) => ({
      id: key,
      label: key,
      isVisible: state.keyItems.find(item => item.id === key)?.isVisible ?? true,
      isCurrent: state.keyItems.find(item => item.id === key)?.isCurrent ?? key === state.root
    }))
  })),
  resetScaleOrder: () => set((state) => ({
    // Reset order preserves visibility and current selection
    scaleItems: SCALES_BY_BRIGHTNESS.map((scale) => ({
      id: scale,
      label: scale,
      isVisible: state.scaleItems.find(item => item.id === scale)?.isVisible ?? true,
      isCurrent: state.scaleItems.find(item => item.id === scale)?.isCurrent ?? scale === state.scaleType
    }))
  })),
  resetKeys: () => set(() => ({
    root: 'C',
    keyItems: KEYS.map((key) => ({
      id: key,
      label: key,
      isVisible: true,
      isCurrent: key === 'C'
    }))
  })),
  resetScales: () => set(() => ({
    scaleType: 'Major',
    scaleItems: SCALES_BY_BRIGHTNESS.map((scale) => ({
      id: scale,
      label: scale,
      isVisible: true,
      isCurrent: scale === 'Major'
    }))
  })),
  // Chord visualization actions
  setSelectedRomanDegree: (degree: number | null) => set({ selectedRomanDegree: degree }),
  setChordExtension: (extension: ChordExtension | null) => set((state) => ({
    chordExtension: state.chordExtension === extension ? null : extension
  })),
  }),
  {
    name: 'stratobater-storage',
    version: 5,
    migrate: (persistedState: any, version: number) => {
      if (version === 1) {
        persistedState.showChordMode = persistedState.showChordMode ?? false;
      }
      // Convert 'none' extension to null (toggleable behavior)
      if (persistedState.chordExtension === 'none') {
        persistedState.chordExtension = null;
      }
      if (persistedState.chordExtension === 'triad') {
        persistedState.chordExtension = null;
      }
      // Ensure selectedRomanDegree is always set (default to 1 if null)
      if (!persistedState.selectedRomanDegree) {
        persistedState.selectedRomanDegree = 1;
      }
      return persistedState;
    },
    partialize: (state) => ({
      keyItems: state.keyItems,
      scaleItems: state.scaleItems,
      root: state.root,
      scaleType: state.scaleType,
      showRoots: state.showRoots,
      showTriads: state.showTriads,
      showChordMode: state.showChordMode,
      noteLabelMode: state.noteLabelMode,
      selectedRomanDegree: state.selectedRomanDegree,
      chordExtension: state.chordExtension,
    }),
  })
);
