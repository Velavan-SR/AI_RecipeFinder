import { useState, useEffect } from 'react';

interface Recipe {
  _id: string;
  title: string;
  vibeTags?: string[];
  flavorProfile?: string;
  [key: string]: any;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('favoriteRecipes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const exists = prev.find(r => r._id === recipe._id);
      if (exists) {
        // Remove from favorites
        return prev.filter(r => r._id !== recipe._id);
      } else {
        // Add to favorites
        return [...prev, recipe];
      }
    });
  };

  const isFavorite = (recipeId: string) => {
    return favorites.some(r => r._id === recipeId);
  };

  const removeFavorite = (recipeId: string) => {
    setFavorites(prev => prev.filter(r => r._id !== recipeId));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    removeFavorite
  };
}
