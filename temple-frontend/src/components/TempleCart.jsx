
import { Link } from 'react-router-dom';

export default function TempleCard({ id, name, location, deity, image }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      
      {/* Temple Image */}
      <div className="relative h-48 w-full bg-slate-100">
        <img 
          src={image || 'https://images.unsplash.com/photo-1600100397608-f010e42fa02e?auto=format&fit=crop&w=600&q=80'} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        {/* Dynamic Badge for Primary Deity */}
        <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
          {deity}
        </span>
      </div>
      {/* Card Content Wrapper */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 tracking-tight line-clamp-1">
          {name}
        </h3>
        
        {/* Location Row */}
        <p className="text-slate-500 text-sm mt-1.5 flex items-center gap-1.5">
          <span className="text-base text-orange-500">📍</span> {location}
        </p>

        {/* Dynamic Description Space / Filler Text */}
        <p className="text-slate-600 text-sm mt-3 line-clamp-2 flex-grow">
          Explore the divine history, daily rituals, and guidelines for visiting this holy heritage site.
        </p>

        {/* Action Button linking to Details Route */}
        <Link 
          to={`/temples/${id}`}
          className="w-full mt-5 text-center bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold py-2 rounded-md transition-colors text-sm"
        >
          View Pilgrimage Guide →
        </Link>
      </div>

    </div>
  );
}