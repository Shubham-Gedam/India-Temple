import { useState, useEffect } from 'react';
import SearchBar from '../components/searchBar';
import TempleCard from '../components/TempleCart'; 
import { TEMPLE_API as API } from '../apis/axios';

export default function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTradition, setSelectedTradition] = useState('All');
  const traditions = ['All', 'Chola', 'Vaishnava', 'Shaiva', 'Jain', 'Buddhist'];
  const popularTags = ['Shiva', 'Vishnu', 'Shakti', 'Tamil Nadu', 'Rajasthan', 'Kerala'];

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

  const handleSearchExecution = async ({ query, state, deity }) => {
    try {
      setLoading(true);
      setError('');
      if (query && query.trim() !== '') {
        const response = await API.get(`/search?q=${encodeURIComponent(query)}`);
        let filtered = response.data?.temples || [];

        if (state) filtered = filtered.filter(t => t.location?.state === state);
        if (deity) filtered = filtered.filter(t => t.deity === deity);
        
        setTemples(filtered);
      } else {
        let urlPath = '/?';
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
    <div className="bg-[#FAF6F0] min-h-screen pb-24 font-sans antialiased">
      
      {/* 1. Hero / Header Section with Subtle Image Layer Overlay */}
      <div 
        className="relative bg-cover bg-center text-white pt-24 pb-20 px-4 text-center shadow-inner"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(120, 53, 4, 0.85), rgba(43, 20, 4, 0.92)), url('https://images.unsplash.com/photo-1621869606578-1561708a7e09?q=80&w=1107&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold tracking-wide drop-shadow-sm">
            Explore Sacred Temples
          </h1>
          <p className="mt-4 text-xs md:text-sm text-orange-200/90 max-w-xl mx-auto tracking-wide font-light">
            Discover ancient shrines, divine stories, and spiritual heritage across India.
          </p>
          
          {/* Search Bar Wrapper */}
          <div className="mt-8 max-w-3xl mx-auto">
            <SearchBar onSearchSubmit={handleSearchExecution} />
          </div>

          {/* Quick Popular Keywords Links matching design */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-orange-100/80">
            <span className="font-medium opacity-60">Popular:</span>
            {popularTags.map((tag) => (
              <button 
                key={tag} 
                className="hover:text-white hover:underline transition underline-offset-4 cursor-pointer bg-white/10 px-2.5 py-0.5 rounded-full border border-white/5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Horizontal Filter Navigation Layer */}
      <div className="bg-white border-b border-stone-200/80 shadow-xs sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Tradition Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-2 shrink-0">Tradition:</span>
            {traditions.map((tradition) => (
              <button
                key={tradition}
                onClick={() => setSelectedTradition(tradition)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                  selectedTradition === tradition
                    ? 'bg-[#C26D38] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tradition}
              </button>
            ))}
          </div>

          {/* Result Stats Counter & Sorting controls */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 text-xs text-stone-500">
            <span className="font-medium text-stone-600">
              <strong className="text-stone-800 font-semibold">{temples.length}</strong> temples found
            </span>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-stone-800">
              <span>⇅ Sort: Relevance</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Temples Content Grid Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#C26D38] rounded-xs"></div>
            <h2 className="text-xl font-serif font-bold text-stone-800">Featured Temples</h2>
          </div>
          <button className="text-xs font-semibold text-[#C26D38] hover:underline cursor-pointer">
            View all →
          </button>
        </div>

        {/* Loading Spinner View */}
        {loading && (
          <div className="text-center py-24">
            <div className="w-12 h-12 border-4 border-[#C26D38] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-500 font-medium text-sm">Accessing temple records...</p>
          </div>
        )}

        {/* Network Error Messaging */}
        {error && !loading && (
          <div className="bg-orange-50/50 border border-orange-200 text-stone-700 p-6 rounded-2xl text-center max-w-xl mx-auto shadow-xs">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loaded Results Rendering Layer */}
        {!loading && !error && (
          <>
            {temples.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl py-20 text-center text-stone-400 max-w-md mx-auto shadow-sm">
                <span className="text-5xl block mb-4">🛕</span>
                <h3 className="font-bold text-stone-700 text-lg">No Architecture Records Found</h3>
                <p className="text-xs px-8 mt-2 text-stone-400 leading-relaxed">
                  We couldn't locate temples fitting these filters. Try clearing search keywords.
                </p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {temples.map((temple) => (
                    <TempleCard
                      key={temple._id || temple.id}
                      slug={temple.slug || temple._id}
                      name={temple.name}
                      location={temple.location}
                      deity={temple.deity}
                      images={temple.images}
                    />
                  ))}
                </div>

                {/* Load More Action Button */}
                <div className="mt-16 text-center">
                  <button className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs px-6 py-3 border border-stone-200 rounded-full shadow-xs transition hover:shadow-sm cursor-pointer">
                    <span>➕</span> Load more temples
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}