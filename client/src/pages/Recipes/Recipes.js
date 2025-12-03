import React from 'react';
import { Link } from 'react-router-dom';
import { useRecipe } from '../../contexts/RecipeContext';
import styles from './Recipes.module.css';

const Recipes = () => {
  const { recipes, loading } = useRecipe();

  if (loading) {
    return <div className={styles.loading}>Загружаем рецепты...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Все рецепты ({recipes.length})</h1>
      
      {recipes.length === 0 ? (
        <div className={styles.noRecipes}>
          <p>Рецепты не найдены</p>
        </div>
      ) : (
        <div className={styles.recipesGrid}>
          {recipes.map(recipe => (
            <div key={recipe.id} className={styles.recipeCard}>
              {recipe.image && (
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className={styles.recipeImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <h3>{recipe.name}</h3>
              <div className={styles.meta}>
                <span>⏱️ {recipe.cooking_time} мин</span>
                <span>📊 {recipe.difficulty}</span>
              </div>
              <div className={styles.tags}>
                {recipe.tags && recipe.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <Link to={`/recipe/${recipe.id}`} className={styles.recipeLink}>
                Смотреть рецепт →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;