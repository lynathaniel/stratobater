import { Note, Interval, Scale } from '@tonaljs/tonal';

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
  noteName: string; // e.g., "C#" (pitch class)
  interval: string | null;
  isRoot: boolean;
  isTriad: boolean;
  inScale: boolean;
}

export const getFretboard = (
  root: string, 
  scaleType: string, 
  tuning: string[], 
  fretCount: number = 22
): FretData[][] => {
  const scale = Scale.get(`${root} ${scaleType}`);
  // Normalize scale notes to pitch classes
  const scaleNotes = scale.notes.map(n => Note.get(n).pc);
  const scaleIntervals = scale.intervals; 
  
  return tuning.map(openStringNote => {
    return getStringNotes(openStringNote, fretCount).map(note => {
      const noteObj = Note.get(note);
      const notePc = noteObj.pc; 
      
      // Check if note is in scale (handle enharmonics simply by checking inclusion first, 
      // maybe improve with chroma if needed)
      // Tonal usually standardizes to sharps or flats based on key.
      // But if tuning has flats and scale has sharps, string match fails.
      // Safer: check Note.chroma(note) against scale chromas?
      // Or simply: scale.notes.some(s => Note.chroma(s) === Note.chroma(note))
      
      const index = scaleNotes.findIndex(s => Note.chroma(s) === Note.chroma(notePc));
      const inScale = index !== -1;
      
      let interval: string | null = null;
      let isRoot = false;
      let isTriad = false;

      if (inScale) {
        interval = scaleIntervals[index];
        isRoot = interval === '1P';
        // A note is part of the tonic triad if its interval from the scale root is a 1P, 3M, 3m, or 5P.
        isTriad = ['1P', '3M', '3m', '5P'].includes(interval || '');
      }

      return {
        note,
        noteName: notePc,
        interval,
        isRoot,
        isTriad,
        inScale
      };
    });
  });
};
