import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import type { ConfigurableItem } from '../../store/useStore';

interface SelectionModeListProps {
  items: ConfigurableItem[];
  currentSelection: string;
  focusedIndex: number;
  isKeyboardNavigation: boolean;
  onItemFocus: (index: number) => void;
  onSelect: (item: string) => void;
  onClose: () => void;
  itemRefs: React.MutableRefObject<(HTMLButtonElement | HTMLDivElement | null)[]>;
}

export const SelectionModeList: React.FC<SelectionModeListProps> = ({
  items,
  currentSelection,
  focusedIndex,
  isKeyboardNavigation,
  onItemFocus,
  onSelect,
  onClose,
  itemRefs,
}) => {
  const handleItemClick = (item: ConfigurableItem, index: number) => {
    onItemFocus(index);
    onSelect(item.id);
    onClose();
  };

  return (
    <div>
      {items.map((item, index) => {
        const isCurrent = item.id === currentSelection;

        return (
          <button
            key={item.id}
            ref={(node) => { itemRefs.current[index] = node; }}
            onClick={() => handleItemClick(item, index)}
            onMouseEnter={() => onItemFocus(index)}
            className={clsx(
              'w-full flex items-center gap-3 px-2 py-1.5 rounded-md transition-all text-left h-12 shrink-0',
              isCurrent
                ? 'bg-blue-500/20 border border-transparent'
                : 'hover:bg-neutral-700/50 border border-transparent',
              focusedIndex === index && isKeyboardNavigation && 'ring-2 ring-blue-500 ring-offset-1 ring-offset-neutral-800'
            )}
            role="option"
            aria-selected={isCurrent}
          >
            <span className={clsx(
              'flex-1 text-sm font-medium',
              isCurrent ? 'text-blue-400' : 'text-neutral-200'
            )}>
              {item.label}
            </span>
            {isCurrent && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-400 font-semibold">Current</span>
                <Check size={14} className="text-blue-400" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
