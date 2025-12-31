import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import axios from 'axios';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubstitute, setShowSubstitute] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [substitute, setSubstitute] = useState<any>(null);
  const [substituteLoading, setSubstituteLoading] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleFindSubstitute = async (ingredient: string) => {
    setSelectedIngredient(ingredient);
    setSubstituteLoading(true);
    setSubstitute(null);
    setShowSubstitute(true);

    try {
      const response = await axios.post(`/api/recipes/${id}/substitute`, { ingredient });
      setSubstitute(response.data);
    } catch (err: any) {
      setSubstitute({ error: 'Failed to find substitute. Make sure you have similar recipes in the database!' });
    } finally {
      setSubstituteLoading(false);
    }
  };

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const formatInstructions = (instructions: string) => {
    // Check if instructions are numbered or have steps
    const lines = instructions.split('\n').filter(line => line.trim());
    
    // Check if already numbered
    const hasNumbers = lines.some(line => /^\d+\./.test(line.trim()));
    
    if (hasNumbers) {
      return lines.map((line, idx) => ({
        step: idx + 1,
        text: line.replace(/^\d+\.\s*/, '').trim()
      }));
    }
    
    // Split by common sentence endings for better step separation
    const sentences = instructions.match(/[^.!?]+[.!?]+/g) || [instructions];
    return sentences.map((sentence, idx) => ({
      step: idx + 1,
      text: sentence.trim()
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Recipe not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 sm:py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            aria-label="Go back"
          >
            ← Back
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => recipe && toggleFavorite(recipe)}
              className="text-3xl transition-all transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={recipe && isFavorite(recipe._id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {recipe && isFavorite(recipe._id) ? '❤️' : '🤍'}
            </button>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all transform hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Recipe Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 mb-4 sm:mb-6 animate-fadeIn">
          {/* Image Placeholder */}
          <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-accent/30 dark:from-primary/10 dark:to-accent/20 rounded-lg mb-4 sm:mb-6 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 sm:w-20 h-16 sm:h-20 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Recipe Image</p>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">{recipe.title}</h1>
          
          {/* Vibe Tags */}
          <div className="mb-4">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Vibe Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.vibeTags?.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-gray-800 rounded-full text-sm sm:text-base font-medium border border-primary/30"
                >
                  {tag}
                </span>
              )) || <span className="text-gray-500 italic">No vibe tags available</span>}
            </div>
          </div>

          {/* Flavor Profile */}
          {recipe.flavorProfile && (
            <div className="bg-primary/5 border-l-4 border-primary p-3 sm:p-4 rounded mb-4">
              <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">🎨 Flavor Profile</h3>
              <p className="text-gray-700 text-sm sm:text-base">{recipe.flavorProfile}</p>
            </div>
          )}

          {/* Match Explanation (if came from search) */}
          {recipe.matchExplanation && (
            <div className="bg-accent/10 border-l-4 border-accent p-3 sm:p-4 rounded mb-4">
              <h3 className="font-bold text-gray-800 mb-2 text-sm sm:text-base">✨ Why This Match?</h3>
              <p className="text-gray-700 italic text-sm sm:text-base">{recipe.matchExplanation}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 pt-4 border-t">
            <span>📅 Added {new Date(recipe.createdAt).toLocaleDateString()}</span>
            {recipe.source && recipe.source !== 'PDF Upload' && (
              <a 
                href={recipe.source} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline flex items-center gap-1"
              >
                🔗 View Source
              </a>
            )}
            {recipe.source === 'PDF Upload' && <span>📄 PDF Upload</span>}
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2 flex-wrap">
            <span>🥘 Ingredients</span>
            <span className="text-sm font-normal text-gray-500">
              ({checkedIngredients.size}/{recipe.ingredients?.length || 0} checked)
            </span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">💡 Hover over an ingredient to find substitutes</p>
          
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: string, idx: number) => (
                <li 
                  key={idx} 
                  className="flex items-start justify-between group p-2 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start flex-1">
                    <input 
                      type="checkbox" 
                      checked={checkedIngredients.has(idx)}
                      onChange={() => toggleIngredient(idx)}
                      className="mt-1 mr-3 w-4 h-4 text-primary focus:ring-primary cursor-pointer flex-shrink-0" 
                    />
                    <span className={`text-gray-700 text-sm sm:text-base ${checkedIngredients.has(idx) ? 'line-through' : ''}`}>
                      {ingredient}
                    </span>
                  </div>
                  <button
                    onClick={() => handleFindSubstitute(ingredient)}
                    className="ml-4 px-3 py-1 text-sm text-primary opacity-0 group-hover:opacity-100 hover:bg-primary/10 rounded transition-all whitespace-nowrap"
                  >
                    Find Substitute
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No ingredients listed</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            📝 Instructions
          </h2>
          
          {recipe.instructions ? (
            <div className="space-y-4 sm:space-y-6">
              {formatInstructions(recipe.instructions).map((step, idx) => (
                <div key={idx} className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm sm:text-base">
                    {step.step}
                  </div>
                  <p className="text-gray-700 flex-1 pt-1 text-sm sm:text-base">{step.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No instructions available</p>
          )}
        </div>
      </div>

      {/* Substitute Modal */}
      {showSubstitute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-w-md w-full relative">
            <button
              onClick={() => {
                setShowSubstitute(false);
                setSubstitute(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Find Substitute
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Missing ingredient:</p>
              <p className="text-base font-semibold text-gray-700">{selectedIngredient}</p>
            </div>

            {substituteLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-500">Searching similar recipes...</p>
              </div>
            ) : substitute ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-lg font-bold text-primary">{substitute.substitute}</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        substitute.confidence === 'high'
                          ? 'bg-green-100 text-green-700'
                          : substitute.confidence === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {substitute.confidence} confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{substitute.reason}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-700 mb-2">💡 Why this substitute?</p>
                  <p className="text-sm text-gray-600">{substitute.explanation || substitute.reason}</p>
                </div>

                <button
                  onClick={() => {
                    setShowSubstitute(false);
                    setSubstitute(null);
                  }}
                  className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Got it!
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No substitute found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}