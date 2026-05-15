import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';
import styles from './style.module.css';

interface HeaderProps {
  total: number;
}

export default function Header({ total }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.title}>Card counter</span>
        <span className={styles.total}>Total: {total}</span>
      </div>
      <nav className={styles.nav}>
        <NavLink
          to='/'
          end
          className={({ isActive }) =>
            clsx(styles.navLink, { [styles.navLinkActive]: isActive })
          }
        >
          Cards
        </NavLink>
        <NavLink
          to='/list'
          className={({ isActive }) =>
            clsx(styles.navLink, { [styles.navLinkActive]: isActive })
          }
        >
          Cards list
        </NavLink>
      </nav>
      <div className={styles.right}>
        <span className={styles.user}>{user?.email}</span>
        <button className={styles.logoutBtn} onClick={() => void logout()}>
          Logout
        </button>
      </div>
    </header>
  );
}
