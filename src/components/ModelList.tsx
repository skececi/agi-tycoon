import type { Model } from '../lib/types';
import { ModelCard } from './ModelCard';

interface ModelListProps {
  models: Model[];
  tick: number;
}

export function ModelList({ models, tick }: ModelListProps) {
  if (models.length === 0) {
    return (
      <div className="panel model-list empty">
        <h2>Active Models</h2>
        <p className="empty-message">No models deployed yet. Train a model!</p>
      </div>
    );
  }

  return (
    <div className="panel model-list">
      <h2>Active Models ({models.length})</h2>
      <div className="models-grid">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} tick={tick} />
        ))}
      </div>
    </div>
  );
}

