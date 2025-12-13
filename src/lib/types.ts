export type ModelType = 'language' | 'image' | 'video';

export interface Model {
  id: string;
  name: string;
  type: ModelType;
  task: string;
  score: number;
  createdAt: number;
  revenuePerTick: number;
}

export interface TrainingJob {
  type: ModelType;
  task: string;
  engineersAllocated: number;
  computeAllocated: number;
  startTick: number;
  duration: number;
}

export interface GameState {
  money: number;
  engineers: number;
  officeTier: number;
  gpus: number;
  activeModels: Model[];
  trainingJob: TrainingJob | null;
  tick: number;
  hasWon: boolean;
  gameStarted: boolean;
}

