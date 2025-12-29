import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MealPlanner() {
  const navigate = useNavigate();
  const [vibe, setVibe] = useState('');
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [shoppingList, setShoppingList] = useState<any>(null);

  const handlePlan = async () => {
    if (!vibe.trim()) return;

    setLoading(true);
    setError('');
    setMealPlan(null);

    try {
      const response = await axios.post('/api/recipes/meal-planner', { vibe });
      setMealPlan(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleShoppingList = async () => {
    if (!mealPlan) return;

    try {
      const recipeIds = [
        mealPlan.appetizer._id,
        mealPlan.main._id,
        mealPlan.dessert._id
      ];
      
      const response = await axios.post('/api/recipes/shopping-list', { recipeIds });
      setShoppingList(response.data);
      setShowShoppingList(true);
    } catch (err) {
      console.error('Error generating shopping list:', err);
    }
  };

  const exampleVibes = [
    'Cozy family dinner',
    'Romantic evening',
    'Celebration feast',
    'Healthy and light',
    'Comfort food indulgence'
  ];

  return (
    <div className="min-h-screen py-12 px-4 dark:text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-primary hover:text-primary/80 font-semibold"
          >
            ← Back to Home
          </button>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Meal <span className="text-primary">Planner</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get AI-curated 3-course meals that share a vibe
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <label className="block text-lg font-semibold mb-4">
            What vibe are you going for?
          </label>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              placeholder="e.g., Cozy family dinner, Romantic evening..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onKeyPress={(e) => e.key === 'Enter' && handlePlan()}
            />
            <button
              onClick={handlePlan}
              disabled={loading || !vibe.trim()}
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Planning...' : 'Plan Meal'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Try:</span>
            {exampleVibes.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setVibe(example)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-primary/20 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            {error}
          </div>
        )}

        {/* Meal Plan Results */}
        {mealPlan && (
          <div className="space-y-6">
            {/* Explanation */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg p-6 border-l-4 border-primary">
              <h3 className="font-bold text-lg mb-2">Why these recipes work together:</h3>
              <p className="text-gray-700 dark:text-gray-300">{mealPlan.explanation}</p>
            </div>

            {/* Courses */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Appetizer */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="text-center mb-4">
                  <span className="text-4xl">🥗</span>
                  <h3 className="text-xl font-bold text-primary mt-2">Appetizer</h3>
                </div>
                <h4 className="font-bold text-lg mb-2">{mealPlan.appetizer.title}</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {mealPlan.appetizer.vibeTags.slice(0, 3).map((tag: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-accent/30 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/recipe/${mealPlan.appetizer._id}`)}
                  className="w-full mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  View Recipe
                </button>
              </div>

              {/* Main */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="text-center mb-4">
                  <span className="text-4xl">🍽️</span>
                  <h3 className="text-xl font-bold text-primary mt-2">Main Course</h3>
                </div>
                <h4 className="font-bold text-lg mb-2">{mealPlan.main.title}</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {mealPlan.main.vibeTags.slice(0, 3).map((tag: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-accent/30 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/recipe/${mealPlan.main._id}`)}
                  className="w-full mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  View Recipe
                </button>
              </div>

              {/* Dessert */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="text-center mb-4">
                  <span className="text-4xl">🍰</span>
                  <h3 className="text-xl font-bold text-primary mt-2">Dessert</h3>
                </div>
                <h4 className="font-bold text-lg mb-2">{mealPlan.dessert.title}</h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {mealPlan.dessert.vibeTags.slice(0, 3).map((tag: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 bg-accent/30 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/recipe/${mealPlan.dessert._id}`)}
                  className="w-full mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  View Recipe
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleShoppingList}
                className="px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors"
              >
                📋 Generate Shopping List
              </button>
              <button
                onClick={handlePlan}
                className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
              >
                🔄 Regenerate
              </button>
            </div>

            {/* Shopping List Modal */}
            {showShoppingList && shoppingList && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Shopping List</h3>
                    <button
                      onClick={() => setShowShoppingList(false)}
                      className="text-2xl hover:text-primary"
                    >
                      ×
                    </button>
                  </div>
                  
                  {Object.entries(shoppingList.categories).map(([category, items]: [string, any]) => (
                    <div key={category} className="mb-6">
                      <h4 className="font-bold text-lg text-primary mb-2">{category}</h4>
                      <ul className="space-y-1">
                        {items.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <input type="checkbox" className="mt-1 mr-2" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
