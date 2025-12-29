import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
          
          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.vibeTags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-4 py-2 bg-accent/30 text-gray-700 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Flavor Profile */}
          <div className="bg-primary/5 border-l-4 border-primary p-4 rounded mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Flavor Profile</h3>
            <p className="text-gray-700">{recipe.flavorProfile}</p>
          </div>

          {/* Source */}
          <p className="text-sm text-gray-500">
            Source: <a href={recipe.source} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              {recipe.source}
            </a>
          </p>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <input type="checkbox" className="mt-1 mr-3" />
                <span className="text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
