import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: {
    _id: string;
    title: string;
    vibeTags: string[];
    flavorProfile: string;
    vibeMatch: number;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/recipe/${recipe._id}`)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer p-6 border-2 border-transparent hover:border-primary"
    >
      {/* Vibe Match Score */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{recipe.title}</h3>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold text-primary">{recipe.vibeMatch}%</span>
          <span className="text-xs text-gray-500">Vibe Match</span>
        </div>
      </div>

      {/* Vibe Match Visual Indicator */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
          style={{ width: `${recipe.vibeMatch}%` }}
        />
      </div>

      {/* Vibe Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {recipe.vibeTags.slice(0, 3).map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-accent/30 text-gray-700 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
        {recipe.vibeTags.length > 3 && (
          <span className="px-3 py-1 text-gray-500 text-sm">
            +{recipe.vibeTags.length - 3} more
          </span>
        )}
      </div>

      {/* Flavor Profile */}
      <p className="text-gray-600 text-sm line-clamp-2">{recipe.flavorProfile}</p>
    </div>
  );
}
