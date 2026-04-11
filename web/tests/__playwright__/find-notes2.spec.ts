import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useStore } from '../src/store/useStore';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Find Notes V2', () => {
  beforeEach(() => {
    // Reset Zustand store for consistent test conditions
    useStore.getState().resetKeys();
    useStore.getState().resetScales();
    useStore.getState().setRoot('C');
    useStore.getState().setScaleType('major');
    useStore.getState().setSelectedRomanDegree(1);
    useStore.getState().setChordExtension(null);
  });

  it('should render fretboard with correct number of strings, frets, and note circles', () => {
    render(<Fretboard />);

    // Check for 6 strings
    expect(screen.getAllByTestId('string-label').length).toBe(6);
    
    // Check for 22 frets per string
    expect(screen.getAllByTestId('fret-cell').length).toBe(6 * 22);
    
    // Check for note circles (should be at least 6 per note in scale)
    expect(screen.getAllByTestId('note-circle').length).toBeGreaterThan(36);
  });

  it('should display all expected buttons and their text content', () => {
    render(<Fretboard />);

    // Check for expected buttons
    expect(screen.getByTestId('chord-mode-button')).toBeInTheDocument();
    expect(screen.getByText('Roots')).toBeInTheDocument();
    expect(screen.getByText('Scale Notes')).toBeInTheDocument();
    expect(screen.getByText('Triads')).toBeInTheDocument();
    expect(screen.getByText('Chords')).toBeInTheDocument();
    
    // Check for chord buttons
    expect(screen.getByTestId('chord-button-I')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-ii')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-III')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-IV')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-V')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-vi')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-vii°')).toBeInTheDocument();
  });

  it('should highlight root notes (red) and triad notes (blue) when enabled', () => {
    render(<Fretboard />);

    // Enable Triads
    const triadsButton = screen.getByText('Triads');
    act(() => {
      fireEvent.click(triadsButton);
    });

    // Find root (C) and triad (E, G) notes
    const cNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('C')
    );
    const eNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('E')
    );
    const gNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('G')
    );

    // Check root notes are red
    cNotes.forEach(note => {
      expect(note).toHaveClass(/bg-red-500/);
    });

    // Check triad notes are blue
    eNotes.forEach(note => {
      expect(note).toHaveClass(/bg-blue-500/);
    });
    gNotes.forEach(note => {
      expect(note).toHaveClass(/bg-blue-500/);
    });
  });

  it('should display all musical notes (C, D, E, F, G, A, B) on the fretboard', () => {
    render(<Fretboard />);

    const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    noteLetters.forEach(note => {
      const notes = screen.getAllByTestId('note-circle').filter(el =>
        el.textContent?.includes(note)
      );
      expect(notes.length).toBeGreaterThan(0);
    });
  });
});