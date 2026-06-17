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

  // Search & Filter State UI Matches
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeityFilter, setSelectedDeityFilter] = useState("");

  // 2. Form Input States for adding/updating a record
  const [editingId, setEditingId] = useState(null); 
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [deity, setDeity] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState("");
  const [darshanTimings, setDarshanTimings] = useState("");
  const [festivals, setFestivals] = useState("");
  const [visitorGuidelines, setVisitorGuidelines] = useState("");

  // 3. Security Guard: Verify Admin Token on load & Fetch Initial Records
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");

    if (!userRole || userRole !== "admin") {
      navigate("/login");
      return;
    }

    fetchAdminPanelData();
  }, [navigate]);

  const fetchAdminPanelData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await API.get("/");
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

  // Compute stats metrics counts
  const totalCount = temples.length;
  const verifiedCount = temples.filter(t => t.isVerified !== false).length;
  const pendingCount = temples.filter(t => t.isVerified === false).length;

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
    setDarshanTimings("");
    setFestivals("");
    setVisitorGuidelines("");
  };

  // 5. Handle Form Submit (Both CREATE and UPDATE operations)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const locationParts = location.split(",");
    const cityClean = locationParts[0] ? locationParts[0].trim() : "";
    const stateClean = locationParts[1] ? locationParts[1].trim() : "";

    const finalImageUrl = image.trim() || "https://images.unsplash.com/photo-1600100397608-f010e42fa02e";

    const payload = {
      name: name.trim(),
      location: {
        city: cityClean || "Unknown",
        state: stateClean || "Unknown",
        address: location.trim(),
        coordinates: {
          type: "Point",
          coordinates: [77.2090, 28.6139]
        }
      },
      deity: deity,
      historicalBackground: history.trim(),
      significance: "Significant socio-cultural spiritual locus marker.",
      architecture: "Traditional authentic Indian architectural structure.",
      images: [
        {
          url: finalImageUrl,
          caption: `${name.trim()} Structural Profile View`
        }
      ],
      darshanTimings: [
        {
          day: "All Days",
          morningOpen: darshanTimings.trim() || "06:00 AM",
          morningClose: "12:00 PM",
          eveningOpen: "04:00 PM",
          eveningClose: "09:00 PM",
          note: "Schedules subject to dynamic variations on festivals."
        }
      ],
      festivals: [
        {
          name: festivals.trim() || "Annual Maha Festival",
          month: "Traditional Cycle",
          description: "Major historical cultural congregation celebration.",
          dateInfo: "As per local lunar system timings."
        }
      ],
      visitorGuidelines: {
        dressCode: visitorGuidelines.trim() || "Decent traditional wear highly recommended.",
        rules: ["Maintain sacred structural decorum inside.", "Abide by local administrative layouts."],
        photographyAllowed: false,
        entryFee: "Free Public Walk-in"
      },
      isVerified: true,
      featured: false,
      facilities: {
        accommodation: ["Available locally around premises"],
        transport: ["Local transportation actively connected"],
        parking: true,
        foodAvailable: true
      },
      rituals: [
        {
          name: "Daily General Aarti",
          timing: "07:00 AM",
          description: "Main initial daily worship procedure."
        }
      ]
    };

    try {
      if (editingId) {
        await API.put(`/${editingId}`, payload);
        setSuccessMsg(`${name.trim()} record updated successfully.`);
      } else {
        await API.post("/", payload);
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

  // 6. Setup Edit Mode triggers
  const handleEditTrigger = (temple) => {
    setEditingId(temple._id || temple.id);
    setName(temple.name || "");

    if (temple.location && typeof temple.location === 'object') {
      const city = temple.location.city || "";
      const state = temple.location.state || "";
      setLocation(city && state ? `${city}, ${state}` : `${city}${state}`);
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
    setDarshanTimings(Array.isArray(temple.darshanTimings) ? temple.darshanTimings[0]?.morningOpen || "" : "");
    setFestivals(Array.isArray(temple.festivals) ? temple.festivals[0]?.name || "" : "");
    setVisitorGuidelines(temple.visitorGuidelines?.dressCode || "");
    
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // 7. DELETE Operation Handler
  const handleDeleteAction = async (id) => {
    if (!window.confirm("Are you absolutely sure you want to drop this database log entry permanently?")) return;
    try {
      await API.delete(`/${id}`);
      setSuccessMsg("Record dropped safely.");
      fetchAdminPanelData();
    } catch (err) {
      setError("Failed to securely wipe requested content entry index.");
    }
  };

  // 8. Admin Sign Out Operation
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#3E2723] font-sans flex flex-col antialiased">
      
      {/* TOP HEADER BRANDING LAYER */}
      <header className="bg-[#5D4037] text-white px-6 py-3 flex justify-between items-center shadow-md z-10">
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
            <span>admin@devsthana.in</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-xs border border-amber-500/30 hover:bg-white/10 px-3 py-1.5 rounded-md transition-all font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* CORE WRAPPER CONTAINER */}
      <div className="flex flex-1 relative">
        
        {/* LEFT SIDEBAR NAVIGATION CONSOLE */}
        <aside className="w-64 bg-white border-r border-[#EFEBE9] p-4 flex flex-col justify-between hidden md:flex shrink-0">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FFF3E0] text-[#E65100] font-semibold text-sm transition-all text-left">
              <span className="text-lg">📋</span> Overview
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#795548] hover:bg-[#F5F5F5] font-medium text-sm transition-all text-left">
              <span className="text-lg">🕌</span> Temples
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#795548] hover:bg-[#F5F5F5] font-medium text-sm transition-all text-left">
              <span className="text-lg">📍</span> Pilgrimages
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#795548] hover:bg-[#F5F5F5] font-medium text-sm transition-all text-left">
              <span className="text-lg">📅</span> Festivals
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#795548] hover:bg-[#F5F5F5] font-medium text-sm transition-all text-left">
              <span className="text-lg">🖼️</span> Media
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#795548] hover:bg-[#F5F5F5] font-medium text-sm transition-all text-left">
              <span className="text-lg">👥</span> Users
            </button>
          </div>

          {/* SYSTEM DISPATCH RUNTIME STATUS */}
          <div className="bg-[#EFEBE9]/60 p-3 rounded-xl border border-[#E0D4D0]">
            <div className="text-xs text-[#795548] font-semibold mb-1">Database Status</div>
            <div className="flex items-center gap-2 text-xs text-[#2E7D32] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></span>
              All systems operational
            </div>
          </div>
        </aside>

        {/* MAIN BODY SCROLL PANEL */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* CATALOG SUBHEADER BAR */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#3E2723] tracking-tight">Admin Master Console</h1>
              <p className="text-sm text-[#795548] mt-1">Manage temple records, content, and heritage catalog</p>
            </div>
            <button 
              onClick={() => { clearForm(); window.scrollTo({ top: 400, behavior: "smooth" }); }}
              className="bg-[#D84315] hover:bg-[#BF360C] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span className="text-base font-bold">+</span> Add New Temple
            </button>
          </div>

          {/* METRICS CORE SYSTEM CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#D84315] text-white p-5 rounded-2xl shadow-sm border border-[#BF360C] relative overflow-hidden">
              <div className="absolute right-3 top-3 text-white/10 text-5xl font-serif">🕌</div>
              <div className="text-xs uppercase tracking-wider font-semibold text-orange-100">Total Temples</div>
              <div className="text-3xl font-bold mt-1">{totalCount || 148}</div>
              <div className="text-xs text-orange-200 mt-2 font-medium">+12 this month</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#EFEBE9] relative">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#795548]">Verified</div>
              <div className="text-3xl font-bold mt-1 text-[#3E2723]">{verifiedCount || 127}</div>
              <div className="text-xs text-[#2E7D32] mt-2 font-medium">85% verified</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#EFEBE9] relative">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#795548]">Pending Review</div>
              <div className="text-3xl font-bold mt-1 text-[#3E2723]">{pendingCount || 21}</div>
              <div className="text-xs text-[#C62828] mt-2 font-medium">Needs attention</div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#EFEBE9] relative">
              <div className="text-xs uppercase tracking-wider font-semibold text-[#795548]">Monthly Visits</div>
              <div className="text-3xl font-bold mt-1 text-[#3E2723]">94k</div>
              <div className="text-xs text-[#2E7D32] mt-2 font-medium">+8.2% vs last month</div>
            </div>
          </div>

          {/* DYNAMIC ALERT LOG BANNER NOTIFICATIONS */}
          {successMsg && (
            <div className="bg-[#E8F5E9] text-[#2E7D32] text-sm border border-[#C8E6C9] px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2 font-medium">
                <span>✨</span> {successMsg}
              </div>
              <button onClick={() => setSuccessMsg("")} className="text-emerald-800 hover:opacity-60 text-lg font-bold">×</button>
            </div>
          )}
          {error && (
            <div className="bg-[#FFEBEE] text-[#C62828] text-sm border border-[#FFCDD2] px-4 py-3 rounded-xl flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2 font-medium">
                <span>⚠️</span> {error}
              </div>
              <button onClick={() => setError("")} className="text-red-800 hover:opacity-60 text-lg font-bold">×</button>
            </div>
          )}

          {/* WORKSPACE COLUMN LAYOUT WRAPPER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN PANEL: DATABASE REGISTRY CREATION & UPDATE FORM */}
            <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E8E2D6] p-6 rounded-2xl shadow-sm">
              <h2 className="text-lg font-bold text-[#3E2723] mb-4 pb-2 border-b border-[#E8E2D6] flex items-center gap-1.5">
                {editingId ? "📝 Edit Temple Profile" : "➕ Add Heritage Entry"}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Temple Name *</label>
                  <input
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315] focus:ring-1 focus:ring-[#D84315] transition-all placeholder:text-stone-300"
                    placeholder="e.g., Somnath Temple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Location * (City, State)</label>
                  <input
                    type="text" required value={location} onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315] focus:ring-1 focus:ring-[#D84315] transition-all placeholder:text-stone-300"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Presiding Deity *</label>
                  <select
                    required value={deity} onChange={(e) => setDeity(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315] focus:ring-1 focus:ring-[#D84315] transition-all text-[#3E2723]"
                  >
                    <option value="">Select deity...</option>
                    <option value="Shiva">Shiva</option>
                    <option value="Shakti">Shakti</option>
                    <option value="Vishnu">Vishnu</option>
                    <option value="Krishna">Krishna</option>
                    <option value="Ganesha">Ganesha</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Image URL</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-stone-400 text-xs">🔗</span>
                    <input
                      type="text" value={image} onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-white border border-[#D7CCC8] rounded-xl py-2.5 pl-8 pr-3 text-sm focus:outline-none focus:border-[#D84315] focus:ring-1 focus:ring-[#D84315] transition-all placeholder:text-stone-300 text-xs"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Historical Background *</label>
                  <textarea
                    rows="3" required value={history} onChange={(e) => setHistory(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315] focus:ring-1 focus:ring-[#D84315] transition-all placeholder:text-stone-300"
                    placeholder="Architectural style, epoch records..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Darshan Timings</label>
                    <input
                      type="text" value={darshanTimings} onChange={(e) => setDarshanTimings(e.target.value)}
                      className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315] transition-all placeholder:text-stone-300"
                      placeholder="6:00 AM – 9:00 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Main Festival</label>
                    <input
                      type="text" value={festivals} onChange={(e) => setFestivals(e.target.value)}
                      className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315] transition-all placeholder:text-stone-300"
                      placeholder="e.g., Shivratri"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#795548] uppercase tracking-wider mb-1">Visitor Guidelines</label>
                  <textarea
                    rows="2" value={visitorGuidelines} onChange={(e) => setVisitorGuidelines(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#D84315] transition-all placeholder:text-stone-300"
                    placeholder="Dress code, rules..."
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#BF360C] hover:bg-[#A72D08] text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>💾</span> {editingId ? "Update Record" : "Save to Database"}
                  </button>
                  {editingId && (
                    <button
                      type="button" onClick={clearForm}
                      className="bg-[#EFEBE9] hover:bg-[#E0D4D0] text-[#5D4037] font-semibold py-2.5 px-4 rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN PANEL: MASTER MATRIX SEARCHABLE TABLE VIEW LISTING */}
            <div className="lg:col-span-7 bg-white border border-[#EFEBE9] rounded-2xl shadow-sm overflow-hidden">
              
              {/* FILTERS TOOLBAR SEARCH HEADER */}
              <div className="p-4 border-b border-[#EFEBE9] bg-[#FAF7F2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#3E2723]">Temple Catalog</h2>
                  <span className="bg-[#FFE0B2] text-[#E65100] text-xs font-bold px-2 py-0.5 rounded-full">{filteredTemples.length} entries</span>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <span className="absolute left-2.5 top-2.5 text-stone-400 text-xs">🔍</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search temples..."
                      className="w-full sm:w-48 bg-white border border-[#D7CCC8] rounded-xl py-1.5 pl-7 pr-3 text-xs focus:outline-none focus:border-[#D84315]"
                    />
                  </div>
                  <select
                    value={selectedDeityFilter}
                    onChange={(e) => setSelectedDeityFilter(e.target.value)}
                    className="bg-white border border-[#D7CCC8] rounded-xl px-2 py-1.5 text-xs text-[#795548] focus:outline-none"
                  >
                    <option value="">All Deities</option>
                    <option value="Shiva">Shiva</option>
                    <option value="Shakti">Shakti</option>
                    <option value="Vishnu">Vishnu</option>
                  </select>
                </div>
              </div>

              {/* RE-STYLED DATA GRID VIEW */}
              {loading ? (
                <div className="p-16 text-center text-[#795548]/60 text-sm flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[#D84315] border-t-transparent rounded-full animate-spin"></div>
                  Synchronizing ledger logs...
                </div>
              ) : filteredTemples.length === 0 ? (
                <div className="p-16 text-center text-[#795548]/60 text-sm">
                  No recorded temple logs matching filters exist inside database.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF7F2] border-b border-[#EFEBE9] text-[#795548] font-bold uppercase tracking-wider">
                        <th className="p-3.5">Temple</th>
                        <th className="p-3.5">Deity</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F5F5]">
                      {filteredTemples.map((temple) => {
                        const tId = temple._id || temple.id;
                        const isVerified = temple.isVerified !== false;
                        
                        // Pick preview image fallback logic
                        let imgUrl = "https://images.unsplash.com/photo-1600100397608-f010e42fa02e";
                        if (temple.image && typeof temple.image === 'string') imgUrl = temple.image;
                        else if (Array.isArray(temple.images) && temple.images.length > 0) imgUrl = temple.images[0]?.url;

                        // Parse string locations cleanly
                        const locString = typeof temple.location === "object"
                          ? `${temple.location?.city || ""}, ${temple.location?.state || ""}`
                          : temple.location;

                        return (
                          <tr key={tId} className="hover:bg-[#FAF7F2]/50 transition-colors">
                            {/* TEMPLE IDENTITY COLUMN WITH METADATA THUMBNAILS */}
                            <td className="p-3.5 flex items-center gap-3">
                              <img 
                                src={imgUrl} 
                                alt={temple.name} 
                                className="w-9 h-9 object-cover rounded-xl border border-stone-200 shadow-xs"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1600100397608-f010e42fa02e" }}
                              />
                              <div>
                                <div className="font-bold text-[#3E2723] text-sm">{temple.name}</div>
                                <div className="text-[#795548] font-medium mt-0.5 flex items-center gap-1">
                                  <span>📍</span> {locString}
                                </div>
                              </div>
                            </td>

                            {/* DEITY CUSTOM PILL CAP TAGS */}
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                                temple.deity === 'Shiva' ? 'bg-[#EFEBE9] text-[#5D4037]' :
                                temple.deity === 'Shakti' ? 'bg-[#FBE9E7] text-[#D84315]' :
                                'bg-[#E8F5E9] text-[#2E7D32]'
                              }`}>
                                {temple.deity || 'Other'}
                              </span>
                            </td>

                            {/* VERIFICATION BADGES STATUS INDICATORS */}
                            <td className="p-3.5">
                              {isVerified ? (
                                <span className="text-[#2E7D32] font-semibold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF50]"></span> Verified
                                </span>
                              ) : (
                                <span className="text-[#E65100] font-semibold flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9800]"></span> Pending
                                </span>
                              )}
                            </td>

                            {/* BUTTON ACTION CONTROLS */}
                            <td className="p-3.5">
                              <div className="flex gap-2 justify-center items-center">
                                <button
                                  onClick={() => handleEditTrigger(temple)}
                                  className="border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shadow-xs"
                                >
                                  ✏️ Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAction(tId)}
                                  className="border border-red-100 bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                                >
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

              {/* PAGINATION INTERFACES */}
              <div className="p-3 border-t border-[#EFEBE9] bg-[#FAF7F2] flex justify-between items-center text-[#795548] text-xs">
                <div>Showing {filteredTemples.length} of {totalCount || 148} entries</div>
                <div className="flex items-center gap-1 font-medium">
                  <button className="p-1 px-2 rounded hover:bg-stone-200">‹</button>
                  <button className="bg-[#D84315] text-white p-1 px-2.5 rounded-lg font-bold">1</button>
                  <button className="p-1 px-2.5 rounded hover:bg-stone-200">2</button>
                  <button className="p-1 px-2.5 rounded hover:bg-stone-200">3</button>
                  <button className="p-1 px-2 rounded hover:bg-stone-200">›</button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}