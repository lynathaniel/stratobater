import { Fretboard } from './components/Fretboard';
import { EarTrainer } from './components/EarTrainer';

function App() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-extrabold text-white mb-10 tracking-tight">Stratobater</h1>
      
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Fretboard Visualizer */}
        <div className="lg:col-span-1">
          <Fretboard />
        </div>

        {/* Ear Trainer */}
        <div className="lg:col-span-1">
          <EarTrainer />
        </div>
      </div>
    </div>
  );
}

export default App;
