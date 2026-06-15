import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_API as API } from '../apis/axios';

export default function Login() {
  const navigate = useNavigate();

  // 1. UI states toggle (Login vs Register)
  const [isRegister, setIsRegister] = useState(false);
  
  // Registration and login state management parameters
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // 2. Clear state on tab toggles
  const handleToggleMode = (registerState) => {
    setIsRegister(registerState);
    setError('');
    setSuccess('');
  };

  // 3. Form Submission Event Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(false);

    try {
      if (isRegister) {
        // --- REGISTER USER FLOW ---
        // Match backend nested payload format: { username, email, password, fullname: { firstname, lastname } }
        const payload = {
          username,
          email,
          password,
          fullname: {
            firstname,
            lastname
          }
        };

        await API.post('/register', payload);
        setSuccess('Registration successful! Please switch over to Sign In.');
        setIsRegister(false);
        // Clear inputs
        setFirstname('');
        setLastname('');
      } else {
        // --- COMMON LOGIN FLOW (User & Admin) ---
        // Backend handles identification seamlessly through common route checks
        const response = await API.post('/login', { email, password });
        
        const userData = response.data?.user;
        
        if (userData) {
          // Local storage configurations for view level routing
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('userName', userData.username);

          // Route switching depending upon role status variables
          if (userData.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication layers failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        
        {/* Toggle Controls Headder Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={() => handleToggleMode(false)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              !isRegister ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In 🔑
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode(true)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              isRegister ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Register 👤
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              {isRegister ? 'Sign up to explore historical archives.' : 'Sign in to access your dashboard settings.'}
            </p>
          </div>

          {/* Conditional Error Alerts */}
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">⚠️ {error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Show extra fields ONLY when registering */}
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      placeholder="Rajesh"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      placeholder="Kumar"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Unique Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="rajesh_kumar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </>
            )}

            {/* Common Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white bg-orange-600 hover:bg-orange-700 font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:bg-slate-300 mt-2"
            >
              {loading ? 'Processing Backend Handshakes...' : isRegister ? 'Register Account' : 'Sign In To Account'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}