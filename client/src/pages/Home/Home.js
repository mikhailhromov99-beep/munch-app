import React from 'react';
import { Link } from 'react-router-dom';
import { useRecipe } from '../../contexts/RecipeContext';
import styles from './Home.module.css';

const Home = () => {
  const { recipes } = useRecipe();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Добро пожаловать в Munch!</h1>
        <p className={styles.heroSubtitle}>Найдите идеальный рецепт для любого случая</p>
        <Link to="/recipes" className={styles.ctaButton}>
          Смотреть все рецепты
        </Link>
      </section>

      <section className={styles.featured}>
        <h2>Популярные рецепты</h2>
        <div className={styles.recipesGrid}>
          {recipes.slice(0, 3).map(recipe => (
            <div key={recipe.id} className={styles.recipeCard}>
              {recipe.image && (
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className={styles.recipeImage}
                />
              )}
              <h3>{recipe.name}</h3>
              <p>⏱️ {recipe.cooking_time} мин • {recipe.difficulty}</p>
              <Link to={`/recipe/${recipe.id}`} className={styles.recipeLink}>
                Смотреть рецепт →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;