
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Top Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Column 1: App Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛕</span>
              <span className="font-bold text-lg text-white tracking-tight">
                Temple<span className="text-orange-500">Heritage</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A centralized digital archive preserving and showcasing the historic significance, daily rituals, and sacred traditions of temple heritage across India.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Quick Discovery
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition-colors">Home Portal</Link>
              </li>
              <li>
                <Link to="/temples" className="hover:text-orange-400 transition-colors">Explore All Temples</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-orange-400 transition-colors">Management Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Guidelines Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Visitor Information Note
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-800">
              ⚠️ Guidelines, customs, and timing schedules are verified manually by system admins. Visitors are advised to respect local traditional dress codes and photography protocols.
            </p>
          </div>

        </div>

        {/* Bottom Bar Container */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {currentYear} India Temple Heritage Portal. Built as an Internship Project.</p>
          <div className="flex gap-4 text-slate-500">
            <span>Incredible India</span>
            <span>•</span>
            <span>Unified Mentor</span>
          </div>
        </div>

      </div>
    </footer>
  );
}