const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRecipe } from '../../contexts/RecipeContext';
import styles from './RecipeDetail.module.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const { favorites, toggleFavorite } = useRecipe();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`${API_URL}/api/recipes/${id}`);
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Загружаем рецепт...</div>;
  }

  if (!recipe) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Рецепт не найден</h2>
          <Link to="/recipes" className={styles.backLink}>← Вернуться к рецептам</Link>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(recipe.id);

  return (
    <div className={styles.container}>
      <Link to="/recipes" className={styles.backLink}>← Все рецепты</Link>
      
      <div className={styles.recipeHeader}>
        <h1>{recipe.name}</h1>
        <button 
          className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
          onClick={() => toggleFavorite(recipe.id)}
        >
          {isFavorite ? '❤️ В избранном' : '🤍 Добавить в избранное'}
        </button>
      </div>

      <div className={styles.recipeMeta}>
        <span>⏱️ {recipe.cooking_time} минут</span>
        <span>📊 Сложность: {recipe.difficulty}</span>
        <span>📁 {recipe.category}</span>
      </div>

      <div className={styles.tags}>
        {recipe.tags.map(tag => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>

      {/* Блок с изображением */}
      {recipe.image && (
        <div className={styles.recipeImageContainer}>
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className={styles.recipeImage}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.ingredients}>
          <h2>Ингредиенты</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className={styles.ingredientName}>{ingredient.name}</span>
                <span className={styles.ingredientAmount}>{ingredient.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.instructions}>
          <h2>Приготовление</h2>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;