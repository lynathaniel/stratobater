import React, { useState, useRef } from 'react';
import * as Tone from 'tone';

export const EarTrainer: React.FC = () => {
  const [started, setStarted] = useState(false);
  const synth = useRef<Tone.PolySynth | null>(null);

  const handleStart = async () => {
    await Tone.start();
    synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
    setStarted(true);
  };

  return (
    <div className="p-4 bg-neutral-900 text-white min-h-[300px] flex flex-col items-start gap-4">
      <h2 className="text-xl font-bold">Ear Trainer</h2>
      {!started ? (
        <button 
          onClick={handleStart}
          className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold shadow-lg transition-colors"
        >
          Start Audio Engine
        </button>
      ) : (
        <div className="px-4 py-2 bg-green-900/30 border border-green-500/50 text-green-400 rounded-md">
          Audio Engine Ready
        </div>
      )}
    </div>
  );
};
