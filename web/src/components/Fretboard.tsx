import React from 'react';
import { useStore } from '../store/useStore';
import { getFretboard } from '../utils/fretboard';
import clsx from 'clsx';

export const Fretboard: React.FC = () => {
  const { root, scaleType, tuning, showRoots, showTriads } = useStore();
  const fretboardData = getFretboard(root, scaleType, tuning);

  const getNoteStyle = (fret: { isRoot: boolean; isTriad: boolean }) => {
    if (fret.isRoot && showRoots) {
      return "bg-red-500 text-white ring-red-900/50 scale-110 z-40";
    }
    if (fret.isTriad && showTriads) {
      return "bg-blue-500 text-white ring-blue-900/50 z-30";
    }
    return "bg-neutral-400 text-neutral-900 ring-neutral-900/50 opacity-80 hover:opacity-100";
  };

  return (
    <div className="w-full overflow-x-auto p-8 bg-neutral-900 min-h-[300px] flex items-center">
      <div className="flex flex-col min-w-max border-l-4 border-neutral-400 bg-neutral-800/50 rounded-l-sm shadow-2xl">
        {fretboardData.map((stringData, stringIndex) => (
          <div key={stringIndex} className="flex relative group">
            {/* String Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-neutral-600 -translate-y-1/2 z-20 pointer-events-none shadow-sm" />
            
            {stringData.map((fret, fretIndex) => (
              <div 
                key={fretIndex} 
                className={clsx(
                  "w-14 h-12 border-r border-neutral-700 flex items-center justify-center relative z-10",
                  fretIndex === 0 
                    ? "w-16 bg-neutral-800 border-r-4 border-neutral-500" // Nut
                    : "bg-transparent"
                )}
              >
                {/* Note Circle */}
                {fret.inScale && (
                  <div className={clsx(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all duration-200 cursor-default select-none ring-2",
                    getNoteStyle(fret)
                  )}>
                    {fret.noteName}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        {/* Fret Numbers */}
        <div className="flex pl-16">
            {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className="w-14 text-center text-[10px] text-neutral-500 py-1 font-mono">
                    {[3, 5, 7, 9, 12, 15, 17, 19, 21].includes(i + 1) ? i + 1 : ''}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
