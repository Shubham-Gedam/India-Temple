import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TEMPLE_API as API } from "../apis/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // 1. Core State Handlers
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Dynamic Admin Auth Profile Tracking
  const [adminEmail, setAdminEmail] = useState("admin@gmail.com");

  // Search & Filter State UI Matches
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeityFilter, setSelectedDeityFilter] = useState("");

  const [editingId, setEditingId] = useState(null); 
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [deity, setDeity] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState("");
  
  // Form input extensions for newly highlighted object schemas
  const [significance, setSignificance] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [darshanTimings, setDarshanTimings] = useState("");
  const [festivals, setFestivals] = useState("");
  const [visitorGuidelines, setVisitorGuidelines] = useState("");

  // Helper utility to generate headers quickly for secure endpoints
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  };

  // 3. Security Guard: Verify Admin Token on load & Fetch Initial Records
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail");

    if (!userRole || userRole !== "admin") {
      navigate("/login");
      return;
    }

    if (storedEmail) {
      setAdminEmail(storedEmail);
    }

    fetchAdminPanelData();
  }, [navigate]);

  const fetchAdminPanelData = async () => {
    try {
      setLoading(true);
      setError("");
      // Secure layout call including local authorization token wrapper
      const response = await API.get("/", getAuthConfig());
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.temples || [];
      setTemples(data);
    } catch (err) {
      console.error(err);
      setError("Failed to extract master collection files from server layers.");
    } finally {
      setLoading(false);
    }
  };

  // Filter temples based on UI selectors
  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (typeof temple.location === 'object' ? `${temple.location?.city} ${temple.location?.state}` : temple.location)?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDeity = selectedDeityFilter === "" || temple.deity === selectedDeityFilter;
    return matchesSearch && matchesDeity;
  });

  // 4. Reset entry form fields completely
  const clearForm = () => {
    setEditingId(null);
    setName("");
    setLocation("");
    setDeity("");
    setImage("");
    setHistory("");
    setSignificance("");
    setArchitecture("");
    setDarshanTimings("");
    setFestivals("");
    setVisitorGuidelines("");
  };

  // 5. Handle Form Submit (Payload configured to perfectly match Postman payload)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // Parsing "City, State" from the combined string field smoothly
    const locationParts = location.split(",");
    const cityClean = locationParts[0] ? locationParts[0].trim() : "";
    const stateClean = locationParts[1] ? locationParts[1].trim() : "";

    const finalImageUrl = image.trim() || "https://images.unsplash.com/photo-1600100397608-f010e42fa02e";

    // EXACT POSTMAN STRUCTURAL MATCH
    const payload = {
      name: name.trim(),
      location: {
        state: stateClean || "Unknown",
        city: cityClean || "Unknown",
        address: location.trim()
      },
      deity: deity,
      historicalBackground: history.trim(),
      significance: significance.trim() || "Major regional cultural pilgrimage site",
      architecture: architecture.trim() || "Traditional Indian Temple Architecture",
      darshanTimings: [
        {
          day: "All Days",
          morningOpen: darshanTimings.trim() || "5:00 AM",
          morningClose: "10:00 PM",
          eveningOpen: "4:00 PM",
          eveningClose: "10:00 PM",
          note: "Timings may vary during festivals"
        }
      ],
      festivals: [
        {
          name: festivals.trim() || "Annual Maha Festival",
          month: "Traditional Cycle",
          description: "Grand community religious and cultural celebration",
          dateInfo: "As per local lunar calendar layers"
        }
      ],
      visitorGuidelines: {
        dressCode: visitorGuidelines.trim() || "Traditional attire recommended.",
        rules: [
          "No leather items allowed",
          "Mobile phones not allowed inside sanctum",
          "Photography restricted in main areas"
        ],
        photographyAllowed: false,
        entryFee: "Free"
      },
      images: [
        {
          url: finalImageUrl,
          caption: `${name.trim()} Structural Profile View`
        }
      ],
      isVerified: true
    };

    try {
      if (editingId) {
        const currentSelectedTemple = temples.find(t => (t._id || t.id) === editingId);
        
        const requestParamSlug = currentSelectedTemple?.slug || 
                                 name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

        console.log(`Submitting PUT Update Request directly onto parameters slug target: /${requestParamSlug}`);
        
        // Passing direct configuration object as the third argument in explicit PUT layout context
        await API.put(`/${requestParamSlug}`, payload, getAuthConfig());
        setSuccessMsg(`${name.trim()} record updated successfully.`);
      } else {
        // Passing auth configuration stack as the third argument parameters layer
        await API.post("/", payload, getAuthConfig());
        setSuccessMsg("New heritage temple cataloged successfully!");
      }
      clearForm();
      fetchAdminPanelData(); 
    } catch (err) {
      console.error("Submission Error Debug Matrix:", err.response?.data);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Structure layout validation failure with backend schema."
      );
    }
  };

  // 6. Setup Edit Mode triggers (Re-populating the complete layout object safely)
  const handleEditTrigger = (temple) => {
    console.log("Full Temple Object Selected for Edit:", temple);

    setEditingId(temple._id || temple.id);
    setName(temple.name || "");

    if (temple.location && typeof temple.location === 'object') {
      const city = temple.location.city || "";
      const state = temple.location.state || "";
      setLocation(city && state ? `${city}, ${state}` : temple.location.address || `${city}${state}`);
    } else {
      setLocation(temple.location || "");
    }

    setDeity(temple.deity || "");
    
    if (temple.image && typeof temple.image === 'string') {
      setImage(temple.image);
    } else if (Array.isArray(temple.images) && temple.images.length > 0) {
      setImage(temple.images[0]?.url || "");
    } else {
      setImage("");
    }

    setHistory(temple.historicalBackground || "");
    setSignificance(temple.significance || "");
    setArchitecture(temple.architecture || "");
    setDarshanTimings(Array.isArray(temple.darshanTimings) ? temple.darshanTimings[0]?.morningOpen || "" : "");
    setFestivals(Array.isArray(temple.festivals) ? temple.festivals[0]?.name || "" : "");
    setVisitorGuidelines(temple.visitorGuidelines?.dressCode || "");
    
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // 7. DELETE Operation Handler
  const handleDeleteAction = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to drop this database log entry permanently?")) return;
    try {
      // Adding explicit header config metadata blueprint tracking
      await API.delete(`/${id}`, getAuthConfig());
      setSuccessMsg("Record dropped safely.");
      fetchAdminPanelData();
    } catch (err) {
      setError("Failed to securely wipe requested content entry index.");
    }
  };

  // 8. Admin Sign Out Operation
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-sans flex flex-col antialiased">
      
      {/* TOP HEADER BRANDING LAYER */}
      {/* <header className="bg-[#5D4037] text-white px-6 py-3 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF9800] p-1.5 rounded-lg text-[#5D4037]">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 22h20L12 2zm0 4.31L18.85 20H5.15L12 6.31zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wide">DevSthana</span>
          <span className="text-xs bg-[#795548] px-2 py-0.5 rounded text-amber-200 border border-amber-900/20 ml-2">Admin Console</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-amber-100">
            <svg className="w-4 h-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span className="font-medium tracking-wide">{adminEmail}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs border border-amber-500/30 hover:bg-white/10 px-3 py-1.5 rounded-md transition-all font-medium"
            type="button"
          >
            Sign Out
          </button>
        </div>
      </header> */}

      {/* CORE WRAPPER CONTAINER */}
      <div className="flex flex-1 relative">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        {/* <aside className="w-64 bg-white border-r border-[#EFEBE9] p-4 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FFF3E0] text-[#E65100] font-semibold text-sm transition-all text-left">
              📋 Overview
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#795548] hover:bg-[#F5F5F5] font-medium text-sm transition-all text-left">
              ☥ Temples
            </button>
          </div>
          <div className="bg-[#EFEBE9]/60 p-3 rounded-xl border border-[#E0D4D0]">
            <div className="text-xs text-[#795548] font-semibold mb-1">Database Status</div>
            <div className="flex items-center gap-2 text-xs text-[#2E7D32] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></span>
              All systems operational
            </div>
          </div>
        </aside> */}

        {/* MAIN BODY SCROLL PANEL */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3E2723] tracking-tight">Admin Master Console</h1>
              <p className="text-sm text-[#795548] mt-1">Manage temple records, content, and heritage catalog</p>
            </div>
            <button 
              onClick={() => { clearForm(); window.scrollTo({ top: 400, behavior: "smooth" }); }}
              className="bg-[#D84315] hover:bg-[#BF360C] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors"
              type="button"
            >
              + Add New Temple
            </button>
          </div>

          {/* DYNAMIC ALERT BANNER NOTIFICATIONS */}
          {successMsg && (
            <div className="bg-[#E8F5E9] text-[#2E7D32] text-sm border border-[#C8E6C9] px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
              <span className="font-medium">✨ {successMsg}</span>
              <button onClick={() => setSuccessMsg("")} className="text-emerald-800 text-lg font-bold" type="button">
                ×
              </button>
            </div>
          )}
          {error && (
            <div className="bg-[#FFEBEE] text-[#C62828] text-sm border border-[#FFCDD2] px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
              <span className="font-medium">⚠️ {error}</span>
              <button onClick={() => setError("")} className="text-red-800 text-lg font-bold" type="button">
                ×
              </button>
            </div>
          )}

          {/* WORKSPACE LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT PANEL: INPUT FORM COMPONENT */}
            <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E8E2D6] p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-[#3E2723] mb-4 pb-2 border-b border-[#E8E2D6]">
                {editingId ? "📝 Edit Temple Profile" : "➕ Add Heritage Entry"}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Temple Name *</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                    placeholder="e.g., Meenakshi Temple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Location * (City, State)</label>
                  <input
                    type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                    placeholder="e.g., Madurai, Tamil Nadu"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Presiding Deity *</label>
                    <input
                      type="text" required value={deity} onChange={(e) => setDeity(e.target.value)}
                      className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                      placeholder="e.g., Durga"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Architecture Style</label>
                    <input
                      type="text" value={architecture} onChange={(e) => setArchitecture(e.target.value)}
                      className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                      placeholder="e.g., Dravidian style"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Significance / Description</label>
                  <input
                    type="text" value={significance} onChange={(e) => setSignificance(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                    placeholder="e.g., One of the 51 Shakti Peethas"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Image URL</label>
                  <input
                    type="text" value={image} onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                    placeholder="https://example.com/meenakshi.jpg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Historical Background *</label>
                  <textarea
                    rows="3" required value={history} onChange={(e) => setHistory(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                    placeholder="Detailed timeline metrics or background context..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Darshan Timings</label>
                    <input
                      type="text" value={darshanTimings} onChange={(e) => setDarshanTimings(e.target.value)}
                      className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                      placeholder="e.g., 5:00 AM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Main Festival Name</label>
                    <input
                      type="text" value={festivals} onChange={(e) => setFestivals(e.target.value)}
                      className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                      placeholder="e.g., Meenakshi Thirukalyanam"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Visitor Dress Code</label>
                  <input
                    type="text" value={visitorGuidelines} onChange={(e) => setVisitorGuidelines(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315]"
                    placeholder="e.g., Traditional attire required"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button type="submit" className="flex-1 bg-[#BF360C] hover:bg-[#A72D08] text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm">
                    💾 {editingId ? "Update Record" : "Save to Database"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={clearForm} className="bg-[#EFEBE9] text-[#5D4037] py-2.5 px-4 rounded-xl text-sm">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* RIGHT PANEL: DISPLAY DATA TABLE LIST */}
            <div className="lg:col-span-7 bg-white border border-[#EFEBE9] rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#EFEBE9] bg-[#FAF7F2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#3E2723]">Temple Catalog</h2>
                  <span className="bg-[#FFE0B2] text-[#E65100] text-xs font-bold px-2 py-0.5 rounded-full">{filteredTemples.length} entries</span>
                </div>
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search temples..."
                  className="w-full sm:w-48 bg-white border border-[#D7CCC8] rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-[#D84315]"
                />
              </div>

              {loading ? (
                <div className="p-16 text-center text-sm">Synchronizing ledger logs...</div>
              ) : filteredTemples.length === 0 ? (
                <div className="p-16 text-center text-sm">No records found matching current query filters.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF7F2] border-b border-[#EFEBE9] text-[#795548] font-bold uppercase tracking-wider">
                        <th className="p-3.5">Temple</th>
                        <th className="p-3.5">Deity</th>
                        <th className="p-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F5]">
                      {filteredTemples.map((temple) => {
                        const tId = temple._id || temple.id;
                        let imgUrl = "https://images.unsplash.com/photo-1600100397608-f010e42fa02e";
                        if (temple.image && typeof temple.image === 'string') imgUrl = temple.image;
                        else if (Array.isArray(temple.images) && temple.images.length > 0) imgUrl = temple.images[0]?.url;

                        const locString = typeof temple.location === "object"
                          ? `${temple.location?.city || ""}, ${temple.location?.state || ""}`
                          : temple.location;

                        return (
                          <tr key={tId} className="hover:bg-[#FAF7F2]/50 transition-colors">
                            <td className="p-3.5 flex items-center gap-3">
                              <img src={imgUrl} alt={temple.name} className="w-9 h-9 object-cover rounded-xl border border-stone-200" />
                              <div>
                                <div className="font-bold text-[#3E2723] text-sm">{temple.name}</div>
                                <div className="text-[#795548] font-medium mt-0.5">📍 {locString}</div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFEBE9] text-[#5D4037]">
                                {temple.deity || 'Other'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex gap-2 justify-center items-center">
                                <button onClick={() => handleEditTrigger(temple)} className="border border-stone-200 bg-white px-2.5 py-1 rounded-lg font-bold">
                                  ✏️ Edit
                                </button>
                                <button onClick={() => handleDeleteAction(tId)} className="border border-red-100 bg-[#FFEBEE] text-[#C62828] px-2.5 py-1 rounded-lg font-bold">
                                  🗑️ Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}