import React, { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import type { ConfigurableItem } from '../../store/useStore';

interface DraggableItemProps {
  item: ConfigurableItem;
  isFocusVisible: boolean;
  isKeyboardNavigation: boolean;
  onClick: () => void;
  onVisibilityClick: (e: React.MouseEvent) => void;
  isVisibilityDisabled: boolean;
  onMouseEnter?: () => void;
}

export const DraggableItem = forwardRef<HTMLDivElement, DraggableItemProps>(
  ({ item, isFocusVisible, isKeyboardNavigation, onClick, onVisibilityClick, isVisibilityDisabled, onMouseEnter }, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: item.id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition: transition || 'transform 150ms cubic-bezier(0.2, 0, 0, 1)',
      opacity: isDragging ? 0.3 : 1,
    };

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        style={style}
        className={clsx(
          'flex items-center justify-between pl-1 pr-2 py-1.5 rounded-md transition-all h-12 shrink-0',
          item.isCurrent && item.isVisible
            ? 'bg-blue-500/20'
            : item.isVisible
              ? ''
              : 'opacity-50',
          isFocusVisible && isKeyboardNavigation && 'ring-2 ring-blue-500 ring-offset-1 ring-offset-neutral-800',
          !isDragging && 'border border-transparent'
        )}
      >
        {/* LEFT SIDE: Draggable area (grip + label + 5px buffer) */}
        <div
          {...attributes}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          className={clsx(
            'flex items-center cursor-grab active:cursor-grabbing min-w-0 hover:bg-neutral-700/50 rounded',
            item.isCurrent && item.isVisible ? '' : item.isVisible ? 'hover:bg-neutral-700/50' : 'hover:bg-neutral-700/30'
          )}
        >
          {/* Drag handle with listeners ONLY on this element */}
          <div
            {...listeners}
            className="shrink-0 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={14} className="text-neutral-500" />
          </div>

          {/* Label */}
          <span className={clsx(
            'text-sm font-medium shrink-0',
            item.isCurrent ? 'text-blue-400' : 'text-neutral-200',
            !item.isVisible && 'opacity-35'
          )}>
            {item.label}
          </span>
          {/* Invisible 5px buffer extending drag area */}
          <div className="w-[5px] h-full shrink-0" />
        </div>

        {/* RIGHT SIDE: Non-draggable (Current + Eye) */}
        <div className="flex items-center gap-1.5 pr-[2px] cursor-default">
          {/* Current indicator - always rendered to maintain layout position */}
          <span className={clsx(
            'text-xs text-blue-400 font-semibold',
            !item.isCurrent && 'invisible'
          )}>
            Current
          </span>

          {/* Visibility toggle */}
          <button
            onClick={onVisibilityClick}
            className={clsx(
              'rounded transition-colors',
              isVisibilityDisabled
                ? 'text-neutral-600 cursor-not-allowed'
                : item.isVisible
                  ? 'text-green-400 hover:text-green-300 hover:bg-green-500/20'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700'
            )}
            disabled={isVisibilityDisabled}
            aria-label={item.isVisible ? 'Hide item' : 'Show item'}
            title={isVisibilityDisabled ? 'Cannot hide current selection or last visible item' : undefined}
          >
            {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        </div>
      </div>
    );
  }
);

DraggableItem.displayName = 'DraggableItem';
