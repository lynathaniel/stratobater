import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import { generateIntervalQuestion, IntervalQuestion } from '../utils/earTrainer';

export const EarTrainer: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [driveMode, setDriveMode] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<IntervalQuestion | null>(null);
  const synth = useRef<Tone.PolySynth | null>(null);

  const handleStart = async () => {
    await Tone.start();
    synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
    setStarted(true);
  };

  useEffect(() => {
    let isRunning = true;

    const playLoop = async () => {
      if (!started || !driveMode || !synth.current) return;

      // 1. Generate Question
      const question = generateIntervalQuestion();
      setCurrentQuestion(question);
      
      // 2. Play Question (Root then Note)
      const now = Tone.now();
      synth.current.triggerAttackRelease(question.root, "8n", now);
      synth.current.triggerAttackRelease(question.note, "8n", now + 0.5);
      
      // 3. Wait 4s
      await new Promise(r => setTimeout(r, 4000));
      
      if (!isRunning || !driveMode) return;

      // 4. Play Answer (Harmonic) - Speech will be added in next step
      synth.current.triggerAttackRelease([question.root, question.note], "4n");
      
      // 5. Wait 2s
      await new Promise(r => setTimeout(r, 2000));
      
      if (isRunning && driveMode) {
        playLoop();
      }
    };

    if (started && driveMode) {
      playLoop();
    }

    return () => {
      isRunning = false;
    };
  }, [started, driveMode]);

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
        <div className="flex flex-col gap-4 w-full max-w-md">
          <div className="px-4 py-2 bg-green-900/30 border border-green-500/50 text-green-400 rounded-md">
            Audio Engine Ready
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
            <input 
              type="checkbox" 
              id="driveMode" 
              checked={driveMode} 
              onChange={(e) => setDriveMode(e.target.checked)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <label htmlFor="driveMode" className="text-white font-medium select-none cursor-pointer flex-1">
              Drive Mode (Hands-Free Loop)
            </label>
            {driveMode && <span className="text-xs text-blue-400 animate-pulse">Active</span>}
          </div>

          {/* Current Question Display (Optional, useful for debug/visual feedback) */}
          {currentQuestion && driveMode && (
            <div className="p-4 bg-neutral-800 rounded-lg text-center">
                <div className="text-sm text-neutral-500">Current Interval</div>
                <div className="text-2xl font-bold">{currentQuestion.interval}</div>
                <div className="text-xs text-neutral-600">{currentQuestion.root} -> {currentQuestion.note}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
