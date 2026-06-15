import { useState, useEffect } from 'react';
import SearchBar from '../components/searchBar';
import TempleCard from '../components/TempleCart';
import API from '../apis/axios';

export default function Temples() {
  // 1. Set up state to store temples data from backend, loading status, and filter metrics
  const [temples, setTemples] = useState([]);
  const [filteredTemples, setFilteredTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. Fetch all temples from your backend API database on initial mount
  useEffect(() => {
    const fetchTemplesData = async () => {
      try {
        setLoading(true);
        // Replace '/temples' with your exact backend GET endpoint path if different
        const response = await API.get('/temples');
        
        // Handle cases where response might be an object wrapping the array
        const data = Array.isArray(response.data) ? response.data : response.data.temples || [];
        setTemples(data);
        setFilteredTemples(data); // Set initial display to show everything
      } catch (err) {
        console.error('Error fetching temple listings:', err);
        setError('Failed to fetch temple data from server. Please check connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplesData();
  }, []);

  // 3. This runs automatically whenever someone interacts with your SearchBar component
  const handleSearchFilter = ({ query, state, deity }) => {
    let outputList = [...temples];

    // Filter by search bar text input matches (Temple Name)
    if (query.trim() !== '') {
      outputList = outputList.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by State option selection matches
    if (state !== '') {
      outputList = outputList.filter((t) => t.location.toLowerCase().includes(state.toLowerCase()));
    }

    // Filter by Deity choice dropdown matches
    if (deity !== '') {
      outputList = outputList.filter((t) => t.deity.toLowerCase() === deity.toLowerCase());
    }

    setFilteredTemples(outputList);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Dynamic Filter Section Banner */}
      <div className="bg-gradient-to-r from-orange-700 to-amber-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Explore Sacred Temples of India
        </h1>
        <p className="mt-2 text-sm text-orange-100 max-w-xl mx-auto">
          Filter through regional states and primary deities to discover architectural profiles, daily pooja schedules, and guidelines.
        </p>
      </div>

      {/* Floating Interactive Search Controls Area */}
      <div className="-mt-8 px-4 mb-10">
        <SearchBar onSearchSubmit={handleSearchFilter} />
      </div>

      {/* Main Content Listings Display Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Loading Spinner Handler */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">Fetching pilgrimage records from database...</p>
          </div>
        )}

        {/* Error Callout Display Handler */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center max-w-xl mx-auto">
            <span>⚠️</span> <p className="mt-1 font-medium">{error}</p>
          </div>
        )}

        {/* Loaded Content and Fallback Handler */}
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
                All Available Matches ({filteredTemples.length})
              </h2>
            </div>

            {filteredTemples.length === 0 ? (
              // Empty search result boundary display state
              <div className="bg-white border rounded-xl py-16 text-center text-slate-400 max-w-md mx-auto shadow-sm">
                <span className="text-4xl">🛕</span>
                <h3 className="font-bold text-slate-700 text-lg mt-3">No Temples Found</h3>
                <p className="text-sm px-6 mt-1 text-slate-400">
                  Try widening your text search string boundaries or clearing selected dropdown menu items.
                </p>
              </div>
            ) : (
              // Rendering Active Filtered Cards
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemples.map((temple) => (
                  <TempleCard
                    key={temple._id || temple.id} // Supports both standard database formats
                    id={temple._id || temple.id}
                    name={temple.name}
                    location={temple.location}
                    deity={temple.deity}
                    image={temple.image}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}