import { describe, it, expect } from 'vitest';
import { generateIntervalQuestion, INTERVALS, INTERVAL_NAMES } from '../earTrainer';
import { Note } from '@tonaljs/tonal';

describe('earTrainer utilities', () => {
  describe('INTERVALS constant', () => {
    it('contains 12 intervals', () => {
      expect(INTERVALS.length).toBe(12);
    });

    it('contains expected interval shorthand', () => {
      expect(INTERVALS).toContain('2m');
      expect(INTERVALS).toContain('3M');
      expect(INTERVALS).toContain('5P');
      expect(INTERVALS).toContain('8P');
    });
  });

  describe('INTERVAL_NAMES mapping', () => {
    it('maps all intervals to full names', () => {
      for (const interval of INTERVALS) {
        expect(INTERVAL_NAMES[interval]).toBeDefined();
      }
    });

    it('has correct names for common intervals', () => {
      expect(INTERVAL_NAMES['2m']).toBe('Minor Second');
      expect(INTERVAL_NAMES['3M']).toBe('Major Third');
      expect(INTERVAL_NAMES['5P']).toBe('Perfect Fifth');
      expect(INTERVAL_NAMES['8P']).toBe('Perfect Octave');
    });

    it('includes tritone enharmonic equivalents', () => {
      expect(INTERVAL_NAMES['4A']).toBe('Augmented Fourth');
      expect(INTERVAL_NAMES['5d']).toBe('Diminished Fifth');
    });
  });

  describe('generateIntervalQuestion', () => {
    it('returns an object with required properties', () => {
      const question = generateIntervalQuestion();
      expect(question).toHaveProperty('root');
      expect(question).toHaveProperty('interval');
      expect(question).toHaveProperty('note');
      expect(question).toHaveProperty('direction');
    });

    it('uses default root C4 when not specified', () => {
      const question = generateIntervalQuestion();
      expect(question.root).toBe('C4');
    });

    it('respects custom root parameter', () => {
      const question = generateIntervalQuestion('A4');
      expect(question.root).toBe('A4');
    });

    it('returns interval from default INTERVALS array', () => {
      const question = generateIntervalQuestion();
      expect(INTERVALS).toContain(question.interval);
    });

    it('respects custom intervals array', () => {
      const customIntervals = ['3M', '5P'];
      const question = generateIntervalQuestion('C4', customIntervals);
      expect(customIntervals).toContain(question.interval);
    });

    it('computes correct target note', () => {
      const question = generateIntervalQuestion('C4', ['5P']);
      const expectedNote = Note.transpose('C4', '5P');
      expect(question.note).toBe(expectedNote);
    });

    it('defaults direction to ascending', () => {
      const question = generateIntervalQuestion();
      expect(question.direction).toBe('ascending');
    });

    it('generates random intervals (probabilistic test)', () => {
      const results = new Set<string>();
      for (let i = 0; i < 50; i++) {
        const question = generateIntervalQuestion();
        results.add(question.interval);
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });
});
