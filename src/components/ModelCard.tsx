import type { Model } from '../lib/types';
import { calculateDecay, calculateRevenue } from '../lib/gameLogic';

interface ModelCardProps {
  model: Model;
  tick: number;
}

function getScoreClass(score: number): string {
  if (score >= 90) return 'score-legendary';
  if (score >= 70) return 'score-great';
  if (score >= 50) return 'score-good';
  if (score >= 30) return 'score-mid';
  return 'score-bad';
}

function formatRevenue(revenue: number): string {
  if (revenue >= 1_000_000) return `$${(revenue / 1_000_000).toFixed(1)}M`;
  if (revenue >= 1_000) return `$${(revenue / 1_000).toFixed(1)}K`;
  return `$${revenue}`;
}

export function ModelCard({ model, tick }: ModelCardProps) {
  const decay = calculateDecay(tick, model.createdAt);
  const revenue = calculateRevenue(model.overallScore, decay);
  const decayPercent = Math.round(decay * 100);

  return (
    <div className={`model-card ${model.overallScore >= 100 ? 'agi' : ''}`}>
      <div className="model-header">
        <span className="model-name">{model.name}</span>
        <span className={`overall-score ${getScoreClass(model.overallScore)}`}>
          {model.overallScore}
        </span>
      </div>
      
      <div className="benchmarks">
        {Object.entries(model.benchmarks).map(([trait, score]) => (
          <div key={trait} className="benchmark-row">
            <span className={`benchmark-trait ${trait === model.task ? 'focused' : ''}`}>
              {trait}
            </span>
            <div className="benchmark-bar-container">
              <div 
                className={`benchmark-bar ${getScoreClass(score)}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`benchmark-score ${getScoreClass(score)}`}>{score}</span>
          </div>
        ))}
      </div>

      <div className="model-footer">
        <span className="revenue">{formatRevenue(revenue)}/tick</span>
        <div className="decay-mini">
          <div className="decay-fill" style={{ width: `${decayPercent}%` }} />
        </div>
      </div>
    </div>
  );
}

