import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../apis/axios';

export default function Login() {
  const navigate = useNavigate();

  // 1. Core Form & UI States
  const [isRegister, setIsRegister] = useState(false); // Toggles between Login mode and Register mode
  const [isAdminMode, setIsAdminMode] = useState(false); // Toggles between Regular User and Admin Portal
  
  const [name, setName] = useState(''); // Only used for user registration
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Clear messages when switching states
  const handleModeSwitch = (toAdmin) => {
    setIsAdminMode(toAdmin);
    setError('');
    setSuccess('');
    // Admins don't register, force login view if admin mode is picked
    if (toAdmin) setIsRegister(false); 
  };

  // 3. Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isAdminMode) {
        // --- ADMIN LOGIN ---
        const response = await API.post('/auth/admin-login', { email, password });
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
          navigate('/admin'); // Redirect straight to CRUD dashboard
        }
      } else {
        if (isRegister) {
          // --- USER REGISTRATION ---
          await API.post('/auth/user-register', { name, email, password });
          setSuccess('Account created cleanly! You can now switch to Sign In.');
          setIsRegister(false);
          setName('');
        } else {
          // --- USER LOGIN ---
          const response = await API.post('/auth/user-login', { email, password });
          if (response.data?.userToken) {
            localStorage.setItem('userToken', response.data.userToken);
            navigate('/'); // Redirect back to Home portal
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please verify entry lines.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Top Role Selector Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => handleModeSwitch(false)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              !isAdminMode ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            👤 Pilgrim / User
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch(true)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              isAdminMode ? 'bg-white text-amber-700 border-b-2 border-amber-700' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            🔑 Admin Portal
          </button>
        </div>

        {/* Card Body Elements */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isAdminMode ? 'Admin Console Sign In' : isRegister ? 'Create Pilgrim Account' : 'Pilgrim Sign In'}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {isAdminMode 
                ? 'System administrator secure gateway credentials.' 
                : 'Access curated trail collections, save favorite nodes, and log plans.'}
            </p>
          </div>

          {/* Status Message Banners */}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">⚠️ {error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Conditional Input Field: Name (Only shown during User Registration) */}
            {!isAdminMode && isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rajesh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            )}

            {/* Email Input Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm mt-2 ${
                isAdminMode ? 'bg-amber-700 hover:bg-amber-800' : 'bg-orange-600 hover:bg-orange-700'
              } disabled:bg-slate-300`}
            >
              {loading ? 'Processing Transaction Layers...' : isAdminMode ? 'Sign In Admin Instance' : isRegister ? 'Register Account' : 'Sign In'}
            </button>
          </form>

          {/* Bottom Context Switch Toggle Link (Hidden for Admin Mode) */}
          {!isAdminMode && (
            <div className="mt-6 text-center text-xs text-slate-500">
              {isRegister ? (
                <p>
                  Already registered?{' '}
                  <button type="button" onClick={() => setIsRegister(false)} className="text-orange-600 font-bold hover:underline">
                    Sign In Here
                  </button>
                </p>
              ) : (
                <p>
                  New pilgrim explorer?{' '}
                  <button type="button" onClick={() => setIsRegister(true)} className="text-orange-600 font-bold hover:underline">
                    Create an Account
                  </button>
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}