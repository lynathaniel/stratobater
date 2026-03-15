import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NoteLabelMode = 'noteNames' | 'scaleDegrees' | 'none';

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
  noteLabelMode: NoteLabelMode;
  // New state for configurable items
  keyItems: ConfigurableItem[];
  scaleItems: ConfigurableItem[];
}

export interface StoreActions {
  setRoot: (root: string) => void;
  setScaleType: (scaleType: string) => void;
  setTuning: (tuning: string[]) => void;
  toggleShowRoots: () => void;
  toggleShowTriads: () => void;
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
}

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
  root: 'C',
  scaleType: 'Major',
  tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  showRoots: true,
  showTriads: false,
  noteLabelMode: 'noteNames',
  keyItems: getInitialKeyItems(),
  scaleItems: getInitialScaleItems(),
  setRoot: (root: string) => set({ root }),
  setScaleType: (scaleType: string) => set({ scaleType }),
  setTuning: (tuning: string[]) => set({ tuning }),
  toggleShowRoots: () => set((state) => ({ showRoots: !state.showRoots })),
  toggleShowTriads: () => set((state) => ({ showTriads: !state.showTriads })),
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
    const visibleCount = state.keyItems.filter(i => i.isVisible).length;
    const itemToToggle = state.keyItems.find(i => i.id === key);

    // Safety: Can't hide current selection
    if (itemToToggle?.isCurrent && itemToToggle.isVisible) {
      return state;
    }
    // Safety: Can't hide last visible item
    if (visibleCount <= 1 && itemToToggle?.isVisible) {
      return state;
    }

    return {
      keyItems: state.keyItems.map(item =>
        item.id === key ? { ...item, isVisible: !item.isVisible } : item
      )
    };
  }),
  toggleScaleVisibility: (scale: string) => set((state) => {
    const visibleCount = state.scaleItems.filter(i => i.isVisible).length;
    const itemToToggle = state.scaleItems.find(i => i.id === scale);

    // Safety: Can't hide current selection
    if (itemToToggle?.isCurrent && itemToToggle.isVisible) {
      return state;
    }
    // Safety: Can't hide last visible item
    if (visibleCount <= 1 && itemToToggle?.isVisible) {
      return state;
    }

    return {
      scaleItems: state.scaleItems.map(item =>
        item.id === scale ? { ...item, isVisible: !item.isVisible } : item
      )
    };
  }),
  toggleBulkKeyVisibility: (key: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => set((state) => {
    // If not shift held, delegate to single toggle
    if (!isShiftHeld) {
      const visibleCount = state.keyItems.filter(i => i.isVisible).length;
      const itemToToggle = state.keyItems.find(i => i.id === key);

      if (itemToToggle?.isCurrent && itemToToggle.isVisible) {
        return state;
      }
      if (visibleCount <= 1 && itemToToggle?.isVisible) {
        return state;
      }

      return {
        keyItems: state.keyItems.map(item =>
          item.id === key ? { ...item, isVisible: !item.isVisible } : item
        )
      };
    }

    // Determine "currently applied" index (the one to exclude from bulk toggle)
    let currentAppliedIndex = currentlyAppliedIndex;
    if (currentAppliedIndex === undefined) {
      currentAppliedIndex = state.keyItems.findIndex(item => item.isCurrent);
    }

    const targetItem = state.keyItems.find(item => item.id === key);
    if (!targetItem) return state;
    const targetIndex = state.keyItems.findIndex(item => item.id === key);

    // If target item is the currently applied item, fall back to single toggle
    if (targetIndex === currentAppliedIndex) {
      const visibleCount = state.keyItems.filter(i => i.isVisible).length;

      if (targetItem?.isCurrent && targetItem.isVisible) {
        return state;
      }
      if (visibleCount <= 1 && targetItem?.isVisible) {
        return state;
      }

      return {
        keyItems: state.keyItems.map(item =>
          item.id === key ? { ...item, isVisible: !item.isVisible } : item
        )
      };
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

    // Safety: Ensure at least 1 item remains visible
    const visibleCountAfterChange = state.keyItems.filter((item, i) => {
      if (i === currentAppliedIndex) return item.isVisible; // Keep current item as-is
      return newVisibilityState;
    }).length;

    if (visibleCountAfterChange === 0) {
      return state; // Don't proceed if result would have no visible items
    }

    // Apply new visibility to all items except currently applied
    return {
      keyItems: state.keyItems.map((item, i) => {
        if (i === currentAppliedIndex) return item; // Don't change currently applied item
        return { ...item, isVisible: newVisibilityState };
      })
    };
  }),
  toggleBulkScaleVisibility: (scale: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => set((state) => {
    // If not shift held, delegate to single toggle
    if (!isShiftHeld) {
      const visibleCount = state.scaleItems.filter(i => i.isVisible).length;
      const itemToToggle = state.scaleItems.find(i => i.id === scale);

      if (itemToToggle?.isCurrent && itemToToggle.isVisible) {
        return state;
      }
      if (visibleCount <= 1 && itemToToggle?.isVisible) {
        return state;
      }

      return {
        scaleItems: state.scaleItems.map(item =>
          item.id === scale ? { ...item, isVisible: !item.isVisible } : item
        )
      };
    }

    // Determine "currently applied" index (the one to exclude from bulk toggle)
    let currentAppliedIndex = currentlyAppliedIndex;
    if (currentAppliedIndex === undefined) {
      currentAppliedIndex = state.scaleItems.findIndex(item => item.isCurrent);
    }

    const targetItem = state.scaleItems.find(item => item.id === scale);
    if (!targetItem) return state;
    const targetIndex = state.scaleItems.findIndex(item => item.id === scale);

    // If target item is the currently applied item, fall back to single toggle
    if (targetIndex === currentAppliedIndex) {
      const visibleCount = state.scaleItems.filter(i => i.isVisible).length;

      if (targetItem?.isCurrent && targetItem.isVisible) {
        return state;
      }
      if (visibleCount <= 1 && targetItem?.isVisible) {
        return state;
      }

      return {
        scaleItems: state.scaleItems.map(item =>
          item.id === scale ? { ...item, isVisible: !item.isVisible } : item
        )
      };
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

    // Safety: Ensure at least 1 item remains visible
    const visibleCountAfterChange = state.scaleItems.filter((item, i) => {
      if (i === currentAppliedIndex) return item.isVisible; // Keep current item as-is
      return newVisibilityState;
    }).length;

    if (visibleCountAfterChange === 0) {
      return state; // Don't proceed if result would have no visible items
    }

    // Apply new visibility to all items except currently applied
    return {
      scaleItems: state.scaleItems.map((item, i) => {
        if (i === currentAppliedIndex) return item; // Don't change currently applied item
        return { ...item, isVisible: newVisibilityState };
      })
    };
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
  }),
  {
    name: 'stratobater-storage',
    partialize: (state) => ({
      keyItems: state.keyItems,
      scaleItems: state.scaleItems,
      root: state.root,
      scaleType: state.scaleType,
      showRoots: state.showRoots,
      showTriads: state.showTriads,
      noteLabelMode: state.noteLabelMode,
    }),
  })
);
