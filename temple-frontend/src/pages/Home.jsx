import TempleCard from '../components/TempleCart';
import SearchBar from '../components/searchBar';

export default function Home() {
  // Simulated database data matching your core backend requirements
  const sampleTemples = [
    {
      id: "1",
      name: "Kedarnath Temple",
      location: "Rudraprayag, Uttarakhand",
      deity: "Shiva",
      image: "https://images.unsplash.com/photo-1626621427131-69795d28b122?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "2",
      name: "Meenakshi Amman Temple",
      location: "Madurai, Tamil Nadu",
      deity: "Parvati / Meenakshi",
      image: "https://images.unsplash.com/photo-1581430872221-d10103763f0d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "3",
      name: "Konark Sun Temple",
      location: "Puri, Odisha",
      deity: "Surya",
      image: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const handleSearch = (searchData) => {
    console.log("User searched for:", searchData);
    // Later, you will map this function to trigger your Axios backend api call!
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
        
        {/* Responsive Grid Setup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTemples.map((temple) => (
            <TempleCard 
              key={temple.id}
              id={temple.id}
              name={temple.name}
              location={temple.location}
              deity={temple.deity}
              image={temple.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}