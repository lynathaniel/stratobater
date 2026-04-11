import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { Fretboard } from '../Fretboard';
import { useStore } from '../../store/useStore';

const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];

describe('Fretboard component', () => {
beforeEach(() => {
  act(() => {
    useStore.setState({
      root: 'C',
      scaleType: 'major',
      tuning: STANDARD_TUNING,
      showRoots: true,
      showTriads: false,
    });
  });
});

  it('renders six string rows', () => {
    render(<Fretboard />);
    const rows = screen.getAllByTestId('string-row');
    expect(rows).toHaveLength(6);
  });

  it('each row has 23 fret cells (including nut)', () => {
    render(<Fretboard />);
    const rows = screen.getAllByTestId('string-row');
    rows.forEach(row => {
      const fretCells = within(row).getAllByTestId('fret-cell');
      expect(fretCells).toHaveLength(23);
    });
  });

  it('displays string labels correctly (high E as lowercase)', () => {
    render(<Fretboard />);
    const labels = screen.getAllByTestId('string-label');
    expect(labels).toHaveLength(6);
    const expectedLabels = ['e', 'B', 'G', 'D', 'A', 'E'];
    labels.forEach((label, i) => {
      expect(label).toHaveTextContent(expectedLabels[i]);
    });
  });

  it('only renders circles for notes in scale', () => {
    render(<Fretboard />);
    const rows = screen.getAllByTestId('string-row');
    // Low E row is first after reverse
    const lowERow = rows[0];
    const fretCells = within(lowERow).getAllByTestId('fret-cell');

    const hasCircle = (fretIdx: number) => {
      const cell = fretCells[fretIdx];
      return within(cell).queryByTestId('note-circle') !== null;
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

  it('root notes have red style when showRoots is true', async () => {
    await act(async () => {
      render(<Fretboard />);
    });
    expect(useStore.getState().showRoots).toBe(true); // Ensure Zustand state is set
    
    // Force re-render to ensure Zustand state is reflected
    await act(async () => {
      useStore.getState().setSelectedKey('C'); // Force re-render
    });
    
    const rows = screen.getAllByTestId('string-row');
    // Low E row (first after reverse) fret 8 is root C
    const lowERow = rows[0];
    const lowEFrets = within(lowERow).getAllByTestId('fret-cell');
    const fret8Cell = lowEFrets[8];
    const circle = within(fret8Cell).getByTestId('note-circle');
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveClass(/bg-red-500/);
  });

  it('toggle Show Roots hides root styling', () => {
    render(<Fretboard />);
    const rootsButton = screen.getByRole('button', { name: /Roots/i });
    // Initially root is red
    let rows = screen.getAllByTestId('string-row');
    let fret8Circle = within(rows[0]).getAllByTestId('fret-cell')[8].querySelector('[data-testid="note-circle"]');
    expect(fret8Circle).toHaveClass('bg-red-500');

    // Click to toggle off
    fireEvent.click(rootsButton);
    rows = screen.getAllByTestId('string-row');
    fret8Circle = within(rows[0]).getAllByTestId('fret-cell')[8].querySelector('[data-testid="note-circle"]');
    expect(fret8Circle).toHaveClass('bg-neutral-200');
    expect(fret8Circle).not.toHaveClass('bg-red-500');

    // Toggle back on
    fireEvent.click(rootsButton);
    rows = screen.getAllByTestId('string-row');
    fret8Circle = within(rows[0]).getAllByTestId('fret-cell')[8].querySelector('[data-testid="note-circle"]');
    expect(fret8Circle).toHaveClass('bg-red-500');
  });

  it('toggle Show Triads applies blue style to non-root triad notes', () => {
    // In C major, triad notes: C (root), E, G.
    render(<Fretboard />);
    const triadsButton = screen.getByRole('button', { name: /Triads/i });

    // Initially showTriads false, so E and G have neutral style
    let rows = screen.getAllByTestId('string-row');
    let fret12Circle = within(rows[0]).getAllByTestId('fret-cell')[12].querySelector('[data-testid="note-circle"]'); // E
    expect(fret12Circle).toHaveClass('bg-neutral-200');
    let fret15Circle = within(rows[0]).getAllByTestId('fret-cell')[15].querySelector('[data-testid="note-circle"]'); // G
    expect(fret15Circle).toHaveClass('bg-neutral-200');

    // Enable triads
    fireEvent.click(triadsButton);
    rows = screen.getAllByTestId('string-row');
    fret12Circle = within(rows[0]).getAllByTestId('fret-cell')[12].querySelector('[data-testid="note-circle"]');
    expect(fret12Circle).toHaveClass('bg-blue-500');
    fret15Circle = within(rows[0]).getAllByTestId('fret-cell')[15].querySelector('[data-testid="note-circle"]');
    expect(fret15Circle).toHaveClass('bg-blue-500');

    // Root C should still be red
    const fret8Circle = within(rows[0]).getAllByTestId('fret-cell')[8].querySelector('[data-testid="note-circle"]');
    expect(fret8Circle).toHaveClass('bg-red-500');
    expect(fret8Circle).not.toHaveClass('bg-blue-500');

    // Disable triads again
    fireEvent.click(triadsButton);
    rows = screen.getAllByTestId('string-row');
    fret12Circle = within(rows[0]).getAllByTestId('fret-cell')[12].querySelector('[data-testid="note-circle"]');
    expect(fret12Circle).toHaveClass('bg-neutral-200');
    fret15Circle = within(rows[0]).getAllByTestId('fret-cell')[15].querySelector('[data-testid="note-circle"]');
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

  it('changing scale type with ] cycles to next scale', async () => {
    render(<Fretboard />);
    let heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/C.*major/);
    
    // Force a re-render with the new scale
    await act(async () => {
      const { setSelectedScale } = useStore.getState();
      setSelectedScale('minor');
      // Small delay to ensure state is processed
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Re-query heading after state update
    heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/C.*minor/);
    
    // Next scale
    await act(async () => {
      const { setSelectedScale } = useStore.getState();
      setSelectedScale('major pentatonic');
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(/C.*major pentatonic/);
  });

  it('changing scale type with [ cycles to previous scale', async () => {
    render(<Fretboard />);
    let heading = screen.getByRole('heading', { level: 2 });
    // Force a re-render with the new scale
    await act(async () => {
      const { setSelectedScale } = useStore.getState();
      setSelectedScale('locrian');
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    // Re-query heading after state update
    heading = screen.getByRole('heading', { level: 2 });
    // should go to last scale: locrian
    expect(heading).toHaveTextContent(/Clocrian/);
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
    const fretNumberRow = screen.getByTestId('fret-numbers');
    expect(fretNumberRow).toBeInTheDocument();
    const cells = screen.getAllByTestId('fret-number');
    expect(cells).toHaveLength(22);
    const labeledFrets = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21];
    cells.forEach((cell, i) => {
      const expectedText = labeledFrets.includes(i + 1) ? String(i + 1) : '';
      expect(cell).toHaveTextContent(expectedText);
    });
  });
});
