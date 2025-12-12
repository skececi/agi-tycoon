interface WinScreenProps {
  tick: number;
  money: number;
  modelCount: number;
  onReset: () => void;
}

export function WinScreen({ tick, money, modelCount, onReset }: WinScreenProps) {
  return (
    <div className="win-overlay">
      <div className="win-modal">
        <div className="confetti" />
        <h1>🎉 AGI ACHIEVED! 🎉</h1>
        <p className="win-subtitle">You've created artificial general intelligence!</p>
        
        <div className="win-stats">
          <div className="win-stat">
            <span className="win-stat-value">{tick}</span>
            <span className="win-stat-label">Ticks</span>
          </div>
          <div className="win-stat">
            <span className="win-stat-value">${money.toLocaleString()}</span>
            <span className="win-stat-label">Final Balance</span>
          </div>
          <div className="win-stat">
            <span className="win-stat-value">{modelCount}</span>
            <span className="win-stat-label">Models Trained</span>
          </div>
        </div>

        <button onClick={onReset} className="btn primary large">
          Play Again
        </button>
      </div>
    </div>
  );
}

