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

    // Location parsing mechanism safely handling commas
    const locationParts = location.split(",");
    const cityClean = locationParts[0] ? locationParts[0].trim() : "";
    const stateClean = locationParts[1] ? locationParts[1].trim() : "";

    // 🌟 Handle Image Safe Fallback Rule
    const finalImageUrl = image.trim() || "https://images.unsplash.com/photo-1600100397608-f010e42fa02e";

    // EXACT BLUEPRINT ALIGNED SCHEMATIC PAYLOAD OBJECT
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
      
      // ✅ Images field properly mapped into array of object structure for BOTH Create & Update
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
        setSuccessMsg("Temple information updated cleanly with images!");
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

  // 6. Setup Edit Mode triggers (Fixed image mapping logic)
  const handleEditTrigger = (temple) => {
    setEditingId(temple._id || temple.id);
    setName(temple.name || "");

    // Safely mapping city and state components back into text input
    if (temple.location && typeof temple.location === 'object') {
      const city = temple.location.city || "";
      const state = temple.location.state || "";
      setLocation(city && state ? `${city}, ${state}` : `${city}${state}`);
    } else {
      setLocation(temple.location || "");
    }

    setDeity(temple.deity || "");
    
    // ✅ FIX: Extract image string perfectly from direct image prop OR nested images array
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
    
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Admin Master Console
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Verified updates, content creations, and operational system oversight logs.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Logout Secure Session
        </button>
      </div>

      {/* Global Status Messages */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm border border-red-200 rounded-lg">
          ⚠️ {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm border border-green-200 rounded-lg">
          ✅ {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: Dynamic Form Input Control Panel */}
        <div className="lg:col-span-1 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4 pb-1 border-b">
            {editingId ? "📝 Edit Temple Profile" : "➕ Add Heritage Entry"}
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Temple Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="e.g., Somnath Temple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Location * (City, State)
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="e.g., Prabhas Patan, Gujarat"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Primary Presiding Deity *
              </label>
              <select
                required
                value={deity}
                onChange={(e) => setDeity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Select Valid Deity Schema --</option>
                <option value="Shiva">Shiva</option>
                <option value="Vishnu">Vishnu</option>
                <option value="Krishna">Krishna</option>
                <option value="Durga">Durga</option>
                <option value="Lakshmi">Lakshmi</option>
                <option value="Ganesha">Ganesha</option>
                <option value="Hanuman">Hanuman</option>
                <option value="Rama">Rama</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Image URL Reference Link
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Historical Context Profile *
              </label>
              <textarea
                rows="3"
                required
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Architectural style, epoch records..."
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Darshan Timings Note
              </label>
              <input
                type="text"
                value={darshanTimings}
                onChange={(e) => setDarshanTimings(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="e.g., 6:00 AM - 9:30 PM daily"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Main Festival Name
              </label>
              <textarea
                rows="2"
                value={festivals}
                onChange={(e) => setFestivals(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="e.g., Maha Shivratri"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                Visitor Dress Code / Guidelines
              </label>
              <textarea
                rows="2"
                value={visitorGuidelines}
                onChange={(e) => setVisitorGuidelines(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-orange-500"
                placeholder="Traditional wear guidelines..."
              ></textarea>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors shadow-sm"
              >
                {editingId ? "Update Log" : "Save To Database"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Active Master Database Table Listing Registry View */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">
              Master Catalog Indexes ({temples.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              Synchronizing ledger lines...
            </div>
          ) : temples.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No recorded temple logs currently exist inside active databases.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4">Temple Name</th>
                    <th className="p-4">Location Map Index</th>
                    <th className="p-4 text-center">Actions Ledger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {temples.map((temple) => (
                    <tr
                      key={temple._id || temple.id}
                      className="hover:bg-slate-50/70 transition-colors text-slate-700"
                    >
                      <td className="p-4 font-bold text-slate-800">
                        {temple.name}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {typeof temple.location === "object"
                          ? `${temple.location?.city || ""}, ${temple.location?.state || ""}`
                          : temple.location}
                      </td>
                      <td className="p-4 flex gap-3 justify-center items-center">
                        <button
                          onClick={() => handleEditTrigger(temple)}
                          className="text-orange-600 hover:text-orange-800 font-semibold text-xs transition-colors"
                        >
                          Modify
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() => handleDeleteAction(temple._id || temple.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-xs transition-colors"
                        >
                          Wipe
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}