import { useEffect, useRef } from 'react';
import type { GameState } from '../lib/types';
import { processTick } from '../lib/gameLogic';

export function useGameLoop(
  state: GameState,
  updateState: (updater: (prev: GameState) => GameState) => void
) {
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (state.hasWon) return;

    const interval = setInterval(() => {
      updateState(processTick);
    }, 1000);

    return () => clearInterval(interval);
  }, [updateState, state.hasWon]);
}

