import { Note } from '@tonaljs/tonal';

export interface IntervalQuestion {
  root: string;
  interval: string;
  note: string; // The target note
  direction: 'ascending' | 'descending';
}

// Common intervals from 2m to 8P
export const INTERVALS = ['2m', '2M', '3m', '3M', '4P', '4A', '5P', '6m', '6M', '7m', '7M', '8P'];

export const INTERVAL_NAMES: Record<string, string> = {
  '2m': 'Minor Second',
  '2M': 'Major Second',
  '3m': 'Minor Third',
  '3M': 'Major Third',
  '4P': 'Perfect Fourth',
  '4A': 'Augmented Fourth', // Tritone
  '5d': 'Diminished Fifth', // Tritone
  '5P': 'Perfect Fifth',
  '6m': 'Minor Sixth',
  '6M': 'Major Sixth',
  '7m': 'Minor Seventh',
  '7M': 'Major Seventh',
  '8P': 'Perfect Octave'
};

export const generateIntervalQuestion = (root: string = 'C4', intervals: string[] = INTERVALS): IntervalQuestion => {
  const interval = intervals[Math.floor(Math.random() * intervals.length)];
  const note = Note.transpose(root, interval);
  return {
    root,
    interval,
    note,
    direction: 'ascending'
  };
};
