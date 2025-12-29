import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSubstitute, setShowSubstitute] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [substitute, setSubstitute] = useState<any>(null);
  const [substituteLoading, setSubstituteLoading] = useState(false);

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
      setSubstitute({ error: 'Failed to find substitute' });
    } finally {
      setSubstituteLoading(false);
    }
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-primary/80 font-semibold flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Recipe Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">{recipe.title}</h1>
          
          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.vibeTags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-4 py-2 bg-accent/30 text-gray-700 dark:text-gray-300 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Flavor Profile */}
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">Flavor Profile</h3>
            <p className="text-gray-700 dark:text-gray-300">{recipe.flavorProfile}</p>
          </div>

          {/* Source */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Source: <a href={recipe.source} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {recipe.source}
            </a>
          </p>
        </div>

        {/* Ingredients */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient: string, idx: number) => (
              <li key={idx} className="flex items-start justify-between group">
                <div className="flex items-start flex-1">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                </div>
                <button
                  onClick={() => handleFindSubstitute(ingredient)}
                  className="ml-4 px-3 py-1 text-sm text-primary opacity-0 group-hover:opacity-100 hover:bg-primary/10 rounded transition-all"
                >
                  Find Substitute
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Substitute Modal */}
        {showSubstitute && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold dark:text-white">Substitute Finder</h3>
                <button
                  onClick={() => setShowSubstitute(false)}
                  className="text-2xl hover:text-primary"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Missing: <strong>{selectedIngredient}</strong>
              </p>

              {substituteLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Finding alternatives...</p>
                </div>
              )}

              {substitute && !substitute.error && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-800 dark:text-green-300">
                      Use: {substitute.substitute}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      substitute.confidence === 'high' ? 'bg-green-200 text-green-800' :
                      substitute.confidence === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-orange-200 text-orange-800'
                    }`}>
                      {substitute.confidence} confidence
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{substitute.reason}</p>
                </div>
              )}

              {substitute?.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-300">
                  {substitute.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Instructions</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
