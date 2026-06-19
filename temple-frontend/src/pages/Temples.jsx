import { useState, useEffect } from 'react';
import SearchBar from '../components/searchBar';
import TempleCard from '../components/TempleCart'; 
import { TEMPLE_API as API } from '../apis/axios';


 // Hardcoded Sidebar Lists matching DevaBhoomi mockup
  const statesList = ['All States', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Odisha'];
  const deitiesList = ['All Deities', 'Lord Shiva', 'Lord Vishnu', 'Goddess Devi', 'Lord Ganesha', 'Lord Murugan', 'Lord Brahma'];
  const archStyles = [
    { name: 'All Types', count: 4200 },
    { name: 'Dravidian', count: 1340 },
    { name: 'Nagara', count: 1850 },
    { name: 'Vesara', count: 650 },
    { name: 'Cave Temple', count: 210 },
    { name: 'Hilltop Shrine', count: 150 },
  ];

export default function Temples() {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State management for individual filter layers
  const [selectedState, setSelectedState] = useState('All States');
  const [selectedDeity, setSelectedDeity] = useState('All Deities');
  const [selectedArch, setSelectedArch] = useState('All Types');

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
      let urlPath = '/?';
      if (query && query.trim() !== '') {
        const response = await API.get(`/search?q=${encodeURIComponent(query)}`);
        let filtered = response.data?.temples || [];
        if (state) filtered = filtered.filter(t => t.location?.state === state);
        if (deity) filtered = filtered.filter(t => t.deity === deity);
        setTemples(filtered);
      } else {
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

  const resetAllFilters = () => {
    setSelectedState('All States');
    setSelectedDeity('All Deities');
    setSelectedArch('All Types');
    fetchInitialTemples();
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen pb-24 font-sans antialiased text-[#2B1404]">
      
      {/* 1. Header Overlay Hero Section */}
      <div 
        className="relative bg-cover bg-center text-white pt-25 pb-24 px-4 text-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(43, 20, 4, 0.75), rgba(43, 20, 4, 0.85)), url('https://images.unsplash.com/photo-1621869606578-1561708a7e09?q=80&w=1107&auto=format&fit=crop')` 
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block mb-2">DEVABHOOMI ARCHIVE</span> */}
          <h1 className="text-7xl md:text-5xl font-serif font-normal tracking-wide">
            Explore Sacred Temples
          </h1>
          <p className="mt-3 text-xs md:text-sm text-stone-300 max-w-xl mx-auto font-light leading-relaxed">
            Filter through regional states, deities, and architecture styles to find your pilgrimage.
          </p>
          
          {/* Central Searchbar container alignment */}
          <div className="mt-8 max-w-3xl mx-auto shadow-xl rounded-full">
            <SearchBar onSearchSubmit={handleSearchExecution} />
          </div>
        </div>
      </div>

      {/* 2. Primary Layout Framework Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* ================= SIDEBAR FILTERS PANEL ================= */}
          <div className="space-y-6 lg:sticky lg:top-6">
            
            {/* Filter by State Block */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-xs">
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-4">Filter by State</h3>
              <div className="space-y-1 max-h-64 overflow-y-auto pr-1 text-sm">
                {statesList.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedState(st)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedState === st 
                        ? 'bg-[#C26D38] text-white' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Deity Block */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-xs">
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-4">Filter by Deity</h3>
              <div className="space-y-1 text-sm">
                {deitiesList.map((dt) => (
                  <button
                    key={dt}
                    onClick={() => setSelectedDeity(dt)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition ${
                      selectedDeity === dt 
                        ? 'bg-[#C26D38]/10 text-[#C26D38]' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {dt}
                  </button>
                ))}
              </div>
            </div>

            {/* Architecture Architecture Block */}
            <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-xs">
              <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-4">Architecture</h3>
              <div className="space-y-1 text-xs">
                {archStyles.map((style) => (
                  <button
                    key={style.name}
                    onClick={() => setSelectedArch(style.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition ${
                      selectedArch === style.name 
                        ? 'text-[#C26D38] font-bold' 
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{style.name}</span>
                    <span className="bg-stone-100 text-stone-500 px-2 py-0.5 rounded-md text-[10px] font-mono border border-stone-200/40">
                      {style.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ================= MAIN RESULTS AREA ================= */}
          <div className="lg:col-span-3">
            
            {/* Top Toolbar Counters & Sorting options row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 mb-4">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Showing Results</span>
                <h2 className="text-2xl font-serif font-bold text-stone-800">
                  {loading ? '...' : `${temples.length || '4,200'} Temples Found`}
                </h2>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-[11px]">Sort By:</span>
                  <select className="bg-white border border-stone-200 rounded-lg px-3 py-1.5 font-medium focus:outline-hidden">
                    <option>Relevance</option>
                    <option>Popularity</option>
                    <option>Historical Era</option>
                  </select>
                </div>
                {/* View type toggle selectors mockup icons layout */}
                <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-1">
                  <button className="p-1 bg-stone-100 rounded text-stone-700"> window ⊞ </button>
                  <button className="p-1 text-stone-400 hover:text-stone-700"> list ⊟ </button>
                </div>
              </div>
            </div>

            {/* Active Rendered Badges Indicators */}
            <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Active:</span>
              <span className="bg-orange-50 text-[#C26D38] px-2.5 py-1 rounded-md font-medium border border-orange-100 flex items-center gap-1">
                {selectedState} <span className="opacity-60 cursor-pointer">×</span>
              </span>
              <span className="bg-orange-50 text-[#C26D38] px-2.5 py-1 rounded-md font-medium border border-orange-100 flex items-center gap-1">
                {selectedDeity} <span className="opacity-60 cursor-pointer">×</span>
              </span>
              <button 
                onClick={resetAllFilters} 
                className="text-[#C26D38] font-medium hover:underline text-[11px] ml-2"
              >
                Clear All
              </button>
            </div>

            {/* Network View/Response Handler Layout Elements */}
            {loading ? (
              <div className="text-center py-24">
                <div className="w-10 h-10 border-4 border-[#C26D38] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-500 text-xs tracking-wide">Syncing architecture archives...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50/60 border border-red-200 text-red-800 p-4 rounded-xl text-center text-xs max-w-md mx-auto">
                {error}
              </div>
            ) : (
              <div>
                {/* Cards Elements Layout Display Grid mapping mockups */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* Grid Item Footer Pagination System matching mockup layout exactly */}
                <div className="mt-16 flex items-center justify-center gap-1 text-xs">
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-500">‹</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#C26D38] text-white font-medium">1</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent hover:border-stone-200 bg-transparent hover:bg-white text-stone-600">2</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent hover:border-stone-200 bg-transparent hover:bg-white text-stone-600">3</button>
                  <span className="px-1 text-stone-400">...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent hover:border-stone-200 bg-transparent hover:bg-white text-stone-600">12</button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-500">›</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}