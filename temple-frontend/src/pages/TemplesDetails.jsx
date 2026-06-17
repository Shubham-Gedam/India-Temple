import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TEMPLE_API as API } from "../apis/axios";

export default function TempleDetails() {
  const { id } = useParams(); 
  
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        if (!id || id === "undefined") {
          setError('Invalid routing parameter identity.');
          return;
        }

        const response = await API.get(`/${id}`);
        const templeData = response.data?.temple || response.data || null;
        setTemple(templeData);
      } catch (err) {
        console.error("Fetch failure:", err);
        setError('Heritage data profile trace missing inside backend servers.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf6f0]">
        <div className="w-10 h-10 border-4 border-[#b35c24]/20 border-t-[#b35c24] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-600">Retrieving Heritage Data...</p>
      </div>
    );
  }
  
  if (error || !temple) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-xl p-8 text-center shadow-sm">
          <p className="text-red-700 font-medium mb-4">{error || 'Data missing.'}</p>
          <Link to="/temples" className="inline-block bg-[#b35c24] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded hover:bg-[#944a1b] transition-colors">
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  const primaryImage = temple.images && temple.images.length > 0 ? temple.images[0].url : 'https://images.unsplash.com/photo-1600100397608-f010e42fa02e?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="bg-[#faf6f0] min-h-screen pb-24 font-serif text-stone-800 antialiased">
      
      {/* Immersive Full-Width Cinematic Banner */}
      <div className="relative h-[65vh] min-h-[440px] w-full overflow-hidden bg-stone-900">
        <img src={primaryImage} alt={temple.name} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Absolute Outer Layout Overlay wrapper */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-6 py-8 flex flex-col justify-between">
          
          {/* Top Row Action Item */}
          <div>
            <Link to="/temples" className="inline-flex items-center gap-1.5 text-[11px] font-sans font-extrabold uppercase tracking-widest text-white bg-[#b35c24] px-4 py-2 rounded shadow-md hover:bg-[#944a1b] transition-all">
              <span>←</span> Explore Archive
            </Link>
          </div>

          {/* Bottom Dynamic Identity Flex */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2">
            
            {/* Title Block Left */}
            <div className="max-w-3xl">
              <span className="inline-block text-[10px] font-sans font-black tracking-widest text-orange-400 bg-orange-500/10 backdrop-blur-sm px-2 py-0.5 rounded uppercase border border-orange-400/20 mb-2">
                {temple.deity || "Historical Site"}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-sm leading-tight">
                {temple.name}
              </h1>
              <p className="text-xs md:text-sm text-stone-300 mt-2 font-sans flex items-start gap-1 font-medium opacity-90">
                <span>📍</span> {temple.location?.address || ""} {temple.location?.city || ""}{temple.location?.state ? `, ${temple.location.state}` : ""}
              </p>
            </div>

            {/* Quick Badges Stack Right */}
            <div className="flex flex-col gap-2 font-sans text-[10px] font-black uppercase tracking-widest text-white shrink-0 items-start md:items-end">
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded">
                <span className="text-amber-400">⭐</span> UNESCO Heritage Site
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded">
                <span>📅</span> Est. 1010 CE
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Opens 6:00 AM
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Decorative Traditional Divider Rule */}
      <div className="w-full flex items-center justify-center gap-4 py-6 bg-white border-y border-stone-200 text-[11px] font-sans font-extrabold tracking-widest uppercase text-amber-800">
        <span className="h-[1px] w-24 bg-gradient-to-r from-transparent to-stone-300" />
        ☀️ {temple.name} ☀️
        <span className="h-[1px] w-24 bg-gradient-to-l from-transparent to-stone-300" />
      </div>

      {/* Main UI Functional Data Side-by-Side Grid Workspace */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER LAYER: Tab Switchboard (8 Cols out of 12) */}
          <div className="lg:col-span-8 bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-sm">
            
            {/* Custom Tab Toggles Bar Layout */}
            <div className="flex bg-[#fdfcf9] border-b border-stone-200 text-xs font-sans font-bold tracking-widest uppercase">
              {[
                { id: 'history', label: '📜 History' },
                { id: 'rituals', label: '🔥 Rituals' },
                { id: 'guidelines', label: '📋 Guidelines' }
              ].map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className={`flex-1 py-4 text-center border-b-2 transition-all duration-150 ${
                    activeTab === tab.id 
                      ? 'border-[#b35c24] bg-white text-[#b35c24] font-black' 
                      : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dynamic Rendering Inner Sheet Window */}
            <div className="p-6 md:p-10 text-stone-600 text-sm md:text-base leading-relaxed">
              
              {/* Context Render: History tab view */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-stone-900 text-lg border-b border-stone-100 pb-2 mb-3">Historical Background</h3>
                    <p className="font-normal font-serif text-stone-700">{temple.historicalBackground}</p>
                  </div>
                  {temple.significance && (
                    <div className="pt-4">
                      <h4 className="font-bold text-stone-900 text-base mb-2">Significance</h4>
                      <p className="font-normal text-stone-600 text-sm md:text-base">{temple.significance}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Context Render: Rituals tab view */}
              {activeTab === 'rituals' && (
                <div className="space-y-6">
                  <h3 className="font-bold text-stone-900 text-lg border-b border-stone-100 pb-2 mb-3">Darshan Windows & Ritual Protocols</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                    {temple.darshanTimings?.map((time, index) => (
                      <div key={index} className="p-4 bg-[#fdfcf9] border border-stone-200/60 rounded-lg text-xs">
                        <p className="font-bold text-[#b35c24] uppercase mb-2">📅 {time.day || 'All Days'}</p>
                        <p className="mb-1"><strong className="text-stone-700">Morning Slot:</strong> {time.morningOpen} - {time.morningClose}</p>
                        <p><strong className="text-stone-700">Evening Slot:</strong> {time.eveningOpen} - {time.eveningClose}</p>
                        {time.note && <p className="text-stone-400 italic mt-2.5 pt-2 border-t border-dashed border-stone-200">* {time.note}</p>}
                      </div>
                    ))}
                  </div>
                  
                  {temple.rituals && temple.rituals.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-stone-200/60">
                      <h4 className="font-bold text-stone-900 text-base mb-3">Daily Active Rituals</h4>
                      <div className="space-y-2.5 font-sans">
                        {temple.rituals.map((r, i) => (
                          <div key={i} className="text-xs p-3 bg-stone-50 rounded border border-stone-200/40">
                            <span className="font-bold text-[#b35c24] mr-1">[{r.timing}]</span>
                            <strong className="text-stone-800">{r.name}:</strong>{' '}
                            <span className="text-stone-500">{r.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Context Render: Guidelines tab view */}
              {activeTab === 'guidelines' && (
                <div className="space-y-4 font-sans text-xs sm:text-sm">
                  <h3 className="font-bold text-stone-900 font-serif text-lg border-b border-stone-100 pb-2 mb-3">Visitor Regulations</h3>
                  <div className="p-4 bg-stone-50 rounded-lg border border-stone-200/60 space-y-2.5">
                    <p><strong className="text-stone-700 uppercase tracking-wider text-[11px] block text-stone-400">Dress Code Constraint:</strong> {temple.visitorGuidelines?.dressCode || 'Standard conservative attire required.'}</p>
                    <p><strong className="text-stone-700 uppercase tracking-wider text-[11px] block text-stone-400">Entry Ticket Threshold:</strong> {temple.visitorGuidelines?.entryFee || 'Free Entry'}</p>
                    <p><strong className="text-stone-700 uppercase tracking-wider text-[11px] block text-stone-400">Photography Matrix:</strong> {temple.visitorGuidelines?.photographyAllowed ? '✅ Permitted outside inner sanctum' : '❌ Completely prohibited inside boundaries'}</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT CONTAINER LAYER: Informational Sidebar widgets (4 Cols out of 12) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Widget 1: Quick Facts Block Card */}
            <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-sm font-sans">
              <h3 className="font-bold text-stone-900 text-sm border-l-2 border-[#b35c24] pl-2 mb-4 uppercase tracking-wider">Quick Facts</h3>
              <div className="space-y-3 text-xs border-t border-stone-100 pt-2">
                <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-400 font-medium">🏛️ Architecture</span><span className="font-semibold text-stone-700">Dravidian Style</span></div>
                <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-400 font-medium">📅 Built</span><span className="font-semibold text-stone-700">1010 CE</span></div>
                <div className="flex justify-between py-1 border-b border-stone-50"><span className="text-stone-400 font-medium">⭐ UNESCO</span><span className="font-semibold text-stone-700">World Heritage Site</span></div>
                <div className="flex justify-between py-1"><span className="text-stone-400 font-medium">👥 Daily Visitors</span><span className="font-semibold text-stone-700">~10,000</span></div>
              </div>
            </div>

            {/* Widget 2: Image Gallery Composite */}
            <div className="bg-white border border-stone-200/80 rounded-xl p-5 shadow-sm font-sans">
              <h3 className="font-bold text-stone-900 text-sm border-l-2 border-[#b35c24] pl-2 mb-4 uppercase tracking-wider">Gallery</h3>
              <div className="grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
                {/* Fallback mock gallery loop using primary or generic images */}
                {[0, 1, 2, 3].map((imgIdx) => {
                  const targetSrc = temple.images?.[imgIdx]?.url || primaryImage;
                  return (
                    <div key={imgIdx} className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200/40">
                      <img src={targetSrc} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Widget 3: Plan Your Visit CTA */}
            <div className="bg-[#6e2b14] border border-[#521f0e] rounded-xl p-6 text-white font-sans shadow-md">
              <h3 className="font-bold text-base tracking-wide mb-2">Plan Your Visit</h3>
              <p className="text-xs text-orange-200/80 leading-relaxed mb-5">
                Best time to visit is between October and March. Avoid peak festival days for a peaceful darshan experience.
              </p>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(temple.name + " " + (temple.location?.city || ""))}`, '_blank')}
                className="w-full bg-[#b35c24] text-white hover:bg-[#cf6d2b] font-bold text-xs uppercase tracking-widest py-3 rounded text-center transition-all shadow-sm"
              >
                Get Directions
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}