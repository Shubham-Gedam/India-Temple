import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check if an admin or user is currently logged in (by checking localStorage tokens)
  const isAdminLoggedIn = !!localStorage.getItem('token'); 
  const isUserLoggedIn = !!localStorage.getItem('userToken'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userToken');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Brand Link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🛕</span>
              <span className="font-bold text-xl tracking-tight text-orange-700">
                Temple<span className="text-slate-700">Heritage</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-slate-600 hover:text-orange-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/temples" className="text-slate-600 hover:text-orange-600 font-medium transition-colors">
              Explore Temples
            </Link>

            {/* Conditional Authentication Buttons */}
            {isAdminLoggedIn || isUserLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 font-medium transition-colors text-sm"
              >
                Logout
              </button>
            ) : (
              <>
                {/* Regular User Access (Login / Register) */}
                <Link to="/login" className="text-slate-600 hover:text-orange-600 font-medium transition-colors text-sm">
                  Sign In / Register
                </Link>

                {/* Dedicated Admin Portal Route */}
                <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
                  Admin Login
                </Link>
              </>
            )}
            
            {/* Quick Link to Dashboard if Admin is already authorized */}
            {isAdminLoggedIn && (
              <Link to="/admin" className="text-orange-600 font-semibold text-sm hover:underline">
                Dashboard ⚙️
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-orange-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-slate-600 hover:bg-orange-50 rounded-md">Home</Link>
          <Link to="/temples" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-slate-600 hover:bg-orange-50 rounded-md">Explore Temples</Link>
          
          {isAdminLoggedIn || isUserLoggedIn ? (
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block px-3 py-2 text-red-600 font-medium">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-slate-600 hover:bg-orange-50 rounded-md">Sign In / Register</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center bg-orange-600 text-white px-3 py-2 rounded-md font-medium">Admin Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}