import { useCards } from '../hooks/useCards';
import Card from '../components/Card';
import Header from '../components/Header/Header';

const TOTAL = 48;

export default function HomePage() {
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
      <Header total={total} />
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
