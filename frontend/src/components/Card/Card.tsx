import styles from './Card.module.css';

type Props = {
  id: string;
  value: number;
  onChange: (id: string, value: number) => void;
};

export default function Card({ id, value, onChange }: Props) {
  const handleMinus = () => {
    if (value <= 0) return;

    onChange(id, value - 1);
  };

  const handlePlus = () => {
    onChange(id, value + 1);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value < 0 || Number.isNaN(value)) {
      onChange(id, 0);
      return;
    }

    onChange(id, Math.floor(value));
  };

  return (
    <div className={styles.card}>
      <div className={styles.number}>Card #{id}</div>

      <div className={styles.count}>{value}</div>

      <div className={styles.controls}>
        <button className={styles.button} onClick={handleMinus}>
          -1
        </button>

        <input
          className={styles.input}
          type='number'
          min='0'
          value={value}
          onChange={handleInput}
        />

        <button className={styles.button} onClick={handlePlus}>
          +1
        </button>
      </div>
    </div>
  );
}
