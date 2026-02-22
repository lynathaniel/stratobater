import { Router, Route } from 'wouter';
import { MainLayout } from './components/MainLayout';
import { Landing } from './pages/Landing';
import { Fretboard } from './components/Fretboard';
import { EarTrainer } from './components/EarTrainer';

function App() {
  return (
    <Router>
      <MainLayout>
        <Route path="/" component={Landing} />
        <Route path="/fretboard-visualizer" component={Fretboard} />
        <Route path="/ear-trainer" component={EarTrainer} />
        <Route path="*" redirect="/" />
      </MainLayout>
    </Router>
  );
}

export default App;
