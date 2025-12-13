import { OFFICE_UPGRADES, HIRE_COST, COMPUTE_AMOUNT, getComputeCost } from '../lib/constants';

interface OfficeProps {
  engineers: number;
  officeTier: number;
  gpus: number;
  money: number;
  onHire: () => void;
  onUpgrade: () => void;
  onBuyCompute: () => void;
}

export function Office({
  engineers,
  officeTier,
  gpus,
  money,
  onHire,
  onUpgrade,
  onBuyCompute,
}: OfficeProps) {
  const maxEngineers = OFFICE_UPGRADES[officeTier].maxEngineers;
  const nextTier = officeTier < 5 ? officeTier + 1 : null;
  const upgradeCost = nextTier ? OFFICE_UPGRADES[nextTier].cost : 0;
  const computeCost = getComputeCost(gpus);

  const canHire = money >= HIRE_COST && engineers < maxEngineers;
  const canUpgrade = nextTier && money >= upgradeCost;
  const canBuyCompute = money >= computeCost;

  return (
    <div className="panel office">
      <h2>Office (Tier {officeTier})</h2>
      
      <div className="engineer-grid">
        {Array.from({ length: maxEngineers }).map((_, i) => (
          <div
            key={i}
            className={`engineer-slot ${i < engineers ? 'filled' : 'empty'}`}
          />
        ))}
      </div>

      <div className="office-stats">
        <p>Engineers: {engineers}/{maxEngineers}</p>
        <p>GPUs: {gpus}</p>
      </div>

      <div className="office-actions">
        <button onClick={onHire} disabled={!canHire} className="btn">
          Hire Engineer (${HIRE_COST.toLocaleString()})
        </button>
        
        {nextTier && (
          <button onClick={onUpgrade} disabled={!canUpgrade} className="btn">
            Upgrade Office (${upgradeCost.toLocaleString()})
          </button>
        )}
        
        <button onClick={onBuyCompute} disabled={!canBuyCompute} className="btn">
          +{COMPUTE_AMOUNT} GPUs (${computeCost.toLocaleString()})
        </button>
      </div>
    </div>
  );
}

