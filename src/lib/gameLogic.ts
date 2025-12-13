import type { GameState, Model, TrainingJob, ModelType } from './types';
import {
  MAX_MODEL_LIFE,
  REVENUE_MULTIPLIER,
  MODEL_PREFIXES,
  MODEL_SUFFIXES,
  getTrainingDuration,
} from './constants';

export function generateModelName(type: ModelType): string {
  const prefix = MODEL_PREFIXES[Math.floor(Math.random() * MODEL_PREFIXES.length)];
  const suffixes = MODEL_SUFFIXES[type];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}-${suffix}`;
}

export function calculateScore(engineers: number, compute: number): number {
  // Requires both engineers AND compute - multiplicative scaling
  // ~100 engineers + ~5000 compute needed for AGI (score 100)
  const engineerFactor = Math.pow(engineers, 0.6);
  const computeFactor = Math.log10(Math.max(10, compute)) * 4;
  const baseScore = engineerFactor * computeFactor;
  const luckFactor = 0.85 + Math.random() * 0.3;
  return Math.min(100, Math.round(baseScore * luckFactor));
}

export function calculateDecay(tick: number, createdAt: number): number {
  const ticksAlive = tick - createdAt;
  return Math.max(0, 1 - ticksAlive / MAX_MODEL_LIFE);
}

export function calculateRevenue(score: number, decayFactor: number): number {
  return Math.round(score * REVENUE_MULTIPLIER * decayFactor);
}

export function completeTraining(job: TrainingJob, tick: number): Model {
  const score = calculateScore(job.engineersAllocated, job.computeAllocated);
  return {
    id: crypto.randomUUID(),
    name: generateModelName(job.type),
    type: job.type,
    task: job.task,
    score,
    createdAt: tick,
    revenuePerTick: score * REVENUE_MULTIPLIER,
  };
}

export function processTick(state: GameState): GameState {
  let { money, activeModels, trainingJob, tick, hasWon } = state;
  tick += 1;

  if (trainingJob && tick >= trainingJob.startTick + trainingJob.duration) {
    const newModel = completeTraining(trainingJob, tick);
    activeModels = [...activeModels, newModel];
    if (newModel.score >= 100) {
      hasWon = true;
    }
    trainingJob = null;
  }

  let tickRevenue = 0;
  activeModels = activeModels.filter((model) => {
    const decay = calculateDecay(tick, model.createdAt);
    if (decay <= 0) return false;
    tickRevenue += calculateRevenue(model.score, decay);
    return true;
  });

  money += tickRevenue;

  return {
    ...state,
    money,
    activeModels,
    trainingJob,
    tick,
    hasWon,
  };
}

export function startTraining(
  state: GameState,
  type: ModelType,
  task: string,
  engineers: number,
  compute: number
): GameState {
  if (state.trainingJob) return state;
  if (engineers > state.engineers) return state;
  if (compute > state.gpus) return state;

  return {
    ...state,
    trainingJob: {
      type,
      task,
      engineersAllocated: engineers,
      computeAllocated: compute,
      startTick: state.tick,
      duration: getTrainingDuration(compute),
    },
  };
}

export function getTrainingProgress(state: GameState): number {
  if (!state.trainingJob) return 0;
  const elapsed = state.tick - state.trainingJob.startTick;
  return Math.min(1, elapsed / state.trainingJob.duration);
}

