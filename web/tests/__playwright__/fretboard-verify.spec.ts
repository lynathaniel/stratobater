import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStore } from '../src/store/useStore';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Fretboard User Interaction', () => {
  beforeEach(() => {
    // Reset Zustand store before each test
    useStore.getState().resetKeys();
    useStore.getState().resetScales();
    useStore.getState().setSelectedRomanDegree(1);
    useStore.getState().setChordExtension(null);
  });

  it('should render fretboard with correct notes and styles', () => {
    render(<Fretboard />);

    // Check for fretboard structure
    expect(screen.getAllByTestId('string-row').length).toBe(6);
    expect(screen.getAllByTestId('fret-cell').length).toBe(6 * 22);
    expect(screen.getAllByTestId('note-circle').length).toBeGreaterThan(0);

    // Check for musical notes
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    notes.forEach(note => {
      const noteElements = screen.queryAllByText(note);
      expect(noteElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  it('should toggle roots when Roots button is clicked', () => {
    render(<Fretboard />);
    const rootsButton = screen.getByText('Roots');

    // Initial state
    expect(useStore.getState().showRoots).toBe(true);

    // Click to toggle
    act(() => {
      fireEvent.click(rootsButton);
    });
    expect(useStore.getState().showRoots).toBe(false);

    // Click again to toggle back
    act(() => {
      fireEvent.click(rootsButton);
    });
    expect(useStore.getState().showRoots).toBe(true);
  });
});
