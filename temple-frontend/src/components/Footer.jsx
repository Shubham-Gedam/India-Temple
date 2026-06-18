import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1c0d02] text-[#a48e7a] font-sans antialiased selection:bg-[#e07a16]/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* --- SECTION 1: Top Identity & Visitor Card --- */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
          {/* Left Block: Brand Details */}
          <div className="max-w-xl space-y-4">
            <div className="flex items-center gap-3">
              {/* Simple Temple Icon Substitute (Use an SVG or Image if you have the exact logo asset) */}
              <span className="text-2xl text-[#e07a16]">🛕</span>
              <span className="font-serif font-bold text-2xl text-white tracking-wide">
                Temple<span className="text-[#e07a16]">Heritage</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#a48e7a]/90">
              A centralized digital archive preserving the historic
              significance, daily rituals, and sacred traditions of temple
              heritage across India.
            </p>
            {/* Meta Tags/Badges */}
            <div className="flex gap-2 pt-2">
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#e07a16] bg-[#e07a16]/10 border border-[#e07a16]/30 px-3 py-1 rounded">
                Incredible India
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#e07a16] bg-[#e07a16]/10 border border-[#e07a16]/30 px-3 py-1 rounded">
                Unified Mentor
              </span>
            </div>
          </div>

          {/* Right Block: Custom Floating Visitor Info Panel */}
          <div className="w-full lg:max-w-md bg-[#2d1908]/40 border border-[#e07a16]/20 p-5 rounded-xl shadow-lg flex items-start gap-4">
            <div className="text-[#e07a16] text-xl mt-0.5">
              {/* Information Circle Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 111.063 1.062 11.25 11.25 0 00-1.104-.042zM12 9v1.5m0 3v3.75m9-3.75a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-white">
                Visitor Information
              </h4>
              <p className="text-xs text-[#a48e7a]/80 leading-relaxed">
                Guidelines, customs, and timing schedules are verified manually
                by system admins. Visitors are advised to respect local
                traditional dress codes and photography protocols.
              </p>
            </div>
          </div>
        </div>

        {/* --- DECORATIVE LINE WITH ORANGE DOT --- */}
        <div className="relative flex items-center my-10">
          <div className="flex-grow border-t border-[#e07a16]/10"></div>
          <span className="absolute left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#e07a16] rounded-full"></span>
          <div className="flex-grow border-t border-[#e07a16]/10"></div>
        </div>

        {/* --- SECTION 2: Dynamic Links Navigation --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
          {/* Quick Discovery */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-[#e07a16]/20 pb-1 mb-4 inline-block">
              Quick Discovery
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/temples"
                  className="hover:text-white transition-colors"
                >
                  Explore All Temples
                </Link>
              </li>
              <li>
                <Link
                  to="/featured"
                  className="hover:text-white transition-colors"
                >
                  Featured Shrines
                </Link>
              </li>
              <li>
                <Link
                  to="/routes"
                  className="hover:text-white transition-colors"
                >
                  Pilgrimage Routes
                </Link>
              </li>
              <li>
                <Link
                  to="/festivals"
                  className="hover:text-white transition-colors"
                >
                  Sacred Festivals
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Project */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-[#e07a16]/20 pb-1 mb-4 inline-block">
              About & Project
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About the Project
                </Link>
              </li>
              <li>
                <Link
                  to="/mission"
                  className="hover:text-white transition-colors"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  to="/methodology"
                  className="hover:text-white transition-colors"
                >
                  Heritage Methodology
                </Link>
              </li>
              <li>
                <Link
                  to="/archives"
                  className="hover:text-white transition-colors"
                >
                  Contributing Archives
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="hover:text-white transition-colors"
                >
                  Academic Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide border-b border-[#e07a16]/20 pb-1 mb-4 inline-block">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/submit"
                  className="hover:text-white transition-colors"
                >
                  Submit Temple Info
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className="hover:text-white transition-colors"
                >
                  Report an Error
                </Link>
              </li>
              <li>
                <Link
                  to="/management"
                  className="hover:text-white transition-colors"
                >
                  Management Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* --- DECORATIVE LINE WITH ORANGE DOT --- */}
        <div className="relative flex items-center my-8">
          <div className="flex-grow border-t border-[#e07a16]/10"></div>
          <span className="absolute left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-[#e07a16] rounded-full"></span>
          <div className="flex-grow border-t border-[#e07a16]/10"></div>
        </div>

        {/* --- SECTION 3: Bottom Legal Bar --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#a48e7a]/60 gap-4 pt-2">
          <p>© {currentYear} India Temple Heritage Portal.</p>
          <div className="flex gap-4 items-center">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span>•</span>
            <Link to="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
