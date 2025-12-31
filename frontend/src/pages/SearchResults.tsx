import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import { useNavigate } from 'react-router-dom';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ minVibeMatch: 0, tags: [] as string[] });

  useEffect(() => {
    if (query) {
      searchRecipes(query);
    }
  }, [query]);

  useEffect(() => {
    applyFilters();
  }, [filters, results]);

  const applyFilters = () => {
    let filtered = results.filter(recipe => recipe.vibeMatch >= filters.minVibeMatch);
    
    if (filters.tags.length > 0) {
      filtered = filtered.filter(recipe =>
        filters.tags.some(tag => 
          recipe.vibeTags.some((recipeTag: string) => 
            recipeTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }
    
    setFilteredResults(filtered);
  };

  const searchRecipes = async (searchQuery: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/api/recipes/search', { query: searchQuery });
      setResults(response.data.results);
      setFilteredResults(response.data.results);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleFilterChange = (newFilters: { minVibeMatch: number; tags: string[] }) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            Recipe <span className="text-primary">Vibe</span> Finder
          </h1>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all transform hover:scale-110"
            aria-label="Toggle dark mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <SearchBar onSearch={handleNewSearch} />
        </div>

        {/* Query Display */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Searching for: <span className="text-primary italic break-words">"{query}"</span>
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Finding your vibe matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* Filters */}
            {results.length > 0 && (
              <SearchFilters onFilterChange={handleFilterChange} />
            )}

            <div className="mb-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Showing {filteredResults.length} of {results.length} vibe matches
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredResults.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
            
            {results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
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

            {filteredResults.length === 0 && results.length > 0 && (
              <div className="text-center py-12">
                <p className="text-lg sm:text-xl text-gray-600">
                  No recipes match your filters. Try adjusting them!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
