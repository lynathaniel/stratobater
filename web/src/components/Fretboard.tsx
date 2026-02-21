import React from 'react';
import { useStore } from '../store/useStore';
import { getFretboard } from '../utils/fretboard';
import clsx from 'clsx';

export const Fretboard: React.FC = () => {
  const { root, scaleType, tuning } = useStore();
  const fretboardData = getFretboard(root, scaleType, tuning);

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
                    : "bg-transparent" // Frets
                )}
              >
                 {/* Note Placeholder (will be replaced by Note Circle later) */}
                 <span className="z-30 text-[10px] text-neutral-500 opacity-30 font-mono select-none">
                   {fret.noteName}
                 </span>
              </div>
            ))}
          </div>
        ))}
        {/* Fret Numbers (Optional, can be added as a separate row or absolute) */}
        <div className="flex pl-16">
            {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} className="w-14 text-center text-[10px] text-neutral-500 py-1">
                    {[3, 5, 7, 9, 12, 15, 17, 19, 21].includes(i + 1) ? i + 1 : ''}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
