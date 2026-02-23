import React from 'react';
import { useStore } from '../store/useStore';
import type { FretData, NoteLabelMode } from '../utils/fretboard';
import { getFretboard } from '../utils/fretboard';
import clsx from 'clsx';
import { Circle, Triangle, Type } from 'lucide-react';

const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALES = ["major", "minor", "major pentatonic", "minor pentatonic", "major blues", "minor blues", "dorian", "mixolydian", "lydian", "phrygian", "locrian"];

interface FretboardControlsProps {
  root: string;
  scaleType: string;
  showRoots: boolean;
  showTriads: boolean;
  noteLabelMode: NoteLabelMode;
  onToggleRoots: () => void;
  onToggleTriads: () => void;
  onCycleLabelMode: () => void;
}

const FretboardControls: React.FC<FretboardControlsProps> = ({
  root,
  scaleType,
  showRoots,
  showTriads,
  noteLabelMode,
  onToggleRoots,
  onToggleTriads,
  onCycleLabelMode,
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
        return "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200";
      case 'scaleDegrees':
        return "bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30";
      case 'none':
        return "bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700 hover:text-neutral-200";
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 ml-[30px] mr-[30px]">
      <div>
        <h2 className="text-2xl font-bold">{root} <span className="text-neutral-400 font-normal">{scaleType}</span></h2>
        <p className="text-xs text-neutral-500">Arrows: Key, []: Scale, R: Roots, T: Triads, L: Labels</p>
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
          Roots (R)
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
          Triads (T)
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
  noteLabelMode: NoteLabelMode;
  fretCount: number;
}

const FretboardGrid: React.FC<FretboardGridProps> = ({ fretboardData, showRoots, showTriads, noteLabelMode, fretCount = 22 }) => {
  const getNoteStyle = (fret: FretData) => {
    if (fret.isRoot && showRoots) {
      return "bg-red-500 text-white ring-red-900/50";
    }
    if (fret.isTriad && showTriads) {
      return "bg-blue-500 text-white ring-blue-900/50";
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
                {noteLabelMode === 'scaleDegrees' && fret.scaleDegree}
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
    noteLabelMode,
    setRoot,
    setScaleType,
    toggleShowRoots,
    toggleShowTriads,
    setNoteLabelMode,
  } = useStore();

  const fretboardData = getFretboard(root, scaleType, tuning);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        const index = KEYS.indexOf(root);
        const next = KEYS[(index + 1) % KEYS.length];
        setRoot(next);
      } else if (e.key === "ArrowLeft") {
        const index = KEYS.indexOf(root);
        const prev = KEYS[(index - 1 + KEYS.length) % KEYS.length];
        setRoot(prev);
      } else if (e.key === "]") {
        const index = SCALES.indexOf(scaleType);
        const next = SCALES[(index + 1) % SCALES.length];
        setScaleType(next);
      } else if (e.key === "[") {
        const index = SCALES.indexOf(scaleType);
        const prev = SCALES[(index - 1 + SCALES.length) % SCALES.length];
        setScaleType(prev);
      } else if (e.key.toLowerCase() === "r") {
        toggleShowRoots();
      } else if (e.key.toLowerCase() === "t") {
        toggleShowTriads();
      } else if (e.key.toLowerCase() === "l") {
        const modes: NoteLabelMode[] = ['noteNames', 'scaleDegrees', 'none'];
        const currentIndex = modes.indexOf(noteLabelMode);
        setNoteLabelMode(modes[(currentIndex + 1) % modes.length]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [root, scaleType, setRoot, setScaleType, toggleShowRoots, toggleShowTriads, setNoteLabelMode, noteLabelMode]);

  return (
    <div className="w-full flex flex-col flex-1">
      <FretboardControls
        root={root}
        scaleType={scaleType}
        showRoots={showRoots}
        showTriads={showTriads}
        noteLabelMode={noteLabelMode}
        onToggleRoots={toggleShowRoots}
        onToggleTriads={toggleShowTriads}
        onCycleLabelMode={() => {
          const modes: NoteLabelMode[] = ['noteNames', 'scaleDegrees', 'none'];
          const currentIndex = modes.indexOf(noteLabelMode);
          setNoteLabelMode(modes[(currentIndex + 1) % modes.length]);
        }}
      />
      <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
        <div className="flex">
          <StringLabels tuning={tuning} />
          <FretboardGrid fretboardData={fretboardData} showRoots={showRoots} showTriads={showTriads} noteLabelMode={noteLabelMode} fretCount={22} />
          <div className="flex flex-col min-w-[30px] pl-2"></div>
        </div>
      </div>
    </div>
  );
};
