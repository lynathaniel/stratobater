import { Note, Interval, Scale } from '@tonaljs/tonal';

export const getStringNotes = (openNote: string, fretCount: number = 22): string[] => {
  return Array.from({ length: fretCount + 1 }, (_, i) => {
    const interval = Interval.fromSemitones(i);
    return Note.transpose(openNote, interval);
  });
};

export const getScaleNotes = (root: string, scaleType: string): string[] => {
  return Scale.get(`${root} ${scaleType}`).notes;
};
