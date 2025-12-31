import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MealPlanner() {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mood.trim()) {
      setError('Please enter a mood or vibe for your meal');
      return;
    }

    setLoading(true);
    setError('');
    setMealPlan(null);

    try {
      const response = await axios.post('/api/recipes/meal-planner', { mood });
      setMealPlan(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerateMeal({ preventDefault: () => {} } as React.FormEvent);
  };

  const exampleMoods = [
    'Cozy winter evening at home',
    'Romantic date night',
    'Energizing Sunday brunch',
    'Comfort food after a long day',
    'Light and refreshing summer meal'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            🍽️ AI Meal Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us your mood, and we'll create a perfectly balanced 3-course meal for you
          </p>
        </div>

        {/* Mood Input Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8">
          <form onSubmit={handleGenerateMeal}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                What's the vibe for your meal?
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g., Cozy winter evening at home"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Example Moods */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Try these:</p>
              <div className="flex flex-wrap gap-2">
                {exampleMoods.map((example, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMood(example)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Your Meal...' : 'Generate Meal Plan'}
            </button>

            {error && (
              <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
            )}
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
            <p className="text-gray-600 text-lg">Crafting your perfect meal...</p>
            <p className="text-gray-500 text-sm mt-2">Analyzing flavors and balancing courses</p>
          </div>
        )}

        {/* Meal Plan Results */}
        {mealPlan && !loading && (
          <div className="space-y-6">
            {/* Cohesion Explanation */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                ✨ Why This Meal Works
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">{mealPlan.explanation}</p>
              
              <div className="mt-4 flex items-center gap-4">
                <span className="text-sm text-gray-600">Mood: <span className="font-semibold">{mealPlan.moodQuery}</span></span>
                <button
                  onClick={handleRegenerate}
                  className="ml-auto px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-semibold"
                >
                  🔄 Regenerate
                </button>
              </div>
            </div>

            {/* 3-Course Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Appetizer */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-3">
                  <h3 className="text-xl font-bold">🥗 Appetizer</h3>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{mealPlan.appetizer.title}</h4>
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">Vibe Match:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${mealPlan.appetizer.vibeMatch}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{mealPlan.appetizer.vibeMatch}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{mealPlan.appetizer.flavorProfile}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mealPlan.appetizer.vibeTags.slice(0, 3).map((tag: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/recipe/${mealPlan.appetizer._id}`)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                  >
                    View Recipe
                  </button>
                </div>
              </div>

              {/* Main Course */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-3">
                  <h3 className="text-xl font-bold">🍖 Main Course</h3>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{mealPlan.main.title}</h4>
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">Vibe Match:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${mealPlan.main.vibeMatch}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{mealPlan.main.vibeMatch}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{mealPlan.main.flavorProfile}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mealPlan.main.vibeTags.slice(0, 3).map((tag: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/recipe/${mealPlan.main._id}`)}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold"
                  >
                    View Recipe
                  </button>
                </div>
              </div>

              {/* Dessert */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-3">
                  <h3 className="text-xl font-bold">🍰 Dessert</h3>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{mealPlan.dessert.title}</h4>
                  <div className="mb-3">
                    <span className="text-sm text-gray-500">Vibe Match:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full"
                          style={{ width: `${mealPlan.dessert.vibeMatch}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{mealPlan.dessert.vibeMatch}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{mealPlan.dessert.flavorProfile}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mealPlan.dessert.vibeTags.slice(0, 3).map((tag: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate(`/recipe/${mealPlan.dessert._id}`)}
                    className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-semibold"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>

            {/* Shopping List */}
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🛒 Combined Shopping List
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(mealPlan.shoppingList).map(([category, items]: [string, any]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-700 mb-3 text-lg border-b pb-2">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                          <span className="text-primary mt-1">•</span>
                          <span className="capitalize">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
