import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useStore, KEYS, SCALES_BY_BRIGHTNESS, type ConfigurableItem } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    useStore.setState({
      root: 'C',
      scaleType: 'Major',
      tuning: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
      showRoots: true,
      showTriads: false,
      showChordMode: false,
      noteLabelMode: 'noteNames',
      keyItems: KEYS.map((key) => ({
        id: key,
        label: key,
        isVisible: true,
        isCurrent: key === 'C',
      })),
      scaleItems: SCALES_BY_BRIGHTNESS.map((scale) => ({
        id: scale,
        label: scale,
        isVisible: true,
        isCurrent: scale === 'Major',
      })),
      selectedRomanDegree: 1,
      chordExtension: null,
    });
  });

  afterEach(() => {
    useStore.setState({
      root: 'C',
      scaleType: 'Major',
      keyItems: KEYS.map((key) => ({
        id: key,
        label: key,
        isVisible: true,
        isCurrent: key === 'C',
      })),
      scaleItems: SCALES_BY_BRIGHTNESS.map((scale) => ({
        id: scale,
        label: scale,
        isVisible: true,
        isCurrent: scale === 'Major',
      })),
    });
  });

  describe('initial state', () => {
    it('has default root C', () => {
      expect(useStore.getState().root).toBe('C');
    });

    it('has default scaleType Major', () => {
      expect(useStore.getState().scaleType).toBe('Major');
    });

    it('has standard tuning', () => {
      expect(useStore.getState().tuning).toEqual(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
    });

    it('has showRoots true by default', () => {
      expect(useStore.getState().showRoots).toBe(true);
    });

    it('has showTriads false by default', () => {
      expect(useStore.getState().showTriads).toBe(false);
    });
  });

  describe('setRoot', () => {
    it('updates root value', () => {
      useStore.getState().setRoot('D');
      expect(useStore.getState().root).toBe('D');
    });
  });

  describe('setScaleType', () => {
    it('updates scaleType value', () => {
      useStore.getState().setScaleType('Minor');
      expect(useStore.getState().scaleType).toBe('Minor');
    });
  });

  describe('setTuning', () => {
    it('updates tuning array', () => {
      const newTuning = ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'];
      useStore.getState().setTuning(newTuning);
      expect(useStore.getState().tuning).toEqual(newTuning);
    });
  });

  describe('toggleShowRoots', () => {
    it('toggles showRoots from true to false', () => {
      useStore.getState().toggleShowRoots();
      expect(useStore.getState().showRoots).toBe(false);
    });

    it('toggles showRoots from false to true', () => {
      useStore.setState({ showRoots: false });
      useStore.getState().toggleShowRoots();
      expect(useStore.getState().showRoots).toBe(true);
    });
  });

  describe('toggleShowTriads', () => {
    it('toggles showTriads from false to true', () => {
      useStore.getState().toggleShowTriads();
      expect(useStore.getState().showTriads).toBe(true);
    });
  });

  describe('toggleShowChordMode', () => {
    it('toggles showChordMode from false to true', () => {
      useStore.getState().toggleShowChordMode();
      expect(useStore.getState().showChordMode).toBe(true);
    });
  });

  describe('setNoteLabelMode', () => {
    it('sets noteLabelMode to scaleDegrees', () => {
      useStore.getState().setNoteLabelMode('scaleDegrees');
      expect(useStore.getState().noteLabelMode).toBe('scaleDegrees');
    });

    it('sets noteLabelMode to none', () => {
      useStore.getState().setNoteLabelMode('none');
      expect(useStore.getState().noteLabelMode).toBe('none');
    });
  });

  describe('setSelectedKey', () => {
    it('updates isCurrent for keyItems', () => {
      useStore.getState().setSelectedKey('G');
      const gItem = useStore.getState().keyItems.find((item: ConfigurableItem) => item.id === 'G');
      expect(gItem?.isCurrent).toBe(true);
      const cItem = useStore.getState().keyItems.find((item: ConfigurableItem) => item.id === 'C');
      expect(cItem?.isCurrent).toBe(false);
    });

    it('updates root for backward compatibility', () => {
      useStore.getState().setSelectedKey('A');
      expect(useStore.getState().root).toBe('A');
    });
  });

  describe('setSelectedScale', () => {
    it('updates isCurrent for scaleItems', () => {
      useStore.getState().setSelectedScale('Minor');
      const minorItem = useStore.getState().scaleItems.find((item: ConfigurableItem) => item.id === 'Minor');
      expect(minorItem?.isCurrent).toBe(true);
    });

    it('updates scaleType for backward compatibility', () => {
      useStore.getState().setSelectedScale('Dorian');
      expect(useStore.getState().scaleType).toBe('Dorian');
    });
  });

  describe('toggleKeyVisibility', () => {
    it('toggles visibility of a key item', () => {
      useStore.getState().toggleKeyVisibility('C#');
      const csItem = useStore.getState().keyItems.find((item: ConfigurableItem) => item.id === 'C#');
      expect(csItem?.isVisible).toBe(false);
    });

    it('keeps current key visible when all others hidden', () => {
      for (const key of KEYS) {
        if (key !== 'C') {
          useStore.getState().toggleKeyVisibility(key);
        }
      }
      const visibleItems = useStore.getState().keyItems.filter((item: ConfigurableItem) => item.isVisible);
      expect(visibleItems.length).toBe(1);
      expect(visibleItems[0].id).toBe('C');
    });
  });

  describe('toggleScaleVisibility', () => {
    it('toggles visibility of a scale item', () => {
      useStore.getState().toggleScaleVisibility('Minor');
      const minorItem = useStore.getState().scaleItems.find((item: ConfigurableItem) => item.id === 'Minor');
      expect(minorItem?.isVisible).toBe(false);
    });
  });

  describe('reorderKeys', () => {
    it('reorders keyItems array', () => {
      const newOrder: ConfigurableItem[] = [
        { id: 'D', label: 'D', isVisible: true, isCurrent: false },
        { id: 'C', label: 'C', isVisible: true, isCurrent: true },
        ...KEYS.filter(k => !['C', 'D'].includes(k)).map(k => ({
          id: k,
          label: k,
          isVisible: true,
          isCurrent: false,
        })),
      ];
      useStore.getState().reorderKeys(newOrder);
      expect(useStore.getState().keyItems[0].id).toBe('D');
      expect(useStore.getState().keyItems[1].id).toBe('C');
    });
  });

  describe('resetKeys', () => {
    it('resets keyItems to default state', () => {
      useStore.getState().toggleKeyVisibility('C#');
      useStore.getState().resetKeys();
      const allVisible = useStore.getState().keyItems.every((item: ConfigurableItem) => item.isVisible);
      expect(allVisible).toBe(true);
      const currentItem = useStore.getState().keyItems.find((item: ConfigurableItem) => item.isCurrent);
      expect(currentItem?.id).toBe('C');
    });
  });

  describe('setSelectedRomanDegree', () => {
    it('sets selectedRomanDegree', () => {
      useStore.getState().setSelectedRomanDegree(4);
      expect(useStore.getState().selectedRomanDegree).toBe(4);
    });

    it('can set to null', () => {
      useStore.getState().setSelectedRomanDegree(null);
      expect(useStore.getState().selectedRomanDegree).toBeNull();
    });
  });

  describe('setChordExtension', () => {
    it('sets chordExtension when different', () => {
      useStore.getState().setChordExtension('7th');
      expect(useStore.getState().chordExtension).toBe('7th');
    });

    it('toggles to null when same value set', () => {
      useStore.setState({ chordExtension: '9th' });
      useStore.getState().setChordExtension('9th');
      expect(useStore.getState().chordExtension).toBeNull();
    });
  });
});
