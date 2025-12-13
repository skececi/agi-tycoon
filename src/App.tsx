import { useGameState } from './hooks/useGameState';
import { useGameLoop } from './hooks/useGameLoop';
import { Header } from './components/Header';
import { Office } from './components/Office';
import { TrainingPanel } from './components/TrainingPanel';
import { ModelList } from './components/ModelList';
import { WinScreen } from './components/WinScreen';
import { IntroScreen } from './components/IntroScreen';
import { startTraining } from './lib/gameLogic';
import type { ModelType } from './lib/types';
import {
  COMPUTE_AMOUNT,
  OFFICE_UPGRADES,
  getComputeCost,
  getHireCost,
} from './lib/constants';
import './index.css';

function App() {
  const { state, updateState, resetGame } = useGameState();
  useGameLoop(state, updateState);

  const handleStartGame = () => {
    updateState((prev) => ({ ...prev, gameStarted: true }));
  };

  const handleHire = () => {
    updateState((prev) => {
      const maxEngineers = OFFICE_UPGRADES[prev.officeTier].maxEngineers;
      const hireCost = getHireCost(prev.engineers);
      if (prev.money < hireCost || prev.engineers >= maxEngineers) return prev;
      return {
        ...prev,
        money: prev.money - hireCost,
        engineers: prev.engineers + 1,
      };
    });
  };

  const handleUpgrade = () => {
    updateState((prev) => {
      if (prev.officeTier >= 6) return prev;
      const nextTier = prev.officeTier + 1;
      const cost = OFFICE_UPGRADES[nextTier].cost;
      if (prev.money < cost) return prev;
      return {
        ...prev,
        money: prev.money - cost,
        officeTier: nextTier,
      };
    });
  };

  const handleBuyCompute = () => {
    updateState((prev) => {
      const cost = getComputeCost(prev.gpus);
      if (prev.money < cost) return prev;
      return {
        ...prev,
        money: prev.money - cost,
        gpus: prev.gpus + COMPUTE_AMOUNT,
      };
    });
  };

  const handleStartTraining = (
    type: ModelType,
    task: string,
    engineers: number,
    compute: number
  ) => {
    updateState((prev) => startTraining(prev, type, task, engineers, compute));
  };

  if (!state.gameStarted) {
    return <IntroScreen onStart={handleStartGame} />;
  }

  return (
    <div className="app">
      <Header money={state.money} tick={state.tick} />

      <main className="main-content">
        <div className="top-panels">
          <Office
            engineers={state.engineers}
            officeTier={state.officeTier}
            gpus={state.gpus}
            money={state.money}
            onHire={handleHire}
            onUpgrade={handleUpgrade}
            onBuyCompute={handleBuyCompute}
          />
          <TrainingPanel
            engineers={state.engineers}
            gpus={state.gpus}
            trainingJob={state.trainingJob}
            tick={state.tick}
            onStartTraining={handleStartTraining}
          />
        </div>

        <ModelList models={state.activeModels} tick={state.tick} />
      </main>

      {state.hasWon && (
        <WinScreen
          tick={state.tick}
          money={state.money}
          modelCount={state.activeModels.length}
          onReset={resetGame}
        />
      )}
    </div>
  );
}

export default App;
