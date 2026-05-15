import { useCards } from '../../hooks/useCards';
import Header from '../../components/Header/Header';
import styles from './style.module.css';

export default function CardsList() {
  const { counts, total } = useCards();

  return (
    <div className='home-page'>
      <Header total={total} />
      <main className={styles.page}>
        <ul className={styles.items}>
          {counts.map((count, i) => (
            <li key={i} className={styles.item}>
              <span className={styles.number}>#{i + 1}</span>
              <span className={styles.divider}>—</span>
              <span className={styles.count}>{count}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
