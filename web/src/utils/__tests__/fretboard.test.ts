import { describe, it, expect } from 'vitest';
import { getFretboard, getStringNotes, getScaleNotes } from '../fretboard';
import { Note, Interval } from '@tonaljs/tonal';

// Manual reference data for scale notes (pitch classes)
const expectedScaleNotes: Record<string, string[]> = {
  // Root C
  'C-major': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  'C-minor': ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'C-major pentatonic': ['C', 'D', 'E', 'G', 'A'],
  'C-minor pentatonic': ['C', 'Eb', 'F', 'G', 'Bb'],
  'C-major blues': ['C', 'D', 'Eb', 'E', 'G', 'A'],
  'C-minor blues': ['C', 'Eb', 'F', 'Gb', 'G', 'Bb'], // fixed: Tonal returns Gb
  'C-dorian': ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'],
  'C-mixolydian': ['C', 'D', 'E', 'F', 'G', 'A', 'Bb'],
  'C-lydian': ['C', 'D', 'E', 'F#', 'G', 'A', 'B'],
  'C-phrygian': ['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb'],
  'C-locrian': ['C', 'Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb'],

  // Root A
  'A-major': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
  'A-minor': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  'A-major pentatonic': ['A', 'B', 'C#', 'E', 'F#'],
  'A-minor pentatonic': ['A', 'C', 'D', 'E', 'G'],
  'A-major blues': ['A', 'B', 'C', 'C#', 'E', 'F#'],
  'A-minor blues': ['A', 'C', 'D', 'Eb', 'E', 'G'],
  'A-dorian': ['A', 'B', 'C', 'D', 'E', 'F#', 'G'],
  'A-mixolydian': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G'],
  'A-lydian': ['A', 'B', 'C#', 'D#', 'E', 'F#', 'G#'],
  'A-phrygian': ['A', 'Bb', 'C', 'D', 'E', 'F', 'G'],
  'A-locrian': ['A', 'Bb', 'C', 'D', 'Eb', 'F', 'G'],
};

const STANDARD_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
const FRET_COUNT = 22;

describe('getStringNotes', () => {
  it('returns correct length for default fretCount', () => {
    const notes = getStringNotes('E2');
    expect(notes.length).toBe(FRET_COUNT + 1);
  });

  it('open string is first element', () => {
    const notes = getStringNotes('A2');
    expect(notes[0]).toBe('A2');
  });

  it('transposes correctly by semitones', () => {
    const notes = getStringNotes('E2');
    expect(notes[5]).toBe('A2'); // P4
    expect(notes[7]).toBe('B2'); // P5
    expect(notes[12]).toBe('E3'); // octave
  });

  it('handles fretCount = 0', () => {
    const notes = getStringNotes('C4', 0);
    expect(notes).toEqual(['C4']);
  });

  it('handles negative fretCount (returns empty array)', () => {
    const notes = getStringNotes('C4', -5);
    expect(notes).toEqual([]);
  });

  it('generates full array correctly for some open notes', () => {
    const open = 'G3';
    const notes = getStringNotes(open, 12);
    for (let i = 0; i <= 12; i++) {
      const interval = Interval.fromSemitones(i);
      const expected = Note.transpose(open, interval);
      expect(notes[i]).toBe(expected);
    }
  });

  it('throws for invalid openNote', () => {
    expect(() => getStringNotes('InvalidNote', 12)).toThrow();
  });
});

describe('getScaleNotes', () => {
  it('returns expected notes for all combinations', () => {
    for (const [key, expected] of Object.entries(expectedScaleNotes)) {
      const [root, ...rest] = key.split('-');
      const scaleType = rest.join('-');
      const result = getScaleNotes(root, scaleType);
      expect(result).toEqual(expected);
    }
  });

  it('is pure (multiple calls same result)', () => {
    const r1 = getScaleNotes('G', 'major');
    const r2 = getScaleNotes('G', 'major');
    expect(r1).toEqual(r2);
  });
});

describe('getFretboard', () => {
  // Test all combos
  for (const [key, expectedPitchClasses] of Object.entries(expectedScaleNotes)) {
    const [root, ...rest] = key.split('-');
    const scaleType = rest.join('-');

    // Compute expected chroma set
    const expectedChromaSet = new Set(expectedPitchClasses.map(pc => Note.chroma(pc)));

    it(`produces correct fretboard for ${key}`, () => {
      const fretboardData = getFretboard(root, scaleType, STANDARD_TUNING, FRET_COUNT);

      // Dimensions
      expect(fretboardData.length).toBe(STANDARD_TUNING.length);
      for (const stringData of fretboardData) {
        expect(stringData.length).toBe(FRET_COUNT + 1);
      }

      // Check each fret
      for (let s = 0; s < STANDARD_TUNING.length; s++) {
        const stringData = fretboardData[s];
        for (let f = 0; f <= FRET_COUNT; f++) {
          const fret = stringData[f];
          const chroma = Note.chroma(fret.noteName);

          // inScale should match expected set
          expect(fret.inScale, `inScale at string ${s} fret ${f} (${fret.noteName}) for ${key}`).toBe(expectedChromaSet.has(chroma));

          // isRoot: true iff noteName matches root pitch class
          const expectedIsRoot = fret.noteName === root;
          expect(fret.isRoot).toBe(expectedIsRoot);

          // isTriad and interval consistency
          if (fret.inScale) {
            expect(fret.interval).not.toBeNull();
            const expectedIsTriad = ['1P', '3M', '3m', '5P'].includes(fret.interval!);
            expect(fret.isTriad).toBe(expectedIsTriad);
          } else {
            expect(fret.interval).toBeNull();
            expect(fret.isTriad).toBe(false);
          }
        }
      }
    });
  }

  // Edge case tests
  it('handles empty tuning array', () => {
    const result = getFretboard('C', 'major', [], 22);
    expect(result).toEqual([]);
  });

  it('handles single string tuning', () => {
    const result = getFretboard('C', 'major', ['E2'], 5);
    expect(result.length).toBe(1);
    expect(result[0].length).toBe(6); // frets 0-5
  });

  it('handles negative fretCount (inner arrays empty)', () => {
    const result = getFretboard('C', 'major', STANDARD_TUNING, -1);
    expect(result.length).toBe(STANDARD_TUNING.length);
    for (const inner of result) {
      expect(inner).toEqual([]);
    }
  });

  it('handles fretCount = 0', () => {
    const result = getFretboard('C', 'major', STANDARD_TUNING, 0);
    for (const inner of result) {
      expect(inner.length).toBe(1);
      expect(inner[0].inScale).toBe(true); // open string notes are in scale for major
    }
  });
});
