import type { ModelType } from './types';

export const INITIAL_MONEY = 10000;
export const INITIAL_ENGINEERS = 2;
export const INITIAL_COMPUTE = 10;
export const INITIAL_OFFICE_TIER = 1;

export const HIRE_COST = 2000;
export const COMPUTE_COST = 3000;
export const COMPUTE_AMOUNT = 10;

export const OFFICE_UPGRADES: Record<number, { cost: number; maxEngineers: number }> = {
  1: { cost: 0, maxEngineers: 3 },
  2: { cost: 5000, maxEngineers: 5 },
  3: { cost: 15000, maxEngineers: 10 },
  4: { cost: 50000, maxEngineers: 20 },
  5: { cost: 150000, maxEngineers: 50 },
};

export const TRAINING_DURATION = 10;
export const MAX_MODEL_LIFE = 300;
export const REVENUE_MULTIPLIER = 2;

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

