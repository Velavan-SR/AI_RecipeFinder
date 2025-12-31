import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';

export default function MyRecipeBox() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-4 inline-flex items-center gap-2"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white mb-2">
              ❤️ My Recipe Box
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Your favorite recipes, all in one place
            </p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start exploring recipes and save your favorites here
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Explore Recipes
            </button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Favorites</p>
                  <p className="text-3xl font-bold text-primary">{favorites.length}</p>
                </div>
                <div className="text-5xl">📚</div>
              </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white flex-1 mr-2">
                        {recipe.title}
                      </h3>
                      <button
                        onClick={() => removeFavorite(recipe._id)}
                        className="text-red-500 hover:text-red-600 text-2xl transition-all transform hover:scale-125"
                        aria-label="Remove from favorites"
                      >
                        ❤️
                      </button>
                    </div>

                    {recipe.flavorProfile && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {recipe.flavorProfile}
                      </p>
                    )}

                    {recipe.vibeTags && recipe.vibeTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {recipe.vibeTags.slice(0, 3).map((tag: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/recipe/${recipe._id}`)}
                      className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
