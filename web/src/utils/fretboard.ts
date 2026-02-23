import { Note, Interval, Scale } from '@tonaljs/tonal';

export type NoteLabelMode = 'noteNames' | 'scaleDegrees' | 'none';

const SHARP_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT_NAMES  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

/** Convert any pitch class to the preferred accidental style */
export const getPreferredNoteName = (pc: string, preference: 'flat' | 'sharp'): string => {
  const chroma = Note.chroma(pc);
  if (chroma === undefined) return pc;
  return preference === 'sharp' ? SHARP_NAMES[chroma] : FLAT_NAMES[chroma];
};

/** Get accidental prefix for a scale degree based on interval quality */
export const getAccidentalPrefix = (interval: string | null): string => {
  if (!interval) return '';
  const quality = interval.slice(-1); // 'P','M','m','a','d'
  if (quality === 'm' || quality === 'd') return 'b';
  if (quality === 'a') return '#';
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

export interface FretData {
  note: string; // e.g., "C#4"
  noteName: string; // e.g., "C#" (pitch class, normalized by preference)
  interval: string | null;
  isRoot: boolean;
  isTriad: boolean;
  inScale: boolean;
  scaleDegree: number | null; // 1-7 for scale degrees, null for out-of-scale notes
  accidentalPrefix: string; // '' or 'b' or '#' based on interval quality
}

export const getFretboard = (
  root: string,
  scaleType: string,
  tuning: string[],
  fretCount: number = 22
): FretData[][] => {
  const scale = Scale.get(`${root} ${scaleType}`);
  // Conventional scale notes (pitch classes) from Tonal
  const scaleNotes = scale.notes.map(n => Note.get(n).pc);
  const scaleIntervals = scale.intervals;

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

      return {
        note,
        noteName,
        interval,
        isRoot,
        isTriad,
        inScale,
        scaleDegree,
        accidentalPrefix,
      };
    });
  });
};
