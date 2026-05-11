import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import Card from './components/Card/Card';
import styles from './App.module.css';

const socket = io('http://localhost:3000');

type Cards = Record<string, number>;

export default function App() {
  const [cards, setCards] = useState<Cards>({});

  useEffect(() => {
    const init = async () => {
      try {
        const response = await fetch('http://localhost:3000/cards');

        const data = await response.json();

        setCards(data);
      } catch (error) {
        console.error('Load cards error:', error);
      }
    };

    init();

    socket.on('cardsUpdated', (updatedCards: Cards) => {
      setCards(updatedCards);
    });

    return () => {
      socket.off('cardsUpdated');
    };
  }, []);

  const updateCard = async (id: string, value: number) => {
    setCards(prev => {
      const updated = {
        ...prev,
        [id]: value,
      };

      fetch('http://localhost:3000/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      }).catch(err => console.error('Save error:', err));

      return updated;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cards Counter</h1>

      <div className={styles.grid}>
        {Object.entries(cards).map(([id, value]) => (
          <Card key={id} id={id} value={value} onChange={updateCard} />
        ))}
      </div>
    </div>
  );
}
