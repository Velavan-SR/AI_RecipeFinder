import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RecipeUpload from '../components/RecipeUpload';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Recipe <span className="text-primary">Vibe</span> Finder
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
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
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-primary text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Vibe-Based Search</h3>
            <p className="text-gray-600 text-sm">
              Describe your mood and we'll find recipes that match your emotional craving
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600 text-sm">
              Our AI understands flavor profiles and emotional contexts to find your perfect match
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Your Recipe Collection</h3>
            <p className="text-gray-600 text-sm">
              Add recipes from URLs or PDFs and build your personalized vibe library
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
