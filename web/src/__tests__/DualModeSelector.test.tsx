import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DualModeSelector } from '../components/DualModeSelector';
import React from 'react';

// Mock functions for DualModeSelector props
const mockOnClose = vi.fn();
const mockOnSelect = vi.fn();
const mockOnToggleVisibility = vi.fn();
const mockOnReorder = vi.fn();
const mockOnReset = vi.fn();

// Mock key items
const mockKeyItems = [
  {
    id: 'C',
    label: 'C',
    name: 'C',
    isVisible: true, 
    isCurrent: true
  },
  {
    id: 'G',
    label: 'G',
    name: 'G',
    isVisible: true, 
    isCurrent: false
  },
  {
    id: 'F',
    label: 'F',
    name: 'F',
    isVisible: true, 
    isCurrent: false
  },
  {
    id: 'D',
    label: 'D',
    name: 'D',
    isVisible: true, 
    isCurrent: false
  }
];

// Mock useStore
import * as useStoreModule from '../store/useStore';

vi.mock('../store/useStore');
vi.mocked(useStoreModule.useStore).mockReturnValue({
  keyItems: mockKeyItems,
  isOpen: false // Default for isOpen=false test
});



describe('DualModeSelector Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

it('does not render when isOpen is false', () => {
    // Mock Zustand to return isOpen: false
    vi.mocked(useStoreModule.useStore).mockReturnValue({ isOpen: false });
    render(
      <DualModeSelector
        isOpen={false}
        onClose={mockOnClose}
        type="key"
        currentSelection="C"
        items={mockKeyItems}
        onSelect={mockOnSelect}
        onToggleVisibility={mockOnToggleVisibility}
        onReorder={mockOnReorder}
      />
    );
    expect(screen.queryByTestId('dual-mode-selector-modal')).not.toBeInTheDocument();
  });

  it('renders modal with correct title and buttons when isOpen is true', () => {
    render(
      <DualModeSelector
        isOpen={true}
        onClose={mockOnClose}
        type="key"
        currentSelection="C"
        items={mockKeyItems}
        onSelect={mockOnSelect}
        onToggleVisibility={mockOnToggleVisibility}
        onReorder={mockOnReorder}
      />
    );

    expect(screen.getByTestId('dual-mode-selector-modal')).toBeInTheDocument();
    expect(screen.getByText('Select Key (K)')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-mode-button')).toBeInTheDocument();
    expect(screen.getByTestId('close-modal-button')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <DualModeSelector
        isOpen={true}
        onClose={mockOnClose}
        type="key"
        currentSelection="C"
        items={mockKeyItems}
        onSelect={mockOnSelect}
        onToggleVisibility={mockOnToggleVisibility}
        onReorder={mockOnReorder}
      />
    );

    fireEvent.click(screen.getByTestId('close-modal-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders SelectionModeList when in selection mode', () => {
    render(
      <DualModeSelector
        isOpen={true}
        onClose={mockOnClose}
        type="key"
        currentSelection="C"
        items={mockKeyItems}
        onSelect={mockOnSelect}
        onToggleVisibility={mockOnToggleVisibility}
        onReorder={mockOnReorder}
      />
    );

    const cOption = screen.getAllByText(/C/i).find(el =>
      el.closest('button')?.getAttribute('aria-selected') === 'true'
    );
    expect(cOption).toBeInTheDocument();
    expect(screen.getByText(/Selection Mode/i)).toBeInTheDocument();
  });

  it('renders EditModeList when in edit mode', () => {
    render(
      <DualModeSelector
        isOpen={true}
        onClose={mockOnClose}
        type="key"
        currentSelection="C"
        items={mockKeyItems}
        onSelect={mockOnSelect}
        onToggleVisibility={mockOnToggleVisibility}
        onReorder={mockOnReorder}
      />
    );

    fireEvent.click(screen.getByTestId('toggle-mode-button'));
    expect(screen.queryByText('Edit Mode')).toBeInTheDocument();
  });

  it('displays all mock items in selection mode', () => {
    render(
      <DualModeSelector
        isOpen={true}
        onClose={mockOnClose}
        type="key"
        currentSelection="C"
        items={mockKeyItems}
        onSelect={mockOnSelect}
        onToggleVisibility={mockOnToggleVisibility}
        onReorder={mockOnReorder}
      />
    );

    const optionButtons = screen.getAllByRole('option');
    const buttonLabels = optionButtons.map(button => button.textContent?.trim());
    expect(buttonLabels.some(label => /C/i.test(label ?? ""))).toBe(true);
    expect(buttonLabels.some(label => /G/i.test(label ?? ""))).toBe(true);
    expect(buttonLabels.some(label => /F/i.test(label ?? ""))).toBe(true);
    expect(buttonLabels.some(label => /D/i.test(label ?? ""))).toBe(true);
  });

  it('toggles to edit mode when toggle button is clicked', () => {
    render(
      <DualModeSelector
        isOpen={true}
        onClose={mockOnClose}
        type="key"
        currentSelection="C"
        items={mockKeyItems}
        onSelect={mockOnSelect}
        onToggleVisibility={mockOnToggleVisibility}
        onReorder={mockOnReorder}
      />
    );

    fireEvent.click(screen.getByTestId('toggle-mode-button'));
    expect(screen.getByText(/Edit Mode/i)).toBeInTheDocument();
  });
});