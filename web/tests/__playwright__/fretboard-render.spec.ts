import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import { useStore } from '../src/store/useStore';
import React from 'react';

describe('Fretboard Rendering', () => {
  beforeEach(() => {
    // Reset Zustand store before each test
    useStore.getState().resetKeys();
    useStore.getState().resetScales();
    useStore.getState().setSelectedRomanDegree(1);
    useStore.getState().setChordExtension(null);
  });

  it('should render fretboard elements and display notes', () => {
    render(<App />);

    // Check for fretboard elements
    expect(screen.getByTestId('string-labels')).toBeInTheDocument();
    expect(screen.getAllByTestId('string-label').length).toBe(6);
    expect(screen.getByTestId('fret-numbers')).toBeInTheDocument();
    expect(screen.getAllByTestId('fret-number').length).toBe(22);
    expect(screen.getAllByTestId('fret-cell').length).toBeGreaterThan(0);

    // Check for C notes (default root)
    expect(screen.getAllByText('C').length).toBeGreaterThan(0);
    expect(screen.getByText('Roots')).toBeInTheDocument();
  });
});
