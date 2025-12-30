const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import React, { createContext, useState, useContext, useEffect } from 'react';

const RecipeContext = createContext();

export const useRecipe = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipe must be used within RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загружаем рецепты
  const fetchRecipes = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_URL}/api/recipes?${queryParams}`);
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем избранное из Local Storage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('munch_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    fetchRecipes();
  }, []);

  // Сохраняем избранное в Local Storage
  useEffect(() => {
    localStorage.setItem('munch_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => {
      if (prev.includes(recipeId)) {
        return prev.filter(id => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const value = {
    recipes,
    favorites,
    loading,
    fetchRecipes,
    toggleFavorite
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};