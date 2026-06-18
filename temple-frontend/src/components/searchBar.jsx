import { useState } from 'react';

export default function SearchBar({ onSearchSubmit }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDeity, setSelectedDeity] = useState(''); 

  const statesList = [
    'Uttarakhand',
    'Tamil Nadu',
    'Odisha',
    'Uttar Pradesh',
    'Maharashtra',
    'Karnataka',
    'Gujarat'
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit({
        query: searchTerm,
        state: selectedState,
        deity: selectedDeity,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form 
        onSubmit={handleFormSubmit} 
        className="flex items-center bg-[#fffcf8] border border-[#f5ebe0] rounded-full p-2 pl-5 pr-2 shadow-sm"
      >
        {/* Left Section: Search Input with Magnifying Glass Icon */}
        <div className="flex items-center flex-1 gap-3 min-w-0">
          <svg 
            className="w-5 h-5 text-[#8c7a6b] shrink-0" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search temples by name, deity, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-[#5c4d42] placeholder-[#a69688] text-base focus:outline-none py-1 min-w-0"
          />
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-1px bg-[#e6d8cb] mx-3 hidden sm:block"></div>

        {/* Middle Section: Location Icon + Dropdown */}
        <div className="flex items-center gap-2 pr-2 hidden sm:flex">
          <svg 
            className="w-5 h-5 text-[#8c7a6b] shrink-0" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="appearance-none bg-transparent text-[#736254] text-base font-medium pr-7 py-1 focus:outline-none cursor-pointer"
            >
              <option value="">All States</option>
              {statesList.map((stateItem) => (
                <option key={stateItem} value={stateItem}>
                  {stateItem}
                </option>
              ))}
            </select>
            {/* Custom Arrow Icon */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-[#736254]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Section: Action Submit Button */}
        <button
          type="submit"
          className="bg-[#c15c1d] hover:bg-[#a84d15] text-white text-base font-semibold px-7 py-2.5 rounded-full shadow-sm transition-colors duration-200 ml-2"
        >
          Search
        </button>
      </form>
    </div>
  );
}