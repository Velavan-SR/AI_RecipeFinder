import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Add to search history
      const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      onSearch(query);
      setShowHistory(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const exampleQueries = [
    "Feeling nostalgic",
    "Need energy",
    "Comfort food",
    "Something spicy and exciting",
    "Cozy rainy day vibes",
    "Quick and healthy",
    "Celebration worthy",
    "Grandmother's cooking"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(searchHistory.length > 0)}
          onBlur={() => setTimeout(() => setShowHistory(false), 200)}
          placeholder="Describe your mood or craving..."
          className="w-full px-6 py-4 text-lg border-2 border-primary rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
        >
          Find Vibes
        </button>

        {/* Search History Dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-xl z-10 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
              <span className="text-sm font-semibold text-gray-600">Recent Searches</span>
              <button
                type="button"
                onClick={clearHistory}
                className="text-xs text-gray-500 hover:text-red-500"
              >
                Clear
              </button>
            </div>
            {searchHistory.map((historyQuery, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(historyQuery);
                  onSearch(historyQuery);
                }}
                className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors border-b border-gray-100 last:border-0 flex items-center gap-2"
              >
                <span className="text-gray-400">🕐</span>
                <span className="text-gray-700">{historyQuery}</span>
              </button>
            ))}
          </div>
        )}
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Try these mood queries:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleQueries.map((example, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(example);
                onSearch(example);
              }}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-full hover:border-primary hover:bg-primary/5 hover:shadow-md transition-all"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
