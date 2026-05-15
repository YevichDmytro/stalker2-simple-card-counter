import { useEffect, useState, useRef } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const TOTAL_CARDS = 48;

function clamp(val) {
  const n = parseInt(val, 10);
  if (isNaN(n) || n < 0) return 0;
  return n;
}

export default function HomePage() {
  const navigate = useNavigate();
  const logout = () => {
    sessionStorage.removeItem('authed');
    navigate('/auth');
  };
  const [counts, setCounts] = useState(() => Array(TOTAL_CARDS).fill(0));
  const [inputVals, setInputVals] = useState(() =>
    Array(TOTAL_CARDS).fill('0'),
  );
  // Track which inputs are being locally edited to avoid overwriting mid-type
  const editing = useRef(Array(TOTAL_CARDS).fill(false));
  const dbRef = useRef(ref(db, 'cards'));

  // Subscribe to Firebase
  useEffect(() => {
    const unsub = onValue(dbRef.current, snap => {
      const data = snap.val();
      if (!data) return;
      setCounts(prev => {
        const next = [...prev];
        for (let i = 0; i < TOTAL_CARDS; i++) {
          const v = data[i] ?? 0;
          if (!editing.current[i]) next[i] = v;
        }
        return next;
      });
      setInputVals(prev => {
        const next = [...prev];
        for (let i = 0; i < TOTAL_CARDS; i++) {
          if (!editing.current[i]) next[i] = String(data[i] ?? 0);
        }
        return next;
      });
    });
    return unsub;
  }, []);

  const writeToDB = (index, value) => {
    const safeVal = clamp(value);
    const payload = Array.from({ length: TOTAL_CARDS }, (_, i) =>
      i === index ? safeVal : counts[i],
    );
    set(dbRef.current, payload);
  };

  const handleIncrement = i => {
    const next = counts[i] + 1;
    const arr = [...counts];
    arr[i] = next;
    setCounts(arr);
    const iv = [...inputVals];
    iv[i] = String(next);
    setInputVals(iv);
    set(dbRef.current, arr);
  };

  const handleDecrement = i => {
    const next = Math.max(0, counts[i] - 1);
    const arr = [...counts];
    arr[i] = next;
    setCounts(arr);
    const iv = [...inputVals];
    iv[i] = String(next);
    setInputVals(iv);
    set(dbRef.current, arr);
  };

  const handleInputChange = (i, raw) => {
    // Allow only digits (no spaces, no minus)
    const filtered = raw.replace(/[^0-9]/g, '');
    const iv = [...inputVals];
    iv[i] = filtered;
    setInputVals(iv);
  };

  const handleInputFocus = i => {
    editing.current[i] = true;
  };

  const handleInputBlur = i => {
    editing.current[i] = false;
    const val = clamp(inputVals[i]);
    const arr = [...counts];
    arr[i] = val;
    setCounts(arr);
    const iv = [...inputVals];
    iv[i] = String(val);
    setInputVals(iv);
    set(dbRef.current, arr);
  };

  const handleInputKeyDown = (e, i) => {
    if (e.key === 'Enter') e.target.blur();
  };

  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div className='home-page'>
      <header className='home-header'>
        <div className='home-header-left'>
          <span className='home-title'>card counter</span>
          <span className='home-total'>всього: {total}</span>
        </div>
        <div className='home-header-right'>
          <button className='logout-btn' onClick={logout}>
            вийти
          </button>
        </div>
      </header>

      <main className='cards-grid'>
        {Array.from({ length: TOTAL_CARDS }, (_, i) => (
          <div key={i} className='card'>
            <span className='card-number'>{i + 1}</span>
            <div className='card-controls'>
              <button
                className='card-btn card-btn--dec'
                onClick={() => handleDecrement(i)}
                aria-label={`зменшити ${i + 1}`}
              >
                −
              </button>
              <input
                className='card-input'
                type='text'
                inputMode='numeric'
                pattern='[0-9]*'
                value={inputVals[i]}
                onChange={e => handleInputChange(i, e.target.value)}
                onFocus={() => handleInputFocus(i)}
                onBlur={() => handleInputBlur(i)}
                onKeyDown={e => handleInputKeyDown(e, i)}
                aria-label={`кількість карток ${i + 1}`}
              />
              <button
                className='card-btn card-btn--inc'
                onClick={() => handleIncrement(i)}
                aria-label={`збільшити ${i + 1}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
