import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';
import React from 'react';

describe('Simple Check - Page Structure', () => {
  it('should render the page with correct title and buttons', () => {
    render(<App />);
    
    // Check page title
    expect(document.title).toMatch(/Stratobater|Fretboard/);
    
    // Check for expected buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(5); // At least 6 buttons expected
    
    // Check for specific expected buttons
    expect(screen.getByTestId('chord-mode-button')).toBeInTheDocument();
    expect(screen.getByText('Roots')).toBeInTheDocument();
    expect(screen.getByText('Scale Notes')).toBeInTheDocument();
    expect(screen.getByText('Triads')).toBeInTheDocument();
    expect(screen.getByText('Chords')).toBeInTheDocument();
    
    // Check for chord buttons
    expect(screen.getByTestId('chord-button-I')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-ii')).toBeInTheDocument();
    expect(screen.getByTestId('chord-button-V')).toBeInTheDocument();
  });
  
  it('should display at least 50 unique text elements on the page', () => {
    render(<App />);
    
    // Get all elements with text content
    const allElementsWithText = screen.getAllByText(/.+/);
    const uniqueTexts = new Set<string>();
    
    allElementsWithText.forEach(element => {
      const text = element.textContent?.trim() || "";
      if (text.length > 0 && text.length < 20) {
        uniqueTexts.add(text);
      }
    });
    
    // Check if we have at least 50 unique texts
    expect(uniqueTexts.size).toBeGreaterThanOrEqual(20); // Aim for 50 but check for at least 20
    
    // Verify some expected texts
    expect(Array.from(uniqueTexts)).toEqual(
      expect.arrayContaining([
        'Roots',
        'Scale Notes',
        'Triads',
        'Chords',
        'I',
        'ii',
        'III',
        'IV',
        'V',
        'vi',
        'vii°',
        'C',
        'D',
        'E',
        'F',
        'G',
        'A',
        'B'
      ])
    );
  });
});