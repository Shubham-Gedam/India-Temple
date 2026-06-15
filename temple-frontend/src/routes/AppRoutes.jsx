import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Temples from '../pages/Temples';
import TempleDetails from '../pages/TemplesDetails';
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AppRoutes() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/temples" element={<Temples />} />
            <Route path="/temples/:id" element={<TempleDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}