interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="intro-overlay">
      <div className="intro-modal">
        <h1>AGI TYCOON</h1>
        <div className="intro-narrative">
          <p className="year">The year is 2015.</p>
          <p>You just started your AI research lab.</p>
          <p>The goal is to achieve <span className="highlight">AGI</span> — a model score of 100/100.</p>
          <p className="question">Can you build an AI model that can stand the test of time...?</p>
        </div>
        <button onClick={onStart} className="btn primary large">
          Begin Research
        </button>
      </div>
    </div>
  );
}

