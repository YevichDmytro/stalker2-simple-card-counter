import type { KeyboardEvent } from 'react';

interface CardProps {
  index: number;
  inputVal: string;
  onIncrement: () => void;
  onDecrement: () => void;
  onInputChange: (val: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export default function Card({
  index,
  inputVal,
  onIncrement,
  onDecrement,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onInputKeyDown,
}: CardProps) {
  return (
    <div className='card'>
      <div className='card-count-wrapper'>
        <span className='card-count'>{inputVal}</span>
      </div>
      <div className='card-number-wrapper'>
        <span className='card-number'>{index + 1}</span>
      </div>
      <div className='card-controls'>
        <button
          className='card-btn card-btn--dec'
          onClick={onDecrement}
          aria-label={`decrease ${index + 1}`}
        >
          -
        </button>
        <input
          className='card-input'
          type='text'
          inputMode='numeric'
          pattern='[0-9]*'
          value={inputVal}
          onChange={e => onInputChange(e.target.value)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onKeyDown={onInputKeyDown}
          aria-label={`count of cards ${index + 1}`}
        />
        <button
          className='card-btn card-btn--inc'
          onClick={onIncrement}
          aria-label={`increase ${index + 1}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
