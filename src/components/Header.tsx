import { tickToDate } from '../lib/dateUtils';

interface HeaderProps {
  money: number;
  tick: number;
}

export function Header({ money, tick }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="title">AGI TYCOON</h1>
      <div className="stats">
        <div className="stat money">
          <span className="label">$</span>
          <span className="value">{money.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="value date">{tickToDate(tick)}</span>
        </div>
      </div>
    </header>
  );
}

