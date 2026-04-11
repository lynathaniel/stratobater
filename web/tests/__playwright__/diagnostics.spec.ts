import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Diagnostics - Button and Note Discovery', () => {
  it('should find all expected buttons via role, text, and test ID', () => {
    render(<Fretboard />);
    
    // Check buttons by role
    const buttonsByRole = screen.getAllByRole('button');
    expect(buttonsByRole.length).toBeGreaterThan(10);
    
    // Check for specific buttons by text
    expect(screen.getByText('Roots')).toBeInTheDocument();
    expect(screen.getByText('Triads')).toBeInTheDocument();
    expect(screen.getByText('Chords')).toBeInTheDocument();
    expect(screen.getByText('Scale Notes')).toBeInTheDocument();
    
    // Check for Roman numeral buttons by text and test ID
    expect(screen.getByText('ii')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-ii')).toBeInTheDocument();
    expect(screen.getByText('V')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-V')).toBeInTheDocument();
    
    // Verify chord mode button
    expect(screen.getByTestId('chord-mode-button')).toBeInTheDocument();
  });
  
  it('should find all elements and verify note visibility', () => {
    render(<Fretboard />);
    
    // Check total elements
    const allElements = screen.getAllByRole(/.*/).length + 
                         screen.getAllByTestId(/.*/).length;
    expect(allElements).toBeGreaterThan(100); // Fretboard is complex
    
    // Check all buttons
    const allButtons = screen.getAllByRole('button');
    expect(allButtons.length).toBeGreaterThan(10);
    
    // Log first 5 buttons for debugging
    console.log('First 5 buttons:');
    allButtons.slice(0, 5).forEach((button, idx) => {
      console.log(`Button ${idx}: ${button.textContent || '(empty)'}`);
    });
    
    // Check for C notes
    const cNotes = screen.getAllByTestId('note-circle').filter(el =>
      el.textContent?.includes('C')
    );
    expect(cNotes.length).toBeGreaterThan(0);
    
    // Log first 3 C notes for debugging
    console.log('First 3 C notes:');
    cNotes.slice(0, 3).forEach((note, idx) => {
      console.log(`C note ${idx}: ${note.textContent}`);
    });
    
    // Check body content
    expect(document.body.textContent).toContain('C');
    expect(document.body.textContent).toContain('ii');
  });
});