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
          setError('Invalid routing parameter index identity.');
          return;
        }

        // URL clean target handler:
        const response = await API.get(`/${id}`);
        const templeData = response.data?.temple || response.data || null;
        setTemple(templeData);
      } catch (err) {
        console.error("Fetch profile failure error Matrix:", err);
        setError('Heritage data profile trace missing inside backend servers.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]); // ✅ Dependency array clean and updated

  if (loading) return <div className="p-20 text-center text-slate-400">Synchronizing database blocks...</div>;
  
  if (error || !temple) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 border rounded-xl">
        <p className="text-red-600 font-medium">{error || 'Data missing.'}</p>
        <Link to="/temples" className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded-md text-sm">Return</Link>
      </div>
    );
  }

  const primaryImage = temple.images && temple.images.length > 0 ? temple.images[0].url : 'https://images.unsplash.com/photo-1600100397608-f010e42fa02e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <Link to="/temples" className="text-xs font-bold uppercase text-orange-600 hover:underline">← Explore Archive</Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Core Profile Card Layer */}
        <div className="md:col-span-1">
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <img src={primaryImage} alt={temple.name} className="w-full h-52 object-cover" />
            <div className="p-5">
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{temple.deity}</span>
              <h1 className="text-xl font-bold text-slate-800 mt-2">{temple.name}</h1>
              <p className="text-xs text-slate-500 mt-1">📍 {temple.location?.address || ""} {temple.location?.city || ""}, {temple.location?.state || ""}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Nav Tabs Layer */}
        <div className="md:col-span-2">
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex border-b bg-slate-50/50 text-xs font-bold tracking-wider">
              {['history', 'rituals', 'guidelines'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`flex-1 py-3 border-b-2 uppercase transition-all ${activeTab === tab ? 'border-orange-600 text-orange-600 bg-white' : 'border-transparent text-slate-400'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 text-sm text-slate-600 leading-relaxed space-y-4">
              {activeTab === 'history' && (
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">Historical Background</h3>
                  <p className="mb-4">{temple.historicalBackground}</p>
                  {temple.significance && (
                    <>
                      <h4 className="font-bold text-slate-700 mt-2">Significance</h4>
                      <p>{temple.significance}</p>
                    </>
                  )}
                </div>
              )}

              {activeTab === 'rituals' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-base">Darshan Windows & Ritual Protocols</h3>
                  {temple.darshanTimings?.map((time, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg border text-xs">
                      <p className="font-bold text-slate-700 uppercase mb-1">📅 {time.day || 'All Days'}</p>
                      <p>Morning Slot: {time.morningOpen} - {time.morningClose} | Evening Slot: {time.eveningOpen} - {time.eveningClose}</p>
                      {time.note && <p className="text-slate-400 italic mt-0.5">* {time.note}</p>}
                    </div>
                  ))}
                  
                  {temple.rituals && temple.rituals.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-bold text-slate-800 mb-2">Daily Active Rituals</h4>
                      {temple.rituals.map((r, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <span className="font-semibold text-orange-600 text-xs">[{r.timing}]</span> <strong className="text-slate-700">{r.name}:</strong> <span className="text-xs text-slate-500">{r.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'guidelines' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-base">Visitor Regulations</h3>
                  <p><strong>Dress Code Constraint:</strong> {temple.visitorGuidelines?.dressCode || 'Standard conservative attire required.'}</p>
                  <p><strong>Entry Ticket Threshold:</strong> {temple.visitorGuidelines?.entryFee || 'Free Entry'}</p>
                  <p><strong>Photography Matrix:</strong> {temple.visitorGuidelines?.photographyAllowed ? '✅ Permitted outside inner sanctum' : '❌ Completely prohibited inside boundaries'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}