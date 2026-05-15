import { useAuth } from '../context/AuthContext';
import { useCards } from '../hooks/useCards';
import Card from '../components/Card';

const TOTAL = 48;

export default function HomePage() {
  const { user, logout } = useAuth();
  const {
    inputVals,
    total,
    increment,
    decrement,
    onInputChange,
    onInputFocus,
    onInputBlur,
    onInputKeyDown,
  } = useCards();

  return (
    <div className='home-page'>
      <header className='home-header'>
        <div className='home-header-left'>
          <span className='home-title'>card counter</span>
          <span className='home-total'>всього: {total}</span>
        </div>
        <div className='home-header-right'>
          <span className='home-user'>{user?.email}</span>
          <button className='logout-btn' onClick={() => void logout()}>
            вийти
          </button>
        </div>
      </header>

      <main className='cards-grid'>
        {Array.from({ length: TOTAL }, (_, i) => (
          <Card
            key={i}
            index={i}
            inputVal={inputVals[i]}
            onIncrement={() => increment(i)}
            onDecrement={() => decrement(i)}
            onInputChange={val => onInputChange(i, val)}
            onInputFocus={() => onInputFocus(i)}
            onInputBlur={() => onInputBlur(i)}
            onInputKeyDown={e => onInputKeyDown(e, i)}
          />
        ))}
      </main>
    </div>
  );
}
