import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TempleCard from '../components/TempleCart';
import SearchBar from '../components/searchBar';
import { TEMPLE_API as API } from "../apis/axios"; // App ka Axios instance

export default function Home() {
  const [featuredTemples, setFeaturedTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeTemples = async () => {
      try {
        setLoading(true);
        const response = await API.get('/'); // Aapka backend GET all route
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
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Welcome Hero Grid Layout */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-center py-16 px-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          India Temple Heritage Portal
        </h1>
        <p className="mt-4 text-lg max-w-2xl mx-auto text-orange-50">
          Discover comprehensive timelines, accurate darshan timings, historical context, and rules for thousands of divine sites.
        </p>
      </div>

      {/* Floating Search Bar container positioned slightly over the hero */}
      <div className="-mt-12 px-4">
        <SearchBar onSearchSubmit={handleSearch} />
      </div>

      {/* Main Grid Wrapper for Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">
          Featured Pilgrimage Sites
        </h2>
        
        {/* Loading State Handler */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm animate-pulse">
            Synchronizing dynamic cultural data...
          </div>
        ) : featuredTemples.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm border border-dashed rounded-xl bg-white">
            No temples available in the database ledger. Open Admin Panel to inject logs.
          </div>
        ) : (
          /* Responsive Grid Setup using Real Live Database Data */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTemples.map((temple) => {
              // Location mapping validation format safely extracted from schema array/object structures
              const city = temple.location?.city || temple.city || "Unknown City";
              const state = temple.location?.state || temple.state || "Unknown State";
              
              // Image safe fallback configuration
              const displayImage = temple.images?.[0]?.url || temple.image || "https://images.unsplash.com/photo-1600100397608-f010e42fa02e";

              return (
                <TempleCard 
                  key={temple._id || temple.id}
                  id={temple._id || temple.id} 
                  name={temple.name}
                  location={`${city}, ${state}`}
                  deity={temple.deity}
                  image={displayImage}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}