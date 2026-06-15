import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <div className="antialiased font-sans bg-slate-50 min-h-screen selection:bg-orange-100 selection:text-orange-900">
      <AppRoutes />
    </div>
  );
}