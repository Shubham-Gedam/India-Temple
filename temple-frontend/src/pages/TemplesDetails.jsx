import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../apis/axios';

export default function TempleDetails() {
  const { id } = useParams(); // Grabs the temple ID right from the URL bar
  
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('history'); // Controls current active panel

  useEffect(() => {
    const fetchSingleTemple = async () => {
      try {
        setLoading(true);
        // Hits your specific backend endpoint: GET /api/temples/:id
        const response = await API.get(`/temples/${id}`);
        setTemple(response.data);
      } catch (err) {
        console.error('Error fetching temple detailed records:', err);
        setError('Could not retrieve details for this specific heritage site.');
      } finally {
        setLoading(false);
      }
    };

    fetchSingleTemple();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-24 min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-slate-500 text-sm">Loading historical archives and guidelines...</p>
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="max-w-xl mx-auto my-16 p-6 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
        <span className="text-4xl">⚠️</span>
        <h3 className="font-bold text-slate-800 text-lg mt-3">Details Unavailable</h3>
        <p className="text-sm text-slate-500 mt-1">{error || 'Temple records not found.'}</p>
        <Link to="/temples" className="inline-block mt-5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
          Back to Explorations
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link to="/temples" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
          ← Back to All Temples
        </Link>
      </div>

      {/* Main Container Layout */}
      <div className="max-w-5xl mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Core Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <img 
              src={temple.image || 'https://images.unsplash.com/photo-1600100397608-f010e42fa02e?auto=format&fit=crop&w=600&q=80'} 
              alt={temple.name} 
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-md">
                {temple.deity}
              </span>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-3">
                {temple.name}
              </h1>
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-1">
                <span>📍</span> {temple.location}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Detailed Content Workspace */}
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            
            {/* Tab Links Row Bar */}
            <div className="flex border-b border-slate-200 bg-slate-50/50">
              {['history', 'rituals', 'guidelines'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-orange-600 text-orange-600 bg-white' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Workspace Panel Display */}
            <div className="p-6 md:p-8">
              
              {/* Panel 1: Historical Profile View */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">Historical Significance & Heritage</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {temple.history || 'Historical validation details are pending review by our research administrators for this archaeological site.'}
                  </p>
                </div>
              )}

              {/* Panel 2: Timings & Daily Rituals Schedules */}
              {activeTab === 'rituals' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">🕒 Darshan Timing Window</h3>
                    <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-xl text-amber-900 text-sm font-medium">
                      {temple.darshanTimings || 'General Timings: 6:00 AM to 9:00 PM (Subject to change during regional festival timelines)'}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">📅 Daily Rituals & Festival Frameworks</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                      {temple.festivals || 'Major annual pooja protocols and traditional calendars will be compiled by the board.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Panel 3: Rules & Visitor Codes */}
              {activeTab === 'guidelines' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-800">📜 Pilgrimage Entry Regulations</h3>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {temple.visitorGuidelines || 'Please wear conservative traditional attire. Photography and mobile devices might be restricted inside the main sanctum structures.'}
                  </p>
                  
                  <div className="mt-6 border-t pt-4 text-xs text-slate-400 flex items-center gap-1.5">
                    <span>💡</span> Near facilities like transportation grids and safe lodging counters are available within walking radius distances.
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}