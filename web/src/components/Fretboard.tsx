import React from 'react';
import { useStore } from '../store/useStore';
import { getFretboard } from '../utils/fretboard';
import clsx from 'clsx';
import { Link } from 'wouter';
import { Circle, Triangle } from 'lucide-react'; // Import Lucide icons

const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const SCALES = ["major", "minor", "major pentatonic", "minor pentatonic", "major blues", "minor blues", "dorian", "mixolydian", "lydian", "phrygian", "locrian"];

export const Fretboard: React.FC = () => {
  const {
    root, scaleType, tuning, showRoots, showTriads,
    setRoot, setScaleType, toggleShowRoots, toggleShowTriads
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [root, scaleType, setRoot, setScaleType, toggleShowRoots, toggleShowTriads]);

  const getNoteStyle = (fret: { isRoot: boolean; isTriad: boolean }) => {
    if (fret.isRoot && showRoots) {
      return "bg-red-500 text-white ring-red-900/50";
    }
    if (fret.isTriad && showTriads) {
      return "bg-blue-500 text-white ring-blue-900/50";
    }
    return "bg-neutral-200 text-neutral-900 ring-neutral-900/50 opacity-100";
  };

  return (
    <div className="w-full flex flex-col flex-1">
      {/* Header / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 ml-[30px] mr-[30px]">
        <div>
            <h2 className="text-2xl font-bold">{root} <span className="text-neutral-400 font-normal">{scaleType}</span></h2>
            <p className="text-xs text-neutral-500">Use arrows to change Key, [ ] to change Scale</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={toggleShowRoots}
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
                onClick={toggleShowTriads}
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
        </div>
      </div>

      {/* Fretboard Container */}
      <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
        <div className="flex"> {/* New wrapper for labels and fretboard grid */}
          {/* Static String Labels Column */}
          <div className="flex flex-col min-w-[30px] pr-2 justify-start items-end text-neutral-400 text-sm font-bold">
            {tuning.slice().reverse().map((stringNote, index) => {
              const noteName = stringNote.charAt(0); // 'E' from 'E2' or 'E4'
              // Display 'e' for high E (E4), otherwise the note name
              const displayLabel = noteName === 'E' && stringNote.endsWith('4') ? 'e' : noteName;
              return (
                <div key={index} className="h-12 flex items-center">
                  {displayLabel}
                </div>
              );
            })}
          </div>

          {/* Existing Fretboard Grid */}
          <div className="flex flex-col flex-1 rounded-l-sm shadow-2xl">
                            {fretboardData.slice().reverse().map((stringData, stringRenderIndex) => {
                              // const isOpenHighE = stringData[0].note.startsWith('E4'); // No longer needed
                              
                              return (
                                <div key={stringRenderIndex} className="flex relative group">
                                  {/* String Line */}
                                  <div className="absolute top-1/2 left-0 w-full bg-neutral-600 -translate-y-1/2 z-0 pointer-events-none shadow-sm" style={{ height: [1,2,2,3,4,5][stringRenderIndex] + 'px' }} />
                                  
                                  {stringData.map((fret, fretIndex) => (
                                    <div
                                      key={fretIndex}
                                      className={clsx(
                                        "h-12 flex items-center justify-center relative",
                                        fretIndex === 0
                                          ? "w-16 flex-none border-r-4 border-neutral-400"
                                          : "flex-1"
                                      )}
                                    >
                                      {fretIndex > 0 && (
                                        <div
                                          className={clsx(
                                            "absolute right-0 w-[2px] bg-neutral-600 pointer-events-none z-0",
                                            stringRenderIndex === 0 ? "top-1/2 h-1/2" : stringRenderIndex === 5 ? "top-0 h-1/2": "top-0 h-full"
                                          )}
                                        />
                                      )}
                                      {/* Note Circle */}
                                      {fret.inScale && (
                                        <div className={clsx(
                                          "w-8 h-8 rounded-full flex items-center justify-center text-base font-bold shadow-md transition-transform duration-200 cursor-default select-none ring-2 relative z-20 hover:scale-110",
                                          getNoteStyle(fret)
                                        )}>
                                          {/* Notes always uppercase */}
                                          {fret.noteName}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              );
                            })}            {/* Fret Numbers */}
            <div className="flex pl-16 bg-neutral-900">
                {Array.from({ length: 22 }).map((_, i) => (
                    <div key={i} className="flex-1 text-center text-sm font-bold text-neutral-500 py-1 font-mono">
                        {[1, 3, 5, 7, 9, 12, 15, 17, 19, 21].includes(i + 1) ? i + 1 : ''}
                    </div>
                ))}
            </div>
          </div> {/* End of existing Fretboard Grid */}
          <div className="flex flex-col min-w-[30px] pl-2"></div>
        </div> {/* End of new wrapper */}
      </div>
    </div>
  );
};
