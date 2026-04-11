import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useStore } from '../src/store/useStore';
import Fretboard from '../src/components/Fretboard';
import React from 'react';

describe('Chord Mode Colors', () => {
  beforeEach(() => {
    // Reset Zustand store before each test
    useStore.getState().resetKeys();
    useStore.getState().resetScales();
    useStore.getState().setSelectedRomanDegree(1);
    useStore.getState().setChordExtension(null);
  });

  it('should highlight Chords button with yellow when active', () => {
    render(<Fretboard />);
    const chordsButton = screen.getByText('Chords');

    // Click to enable chord mode
    act(() => {
      fireEvent.click(chordsButton);
    });
    expect(useStore.getState().showChordMode).toBe(true);

    // Check button style
    expect(chordsButton).toHaveClass('bg-[#E6A500]/20');
    expect(chordsButton).toHaveTextContent('Chords');

    // Check roman numeral buttons are visible
    expect(screen.getByText('I')).toBeInTheDocument();
  });

  it('should highlight selected Roman numeral with yellow', () => {
    render(<Fretboard />);
    const chordsButton = screen.getByText('Chords');
    
    // Enable chord mode and select V
    act(() => {
      fireEvent.click(chordsButton);
    });
    
    const vButton = screen.getByText('V');
    act(() => {
      fireEvent.click(vButton);
    });
    
    expect(useStore.getState().selectedRomanDegree).toBe(5);
    expect(vButton).toHaveClass('bg-[#E6A500]/30');
  });

  it('should highlight selected extension with yellow', () => {
    render(<Fretboard />);
    const chordsButton = screen.getByText('Chords');
    
    // Enable chord mode, select V, and select 7th extension
    act(() => {
      fireEvent.click(chordsButton);
    });
    
    const vButton = screen.getByText('V');
    act(() => {
      fireEvent.click(vButton);
    });
    
    const seventhButton = screen.getByText('7th');
    act(() => {
      fireEvent.click(seventhButton);
    });
    
    expect(useStore.getState().chordExtension).toBe('7th');
    expect(seventhButton).toHaveClass('bg-[#E6A500]/20');
  });

  it('should highlight chord root notes in red', () => {
    render(<Fretboard />);
    const chordsButton = screen.getByText('Chords');
    
    // Enable chord mode and select V (G is root in C Major)
    act(() => {
      fireEvent.click(chordsButton);
    });
    
    const vButton = screen.getByText('V');
    act(() => {
      fireEvent.click(vButton);
    });
    
    const gNotes = screen.getAllByText('G');
    expect(gNotes.length).toBeGreaterThan(0);
    
  // Check if any G note has red background
  const gNote = gNotes.find(note => {
    const styles = window.getComputedStyle(note);
    return styles.backgroundColor === 'rgb(239, 68, 68)';
  });
  expect(gNote).toBeTruthy();
  });

  it('should highlight chord triad tones in blue', () => {
    render(<Fretboard />);
    const chordsButton = screen.getByText('Chords');
    
    // Enable chord mode and select V (B and D are triad tones)
    act(() => {
      fireEvent.click(chordsButton);
    });
    
    const vButton = screen.getByText('V');
    act(() => {
      fireEvent.click(vButton);
    });
    
    const bNotes = screen.getAllByText('B');
    const dNotes = screen.getAllByText('D');
    
  // Check if any B note has blue background
  const bNote = bNotes.find(note => {
    const styles = window.getComputedStyle(note);
    return styles.backgroundColor === 'rgb(59, 130, 246)';
  });
  expect(bNote).toBeTruthy();

  // Check if any D note has blue background
  const dNote = dNotes.find(note => {
    const styles = window.getComputedStyle(note);
    return styles.backgroundColor === 'rgb(59, 130, 246)';
  });
  expect(dNote).toBeTruthy();
  });

  it('should highlight extension notes in bright yellow with white text', () => {
    render(<Fretboard />);
    const chordsButton = screen.getByText('Chords');
    
    // Enable chord mode, select V, and select 7th extension (F is the extension)
    act(() => {
      fireEvent.click(chordsButton);
    });
    
    const vButton = screen.getByText('V');
    act(() => {
      fireEvent.click(vButton);
    });
    
    const seventhButton = screen.getByText('7th');
    act(() => {
      fireEvent.click(seventhButton);
    });
    
    const fNotes = screen.getAllByText('F');
    expect(fNotes.length).toBeGreaterThan(0);
    
  // Check if any F note has bright yellow background
  const fNote = fNotes.find(note => {
    const styles = window.getComputedStyle(note);
    return styles.backgroundColor === 'rgb(230, 165, 0)' && styles.color === 'rgb(255, 255, 255)';
  });
  expect(fNote).toBeTruthy();
  });

  it('should not highlight key root in chord mode', () => {
    render(<Fretboard />);
    const chordsButton = screen.getByText('Chords');
    
    // Enable chord mode and select V (C is key root but not chord root)
    act(() => {
      fireEvent.click(chordsButton);
    });
    
    const vButton = screen.getByText('V');
    act(() => {
      fireEvent.click(vButton);
    });
    
    const cNotes = screen.getAllByText('C');
    expect(cNotes.length).toBeGreaterThan(0);
    
    // Ensure all C notes are neutral (not red)
    cNotes.forEach(note => {
      const styles = window.getComputedStyle(note);
      expect(styles.backgroundColor).not.toBe('rgb(239, 68, 68)');
      expect(styles.backgroundColor).toBe('rgb(229, 231, 235)');
    });
  });
});
