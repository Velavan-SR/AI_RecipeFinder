import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import SearchBar from '../components/SearchBar';
import RecipeUpload from '../components/RecipeUpload';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSurpriseMe = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/recipes/random');
      navigate(`/recipe/${response.data._id}`);
    } catch (error) {
      console.error('Failed to get random recipe:', error);
      alert('No recipes found. Please add some recipes first!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={() => navigate('/my-recipes')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            aria-label="My Recipe Box"
          >
            <span className="text-xl">❤️</span>
            <span className="font-semibold">My Recipes ({favorites.length})</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all transform hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4 animate-fadeIn">
            Recipe <span className="text-primary">Vibe</span> Finder
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Search recipes by mood, not just ingredients. Find the perfect dish for how you're feeling right now.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Surprise Me Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSurpriseMe}
            disabled={loading}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-primary text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-primary/50"
            aria-label="Get a random recipe"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Finding a surprise...
              </>
            ) : (
              <>
                <span className="text-2xl">🎲</span>
                Surprise Me!
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-2">Get a random recipe from your collection</p>
        </div>

        {/* Meal Planner Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/meal-planner')}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-secondary to-primary text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-secondary/50"
            aria-label="Plan a 3-course meal"
          >
            <span className="text-2xl">🍽️</span>
            Plan a 3-Course Meal
          </button>
          <p className="text-sm text-gray-500 mt-2">Let AI create a perfectly balanced dinner</p>
        </div>

        {/* Toggle Upload */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="text-primary hover:text-primary/80 font-semibold underline"
          >
            {showUpload ? 'Hide Upload' : 'Add Your Own Recipe'}
          </button>
        </div>

        {/* Upload Section */}
        {showUpload && (
          <div className="mb-12 animate-fadeIn">
            <RecipeUpload />
          </div>
        )}

        {/* Features */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-16">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Vibe-Based Search</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Describe your mood and we'll find recipes that match your emotional craving
            </p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">AI-Powered Matching</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Our AI understands flavor profiles and emotional contexts to find your perfect match
            </p>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 sm:col-span-2 md:col-span-1">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Your Recipe Collection</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Add recipes from URLs or PDFs and build your personalized vibe library
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
