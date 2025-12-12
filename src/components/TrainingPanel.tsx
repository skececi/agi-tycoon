import { useState } from 'react';
import type { ModelType, TrainingJob } from '../lib/types';
import { MODEL_TASKS, getTrainingDuration } from '../lib/constants';
import { getTrainingProgress } from '../lib/gameLogic';

interface TrainingPanelProps {
  engineers: number;
  computeUnits: number;
  trainingJob: TrainingJob | null;
  tick: number;
  onStartTraining: (type: ModelType, task: string, engineers: number, compute: number) => void;
}

export function TrainingPanel({
  engineers,
  computeUnits,
  trainingJob,
  tick,
  onStartTraining,
}: TrainingPanelProps) {
  const [modelType, setModelType] = useState<ModelType>('language');
  const [task, setTask] = useState(MODEL_TASKS['language'][0]);
  const [allocEngineers, setAllocEngineers] = useState(1);
  const [allocCompute, setAllocCompute] = useState(5);

  const handleTypeChange = (type: ModelType) => {
    setModelType(type);
    setTask(MODEL_TASKS[type][0]);
  };

  const handleTrain = () => {
    onStartTraining(modelType, task, allocEngineers, allocCompute);
  };

  const isTraining = trainingJob !== null;
  const progress = isTraining ? getTrainingProgress({ trainingJob, tick } as any) : 0;

  return (
    <div className="panel training">
      <h2>Train New Model</h2>

      {isTraining ? (
        <div className="training-progress">
          <p>Training {trainingJob.type} model...</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <p>{Math.round(progress * 100)}%</p>
        </div>
      ) : (
        <>
          <div className="form-group">
            <label>Type</label>
            <select
              value={modelType}
              onChange={(e) => handleTypeChange(e.target.value as ModelType)}
            >
              <option value="language">Language</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="form-group">
            <label>Task</label>
            <select value={task} onChange={(e) => setTask(e.target.value)}>
              {MODEL_TASKS[modelType].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Engineers ({allocEngineers}/{engineers})</label>
            <input
              type="range"
              min={1}
              max={engineers}
              value={allocEngineers}
              onChange={(e) => setAllocEngineers(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Compute ({allocCompute}/{computeUnits})</label>
            <input
              type="range"
              min={1}
              max={computeUnits}
              value={allocCompute}
              onChange={(e) => setAllocCompute(Number(e.target.value))}
            />
          </div>

          <div className="training-estimate">
            Est. Training Time: <span>{getTrainingDuration(allocCompute)} days</span>
          </div>

          <button onClick={handleTrain} className="btn primary">
            Start Training
          </button>
        </>
      )}
    </div>
  );
}

