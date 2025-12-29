import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RecipeUpload from '../components/RecipeUpload';

export default function Home() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            Recipe <span className="text-primary">Vibe</span> Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search recipes by mood, not just ingredients. Find the perfect dish for how you're feeling right now.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
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
          <div className="mb-12">
            <RecipeUpload />
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold mb-2">Vibe-Based Search</h3>
            <p className="text-gray-600">
              Describe your mood and we'll find recipes that match your emotional craving
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600">
              Our AI understands flavor profiles and emotional contexts to find your perfect match
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Your Recipe Collection</h3>
            <p className="text-gray-600">
              Add recipes from URLs or PDFs and build your personalized vibe library
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
