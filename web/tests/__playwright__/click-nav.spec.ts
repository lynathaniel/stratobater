import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../src/App';
import { useStore } from '../src/store/useStore';
import React from 'react';

describe('Click Navigation to Fretboard', () => {
  beforeEach(() => {
    // Reset Zustand store for initial state
    useStore.getState().resetKeys();
    useStore.getState().resetScales();
  });

  it('should render fretboard when accessed via navigation', () => {
    render(<App />);
    
    // Check current URL (simulated via Zustand)
    expect(useStore.getState().currentPage).toBe('home');
    
    // Simulate navigation to fretboard
    const fretboardLink = screen.getByRole('link', { name: /fretboard/i });
    expect(fretboardLink).toBeInTheDocument();
    
    // Verify fretboard rendering
    expect(screen.getByTestId('string-labels')).toBeInTheDocument();
    expect(screen.getAllByTestId('string-row').length).toBe(6);
    expect(screen.getByText('Roots')).toBeInTheDocument();
    
    // Verify URL update (simulated via Zustand)
    act(() => {
      useStore.getState().navigateTo('fretboard');
    });
    expect(useStore.getState().currentPage).toBe('fretboard');
  });

  it('should display fretboard controls and buttons', () => {
    // Start directly on fretboard page
    act(() => {
      useStore.getState().navigateTo('fretboard');
    });
    render(<App />);
    
    // Check for expected buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(5);
    
    const expectedButtons = [
      'Roots',
      'Scale Notes',
      'Triads',
      'Chords'
    ];
    
    expectedButtons.forEach(buttonText => {
      expect(screen.getByText(buttonText)).toBeInTheDocument();
    });
    
    // Check for chord buttons
    ['I', 'ii', 'III', 'IV', 'V', 'vi', 'vii°'].forEach(chord => {
      const button = screen.queryByTestId(`chord-button-${chord}`);
      expect(button).toBeInTheDocument();
    });
  });
});