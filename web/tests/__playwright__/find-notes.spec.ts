import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Find Notes on Fretboard', () => {
  it('should display all musical notes (A, B, C, D, E, F, G) on the fretboard', () => {
    render(<Fretboard />);
    
    const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const allNoteElements = screen.getAllByTestId('note-circle');
    
    noteLetters.forEach(note => {
      const notes = allNoteElements.filter(el =>
        el.textContent?.includes(note)
      );
      expect(notes.length).toBeGreaterThan(0);
    });
  });
  
  it('should contain styled note elements with expected classes', () => {
    render(<Fretboard />);
    
    // Get all note circles
    const noteCircles = screen.getAllByTestId('note-circle');
    expect(noteCircles.length).toBeGreaterThan(36); // At least 6 per note
    
    // Check for expected Tailwind classes
    const classChecks = [
      { className: /w-8/, expectedCount: noteCircles.length },
      { className: /h-8/, expectedCount: noteCircles.length },
      { className: /rounded-full/, expectedCount: noteCircles.length },
    ];
    
    noteCircles.forEach(note => {
      classChecks.forEach(check => {
        expect(note).toHaveClass(check.className.toString());
      });
    });
  });
  
  it('should have colored notes for roots, scale degrees, and triads', () => {
    render(<Fretboard />);
    
    // Check for root notes (red)
    const redNotes = screen.getAllByTestId('note-circle').filter(el => {
      const classList = Array.from(el.classList);
      return classList.some(c => c.includes('bg-red-'));
    });
    expect(redNotes.length).toBeGreaterThan(6); // At least 6 roots
    
    // Check for scale notes (neutral)
    const neutralNotes = screen.getAllByTestId('note-circle').filter(el => {
      const classList = Array.from(el.classList);
      return classList.some(c => c.includes('bg-neutral-'));
    });
    expect(neutralNotes.length).toBeGreaterThan(24); // At least 4 per note in scale
  });
  
  it('should display note-like elements with single-letter content', () => {
    render(<Fretboard />);
    
    const noteRegex = /^[A-G]$/;
    const noteElements = screen.getAllByTestId('note-circle').filter(el => {
      const text = el.textContent?.trim() || "";
      return noteRegex.test(text);
    });
    
    expect(noteElements.length).toBeGreaterThan(6); // At least 6 single-letter notes
    
    // Verify we found notes for each letter
    const foundNotes = new Set<string>();
    noteElements.forEach(el => {
      foundNotes.add(el.textContent?.trim() || "");
    });
    
    ['C', 'D', 'E', 'F', 'G', 'A', 'B'].forEach(note => {
      expect(foundNotes).toContain(note);
    });
  });
});