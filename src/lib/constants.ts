import type { ModelType } from './types';

export const INITIAL_MONEY = 500_000;
export const INITIAL_ENGINEERS = 3;
export const INITIAL_COMPUTE = 100;
export const INITIAL_OFFICE_TIER = 1;

export const HIRE_BASE_COST = 75_000;
export const HIRE_SCALE_FACTOR = 1.03;
export const COMPUTE_BASE_COST = 50_000;
export const COMPUTE_AMOUNT = 100;
export const COMPUTE_SCALE_FACTOR = 1.12;

export function getHireCost(currentEngineers: number): number {
  return Math.round(HIRE_BASE_COST * Math.pow(HIRE_SCALE_FACTOR, currentEngineers));
}

export function getComputeCost(currentCompute: number): number {
  const purchases = Math.floor((currentCompute - INITIAL_COMPUTE) / COMPUTE_AMOUNT);
  return Math.round(COMPUTE_BASE_COST * Math.pow(COMPUTE_SCALE_FACTOR, purchases));
}

export const OFFICE_UPGRADES: Record<number, { cost: number; maxEngineers: number }> = {
  1: { cost: 0, maxEngineers: 5 },
  2: { cost: 250_000, maxEngineers: 10 },
  3: { cost: 1_000_000, maxEngineers: 25 },
  4: { cost: 5_000_000, maxEngineers: 50 },
  5: { cost: 20_000_000, maxEngineers: 100 },
  6: { cost: 100_000_000, maxEngineers: 200 },
};

export const TRAINING_BASE_DURATION = 20;
export const TRAINING_COMPUTE_FACTOR = 0.05;

export function getTrainingDuration(compute: number): number {
  return Math.round(TRAINING_BASE_DURATION + Math.sqrt(compute) * TRAINING_COMPUTE_FACTOR * 10);
}

export const MAX_MODEL_LIFE = 400;
export const REVENUE_MULTIPLIER = 500;

export const MODEL_TASKS: Record<ModelType, string[]> = {
  language: ['coding', 'writing', 'reasoning', 'translation'],
  image: ['artistic', 'photorealistic', 'logos', 'editing'],
  video: ['short-form', 'cinematic', 'animation'],
};

export const MODEL_PREFIXES = [
  'Ultra', 'Mega', 'Super', 'Hyper', 'Neo', 'Quantum', 'Prime', 'Max', 'Pro', 'Elite'
];

export const MODEL_SUFFIXES: Record<ModelType, string[]> = {
  language: ['GPT', 'LLM', 'Mind', 'Brain', 'Think', 'Claude', 'Sage'],
  image: ['Diffuse', 'Pixel', 'Vision', 'Art', 'Canvas', 'Dream'],
  video: ['Motion', 'Reel', 'Clip', 'Frame', 'Cinema', 'Flux'],
};

