import { Note, Interval, Scale } from '@tonaljs/tonal';
import type { ChordExtension, RomanNumeralButton } from '../store/useStore';

export type NoteLabelMode = 'noteNames' | 'scaleDegrees' | 'none';

const SHARP_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT_NAMES  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

// Extension configurations - which scale degrees are added beyond the base triad
export const CHORD_EXTENSION_DEGREES: Record<ChordExtension, number[]> = {
  '6th': [6],
  '7th': [7],
  '9th': [7, 9],
  '11th': [7, 9, 11],
  '13th': [7, 9, 11, 13],
};

// Musical symbols for chord qualities
export const QUALITY_SYMBOLS: Record<string, string> = {
  major: '\u25B3',   // White triangle △
  minor: '-',        // Dash -
  diminished: '\u00B0', // Degree symbol °
};

// Roman numeral strings for 7 scale degrees
export const ROMAN_NUMERALS: string[] = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];

// Diatonic chord quality patterns for common scale types
const SCALE_QUALITY_PATTERNS: Record<string, ('major' | 'minor' | 'diminished' | undefined)[]> = {
  'major': ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  'ionian': ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  'minor': ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
  'aeolian': ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
  'dorian': ['minor', 'minor', 'major', 'major', 'minor', 'diminished', 'major'],
  'phrygian': ['minor', 'major', 'major', 'minor', 'diminished', 'major', 'minor'],
  'lydian': ['major', 'major', 'minor', 'diminished', 'major', 'minor', 'minor'],
  'mixolydian': ['major', 'minor', 'minor', 'diminished', 'major', 'major', 'minor'],
  'locrian': ['diminished', 'major', 'minor', 'major', 'major', 'minor', 'diminished'],
  'melodic minor': ['minor', 'minor', 'major', 'major', 'major', 'diminished', 'diminished'],
  'harmonic minor': ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'diminished'],
  'major pentatonic': ['major', undefined, 'minor', 'major', 'major', 'minor', undefined],
  'minor pentatonic': ['minor', undefined, 'major', 'minor', 'minor', 'major', undefined],
  'major blues': ['major', undefined, 'minor', 'major', 'major', 'minor', undefined],
  'minor blues': ['minor', undefined, 'major', 'minor', 'minor', 'major', undefined],
  'chromatic': ['major', undefined, 'minor', undefined, 'major', undefined, 'diminished'], // Fallback
};

/** Convert any pitch class to the preferred accidental style */
export const getPreferredNoteName = (pc: string, preference: 'flat' | 'sharp'): string => {
  const chroma = Note.chroma(pc);
  if (chroma === undefined) return pc;
  return preference === 'sharp' ? SHARP_NAMES[chroma] : FLAT_NAMES[chroma];
};

/** Get accidental prefix for a scale degree based on interval quality */
export const getAccidentalPrefix = (interval: string | null): string => {
  if (!interval) return '';
  const quality = interval.slice(-1);
  if (quality === 'm' || quality === 'd') return 'b';
  if (quality === 'a' || quality === 'A') return '#'; // Check both lowercase and uppercase for augmented
  return '';
};

export const getStringNotes = (openNote: string, fretCount: number = 22): string[] => {
  // Validate using Note.chroma: returns number (0-11) for valid notes, NaN for invalid
  const chroma = Note.chroma(openNote);
  if (isNaN(chroma)) {
    throw new Error(`Invalid open note: ${openNote}`);
  }

  return Array.from({ length: fretCount + 1 }, (_, i) => {
    const interval = Interval.fromSemitones(i);
    return Note.transpose(openNote, interval);
  });
};

export const getScaleNotes = (root: string, scaleType: string): string[] => {
  return Scale.get(`${root} ${scaleType}`).notes;
};

/**
 * Get quality for a scale degree in a given scale type
 */
export const getDiatonicChordQuality = (
  scaleType: string,
  degree: number
): 'major' | 'minor' | 'diminished' | null => {
  const key = scaleType.toLowerCase();
  const pattern = SCALE_QUALITY_PATTERNS[key];
  if (!pattern) return null;
  const index = (degree - 1) % 7;
  return pattern[index] ?? null;
};

/**
 * Get roman numeral buttons for current scale
 */
export const getRomanNumeralButtons = (
  scaleType: string
): RomanNumeralButton[] => {
  return ROMAN_NUMERALS.map((roman, index) => {
    const degree = index + 1;
    const quality = getDiatonicChordQuality(scaleType, degree) ?? 'major';
    return {
      degree,
      roman: roman.replace('°', ''), // Remove degree symbol from roman for quality to handle separately
      quality,
      qualitySymbol: roman.includes('°') ? QUALITY_SYMBOLS.diminished : QUALITY_SYMBOLS[quality] || '',
    };
  });
};

/**
 * Get chord tone degrees relative to scale
 * Always includes root, third, fifth of the chord as base, then adds extensions
 * Example: Roman degree IV (degree 4) with 7th extension uses [1,3,5,7]
 * which maps to scale degrees [4,6,8(1),10(3)] = [4,6,1,3]
 */
export const getChordToneDegrees = (
  romanDegree: number,
  extension: ChordExtension | null
): number[] => {
  // Always include root, third, fifth of the chord
  const baseChord = [1, 3, 5];
  const extensionDegrees = extension ? CHORD_EXTENSION_DEGREES[extension] : [];

  return [...baseChord, ...extensionDegrees].map(baseDegree => {
    const absolute = romanDegree + baseDegree - 1;
    // Wrap using modulo 7, 1-indexed
    return ((absolute - 1) % 7) + 1;
  });
};

export interface FretData {
  note: string; // e.g., "C#4"
  noteName: string; // e.g., "C#" (pitch class, normalized by preference)
  interval: string | null;
  isRoot: boolean;
  isTriad: boolean;
  inScale: boolean;
  scaleDegree: number | null; // 1-7 for scale degrees, null for out-of-scale notes
  accidentalPrefix: string; // '' or 'b' or '#' based on interval quality
  // New chord visualization properties
  isChordTone: boolean;
  chordToneRole: number | null; // 1=root, 3=third, 5=fifth, 7=seventh, etc.
}

/**
 * Format chord extension to chord symbol suffix
 */
export const formatChordExtension = (extension: ChordExtension | null): string => {
  if (!extension) return '';
  return extension.replace('th', ''); // '7th' → '7', '9th' → '9', etc.
};

/**
 * Format chord quality to abbreviated form
 */
export const formatChordQuality = (quality: 'major' | 'minor' | 'diminished'): string => {
  switch (quality) {
    case 'major': return 'maj';
    case 'minor': return 'min';
    case 'diminished': return 'dim';
  }
};

/**
 * Get chord root note name for a given roman degree
 */
export const getChordRoot = (
  root: string,
  scaleType: string,
  romanDegree: number
): string => {
  const scale = Scale.get(`${root} ${scaleType}`);
  const scaleNotes = scale.notes;
  const chordRootIndex = (romanDegree - 1) % scaleNotes.length;
  const chordRoot = scaleNotes[chordRootIndex];
  if (chordRoot) {
    const chordRootNote = Note.get(chordRoot);
    return chordRootNote.pc || chordRoot;
  }
  return root;
};

export const getFretboard = (
  root: string,
  scaleType: string,
  tuning: string[],
  fretCount: number = 22,
  selectedRomanDegree: number | null = null,
  chordExtension: ChordExtension | null = null
): FretData[][] => {
  const scale = Scale.get(`${root} ${scaleType}`);
  // Conventional scale notes (pitch classes) from Tonal
  const scaleNotes = scale.notes.map(n => Note.get(n).pc);
  const scaleIntervals = scale.intervals;

  // Calculate chord tone degrees if roman numeral selected
  const chordToneDegrees = selectedRomanDegree !== null
    ? getChordToneDegrees(selectedRomanDegree, chordExtension)
    : [];

  return tuning.map(openStringNote => {
    return getStringNotes(openStringNote, fretCount).map(note => {
      const noteObj = Note.get(note);
      const notePc = noteObj.pc;

      // Check if note is in scale (handle enharmonics by comparing chroma)
      const index = scaleNotes.findIndex(s => Note.chroma(s) === Note.chroma(notePc));
      const inScale = index !== -1;

      let interval: string | null = null;
      let isRoot = false;
      let isTriad = false;
      let scaleDegree: number | null = null;
      let accidentalPrefix = '';
      let noteName = '';

      if (inScale) {
        interval = scaleIntervals[index];
        isRoot = interval === '1P';
        // A note is part of the tonic triad if its interval from the scale root is a 1P, 3M, 3m, or 5P.
        isTriad = ['1P', '3M', '3m', '5P'].includes(interval);
        // Parse scale degree from interval (e.g., "3m" -> 3, "4P" -> 4, "5d" -> 5)
        scaleDegree = parseInt(interval[0], 10);
        accidentalPrefix = getAccidentalPrefix(interval);

        // Use the scale's conventional pitch class and convert to flat for consistent display
        const rawNoteName = scaleNotes[index];
        noteName = getPreferredNoteName(rawNoteName, 'flat');
      } else {
        // Out-of-scale: use transposed note's pitch class converted to flat
        noteName = getPreferredNoteName(notePc, 'flat');
      }

      let isChordTone = false;
      let chordToneRole: number | null = null;

      // Check if this note is a chord tone
      if (inScale && scaleDegree && chordToneDegrees.length > 0) {
        isChordTone = chordToneDegrees.includes(scaleDegree);
        if (isChordTone) {
          // Calculate role within the chord (1, 3, 5, 7, etc.)
          const base = selectedRomanDegree!;
          const step = ((scaleDegree - base + 7) % 7) + 1;
          chordToneRole = [1, 3, 5, 7, 9, 11, 13].includes(step) ? step : null;
        }
      }

      return {
        note,
        noteName,
        interval,
        isRoot,
        isTriad,
        inScale,
        scaleDegree,
        accidentalPrefix,
        isChordTone,
        chordToneRole,
      };
    });
  });
};
