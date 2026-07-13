import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH_API as API } from '../apis/axios';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Landmark, MapPin, Users, LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  // UI and Visibility States
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration and login state parameters
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear state on tab toggles
  const handleToggleMode = (registerState) => {
    setIsRegister(registerState);
    setError('');
    setSuccess('');
  };

  // Form Submission Event Handler
  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setLoading(true);

  try {
    if (isRegister) {
      const payload = {
        username,
        email,
        password,
        fullname: { firstname, lastname }
      };

      const response = await API.post('/register', payload);
      
      // OPTIONAL FALLBACK FOR REGISTER (Agar seedhe register pe token save rakhna ho)
      const token = response.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      setSuccess('Registration successful! Please switch over to Sign In.');
      setIsRegister(false);
      
      // Clear form states completely
      setUsername('');
      setEmail('');
      setPassword('');
      setFirstname('');
      setLastname('');
    } else {
      const response = await API.post('/login', { email, password });
      const userData = response.data?.user;  
      
      // Token extract aur localstorage me save
      const token = response.data?.token || response.data?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      
      if (userData) {
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userName', userData.username);

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

  // Quick action function to trigger admin routing flows seamlessly 
  const handleAdminBypass = () => {
    // Optional shortcut action mapped to "Continue as Admin" button
    navigate('/admin');
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-[#fbf7f0] font-sans antialiased">
      
      {/* LEFT HAND SIDE BANNER PANEL */}
      <div className="relative hidden md:flex md:col-span-5 lg:col-span-6 bg-[#3d2a21] p-12 flex-col justify-between overflow-hidden">
        {/* Subtle decorative grid overlay simulating screenshot texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Top Branding Header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#df8036] flex items-center justify-center text-white font-bold text-sm">
            🔥
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Temple<span className="text-[#df8036]">Heritage</span>
          </span>
        </div>

        {/* Hero Copy Sections */}
        <div className="relative z-10 my-auto max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-[1px] w-8 bg-[#df8036]"></span>
            <p className="text-xs uppercase tracking-widest text-[#df8036] font-semibold">Sacred Archives</p>
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif text-white leading-tight font-semibold mb-4">
            Discover India's Living Temples
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed font-light">
            Explore thousands of sacred shrines, divine histories, and spiritual heritage from across the subcontinent.
          </p>
        </div>

        {/* Dynamic Static Metric Chips */}
        <div className="relative z-10 flex items-center gap-3 flex-wrap">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#df8036]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">2,400+</p>
              <p className="text-[10px] text-stone-300">Temples</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#df8036]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">28</p>
              <p className="text-[10px] text-stone-300">States</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#df8036]" />
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-none">94k</p>
              <p className="text-[10px] text-stone-300">Visitors/mo</p>
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT HAND SIDE FORM PANEL */}
      <div className="col-span-1 md:col-span-7 lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="w-full max-w-md mx-auto">
          
          {/* Top Integrated Capsule Pill Tabs Toggle Controls */}
          <div className="flex justify-end mb-8">
            <div className="bg-[#f0e8dc] p-1 rounded-full flex items-center gap-1 w-full max-w-[280px]">
              <button
                type="button"
                onClick={() => handleToggleMode(false)}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                  !isRegister 
                    ? 'bg-[#c05c14] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleToggleMode(true)}
                className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isRegister 
                    ? 'bg-[#c05c14] text-white shadow-sm' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form Context Headers */}
          <div className="text-left mb-6">
            <h2 className="text-3xl font-serif font-bold text-stone-900">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-stone-500 text-xs mt-1">
              {isRegister ? 'Sign up to explore historical archives.' : 'Sign in to access your temple archive.'}
            </p>
          </div>

          {/* State Error/Success Modals */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-100 flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-100 flex items-center gap-2">
              <span>✅ {success}</span>
            </div>
          )}

          {/* Functional Dynamic Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Conditional Registration Form Input Subsets */}
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      placeholder="Rajesh"
                      className="w-full bg-[#f5ebd9]/40 border border-stone-200 focus:border-[#c05c14] focus:ring-1 focus:ring-[#c05c14] rounded-xl px-3 py-2.5 text-sm outline-none transition-all placeholder-stone-400 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      placeholder="Kumar"
                      className="w-full bg-[#f5ebd9]/40 border border-stone-200 focus:border-[#c05c14] focus:ring-1 focus:ring-[#c05c14] rounded-xl px-3 py-2.5 text-sm outline-none transition-all placeholder-stone-400 text-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Unique Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="rajesh_kumar"
                    className="w-full bg-[#f5ebd9]/40 border border-stone-200 focus:border-[#c05c14] focus:ring-1 focus:ring-[#c05c14] rounded-xl px-3 py-2.5 text-sm outline-none transition-all placeholder-stone-400 text-stone-800"
                  />
                </div>
              </>
            )}

            {/* Common Unified Fields */}
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#f5ebd9]/40 border border-stone-200 focus:border-[#c05c14] focus:ring-1 focus:ring-[#c05c14] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all placeholder-stone-400 text-stone-800"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">Password</label>
                {!isRegister && (
                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')} 
                    className="text-[10px] font-bold text-[#c05c14] hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-stone-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#f5ebd9]/40 border border-stone-200 focus:border-[#c05c14] focus:ring-1 focus:ring-[#c05c14] rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none transition-all placeholder-stone-400 text-stone-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white bg-[#c05c14] hover:bg-[#a34b0f] font-medium py-3 rounded-xl text-sm transition-all shadow-sm active:scale-[0.99] disabled:bg-stone-300 disabled:cursor-not-allowed mt-4"
            >
              {!loading && <LogIn className="w-4 h-4" />}
              {loading ? 'Processing Backend Handshakes...' : isRegister ? 'Register Account' : 'Sign In to Account'}
            </button>
          </form>

          {/* Alternative Separation Intermediary Breakpoints */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#fbf7f0] px-3 text-stone-400">or</span>
            </div>
          </div>

          {/* Footer Interactive Dynamic Links */}
          <p className="text-center text-stone-500 text-xs mt-8">
            {isRegister ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => handleToggleMode(!isRegister)}
              className="text-[#c05c14] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              {isRegister ? 'Sign In' : 'Create one free'}
            </button>
          </p>

        </div>
      </div>

    </div>
  );
}