import React from 'react';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <div className="antialiased font-sans bg-slate-50 min-h-screen selection:bg-orange-100 selection:text-orange-900">
      {/* This renders your entire application routing network.
        Navbar, Footer, and Page content are controlled safely inside it.
      */}
      <AppRoutes />
    </div>
  );
}