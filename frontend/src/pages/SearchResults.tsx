import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      searchRecipes(query);
    }
  }, [query]);

  const searchRecipes = async (searchQuery: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/recipes/search', { query: searchQuery });
      setResults(response.data.results);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Recipe <span className="text-primary">Vibe</span> Finder
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleNewSearch} />
        </div>

        {/* Query Display */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">
            Searching for: <span className="text-primary italic">"{query}"</span>
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Finding your vibe matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-gray-600">
              Found {results.length} vibe matches
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
            
            {results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">
                  No recipes found. Try adding some recipes first!
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Go Home
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
