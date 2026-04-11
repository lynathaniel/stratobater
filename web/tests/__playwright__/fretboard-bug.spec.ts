import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useStore } from '../src/store/useStore';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Fretboard Bug - Roots/Triads Highlighting', () => {
  beforeEach(() => {
    // Reset Zustand store for consistent test conditions
    useStore.getState().resetKeys();
    useStore.getState().resetScales();
    useStore.getState().setRoot('C');
    useStore.getState().setScaleType('major');
    useStore.getState().setSelectedRomanDegree(1);
    useStore.getState().setChordExtension(null);
  });

  it('Roots button highlights selected chord root, not tonic root', async () => {
    render(<Fretboard />);
    
    // Click degree ii (D is the root)
    const iiButton = screen.getByTestId('chord-button-ii');
    await act(async () => {
      fireEvent.click(iiButton);
    });
    
    // Find D and C notes
    const dNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('D')
    );
    const cNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('C')
    );
    
    // D should be red (chord root of ii)
    dNotes.forEach(note => {
      expect(note).toHaveClass(/bg-red-500/);
    });
    
    // C should NOT be red (tonic root)
    cNotes.forEach(note => {
      expect(note).not.toHaveClass(/bg-red-500/);
    });
  });

  it('Triads button highlights selected chord triad, not tonic triad', async () => {
    render(<Fretboard />);
    
    // Disable Roots button
    const rootsButton = screen.getByText('Roots');
    await act(async () => {
      fireEvent.click(rootsButton);
    });
    
    // Enable Triads button
    const triadsButton = screen.getByText('Triads');
    await act(async () => {
      fireEvent.click(triadsButton);
    });
    
    // Click degree V (G-B-D)
    const vButton = screen.getByTestId('chord-button-V');
    await act(async () => {
      fireEvent.click(vButton);
    });
    
    // Find notes
    const gNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('G')
    );
    const bNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('B')
    );
    const dNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('D')
    );
    const cNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('C')
    );
    const eNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('E')
    );
    
    // G, B, D should be blue (chord triad)
    gNotes.forEach(note => {
      expect(note).toHaveClass(/bg-blue-500/);
    });
    bNotes.forEach(note => {
      expect(note).toHaveClass(/bg-blue-500/);
    });
    dNotes.forEach(note => {
      expect(note).toHaveClass(/bg-blue-500/);
    });
    
    // C and E should NOT be blue (not in V chord triad)
    cNotes.forEach(note => {
      expect(note).not.toHaveClass(/bg-blue-500/);
    });
    eNotes.forEach(note => {
      expect(note).not.toHaveClass(/bg-blue-500/);
    });
  });
});