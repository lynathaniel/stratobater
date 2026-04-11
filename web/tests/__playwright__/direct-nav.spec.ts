import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useStore } from '../src/store/useStore';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Direct Navigation to Fretboard', () => {
  beforeEach(() => {
    // Reset Zustand store for initial state
    useStore.getState().resetKeys();
    useStore.getState().resetScales();
    useStore.getState().setRoot('C');
    useStore.getState().setScaleType('major');
    useStore.getState().navigateTo('fretboard');
  });

  it('should render fretboard with expected UI elements', () => {
    render(<Fretboard />);

    // Verify fretboard structure
    expect(screen.getByTestId('string-labels')).toBeInTheDocument();
    expect(screen.getAllByTestId('string-label').length).toBe(6);
    expect(screen.getByTestId('fret-numbers')).toBeInTheDocument();
    expect(screen.getAllByTestId('fret-cell').length).toBe(6 * 22);
    expect(screen.getAllByTestId('note-circle').length).toBeGreaterThan(36);
  });

  it('should display expected buttons and text content', () => {
    render(<Fretboard />);

    // Verify buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(5);
    
    // Verify expected buttons
    expect(screen.getByTestId('chord-mode-button')).toBeInTheDocument();
    expect(screen.getByText('Roots')).toBeInTheDocument();
    expect(screen.getByText('Scale Notes')).toBeInTheDocument();
    expect(screen.getByText('Triads')).toBeInTheDocument();
    expect(screen.getByText('Chords')).toBeInTheDocument();
    
    // Verify chord buttons
    ['I', 'ii', 'III', 'IV', 'V', 'vi', 'vii°'].forEach(chord => {
      expect(screen.getByTestId(`chord-button-${chord}`)).toBeInTheDocument();
    });
  });

  it('should display musical notes and controls on page', () => {
    render(<Fretboard />);

    // Verify musical notes
    const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    noteLetters.forEach(note => {
      const notes = screen.getAllByTestId('note-circle').filter(el =>
        el.textContent?.includes(note)
      );
      expect(notes.length).toBeGreaterThan(0);
    });

    // Verify visible text content
    expect(document.body.textContent).toContain('Roots');
    expect(document.body.textContent).toContain('Fretboard');
    expect(document.body.textContent?.length).toBeGreaterThan(100);
  });
});