import type { GameState, Model, TrainingJob, ModelType, Benchmarks } from './types';
import {
  MAX_MODEL_LIFE,
  MODEL_PREFIXES,
  MODEL_SUFFIXES,
  MODEL_TASKS,
  getTrainingDuration,
} from './constants';

export function generateModelName(type: ModelType): string {
  const prefix = MODEL_PREFIXES[Math.floor(Math.random() * MODEL_PREFIXES.length)];
  const suffixes = MODEL_SUFFIXES[type];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}-${suffix}`;
}

function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function calculateBenchmarks(
  type: ModelType,
  task: string,
  engineers: number,
  compute: number
): { benchmarks: Benchmarks; overallScore: number } {
  const tasks = MODEL_TASKS[type];
  const benchmarks: Benchmarks = {};
  
  const engineerFactor = Math.pow(engineers, 0.55);
  const computeFactor = Math.log10(Math.max(10, compute)) * 3.5;
  const basePotential = engineerFactor * computeFactor;
  
  // Global luck swing: sometimes you nail it, sometimes you fumble
  const globalLuck = 0.5 + Math.random() * 1.0;
  
  let total = 0;
  for (const t of tasks) {
    let traitBase = basePotential * globalLuck;
    
    // Focused task gets a significant boost, others get penalties
    if (t === task) {
      traitBase *= 1.3 + Math.random() * 0.4;
    } else {
      traitBase *= 0.4 + Math.random() * 0.5;
    }
    
    // Per-trait variance (can swing ±30%)
    const traitVariance = 1 + gaussianRandom() * 0.15;
    let score = Math.round(traitBase * traitVariance);
    
    // Clamp and allow some truly bad results
    score = Math.max(5, Math.min(100, score));
    benchmarks[t] = score;
    total += score;
  }
  
  const overallScore = Math.round(total / tasks.length);
  return { benchmarks, overallScore };
}

export function calculateDecay(tick: number, createdAt: number): number {
  const ticksAlive = tick - createdAt;
  return Math.max(0, 1 - ticksAlive / MAX_MODEL_LIFE);
}

export function calculateRevenue(overallScore: number, decayFactor: number): number {
  // Exponential revenue: bad models barely pay, great models print money
  // score 20 → ~$40/tick, score 50 → ~$2.5k/tick, score 80 → ~$65k/tick, score 100 → ~$1M/tick
  const exponentialBase = Math.pow(overallScore / 10, 3.2);
  return Math.round(exponentialBase * 100 * decayFactor);
}

export function completeTraining(job: TrainingJob, tick: number): Model {
  const { benchmarks, overallScore } = calculateBenchmarks(
    job.type,
    job.task,
    job.engineersAllocated,
    job.computeAllocated
  );
  return {
    id: crypto.randomUUID(),
    name: generateModelName(job.type),
    type: job.type,
    task: job.task,
    benchmarks,
    overallScore,
    createdAt: tick,
  };
}

export function processTick(state: GameState): GameState {
  let { money, activeModels, trainingJob, tick, hasWon } = state;
  tick += 1;

  if (trainingJob && tick >= trainingJob.startTick + trainingJob.duration) {
    const newModel = completeTraining(trainingJob, tick);
    activeModels = [...activeModels, newModel];
    if (newModel.overallScore >= 100) {
      hasWon = true;
    }
    trainingJob = null;
  }

  let tickRevenue = 0;
  activeModels = activeModels.filter((model) => {
    const decay = calculateDecay(tick, model.createdAt);
    if (decay <= 0) return false;
    tickRevenue += calculateRevenue(model.overallScore, decay);
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

