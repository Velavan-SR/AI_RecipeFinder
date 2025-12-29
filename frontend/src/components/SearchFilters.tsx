import { useState } from 'react';

interface SearchFiltersProps {
  onFilterChange: (filters: { minVibeMatch: number; tags: string[] }) => void;
}

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [minVibeMatch, setMinVibeMatch] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const commonTags = [
    'Comfort Food',
    'Quick & Easy',
    'Healthy',
    'Nostalgic',
    'Energizing',
    'Cozy',
    'Celebration',
    'Savory',
    'Sweet',
    'Rainy Day'
  ];

  const handleMinVibeMatchChange = (value: number) => {
    setMinVibeMatch(value);
    onFilterChange({ minVibeMatch: value, tags: selectedTags });
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    onFilterChange({ minVibeMatch, tags: newTags });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Refine Your Search</h3>
      
      {/* Min Vibe Match Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Vibe Match: {minVibeMatch}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={minVibeMatch}
          onChange={(e) => handleMinVibeMatchChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Tag Filters */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {commonTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
