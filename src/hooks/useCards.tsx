import { useEffect, useRef, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';
import type { Cards } from '../types';

const TOTAL = 48;
const DB_PATH = 'cards';

function initCards(): Cards {
  return Array<number>(TOTAL).fill(0);
}

function clamp(val: string | number): number {
  const n = parseInt(String(val), 10);
  return isNaN(n) || n < 0 ? 0 : n;
}

export function useCards() {
  const [counts, setCounts] = useState<Cards>(initCards);
  const [inputVals, setInputVals] = useState<string[]>(() =>
    Array<string>(TOTAL).fill('0'),
  );
  const editing = useRef<boolean[]>(Array<boolean>(TOTAL).fill(false));
  const dbRef = useRef(ref(db, DB_PATH));

  // Subscribe
  useEffect(() => {
    const unsub = onValue(dbRef.current, snap => {
      const data = snap.val() as number[] | null;
      if (!data) return;

      setCounts(prev => {
        const next = [...prev];
        for (let i = 0; i < TOTAL; i++) {
          if (!editing.current[i]) next[i] = data[i] ?? 0;
        }
        return next;
      });

      setInputVals(prev => {
        const next = [...prev];
        for (let i = 0; i < TOTAL; i++) {
          if (!editing.current[i]) next[i] = String(data[i] ?? 0);
        }
        return next;
      });
    });
    return unsub;
  }, []);

  const writeAll = (next: Cards) => set(dbRef.current, next);

  const increment = (i: number) => {
    const next = [...counts];
    next[i] = counts[i] + 1;
    setCounts(next);
    setInputVals(iv => {
      const n = [...iv];
      n[i] = String(next[i]);
      return n;
    });
    writeAll(next);
  };

  const decrement = (i: number) => {
    const next = [...counts];
    next[i] = Math.max(0, counts[i] - 1);
    setCounts(next);
    setInputVals(iv => {
      const n = [...iv];
      n[i] = String(next[i]);
      return n;
    });
    writeAll(next);
  };

  const onInputChange = (i: number, raw: string) => {
    const filtered = raw.replace(/[^0-9]/g, '');
    setInputVals(iv => {
      const n = [...iv];
      n[i] = filtered;
      return n;
    });
  };

  const onInputFocus = (i: number) => {
    editing.current[i] = true;
  };

  const onInputBlur = (i: number) => {
    editing.current[i] = false;
    const val = clamp(inputVals[i]);
    const next = [...counts];
    next[i] = val;
    setCounts(next);
    setInputVals(iv => {
      const n = [...iv];
      n[i] = String(val);
      return n;
    });
    writeAll(next);
  };

  const onInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    i: number,
  ) => {
    if (e.key === 'Enter') e.currentTarget.blur();
  };

  const total = counts.reduce((a, b) => a + b, 0);

  return {
    counts,
    inputVals,
    total,
    increment,
    decrement,
    onInputChange,
    onInputFocus,
    onInputBlur,
    onInputKeyDown,
  };
}
