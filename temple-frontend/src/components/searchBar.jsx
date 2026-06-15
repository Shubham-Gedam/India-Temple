import  { useState } from 'react';

export default function SearchBar({ onSearchSubmit }) {
  // 1. Set up simple state values for our search criteria
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDeity, setSelectedDeity] = useState('');

  // 2. Mock list arrays for your dropdown choices matching India's heritage
  const statesList = [
    'Uttarakhand',
    'Tamil Nadu',
    'Odisha',
    'Uttar Pradesh',
    'Maharashtra',
    'Karnataka',
    'Gujarat'
  ];

  const deitiesList = ['Shiva', 'Vishnu', 'Devi / Parvati', 'Surya', 'Ganesha', 'Krishna'];

  // 3. Handle what happens when a user clicks the "Search" button
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Stop page reload
    
    // Pass the typed and selected values back to the parent page (like Home or Temples)
    if (onSearchSubmit) {
      onSearchSubmit({
        query: searchTerm,
        state: selectedState,
        deity: selectedDeity,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-xl shadow-md border border-slate-100">
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        {/* Input 1: Text Search bar */}
        <div className="md:col-span-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Search Temple
          </label>
          <input
            type="text"
            placeholder="e.g., Kedarnath, Meenakshi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Input 2: State Filter Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select State
          </label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
          >
            <option value="">All States</option>
            {statesList.map((stateItem) => (
              <option key={stateItem} value={stateItem}>
                {stateItem}
              </option>
            ))}
          </select>
        </div>

        {/* Input 3: Deity Filter Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Primary Deity
          </label>
          <select
            value={selectedDeity}
            onChange={(e) => setSelectedDeity(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
          >
            <option value="">All Deities</option>
            {deitiesList.map((deityItem) => (
              <option key={deityItem} value={deityItem}>
                {deityItem}
              </option>
            ))}
          </select>
        </div>

        {/* Input 4: Action Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 h-[38px]"
          >
            🔍 Search
          </button>
        </div>

      </form>
    </div>
  );
}