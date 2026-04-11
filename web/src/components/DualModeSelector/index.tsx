import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { X, Edit, RotateCcw } from 'lucide-react';
import { SelectionModeList } from './SelectionModeList';
import { EditModeList } from './EditModeList';
import type { ConfigurableItem } from '../../store/useStore';

export interface DualModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'key' | 'scale';
  currentSelection: string;
  items: ConfigurableItem[];
  onSelect: (item: string) => void;
  onToggleVisibility: (item: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => void;
  onReorder: (newOrder: ConfigurableItem[]) => void;
  onReset?: () => void;
}

type Mode = 'selection' | 'edit';

export const DualModeSelector: React.FC<DualModeSelectorProps> = ({
  isOpen,
  onClose,
  type,
  currentSelection,
  items,
  onSelect,
  onToggleVisibility,
  onReorder,
  onReset,
}) => {
  const [mode, setMode] = useState<Mode>('selection');
  const [focusedIndex, setFocusedIndex] = useState<number>(() =>
    items.findIndex(item => item.id === currentSelection)
  );
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | HTMLDivElement | null)[]>([]);
  const lastFocusedIndex = useRef<number>(-1);

  // Focus modal when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => modalRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Reset mode and focus when opening
  useEffect(() => {
    if (isOpen) {
      setMode('selection');
      setFocusedIndex(items.findIndex(item => item.id === currentSelection));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Reset item refs when items array changes
  useEffect(() => {
    itemRefs.current = [];
  }, [items]);

  // Helper function to check if element is fully visible in scroll container (including outline)
  const isElementFullyVisible = (element: HTMLElement, container: HTMLElement): boolean => {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Account for the focus outline (ring-2 = 8px, ring-offset-1 = 4px on top side)
    // Total additional space needed ABOVE the element: ~12px
    const ELEMENT_OUTLINE_TOP = 12;
    const ELEMENT_OUTLINE_BOTTOM = 8;

    const elementTop = elementRect.top - ELEMENT_OUTLINE_TOP;
    const elementBottom = elementRect.bottom + ELEMENT_OUTLINE_BOTTOM;

    return (
      elementTop >= containerRect.top &&
      elementBottom <= containerRect.bottom
    );
  };

  // Auto-scroll to focused item when using keyboard navigation
  useLayoutEffect(() => {
    if (isKeyboardNavigation && focusedIndex >= 0 && focusedIndex < itemRefs.current.length) {
      const focusedElement = itemRefs.current[focusedIndex];
      if (focusedElement && scrollContainerRef.current) {
        // Only scroll if the element (including its outline) is not fully visible
        if (!isElementFullyVisible(focusedElement, scrollContainerRef.current)) {
          const isNavigatingDown = focusedIndex > lastFocusedIndex.current;
          lastFocusedIndex.current = focusedIndex;

          // Use 'start' when navigating down, 'end' when navigating up
          // This ensures the focused outline is always fully visible
          focusedElement.scrollIntoView({
            behavior: 'smooth',
            block: isNavigatingDown ? 'start' : 'end',
          });
        }
      }
    }
  }, [focusedIndex, isKeyboardNavigation]);

  // Get visible items for Selection Mode
  const visibleItems = items.filter(item => item.isVisible);

  const handleModeToggle = useCallback(() => {
    setMode(prev => prev === 'selection' ? 'edit' : 'selection');
  }, []);

  const handleMouseFocus = useCallback((index: number) => {
    setIsKeyboardNavigation(false);
    setFocusedIndex(index);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    const itemsToNavigate = mode === 'selection' ? visibleItems : items;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setIsKeyboardNavigation(true);
        setFocusedIndex(prev => (prev - 1 + itemsToNavigate.length) % itemsToNavigate.length);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setIsKeyboardNavigation(true);
        setFocusedIndex(prev => (prev + 1) % itemsToNavigate.length);
        break;
      case ' ':  // Spacebar toggles mode
        e.preventDefault();
        handleModeToggle();
        break;
      case 'Enter':
        e.preventDefault();
        if (mode === 'selection') {
          const item = visibleItems[focusedIndex];
          if (item) {
            onSelect(item.id);
            onClose();
          }
        } else {
          // Edit Mode: Enter toggles visibility, Shift+Enter for bulk toggle
          const isShiftHeld = e.shiftKey;
          const item = items[focusedIndex];
          if (item) {
            // If keyboard navigation is active, pass focusedIndex as currentlyAppliedIndex
            const currentlyAppliedIndex = isKeyboardNavigation ? focusedIndex : undefined;
            onToggleVisibility(item.id, isShiftHeld, currentlyAppliedIndex);
          }
        }
        break;
      case 'r':
      case 'R':
        if (onReset) {
          onReset();
        }
        break;
      // Cmd/Ctrl + Arrow for reordering in Edit Mode
      case 'ArrowLeft':
      case 'ArrowRight':
        if (mode === 'edit' && (e.metaKey || e.ctrlKey)) {
          // Check if arrow key press is actually Up/Down
          // Note: KeyboardEvent doesn't report Cmd+ArrowUp/Down as ArrowUp/Down,
          // but we'll check the key if it reaches here
        }
        break;
    }
  }, [mode, visibleItems, items, focusedIndex, handleModeToggle, onSelect, onClose, onToggleVisibility]);

  // Handle keyboard reordering in Edit Mode
  useEffect(() => {
    const handleReorderKeys = (e: KeyboardEvent) => {
      if (mode !== 'edit' || !(e.metaKey || e.ctrlKey)) return;

      const maxIndex = items.length - 1;
      if (maxIndex <= 0) return;

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const newIndex = focusedIndex - 1;
        if (newIndex >= 0) {
          const newOrder = [...items];
          const [removed] = newOrder.splice(focusedIndex, 1);
          newOrder.splice(newIndex, 0, removed);
          onReorder(newOrder);
          setFocusedIndex(newIndex);
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const newIndex = focusedIndex + 1;
        if (newIndex <= maxIndex) {
          const newOrder = [...items];
          const [removed] = newOrder.splice(focusedIndex, 1);
          newOrder.splice(newIndex, 0, removed);
          onReorder(newOrder);
          setFocusedIndex(newIndex);
        }
      }
    };

    window.addEventListener('keydown', handleReorderKeys);
    return () => window.removeEventListener('keydown', handleReorderKeys);
  }, [mode, items, focusedIndex, onReorder]);

  // Update focused index when mode switches or selection changes
  useEffect(() => {
    if (mode === 'selection') {
      // When switching to selection mode, focus on current selection if visible
      const newFocusIndex = visibleItems.findIndex(item => item.id === currentSelection);
      if (newFocusIndex !== -1) {
        setFocusedIndex(newFocusIndex);
      }
    } else {
      // When switching to edit mode, focus on current selection
      const newFocusIndex = items.findIndex(item => item.id === currentSelection);
      if (newFocusIndex !== -1) {
        setFocusedIndex(newFocusIndex);
      }
    }
  }, [mode, currentSelection]); // Only run when mode or selection actually changes

  if (!isOpen) return null;

  const title = type === 'key' ? 'Select Key (K)' : 'Select Scale (S)';
  const modeLabel = mode === 'selection' ? 'Selection Mode' : 'Edit Mode';

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-testid="dual-mode-selector-modal"
    >
      <div
        ref={modalRef}
        tabIndex={0}
        className="bg-neutral-800 border border-neutral-600 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col focus:outline-none"
        onKeyDown={handleKeyDown}
      >
        {/* Header with mode toggle */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">{modeLabel}</span>
          <button
            onClick={handleModeToggle}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors"
            aria-label="Toggle mode"
            title="Switch to Edit Mode (Space)"
            data-testid="toggle-mode-button"
          >
            <Edit size={18} />
          </button>
          {onReset && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors"
              aria-label="Reset to defaults"
              title="Reset to defaults"
              data-testid="reset-button"
            >
              <RotateCcw size={18} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700 transition-colors"
            aria-label="Close modal"
            data-testid="close-modal-button"
          >
            <X size={20} />
          </button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={scrollContainerRef}
          className="overflow-y-auto flex-1 p-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{'[data-scrollable="true"]::-webkit-scrollbar { display: none; }'}</style>
          <div data-scrollable="true">
            {mode === 'selection' ? (
              <SelectionModeList
                items={visibleItems}
                currentSelection={currentSelection}
                focusedIndex={focusedIndex}
                isKeyboardNavigation={isKeyboardNavigation}
                onItemFocus={handleMouseFocus}
                onSelect={onSelect}
                onClose={onClose}
                itemRefs={itemRefs}
              />
            ) : (
              <EditModeList
                items={items}
                focusedIndex={focusedIndex}
                isKeyboardNavigation={isKeyboardNavigation}
                onItemFocus={handleMouseFocus}
                onToggleVisibility={onToggleVisibility}
                onReorder={onReorder}
                itemRefs={itemRefs}
              />
            )}
          </div>
        </div>

        {/* Footer with keyboard hints */}
        <div className="p-3 border-t border-neutral-700 text-xs text-neutral-500 text-center leading-tight">
          {mode === 'selection'
            ? 'Enter: select • Space: edit mode • Arrows: navigate • R: reset'
            : 'Enter: toggle visibility • Shift+Enter: bulk toggle • Space: selection mode • Drag: reorder • R: reset'
          }
        </div>
      </div>
    </div>
  );
};
