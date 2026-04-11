import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Debug - Chord Button Discovery', () => {
  it('should list all buttons and verify chord-related buttons', () => {
    render(<Fretboard />);
    
    // Get all buttons
    const buttons = screen.getAllByRole('button');
    const buttonLabels = buttons.map(btn => btn.textContent?.trim() || '(empty)');
    
    // Log all buttons for debugging
    console.log('All buttons:', buttonLabels);
    
    // Verify expected buttons exist
    expect(buttonLabels).toContain('Roots');
    expect(buttonLabels).toContain('Triads');
    expect(buttonLabels).toContain('Chords');
    expect(buttonLabels).toContain('ii');
    expect(buttonLabels).toContain('V');
  });
  
  it('should verify page content and note visibility', () => {
    render(<Fretboard />);
    
    // Check body text content
    const bodyText = document.body.textContent || "";
    
    expect(bodyText).toContain('ii');
    expect(bodyText).toContain('Roots');
    expect(bodyText).toContain('Triads');
    
    // Check for C notes
    const cNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('C')
    );
    
    console.log('Found C notes:', cNotes.length);
    expect(cNotes.length).toBeGreaterThan(0);
  });
});