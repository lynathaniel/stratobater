import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { FretData, NoteLabelMode } from '../utils/fretboard';
import type { ChordExtension, RomanNumeralButton } from '../store/useStore';
import { getFretboard, getRomanNumeralButtons, getChordRoot, formatChordQuality, formatChordExtension } from '../utils/fretboard';
import clsx from 'clsx';
import { Circle, Triangle, Type } from 'lucide-react';
import { DualModeSelector } from './DualModeSelector';

interface FretboardControlsProps {
  root: string;
  scaleType: string;
  showRoots: boolean;
  showTriads: boolean;
  showChordMode: boolean;
  noteLabelMode: NoteLabelMode;
  onToggleRoots: () => void;
  onToggleTriads: () => void;
  onToggleChordMode: () => void;
  onCycleLabelMode: () => void;
  onOpenKeyModal: () => void;
  onOpenScaleModal: () => void;
}

const FretboardControls: React.FC<FretboardControlsProps> = ({
  root,
  scaleType,
  showRoots,
  showTriads,
  showChordMode,
  noteLabelMode,
  onToggleRoots,
  onToggleTriads,
  onToggleChordMode,
  onCycleLabelMode,
  onOpenKeyModal,
  onOpenScaleModal,
}) => {
  const getLabelModeLabel = () => {
    switch (noteLabelMode) {
      case 'noteNames':
        return 'Labels: Notes';
      case 'scaleDegrees':
        return 'Labels: Degrees';
      case 'none':
        return 'Labels: Hidden';
    }
  };

  const getLabelModeClassName = () => {
    switch (noteLabelMode) {
      case 'noteNames':
        return "bg-[#FFB936]/20 text-[#FFB936] border-[#FFB936]/50 hover:bg-[#FFB936]/30";
      case 'scaleDegrees':
        return "bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30";
      case 'none':
        return "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200/50";
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 ml-[30px] mr-[30px]">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
            onClick={onOpenKeyModal}
            title="Click to change key or press K"
          >
            {root}
          </span>
          <span
            className="px-3 py-1 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer text-neutral-400"
            onClick={onOpenScaleModal}
            title="Click to change scale or press S"
          >
            {scaleType}
          </span>
        </h2>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onToggleRoots}
          className={clsx(
            "px-4 py-2 rounded-md text-sm font-semibold transition-all border flex items-center justify-center",
            showRoots
              ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30"
              : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200"
          )}
        >
          <Circle size={16} className="mr-2" />
          Roots
        </button>
        <button
          onClick={onToggleTriads}
          className={clsx(
            "px-4 py-2 rounded-md text-sm font-semibold transition-all border flex items-center justify-center",
            showTriads
              ? "bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30"
              : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200"
          )}
        >
          <Triangle size={16} className="mr-2" />
          Triads
        </button>
        <button
          onClick={onToggleChordMode}
          className={clsx(
            "px-4 py-2 rounded-md text-sm font-semibold transition-all border flex items-center justify-center",
            showChordMode
              ? "bg-[#E6A500]/20 text-[#E6A500] border-[#E6A500]/50 hover:bg-[#E6A500]/30"
              : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200"
          )}
        >
          <Triangle size={16} className="mr-2" />
          Chords
        </button>
        <button
          onClick={onCycleLabelMode}
          className={clsx(
            "px-4 py-2 rounded-md text-sm font-semibold transition-all border flex items-center justify-center",
            getLabelModeClassName()
          )}
        >
          <Type size={16} className="mr-2" />
          {getLabelModeLabel()}
        </button>
      </div>
    </div>
  );
};

interface ChordDisplayProps {
  root: string;
  scaleType: string;
  selectedDegree: number | null;
  chordExtension: ChordExtension | null;
  romanButtons: RomanNumeralButton[];
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({
  root,
  scaleType,
  selectedDegree,
  chordExtension,
  romanButtons,
}) => {
  if (selectedDegree === null) return null;

  const selectedButton = romanButtons.find(btn => btn.degree === selectedDegree);
  if (!selectedButton) return null;

  const chordRoot = getChordRoot(root, scaleType, selectedDegree);
  const quality = formatChordQuality(selectedButton.quality);
  const extension = formatChordExtension(chordExtension);

  return (
    <div className="px-6 py-2 rounded-md border border-neutral-700 bg-neutral-800 text-center text-2xl font-bold text-neutral-200 mb-2 hover:bg-neutral-700 transition-colors">
      {chordRoot}{quality}{extension}
    </div>
  );
};

interface ChordSelectorProps {
  root: string;
  scaleType: string;
  selectedDegree: number | null;
  chordExtension: ChordExtension | null;
  romanButtons: RomanNumeralButton[];
  onDegreeSelect: (degree: number | null) => void;
  onExtensionChange: (extension: ChordExtension | null) => void;
}

const extensions: { value: ChordExtension; label: string }[] = [
  { value: '6th', label: '6th' },
  { value: '7th', label: '7th' },
  { value: '9th', label: '9th' },
  { value: '11th', label: '11th' },
  { value: '13th', label: '13th' },
];

const ChordSelector: React.FC<ChordSelectorProps> = ({
  root,
  scaleType,
  selectedDegree,
  chordExtension,
  romanButtons,
  onDegreeSelect,
  onExtensionChange,
}) => {
  const [extensionIndex, setExtensionIndex] = React.useState(extensions.findIndex(e => e.value === chordExtension));

  React.useEffect(() => {
    setExtensionIndex(extensions.findIndex(e => e.value === chordExtension));
  }, [chordExtension]);

  return (
    <div className="flex flex-col items-center gap-4 mt-6 ml-[30px] mr-[30px]">
      {/* Chord Name Display */}
      <ChordDisplay
        root={root}
        scaleType={scaleType}
        selectedDegree={selectedDegree}
        chordExtension={chordExtension}
        romanButtons={romanButtons}
      />

      {/* Roman Numeral Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {romanButtons.map((btn) => {
          const displayName = btn.qualitySymbol ? `${btn.roman}${btn.qualitySymbol}` : btn.roman;
          return (
            <button
              key={btn.degree}
              onClick={() => onDegreeSelect(selectedDegree === btn.degree ? 1 : btn.degree)}
              className={clsx(
                "relative px-3 py-2 rounded-md text-lg font-bold min-w-[50px] transition-all border",
                selectedDegree === btn.degree
                  ? "bg-[#E6A500]/30 text-yellow-200 border-[#E6A500]/60 ring-2 ring-[#E6A500]/40"
                  : "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200"
              )}
              aria-label={`Chord degree ${btn.degree}: ${displayName}`}
              title={`${displayName} chord`}
            >
              {displayName}
            </button>
          );
        })}
      </div>

      {/* Extension Slider - visible when chord selected */}
      {selectedDegree !== null && (
        <div className="flex items-center gap-4 w-full max-w-lg">
          <div className="flex-1 flex bg-neutral-800 rounded-md border border-neutral-700 overflow-hidden">
            {extensions.map((ext, idx) => (
              <button
                key={ext.value}
                onClick={() => onExtensionChange(ext.value)}
                className={clsx(
                  "flex-1 px-3 py-2 text-sm font-semibold transition-all",
                  idx === extensionIndex
                    ? "bg-[#E6A500]/20 text-[#E6A500] font-bold border-r border-neutral-700"
                    : "text-neutral-500 hover:text-neutral-300 border-r border-neutral-700 last:border-r-0"
                )}
              >
                {ext.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface StringLabelsProps {
  tuning: string[];
}

const StringLabels: React.FC<StringLabelsProps> = ({ tuning }) => {
  return (
    <div className="flex flex-col min-w-[30px] pr-2 justify-start items-end text-neutral-400 text-sm font-bold">
      {tuning.slice().reverse().map((stringNote, index) => {
        const noteName = stringNote.charAt(0);
        const displayLabel = noteName === 'E' && stringNote.endsWith('4') ? 'e' : noteName;
        return (
          <div key={index} className="h-12 flex items-center">
            {displayLabel}
          </div>
        );
      })}
    </div>
  );
};

interface FretNumbersProps {
  fretCount?: number;
}

const FretNumbers: React.FC<FretNumbersProps> = ({ fretCount = 22 }) => {
  return (
    <div className="flex pl-16 bg-neutral-900">
      {Array.from({ length: fretCount }).map((_, i) => (
        <div key={i} className="flex-1 text-center text-sm font-bold text-neutral-500 py-1 font-mono">
          {[1, 3, 5, 7, 9, 12, 15, 17, 19, 21].includes(i + 1) ? i + 1 : ''}
        </div>
      ))}
    </div>
  );
};

interface FretboardGridProps {
  fretboardData: FretData[][];
  showRoots: boolean;
  showTriads: boolean;
  showChordMode: boolean;
  noteLabelMode: NoteLabelMode;
  fretCount: number;
  selectedRomanDegree: number | null;
}

const FretboardGrid: React.FC<FretboardGridProps> = ({ fretboardData, showRoots, showTriads, showChordMode, noteLabelMode, fretCount = 22, selectedRomanDegree }) => {
  const getNoteStyle = (fret: FretData) => {
    // When a roman degree is selected, we only highlight chord tones.
    // If a non-tonic chord is selected (degree > 1), don't fall back to scale-based highlighting
    // because that would incorrectly highlight the tonic triad.
    const isTonicChord = selectedRomanDegree === 1;

    if (fret.isChordTone) {
      // 1. Root button takes precedence - chord root (role 1) = red
      if (fret.chordToneRole === 1 && showRoots) {
        return "bg-red-500 text-white ring-red-900/50";
      }
      // 2. Triad button - includes root, 3rd, and 5th in blue (when Roots is OFF)
      if ((fret.chordToneRole === 1 || fret.chordToneRole === 3 || fret.chordToneRole === 5) && showTriads) {
        return "bg-blue-500 text-white ring-blue-900/50";
      }
      // 3. Chord mode button - all chord tones = yellow
      if (showChordMode) {
        return "bg-[#E6A500] text-white ring-[#E6A500]/50";
      }
    }

    // Scale-based (tonic) highlighting - only applies when tonic is selected or no chord selected
    // Never apply when a non-tonic chord is selected
    if (isTonicChord || selectedRomanDegree === null) {
      if (fret.isRoot && showRoots) {
        return "bg-red-500 text-white ring-red-900/50";
      }
      if (fret.isTriad && showTriads) {
        return "bg-blue-500 text-white ring-blue-900/50";
      }
    }

    return "bg-neutral-200 text-neutral-900 ring-neutral-900/50 opacity-100";
  };

  const StringRow: React.FC<{ stringData: FretData[]; stringIndex: number }> = ({ stringData, stringIndex }) => {
    return (
      <div className="flex relative group">
        <div
          className="absolute top-1/2 left-0 w-full bg-neutral-600 -translate-y-1/2 z-0 pointer-events-none shadow-sm"
          style={{ height: [1, 2, 2, 3, 4, 5][stringIndex] + 'px' }}
        />
        {stringData.map((fret, fretIndex) => (
          <div
            key={fretIndex}
            className={clsx(
              "fret-cell h-12 flex items-center justify-center relative",
              fretIndex === 0
                ? "w-16 flex-none border-r-4 border-neutral-400"
                : "flex-1"
            )}
          >
            {fretIndex > 0 && (
              <div
                className={clsx(
                  "absolute right-0 w-[2px] bg-neutral-600 pointer-events-none z-0",
                  stringIndex === 0 ? "top-1/2 h-1/2" : stringIndex === 5 ? "top-0 h-1/2" : "top-0 h-full"
                )}
              />
            )}
            {fret.inScale && (
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-base font-bold shadow-md transition-transform duration-200 cursor-default select-none ring-2 relative z-20 hover:scale-110",
                  getNoteStyle(fret)
                )}
                aria-label={noteLabelMode === 'none' ? `${fret.noteName}${fret.scaleDegree ? `, scale degree ${fret.scaleDegree}` : ''}` : undefined}
                title={noteLabelMode === 'none' ? `${fret.noteName}${fret.scaleDegree ? ` (degree ${fret.scaleDegree})` : ''}` : undefined}
              >
                {noteLabelMode === 'noteNames' && fret.noteName}
                {noteLabelMode === 'scaleDegrees' && fret.scaleDegree && (
                  <>
                    {fret.accidentalPrefix}
                    {fret.scaleDegree}
                  </>
                )}
                {noteLabelMode === 'none' && null}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 rounded-l-sm shadow-2xl bg-neutral-900">
      {fretboardData.slice().reverse().map((stringData, idx) => (
        <StringRow key={idx} stringData={stringData} stringIndex={idx} />
      ))}
          <FretNumbers fretCount={fretCount} />
    </div>
  );
};

export const Fretboard: React.FC = () => {
  const {
    root,
    scaleType,
    tuning,
    showRoots,
    showTriads,
    showChordMode,
    noteLabelMode,
    keyItems,
    scaleItems,
    selectedRomanDegree,
    chordExtension,
    setSelectedKey,
    setSelectedScale,
    toggleShowRoots,
    toggleShowTriads,
    toggleShowChordMode,
    setNoteLabelMode,
    toggleKeyVisibility,
    toggleScaleVisibility,
    toggleBulkKeyVisibility,
    toggleBulkScaleVisibility,
    reorderKeys,
    reorderScales,
    resetKeys,
    resetScales,
    setSelectedRomanDegree,
    setChordExtension,
  } = useStore();

  // Calculate roman numeral buttons
  const romanButtons = React.useMemo(
    () => getRomanNumeralButtons(scaleType),
    [scaleType]
  );

  const fretboardData = getFretboard(root, scaleType, tuning, 22, selectedRomanDegree, chordExtension);

  // Wrapper functions for visibility toggle with optional bulk mode
  const handleKeyVisibilityToggle = (key: string, isShiftHeld: boolean = false, currentlyAppliedIndex?: number) => {
    if (isShiftHeld) {
      toggleBulkKeyVisibility(key, true, currentlyAppliedIndex);
    } else {
      toggleKeyVisibility(key);
    }
  };

  const handleScaleVisibilityToggle = (scale: string, isShiftHeld: boolean = false, currentlyAppliedIndex?: number) => {
    if (isShiftHeld) {
      toggleBulkScaleVisibility(scale, true, currentlyAppliedIndex);
    } else {
      toggleScaleVisibility(scale);
    }
  };

  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const openKeyModal = () => setIsKeyModalOpen(true);
  const openScaleModal = () => setIsScaleModalOpen(true);
  const closeKeyModal = () => setIsKeyModalOpen(false);
  const closeScaleModal = () => setIsScaleModalOpen(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle K/S for modals - toggle open/close
      if (e.key.toLowerCase() === "k") {
        // Don't allow K to open key modal if scale modal is open
        if (isScaleModalOpen) return;
        setIsKeyModalOpen(prev => !prev);
        return;
      }
      if (e.key.toLowerCase() === "s") {
        // Don't allow S to open scale modal if key modal is open
        if (isKeyModalOpen) return;
        setIsScaleModalOpen(prev => !prev);
        return;
      }

      // Don't process other shortcuts if any modal is open
      if (isKeyModalOpen || isScaleModalOpen) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        // Use custom ordering from keyItems
        const visibleKeys = keyItems.filter(k => k.isVisible);
        if (visibleKeys.length > 0) {
          const currentIdx = visibleKeys.findIndex(k => k.id === root);
          const nextIdx = e.key === "ArrowRight"
            ? (currentIdx + 1) % visibleKeys.length
            : (currentIdx - 1 + visibleKeys.length) % visibleKeys.length;
          setSelectedKey(visibleKeys[nextIdx].id);
        }
      } else if (e.key === "]" || e.key === "[") {
        // Use custom ordering from scaleItems
        const visibleScales = scaleItems.filter(s => s.isVisible);
        if (visibleScales.length > 0) {
          const currentIdx = visibleScales.findIndex(s => s.id === scaleType);
          const nextIdx = e.key === "]"
            ? (currentIdx + 1) % visibleScales.length
            : (currentIdx - 1 + visibleScales.length) % visibleScales.length;
          setSelectedScale(visibleScales[nextIdx].id);
        }
      } else if (e.key.toLowerCase() === "r") {
        toggleShowRoots();
      } else if (e.key.toLowerCase() === "t") {
        toggleShowTriads();
      } else if (e.key.toLowerCase() === "l") {
        const modes: NoteLabelMode[] = ['noteNames', 'scaleDegrees', 'none'];
        const currentIndex = modes.indexOf(noteLabelMode);
        setNoteLabelMode(modes[(currentIndex + 1) % modes.length]);
      } else if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) {
        const degree = parseInt(e.key, 10);
        setSelectedRomanDegree(degree);
      } else if (e.key.toLowerCase() === 'c') {
        toggleShowChordMode();
      } else if (e.key === '=' || e.key === '+') {
        const exts: ChordExtension[] = ['6th', '7th', '9th', '11th', '13th'];
        const idx = chordExtension ? exts.indexOf(chordExtension) : -1;
        // Cycle through extensions, cycling back to null after 13th
        if (idx === -1) {
          setChordExtension('6th');
        } else if (idx === exts.length - 1) {
          setChordExtension(null);
        } else {
          setChordExtension(exts[(idx + 1)]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [root, scaleType, keyItems, scaleItems, setSelectedKey, setSelectedScale, toggleShowRoots, toggleShowTriads, toggleShowChordMode, setNoteLabelMode, noteLabelMode, isKeyModalOpen, isScaleModalOpen, selectedRomanDegree, chordExtension, setSelectedRomanDegree, setChordExtension]);

  return (
    <div className="w-full flex flex-col flex-1">
      <FretboardControls
        root={root}
        scaleType={scaleType}
        showRoots={showRoots}
        showTriads={showTriads}
        showChordMode={showChordMode}
        noteLabelMode={noteLabelMode}
        onToggleRoots={toggleShowRoots}
        onToggleTriads={toggleShowTriads}
        onToggleChordMode={toggleShowChordMode}
        onCycleLabelMode={() => {
          const modes: NoteLabelMode[] = ['noteNames', 'scaleDegrees', 'none'];
          const currentIndex = modes.indexOf(noteLabelMode);
          setNoteLabelMode(modes[(currentIndex + 1) % modes.length]);
        }}
        onOpenKeyModal={openKeyModal}
        onOpenScaleModal={openScaleModal}
      />
      {isKeyModalOpen && (
        <DualModeSelector
          isOpen={true}
          onClose={closeKeyModal}
          type="key"
          currentSelection={root}
          items={keyItems}
          onSelect={setSelectedKey}
          onToggleVisibility={handleKeyVisibilityToggle}
          onReorder={reorderKeys}
          onReset={resetKeys}
        />
      )}
      {isScaleModalOpen && (
        <DualModeSelector
          isOpen={true}
          onClose={closeScaleModal}
          type="scale"
          currentSelection={scaleType}
          items={scaleItems}
          onSelect={setSelectedScale}
          onToggleVisibility={handleScaleVisibilityToggle}
          onReorder={reorderScales}
          onReset={resetScales}
        />
      )}
      <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
        <div className="flex flex-col">
          <div className="flex">
            <StringLabels tuning={tuning} />
            <FretboardGrid
              fretboardData={fretboardData}
              showRoots={showRoots}
              showTriads={showTriads}
              showChordMode={showChordMode}
              noteLabelMode={noteLabelMode}
              fretCount={22}
              selectedRomanDegree={selectedRomanDegree}
            />
            <div className="flex flex-col min-w-[30px] pl-2"></div>
          </div>
          <ChordSelector
            root={root}
            scaleType={scaleType}
            selectedDegree={selectedRomanDegree}
            chordExtension={chordExtension}
            romanButtons={romanButtons}
            onDegreeSelect={setSelectedRomanDegree}
            onExtensionChange={setChordExtension}
          />
        </div>
      </div>
      <div className="fixed bottom-4 left-0 right-0 text-center text-sm">
        <div className="bg-neutral-700/20 px-3 py-3 rounded-lg border border-neutral-700 w-fit inline-block mx-4 lg:mx-12 md:mx-8">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3">
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">←/→</span>
            <span className="text-neutral-500 text-xs leading-tight">Cycle Keys</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">
              <span className="text-xs mx-0.5">[</span><span className="mx-0.5">/</span><span className="text-xs mx-0.5">]</span>
            </span>
            <span className="text-neutral-500 text-xs leading-tight">Cycle Scales</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">K</span>
            <span className="text-neutral-500 text-xs leading-tight">Key Menu</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">S</span>
            <span className="text-neutral-500 text-xs leading-tight">Scale Menu</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">R</span>
            <span className="text-neutral-500 text-xs leading-tight">Roots</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">T</span>
            <span className="text-neutral-500 text-xs leading-tight">Triads</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">L</span>
            <span className="text-neutral-500 text-xs leading-tight">Labels</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">1-7</span>
            <span className="text-neutral-500 text-xs leading-tight">Chord</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">C</span>
            <span className="text-neutral-500 text-xs leading-tight">Chords</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-neutral-200/50 bg-neutral-700/20 px-2 py-0.5 rounded border border-neutral-600/40 text-sm">=</span>
            <span className="text-neutral-500 text-xs leading-tight">Extension</span>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
