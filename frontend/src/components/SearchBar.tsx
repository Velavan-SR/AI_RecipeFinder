import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const exampleQueries = [
    "Something my grandmother would make to cure a cold",
    "I'm stressed and want something crunchy but healthy",
    "Feeling nostalgic for summer",
    "Comfort food for a rainy day",
    "Need energy for a long day"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your mood or craving..."
          className="w-full px-6 py-4 text-lg border-2 border-primary rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors font-semibold"
        >
          Find Vibes
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Try:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleQueries.slice(0, 3).map((example, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(example)}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
