import { useState, useEffect, useCallback } from 'react';
import type { GameState } from '../lib/types';
import {
  INITIAL_MONEY,
  INITIAL_ENGINEERS,
  INITIAL_COMPUTE,
  INITIAL_OFFICE_TIER,
} from '../lib/constants';

const STORAGE_KEY = 'agi-tycoon-save';

const createInitialState = (): GameState => ({
  money: INITIAL_MONEY,
  engineers: INITIAL_ENGINEERS,
  officeTier: INITIAL_OFFICE_TIER,
  computeUnits: INITIAL_COMPUTE,
  activeModels: [],
  trainingJob: null,
  tick: 0,
  hasWon: false,
});

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as GameState;
      } catch {
        return createInitialState();
      }
    }
    return createInitialState();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = useCallback((updater: (prev: GameState) => GameState) => {
    setState(updater);
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialState());
  }, []);

  return { state, updateState, resetGame };
}

