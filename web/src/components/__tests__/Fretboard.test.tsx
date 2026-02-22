import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Fretboard } from '../Fretboard';
import { useStore } from '../../store/useStore';

const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

describe('Fretboard component', () => {
  beforeEach(() => {
    useStore.setState({
      root: 'C',
      scaleType: 'major',
      tuning: STANDARD_TUNING,
      showRoots: true,
      showTriads: false,
    });
  });

  it('renders six string rows', () => {
    render(<Fretboard />);
    const rows = document.querySelectorAll('.flex.relative.group');
    expect(rows).toHaveLength(6);
  });

  it('each row has 23 fret cells (including nut)', () => {
    render(<Fretboard />);
    const rows = document.querySelectorAll('.flex.relative.group');
    rows.forEach(row => {
      const fretCells = row.querySelectorAll('.fret-cell');
      expect(fretCells.length).toBe(23);
    });
  });

  it('displays string labels correctly (high E as lowercase)', () => {
    render(<Fretboard />);
    const labelColumn = document.querySelector('div[class*="pr-2"]');
    expect(labelColumn).not.toBeNull();
    const labels = labelColumn?.querySelectorAll('div');
    expect(labels?.length).toBe(6);
    const expectedLabels = ['e', 'B', 'G', 'D', 'A', 'E'];
    for (let i = 0; i < 6; i++) {
      expect(labels?.[i].textContent).toBe(expectedLabels[i]);
    }
  });

  it('only renders circles for notes in scale', () => {
    render(<Fretboard />);
    const rows = document.querySelectorAll('.flex.relative.group');
    // Low E row is last (index 5)
    const lowERow = rows[5];
    const fretCells = lowERow.querySelectorAll('.fret-cell');

    const hasCircle = (fretIdx: number) => {
      const cell = fretCells[fretIdx] as HTMLElement;
      return !!cell.querySelector('.rounded-full');
    };

    // Non-scale frets on low E: F# (2), G# (4), A# (6), C# (9), D# (11), etc.
    expect(hasCircle(2)).toBe(false);
    expect(hasCircle(4)).toBe(false);
    expect(hasCircle(6)).toBe(false);
    expect(hasCircle(9)).toBe(false);
    expect(hasCircle(11)).toBe(false);

    // In-scale frets: C (8), D (10), E (12), F (13), G (15), A (17), B (19)
    expect(hasCircle(8)).toBe(true);
    expect(hasCircle(10)).toBe(true);
    expect(hasCircle(12)).toBe(true);
    expect(hasCircle(13)).toBe(true);
    expect(hasCircle(15)).toBe(true);
    expect(hasCircle(17)).toBe(true);
    expect(hasCircle(19)).toBe(true);
  });

  it('root notes have red style when showRoots is true', () => {
    render(<Fretboard />);
    const rows = document.querySelectorAll('.flex.relative.group');
    // Low E row (index 5) fret 8 is root C
    const lowERow = rows[5];
    const lowEFrets = lowERow.querySelectorAll('.fret-cell');
    const fret8Cell = lowEFrets[8] as HTMLElement;
    const circle = fret8Cell.querySelector('.rounded-full');
    expect(circle).not.toBeNull();
    expect(circle).toHaveClass('bg-red-500');

    // A string (index 4) fret 3 is root C
    const aRow = rows[4];
    const aFrets = aRow.querySelectorAll('.fret-cell');
    const aFret3Cell = aFrets[3] as HTMLElement;
    const aCircle = aFret3Cell.querySelector('.rounded-full');
    expect(aCircle).not.toBeNull();
    expect(aCircle).toHaveClass('bg-red-500');
  });

  it('toggle Show Roots hides root styling', () => {
    render(<Fretboard />);
    const rootsButton = screen.getByRole('button', { name: /Roots \(R\)/i });
    // Initially root is red
    let rows = document.querySelectorAll('.flex.relative.group');
    let fret8Circle = rows[5].querySelectorAll('.fret-cell')[8].querySelector('.rounded-full');
    expect(fret8Circle).toHaveClass('bg-red-500');

    // Click to toggle off
    fireEvent.click(rootsButton);
    rows = document.querySelectorAll('.flex.relative.group');
    fret8Circle = rows[5].querySelectorAll('.fret-cell')[8].querySelector('.rounded-full');
    expect(fret8Circle).toHaveClass('bg-neutral-200');
    expect(fret8Circle).not.toHaveClass('bg-red-500');

    // Toggle back on
    fireEvent.click(rootsButton);
    rows = document.querySelectorAll('.flex.relative.group');
    fret8Circle = rows[5].querySelectorAll('.fret-cell')[8].querySelector('.rounded-full');
    expect(fret8Circle).toHaveClass('bg-red-500');
  });

  it('toggle Show Triads applies blue style to non-root triad notes', () => {
    // In C major, triad notes: C (root), E, G.
    render(<Fretboard />);
    const triadsButton = screen.getByRole('button', { name: /Triads \(T\)/i });

    // Initially showTriads false, so E and G have neutral style
    let rows = document.querySelectorAll('.flex.relative.group');
    let fret12Circle = rows[5].querySelectorAll('.fret-cell')[12].querySelector('.rounded-full'); // E
    expect(fret12Circle).toHaveClass('bg-neutral-200');
    let fret15Circle = rows[5].querySelectorAll('.fret-cell')[15].querySelector('.rounded-full'); // G
    expect(fret15Circle).toHaveClass('bg-neutral-200');

    // Enable triads
    fireEvent.click(triadsButton);
    rows = document.querySelectorAll('.flex.relative.group');
    fret12Circle = rows[5].querySelectorAll('.fret-cell')[12].querySelector('.rounded-full');
    expect(fret12Circle).toHaveClass('bg-blue-500');
    fret15Circle = rows[5].querySelectorAll('.fret-cell')[15].querySelector('.rounded-full');
    expect(fret15Circle).toHaveClass('bg-blue-500');

    // Root C should still be red
    let fret8Circle = rows[5].querySelectorAll('.fret-cell')[8].querySelector('.rounded-full');
    expect(fret8Circle).toHaveClass('bg-red-500');
    expect(fret8Circle).not.toHaveClass('bg-blue-500');

    // Disable triads again
    fireEvent.click(triadsButton);
    rows = document.querySelectorAll('.flex.relative.group');
    fret12Circle = rows[5].querySelectorAll('.fret-cell')[12].querySelector('.rounded-full');
    expect(fret12Circle).toHaveClass('bg-neutral-200');
    fret15Circle = rows[5].querySelectorAll('.fret-cell')[15].querySelector('.rounded-full');
    expect(fret15Circle).toHaveClass('bg-neutral-200');
  });

  it('changing root via ArrowRight updates the display', () => {
    render(<Fretboard />);
    // Initial heading
    expect(screen.getByRole('heading', { name: /C/ })).toBeInTheDocument();
    // Press ArrowRight
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { name: /C#/ })).toBeInTheDocument();
  });

  it('changing root via setState updates the display', () => {
    render(<Fretboard />);
    // Start at C from beforeEach
    expect(screen.getByRole('heading', { name: /C/ })).toBeInTheDocument();
    act(() => {
      useStore.setState({ root: 'D' });
    });
    expect(screen.getByRole('heading', { name: /D/ })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /C/ })).not.toBeInTheDocument();
  });

  it('changing scale type with ] cycles to next scale', () => {
    render(<Fretboard />);
    expect(screen.getByRole('heading', { name: /major/ })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: ']' });
    expect(screen.getByRole('heading', { name: /minor/ })).toBeInTheDocument();
    fireEvent.keyDown(window, { key: ']' });
    expect(screen.getByRole('heading', { name: /major pentatonic/ })).toBeInTheDocument();
  });

  it('changing scale type with [ cycles to previous scale', () => {
    render(<Fretboard />);
    // start at major
    fireEvent.keyDown(window, { key: '[' });
    // should go to last scale: locrian
    expect(screen.getByRole('heading', { name: /locrian/ })).toBeInTheDocument();
 });

  it('pressing r toggles showRoots', () => {
    render(<Fretboard />);
    expect(useStore.getState().showRoots).toBe(true);
    fireEvent.keyDown(window, { key: 'r' });
    expect(useStore.getState().showRoots).toBe(false);
    fireEvent.keyDown(window, { key: 'r' });
    expect(useStore.getState().showRoots).toBe(true);
  });

  it('pressing t toggles showTriads', () => {
    render(<Fretboard />);
    expect(useStore.getState().showTriads).toBe(false);
    fireEvent.keyDown(window, { key: 't' });
    expect(useStore.getState().showTriads).toBe(true);
    fireEvent.keyDown(window, { key: 't' });
    expect(useStore.getState().showTriads).toBe(false);
  });

  it('displays fret numbers at correct positions', () => {
    render(<Fretboard />);
    const fretNumberRow = document.querySelector('div[class*="bg-neutral-900"]');
    expect(fretNumberRow).not.toBeNull();
    const cells = fretNumberRow?.children;
    expect(cells?.length).toBe(22);
    const labeledFrets = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21];
    for (let i = 0; i < 22; i++) {
      const expectedText = labeledFrets.includes(i + 1) ? String(i + 1) : '';
      expect((cells?.[i] as HTMLElement).textContent).toBe(expectedText);
    }
  });
});
