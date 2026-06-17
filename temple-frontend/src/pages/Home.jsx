import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TempleCard from '../components/TempleCart'; 
import SearchBar from '../components/searchBar';  
import { TEMPLE_API as API } from "../apis/axios";

export default function Home() {
  const [featuredTemples, setFeaturedTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeTemples = async () => {
      try {
        setLoading(true);
        const response = await API.get('/'); 
        const data = response.data?.temples || response.data || [];
        setFeaturedTemples(data.slice(0, 3)); 
      } catch (err) {
        console.error("Error fetching live database records for home:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeTemples();
  }, []);

  const handleSearch = (searchData) => {
    console.log("User searched for:", searchData);
    navigate('/temples');
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen pb-16 font-sans selection:bg-amber-700 selection:text-white">
      
      {/* 1. Immersive Hero Section with Image Overlay */}
      <div 
        className="relative bg-cover bg-center text-white py-24 px-4 sm:px-6 lg:px-8 text-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.55)), url('https://images.unsplash.com/photo-1631102006950-64c80c08681e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGJlc3QlMjB0ZW1wbGUlMjBpbWdlc3xlbnwwfHwwfHx8MA%3D%3D')` }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-serif font-medium tracking-wide text-white drop-shadow-md max-w-2xl mx-auto leading-tight">
            Discover the Sacred Geography of Bharat
          </h1>
          <p className="mt-4 text-sm sm:text-base max-w-xl mx-auto text-stone-200 font-light leading-relaxed">
            Timings, rituals, history, and visitor guides for thousands of divine sites across India — all in one place.
          </p>
          
          {/* Centered Floating Search Wrapper */}
          <div className="mt-8 max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-lg">
            <SearchBar onSearchSubmit={handleSearch} />
          </div>
        </div>
      </div>

      {/* 2. Copper Live Metrics Banner */}
      <div className="bg-[#8E4426] text-[#F3E9DC] py-4 border-b border-[#723218]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/10">
          <div>
            <div className="text-xl font-bold tracking-tight">4,200+</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-300 font-medium">Temples Listed</div>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">28</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-300 font-medium">States Covered</div>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">1.2M+</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-300 font-medium">Monthly Devotees</div>
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight">800+</div>
            <div className="text-[10px] uppercase tracking-wider text-stone-300 font-medium">Heritage Records</div>
          </div>
        </div>
      </div>

      {/* 3. Main Featured Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E4426]">Handpicked For You</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-800 mt-0.5">
              Featured Pilgrimage Sites
            </h2>
          </div>
          <button 
            onClick={() => navigate('/temples')}
            className="text-xs font-semibold text-[#8E4426] hover:text-[#723218] flex items-center gap-1 transition-all group"
          >
            View All Temples <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-stone-100 p-4 space-y-4 animate-pulse">
                <div className="bg-stone-200 h-48 w-full rounded-lg"></div>
                <div className="h-4 bg-stone-200 rounded w-2/3"></div>
                <div className="h-3 bg-stone-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : featuredTemples.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm border border-dashed border-stone-200 rounded-xl bg-white/50">
            No temples available in the database ledger. Open Admin Panel to inject logs.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTemples.map((temple) => {
              const city = temple.location?.city || temple.city || "Unknown City";
              const state = temple.location?.state || temple.state || "Unknown State";
              const displayImage = temple.images?.[0]?.url || temple.image || "https://images.unsplash.com/photo-1600100397608-f010e42fa02e";

              return (
                <div key={temple._id || temple.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <TempleCard 
                    id={temple._id || temple.id} 
                    name={temple.name}
                    location={`${city}, ${state}`}
                    deity={temple.deity}
                    image={displayImage}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Categorized Explorer Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="mb-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E4426]">Browse</span>
          <h2 className="text-2xl font-serif font-semibold text-stone-800 mt-0.5">Explore by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Shiva Temples', count: '1,240 sites', icon: '📿' },
            { label: 'Vishnu Temples', count: '980 sites', icon: '🔱' },
            { label: 'Devi Temples', count: '780 sites', icon: '🌸' },
            { label: 'Jyotirlinga Sites', count: '12 sites', icon: '☀️' },
            { label: 'Hilltop Shrines', count: '340 sites', icon: '🏔️' },
            { label: 'UNESCO Heritage', count: '18 sites', icon: '🏛️' }
          ].map((cat, i) => (
            <div key={i} className="bg-white border border-stone-200/60 p-5 rounded-xl text-center shadow-sm hover:border-amber-600/40 cursor-pointer transition-colors">
              <div className="text-2xl mb-2 opacity-80">{cat.icon}</div>
              <h3 className="text-xs font-bold text-stone-700 tracking-tight">{cat.label}</h3>
              <p className="text-[10px] text-stone-400 mt-0.5">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Missing Submissions Contributor Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div 
          className="relative bg-cover bg-center rounded-2xl overflow-hidden p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md"
          style={{ backgroundImage: `linear-gradient(rgba(114, 50, 24, 0.85), rgba(114, 50, 24, 0.9)), url('https://images.unsplash.com/photo-1600100397608-f010e42fa02e')` }}
        >
          <div className="text-center sm:text-left max-w-xl">
            <h3 className="text-xl sm:text-2xl font-serif font-medium">Know a Temple We're Missing?</h3>
            <p className="text-xs text-stone-200/90 mt-2 leading-relaxed">
              Help us grow the archive. Submit temple details, timings, and photos to preserve India's heritage.
            </p>
          </div>
          <button className="bg-[#D36135] hover:bg-[#bd522a] text-white text-xs font-bold px-6 py-3 rounded-lg shadow transition-colors whitespace-nowrap">
            Contribute a Temple
          </button>
        </div>
      </div>

    </div>
  );
}