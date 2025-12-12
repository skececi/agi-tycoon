import type { Model } from '../lib/types';
import { calculateDecay, calculateRevenue } from '../lib/gameLogic';

interface ModelCardProps {
  model: Model;
  tick: number;
}

export function ModelCard({ model, tick }: ModelCardProps) {
  const decay = calculateDecay(tick, model.createdAt);
  const revenue = calculateRevenue(model.score, decay);
  const decayPercent = Math.round(decay * 100);

  return (
    <div className={`model-card ${model.score >= 100 ? 'agi' : ''}`}>
      <div className="model-header">
        <span className="model-name">{model.name}</span>
        <span className="model-meta">{model.type}/{model.task}</span>
      </div>
      <div className="model-stats">
        <span className="score">Score: {model.score}</span>
        <span className="revenue">${revenue}/tick</span>
      </div>
      <div className="decay-bar">
        <div className="decay-fill" style={{ width: `${decayPercent}%` }} />
      </div>
      <span className="decay-label">Decay: {decayPercent}%</span>
    </div>
  );
}

