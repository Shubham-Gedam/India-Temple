import { useState, useEffect } from 'react';
import SearchBar from '../components/searchBar';
import TempleCard from '../components/TempleCart';
import { TEMPLE_API as API } from '../apis/axios';

export default function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initial render lifecycle check
  useEffect(() => {
    fetchInitialTemples();
  }, []);

  const fetchInitialTemples = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/');
      setTemples(response.data?.temples || []);
    } catch (err) {
      console.error(err);
      setError('Database connectivity layer failed. Please refresh portal logs.');
    } finally {
      setLoading(false);
    }
  };

  // Triggers automatically upon SearchBar submit click
  const handleSearchExecution = async ({ query, state, deity }) => {
    try {
      setLoading(true);
      setError('');

      // Scenario A: Agar user text dalta hai toh direct `/search?q=` chalega
      if (query.trim() !== '') {
        const response = await API.get(`/temples/search?q=${encodeURIComponent(query)}`);
        let filtered = response.data?.temples || [];
        
        // Filter dropdown parameters client side over the text results if present
        if (state) filtered = filtered.filter(t => t.location?.state === state);
        if (deity) filtered = filtered.filter(t => t.deity === deity);
        
        setTemples(filtered);
      } else {
        // Scenario B: Agar plain filters hain toh backend native query trigger params inject karega
        let urlPath = '/temples?';
        if (state) urlPath += `state=${encodeURIComponent(state)}&`;
        if (deity) urlPath += `deity=${encodeURIComponent(deity)}&`;
        
        const response = await API.get(urlPath);
        setTemples(response.data?.temples || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch filtered indices.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="bg-linear-to-r from-orange-700 to-amber-600 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore Sacred Temples</h1>
        <p className="mt-2 text-sm text-orange-100 max-w-xl mx-auto">
          Filter through regional states and primary deities to discover authentic architectural profiles.
        </p>
      </div>

      <div className="-mt-8 px-4 mb-10">
        <SearchBar onSearchSubmit={handleSearchExecution} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-500 text-sm">Searching pilgrimage records...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center max-w-xl mx-auto">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
              Search Results ({temples.length})
            </h2>

            {temples.length === 0 ? (
              <div className="bg-white border rounded-xl py-16 text-center text-slate-400 max-w-md mx-auto shadow-sm">
                <span className="text-4xl">🛕</span>
                <h3 className="font-bold text-slate-700 text-lg mt-3">No Temples Registered</h3>
                <p className="text-xs px-6 mt-1 text-slate-400">Try widening your search terms parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {temples.map((temple) => (
                  <TempleCard
                    key={temple._id}
                    slug={temple.slug}
                    name={temple.name}
                    location={temple.location}
                    deity={temple.deity}
                    images={temple.images}
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