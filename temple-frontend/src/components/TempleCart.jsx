import { Link } from 'react-router-dom';

export default function TempleCard({ name, location, deity, images, slug }) {
  // Array se pehli image nikalenge fallback placeholder ke sath
  const displayImage = images && images.length > 0 && images[0].url
    ? images[0].url
    : 'https://images.unsplash.com/photo-1600100397608-f010e42fa02e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      
      {/* Image Wrap Frame */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={displayImage} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-orange-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
          {deity}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {name}
        </h3>
        
        {/* Nested location structure verification */}
        <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1">
          <span>📍</span> {location?.city || 'Unknown City'}, {location?.state || 'Unknown State'}
        </p>

        {/* Link Button trigger via slug instead of id */}
        <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
          <Link 
            to={`/temples/${slug}`}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors inline-flex items-center gap-1"
          >
            View Heritage Profile <span>→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}