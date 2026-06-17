import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Mocked state logic based on your localStorage implementation
  const userRole = localStorage.getItem('userRole');
  const isAdminLoggedIn = userRole === 'admin';
  const isUserLoggedIn = userRole === 'user';
  
  // Dynamic user name rendering (fallback to 'User' or your specific state if needed)
  const userName = localStorage.getItem('userName') || 'Arjun Sharma';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
    setIsOpen(false);
  };

  // Helper function to handle active state border bottom / highlight matching the mockups
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Temples', path: '/temples' },
    { name: 'Pilgrimages', path: '/pilgrimages' },
    { name: 'Festivals', path: '/festivals' },
  ];

  return (
    <nav className="bg-[#FAF6F0] sticky top-0 z-50 border-b border-[#EADBC8]/40 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo Brand Link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-[#C85C11] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-lg">🔥</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-[#8C330B]">
                Temple<span className="text-[#C85C11] font-medium">Heritage</span>
              </span>
            </Link>
          </div>

          {/* Desktop Central Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-base font-medium transition-all duration-200 ${
                  isActive(link.path) 
                    ? 'text-[#C85C11] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#C85C11]' 
                    : 'text-[#5C544E] hover:text-[#C85C11]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Authentication Right Side Panels */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* STATE 1: LOGGED OUT */}
            {!isUserLoggedIn && !isAdminLoggedIn && (
              <>
                <Link to="/login" className="bg-[#F3E3CE] hover:bg-[#EADBC8] text-[#8C330B] px-5 py-2 rounded-full font-medium text-sm transition-colors shadow-sm">
                  Sign In / Register
                </Link>
              </>
            )}

            {/* STATE 2: LOGGED IN AS REGULAR USER */}
            {isUserLoggedIn && !isAdminLoggedIn && (
              <div className="flex items-center space-x-4">
                <Link to="/saved" className="flex items-center gap-1.5 border border-[#EADBC8] bg-white hover:bg-[#FAF6F0] text-[#5C544E] px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                  <svg className="w-4 h-4 text-[#C85C11]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  Saved
                </Link>
                <div className="flex items-center gap-2 border border-[#EADBC8] bg-white px-3 py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-neutral-50 transition-colors">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-semibold text-amber-800">
                    {userName[0]}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{userName}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 text-gray-500 hover:text-red-600 text-sm font-medium transition-colors pl-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1"></path></svg>
                  Logout
                </button>
              </div>
            )}

            {/* STATE 3: LOGGED IN AS ADMIN */}
            {isAdminLoggedIn && (
              <div className="flex items-center space-x-3">
                <Link to="/admin" className="flex items-center gap-1.5 bg-[#F3E3CE] hover:bg-[#EADBC8] text-[#8C330B] px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 border border-[#EADBC8] bg-white px-4 py-2 rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-gray-700">Admin</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1 bg-[#FFF0F0] border border-red-200 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1"></path></svg>
                  Logout
                </button>
              </div>
            )}

          </div>

          {/* Mobile Menu Open Trigger */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(true)} className="text-[#5C544E] hover:text-[#C85C11] p-2">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE — OVERLAY EXPANDED SIDEBAR DRAWER MENU */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-sm md:hidden">
          <div className="w-80 bg-[#FAF6F0] h-full p-6 shadow-2xl flex flex-col relative animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-[#EADBC8]/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#C85C11] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🔥</span>
                </div>
                <span className="font-bold text-lg text-[#8C330B]">TempleHeritage</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full bg-gray-200/60 text-gray-600 hover:bg-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Central Navigation Links */}
            <div className="mt-6 space-y-2.5 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-[#F3E3CE] text-[#8C330B] font-semibold'
                      : 'text-[#5C544E] hover:bg-orange-50/60 hover:text-[#C85C11]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Footer Drawer Actions based on Auth Rules */}
            <div className="pt-4 border-t border-[#EADBC8]/50 space-y-3">
              {!isUserLoggedIn && !isAdminLoggedIn ? (
                <>
                  <Link 
                    to="/login" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#5C544E] hover:bg-orange-50/60 rounded-xl"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1"></path></svg>
                    Sign In / Register
                  </Link>
                  <Link 
                    to="/admin-login" 
                    onClick={() => setIsOpen(false)} 
                    className="block text-center bg-[#C85C11] text-white py-3 rounded-xl font-medium text-sm shadow-md hover:bg-[#A3470C] transition-colors"
                  >
                    🛡️ Admin Login
                  </Link>
                </>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h4a3 3 0 013 3v1"></path></svg>
                  Logout Account
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}