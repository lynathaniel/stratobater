import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import type { ConfigurableItem } from '../../store/useStore';
import type { DragEndEvent } from '@dnd-kit/core';
import { DraggableItem } from './DraggableItem';

interface EditModeListProps {
  items: ConfigurableItem[];
  focusedIndex: number;
  isKeyboardNavigation: boolean;
  onItemFocus: (index: number) => void;
  onToggleVisibility: (item: string, isShiftHeld: boolean, currentlyAppliedIndex?: number) => void;
  onReorder: (newOrder: ConfigurableItem[]) => void;
  itemRefs: React.MutableRefObject<(HTMLButtonElement | HTMLDivElement | null)[]>;
}

export const EditModeList: React.FC<EditModeListProps> = ({
  items,
  focusedIndex,
  isKeyboardNavigation,
  onItemFocus,
  onToggleVisibility,
  onReorder,
  itemRefs,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Only start drag after moving 8px
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(items, oldIndex, newIndex);
        onReorder(newOrder);
      }
    }
  };

  const handleVisibilityClick = (e: React.MouseEvent, item: ConfigurableItem, index: number) => {
    e.stopPropagation();
    onItemFocus(index);

    // Detect Shift key for bulk toggle
    const isShiftHeld = e.shiftKey;

    // Pass focusedIndex if in keyboard navigation mode, otherwise undefined
    const currentlyAppliedIndex = isKeyboardNavigation ? focusedIndex : undefined;

    onToggleVisibility(item.id, isShiftHeld, currentlyAppliedIndex);
  };

  const isVisibilityDisabled = (item: ConfigurableItem) => {
    // Can't hide current selection
    if (item.isCurrent && item.isVisible) return true;
    // Can't hide if only one visible item
    const visibleCount = items.filter(i => i.isVisible).length;
    if (visibleCount <= 1 && item.isVisible) return true;
    return false;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => {
          const isVisibilityLocked = isVisibilityDisabled(item);

          return (
            <DraggableItem
              key={item.id}
              item={item}
              isFocusVisible={focusedIndex === index}
              isKeyboardNavigation={isKeyboardNavigation}
              onMouseEnter={() => onItemFocus(index)}
              onClick={() => onItemFocus(index)}
              onVisibilityClick={(e) => handleVisibilityClick(e, item, index)}
              isVisibilityDisabled={isVisibilityLocked}
              ref={(node) => { itemRefs.current[index] = node; }}
            />
          );
        })}
      </SortableContext>
    </DndContext>
  );
};
