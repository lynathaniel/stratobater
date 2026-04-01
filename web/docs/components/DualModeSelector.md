# DualModeSelector Component

## Overview

The DualModeSelector is a sophisticated modal component that provides two modes for key and scale selection: Selection Mode for quick selection and Edit Mode for advanced customization with drag-and-drop reordering.

## User Documentation

### Features

- **Two Modes**:
  - **Selection Mode**: Quick selection from available keys/scales
  - **Edit Mode**: Advanced customization with drag-and-drop reordering
- **Visibility Controls**: Toggle visibility of individual keys/scales
- **Bulk Operations**: Shift-click to toggle multiple items
- **Drag-and-Drop**: Reorder items in Edit Mode
- **Keyboard Navigation**: Full keyboard support with arrow keys
- **Auto-Scroll**: Focused items automatically scroll into view
- **Persistent State**: All customizations saved to local storage
- **Reset Functionality**: Restore default visibility and ordering

### How to Use

#### Selection Mode

1. **Open the Modal**: Press `K` for keys or `S` for scales
2. **Navigate**: Use arrow keys to move through the list
3. **Select**: Press Enter or click to select a key/scale
4. **Close**: Press Escape or click outside the modal

#### Edit Mode

1. **Switch to Edit Mode**: Click the "Edit" button in the modal header
2. **Toggle Visibility**: Click items to show/hide them
3. **Bulk Toggle**: Hold Shift and click to toggle multiple items
4. **Reorder**: Drag items to reorder them
5. **Reset**: Click "Reset" to restore defaults
6. **Save**: Changes are automatically saved to local storage

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate up/down |
| `Enter` | Select item |
| `Escape` | Close modal |
| `Tab` | Move focus between elements |
| `Shift + Click` | Toggle multiple items |

## Technical Documentation

### Architecture

The DualModeSelector follows a component composition pattern:

```
DualModeSelector (index.tsx)
├── SelectionModeList.tsx
├── EditModeList.tsx
│   └── DraggableItem.tsx
└── Modal Header/Footer
```

### Component Structure

#### DualModeSelector (index.tsx)

Main modal component that manages mode switching and state.

**Props:**
```typescript
interface DualModeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'key' | 'scale';
  items: ConfigurableItem[];
  setItems: (items: ConfigurableItem[]) => void;
  onSelect: (item: ConfigurableItem) => void;
  currentValue: string;
}
```

**State:**
- `mode`: 'selection' | 'edit' - Current mode
- `focusedIndex`: number - Currently focused item index

**Key Features:**
- Mode switching between Selection and Edit modes
- Keyboard navigation handling
- Focus management
- Auto-scroll to focused item

#### SelectionModeList

Displays items in a simple list for quick selection.

**Props:**
```typescript
interface SelectionModeListProps {
  items: ConfigurableItem[];
  onSelect: (item: ConfigurableItem) => void;
  currentValue: string;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
}
```

**Features:**
- Simple list rendering
- Click selection
- Keyboard navigation
- Visual feedback for selected item

#### EditModeList

Displays items with visibility toggles and drag-and-drop support.

**Props:**
```typescript
interface EditModeListProps {
  items: ConfigurableItem[];
  setItems: (items: ConfigurableItem[]) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
}
```

**Features:**
- Visibility toggle for each item
- Drag-and-drop reordering
- Bulk toggle with Shift-click
- Reset functionality
- Keyboard navigation

#### DraggableItem

Individual draggable item component.

**Props:**
```typescript
interface DraggableItemProps {
  item: ConfigurableItem;
  index: number;
  onToggleVisibility: (index: number) => void;
  isFocused: boolean;
  onFocus: () => void;
}
```

**Features:**
- Drag handle
- Visibility toggle
- Focus management
- Visual feedback

### Data Structures

#### ConfigurableItem

```typescript
interface ConfigurableItem {
  id: string;           // Unique identifier
  label: string;        // Display label
  value: string;        // Value used in state
  visible: boolean;     // Visibility status
}
```

### Drag-and-Drop Implementation

Uses **@dnd-kit** library for drag-and-drop functionality:

```typescript
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
```

**Sensors:**
- `PointerSensor`: Mouse/touch drag
- `KeyboardSensor`: Keyboard drag with arrow keys

**Sorting Strategy:**
- `verticalListSortingStrategy`: Vertical list sorting

**Event Handlers:**
- `onDragEnd`: Reorder items using `arrayMove`

### State Management

DualModeSelector state is managed in `useStore.ts`:

```typescript
interface DualModeSelectorState {
  keyItems: ConfigurableItem[];
  scaleItems: ConfigurableItem[];
  setKeyItems: (items: ConfigurableItem[]) => void;
  setScaleItems: (items: ConfigurableItem[]) => void;
  resetKeyItems: () => void;
  resetScaleItems: () => void;
}
```

**Persistence:**
- All changes are automatically persisted to local storage
- Zustand middleware handles persistence

### Keyboard Navigation

**Navigation Logic:**
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      setFocusedIndex(Math.max(0, focusedIndex - 1));
      break;
    case 'ArrowDown':
      e.preventDefault();
      setFocusedIndex(Math.min(items.length - 1, focusedIndex + 1));
      break;
    case 'Enter':
      if (mode === 'selection') {
        onSelect(items[focusedIndex]);
        onClose();
      }
      break;
    case 'Escape':
      onClose();
      break;
  }
};
```

**Auto-Scroll:**
```typescript
useEffect(() => {
  if (focusedItemRef.current) {
    focusedItemRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }
}, [focusedIndex]);
```

### Bulk Operations

**Shift-Click Toggle:**
```typescript
const handleShiftClick = (index: number) => {
  if (lastClickedIndex === null) {
    // First click, just toggle this item
    toggleItem(index);
  } else {
    // Toggle range from last clicked to current
    const start = Math.min(lastClickedIndex, index);
    const end = Math.max(lastClickedIndex, index);
    const newItems = items.map((item, i) => {
      if (i >= start && i <= end) {
        return { ...item, visible: !item.visible };
      }
      return item;
    });
    setItems(newItems);
  }
  setLastClickedIndex(index);
};
```

### Reset Functionality

**Default Items:**
```typescript
const DEFAULT_KEY_ITEMS: ConfigurableItem[] = [
  { id: 'C', label: 'C', value: 'C', visible: true },
  { id: 'D', label: 'D', value: 'D', visible: true },
  // ... all 12 keys
];

const DEFAULT_SCALE_ITEMS: ConfigurableItem[] = [
  { id: 'major', label: 'Major', value: 'major', visible: true },
  { id: 'minor', label: 'Minor', value: 'minor', visible: true },
  // ... all scales
];
```

**Reset Function:**
```typescript
const resetItems = () => {
  if (type === 'key') {
    setKeyItems(DEFAULT_KEY_ITEMS);
  } else {
    setScaleItems(DEFAULT_SCALE_ITEMS);
  }
};
```

## Developer Documentation

### Adding New Items

To add a new key or scale:

1. **Update default items** in `useStore.ts`:
   ```typescript
   const DEFAULT_KEY_ITEMS: ConfigurableItem[] = [
     // ... existing items
     { id: 'newKey', label: 'New Key', value: 'newKey', visible: true },
   ];
   ```

2. **Update music theory logic** if needed in `fretboard.ts`

3. **Test** the new item appears in the selector

### Customizing Drag-and-Drop

To customize drag-and-drop behavior:

1. **Modify sensors** in `EditModeList.tsx`:
   ```typescript
   const sensors = useSensors(
     useSensor(PointerSensor, {
       activationConstraint: {
         distance: 8, // 8px drag threshold
       },
     }),
     useSensor(KeyboardSensor, {
       coordinateGetter: sortableKeyboardCoordinates,
     })
   );
   ```

2. **Update sorting strategy** if needed:
   ```typescript
   <SortableContext
     items={items}
     strategy={horizontalListSortingStrategy} // Change strategy
   >
   ```

### Adding New Modes

To add a new mode to the selector:

1. **Update mode type**:
   ```typescript
   type Mode = 'selection' | 'edit' | 'newMode';
   ```

2. **Create new component** for the mode:
   ```typescript
   // NewModeList.tsx
   export const NewModeList = ({ /* props */ }) => {
     // Implementation
   };
   ```

3. **Add mode switcher** in `index.tsx`:
   ```typescript
   const renderMode = () => {
     switch (mode) {
       case 'selection':
         return <SelectionModeList {...props} />;
       case 'edit':
         return <EditModeList {...props} />;
       case 'newMode':
         return <NewModeList {...props} />;
     }
   };
   ```

### Performance Considerations

- Drag-and-drop operations are O(n) where n is the number of items
- Keyboard navigation is O(1) for index updates
- Auto-scroll uses `scrollIntoView` which is optimized by browsers
- Consider virtualization for large lists (100+ items)

### Accessibility

**ARIA Attributes:**
```typescript
<div
  role="listbox"
  aria-label={`${type} selector`}
  aria-activedescendant={`item-${focusedIndex}`}
>
  {items.map((item, index) => (
    <div
      role="option"
      aria-selected={item.value === currentValue}
      id={`item-${index}`}
      tabIndex={index === focusedIndex ? 0 : -1}
    >
      {/* Item content */}
    </div>
  ))}
</div>
```

**Focus Management:**
- Trap focus within modal when open
- Return focus to trigger element when closed
- Manage focus between modes

### Testing

Test cases to consider:

1. **Mode switching**: Verify correct mode rendering
2. **Selection**: Verify item selection updates state
3. **Visibility toggle**: Verify visibility changes persist
4. **Bulk operations**: Verify Shift-click toggles range correctly
5. **Drag-and-drop**: Verify reordering updates state
6. **Keyboard navigation**: Verify arrow keys navigate correctly
7. **Auto-scroll**: Verify focused item scrolls into view
8. **Reset**: Verify reset restores defaults
9. **Persistence**: Verify changes survive page reload
10. **Accessibility**: Verify ARIA attributes and focus management

### Dependencies

- **@dnd-kit/core**: Core drag-and-drop functionality
- **@dnd-kit/sortable**: Sortable list functionality
- **@dnd-kit/utilities**: Utility functions for drag-and-drop
- **Zustand**: State management with persistence
- **React**: UI rendering and state management
- **lucide-react**: Icons

### Related Files

- `web/src/components/DualModeSelector/index.tsx` - Main modal component
- `web/src/components/DualModeSelector/SelectionModeList.tsx` - Selection mode
- `web/src/components/DualModeSelector/EditModeList.tsx` - Edit mode
- `web/src/components/DualModeSelector/DraggableItem.tsx` - Draggable item
- `web/src/store/useStore.ts` - State management
- `web/src/components/Fretboard.tsx` - Integration with fretboard

### Future Enhancements

Potential improvements to the DualModeSelector:

1. **Search functionality**: Filter items by text search
2. **Categories**: Group items by category (e.g., major keys, minor keys)
3. **Presets**: Save and load custom configurations
4. **Import/Export**: Export/import configurations
5. **Undo/Redo**: Undo/redo for edit operations
6. **Multi-select**: Select multiple items at once
7. **Custom labels**: Allow users to customize item labels
8. **Color coding**: Color-code items by category
9. **Quick filters**: Quick filter buttons (e.g., "Show all", "Hide all")
10. **Touch gestures**: Swipe gestures for mobile
