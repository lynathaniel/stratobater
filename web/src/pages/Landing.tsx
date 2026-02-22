import { Link } from 'wouter';
import { Guitar, Music } from 'lucide-react';

export const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-8 flex-1">
      <h1 className="text-4xl font-extrabold text-white">Stratobater</h1>
      <p className="text-lg text-neutral-400">Music Theory & Ear Training</p>
      <div className="flex gap-6">
        <Link
          href="/fretboard-visualizer"
          className="flex flex-col items-center gap-2 p-6 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
        >
          <Guitar size={48} />
          <span className="text-xl font-semibold">Fretboard Visualizer</span>
        </Link>
        <Link
          href="/ear-trainer"
          className="flex flex-col items-center gap-2 p-6 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
        >
          <Music size={48} />
          <span className="text-xl font-semibold">Ear Trainer</span>
        </Link>
      </div>
    </div>
  );
};
