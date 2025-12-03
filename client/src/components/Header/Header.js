import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>🍽️ Munch</h1>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Главная</Link>
          <Link to="/recipes" className={styles.navLink}>Все рецепты</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;