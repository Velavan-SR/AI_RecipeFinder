import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

interface RecipeCardProps {
  recipe: {
    _id: string;
    title: string;
    vibeTags: string[];
    flavorProfile: string;
    vibeMatch: number;
    matchExplanation?: string;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(recipe._id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe);
  };

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe._id}`)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-4 sm:p-6 border-2 border-transparent hover:border-primary transform hover:scale-105 animate-fadeIn group"
      role="article"
      aria-label={`Recipe: ${recipe.title}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/recipe/${recipe._id}`);
        }
      }}
    >
      {/* Vibe Match Score */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white line-clamp-2 flex-1">{recipe.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFavoriteClick}
            className="text-2xl transition-all transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary rounded"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? '❤️' : '🤍'}
          </button>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="text-xl sm:text-2xl font-bold text-primary">{recipe.vibeMatch}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Vibe Match</span>
          </div>
        </div>
      </div>

      {/* Vibe Match Visual Indicator */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 group-hover:animate-pulse"
          style={{ width: `${recipe.vibeMatch}%` }}
        />
      </div>

      {/* Vibe Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.vibeTags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            className="px-2 sm:px-3 py-1 bg-accent/30 dark:bg-accent/20 text-gray-700 dark:text-gray-200 rounded-full text-xs sm:text-sm font-medium"
          >
            {tag}
          </span>
        ))}
        {recipe.vibeTags.length > 3 && (
          <span className="px-2 sm:px-3 py-1 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            +{recipe.vibeTags.length - 3} more
          </span>
        )}
      </div>

      {/* Match Explanation */}
      {recipe.matchExplanation && (
        <div className="mb-3 p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border-l-2 border-primary">
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic">
            <span className="font-semibold text-primary">Why this match: </span>
            {recipe.matchExplanation}
          </p>
        </div>
      )}

      {/* Flavor Profile */}
      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2">{recipe.flavorProfile}</p>
    </div>
  );
}
