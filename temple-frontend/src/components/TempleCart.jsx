import { Link } from 'react-router-dom';

// Prop destructuring me hum id aur image dono backup variables ko add kar rahe hain
export default function TempleCard({ id, _id, name, location, deity, images, image, slug }) {
  
  // 1. 🌟 DYNAMIC IMAGE FALLBACK MATRIX
  // Agar pure string dynamic variable 'image' ho ya nested schema matrix 'images' array ho, dono ko automatic pull karega
  let displayImage = 'https://images.unsplash.com/photo-1600100397608-f010e42fa02e?auto=format&fit=crop&w=600&q=80';

  if (Array.isArray(images) && images.length > 0 && images[0]?.url) {
    displayImage = images[0].url;
  } else if (image && typeof image === 'string' && image.trim() !== '') {
    displayImage = image;
  } else if (images && typeof images === 'string' && images.trim() !== '') {
    displayImage = images;
  }

  // 2. 📍 SAFE LOCATION STRING AND OBJECT INTERPOLATION
  // Agar location backend se pure object standard me aaya hai ya parent ne string pass ki hai, safe handle hoga
  let displayCity = 'Unknown City';
  let displayState = 'Unknown State';

  if (location && typeof location === 'object') {
    displayCity = location.city || 'Unknown City';
    displayState = location.state || 'Unknown State';
  } else if (typeof location === 'string' && location.includes(',')) {
    const parts = location.split(',');
    displayCity = parts[0]?.trim() || displayCity;
    displayState = parts[1]?.trim() || displayState;
  } else if (typeof location === 'string') {
    displayCity = location;
  }

  // 3. 🔗 SECURE LOG NAVIGATION ROUTE IDENTIFIER
  // Agar routing system slug mangta hai toh priority slug ko, warna MongoDB ObjectId (_id/id) ko backup milega
  const activeRouteParam = slug || _id || id;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group h-full justify-between">
      
      <div>
        {/* Image Wrap Frame */}
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img 
            src={displayImage} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              // Network stream failure handle karne ke liye absolute image placeholder logic
              e.target.src = 'https://images.unsplash.com/photo-1600100397608-f010e42fa02e?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-orange-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-wide">
            {deity}
          </div>
        </div>

        {/* Details Container */}
        <div className="p-5 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {name}
          </h3>
          
          {/* Dynamic Rendered Checked Location Map Output */}
          <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
            <span>📍</span> {displayCity}, {displayState}
          </p>
        </div>
      </div>

      {/* Footer Link Action Row */}
      <div className="px-5 pb-5">
        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <Link 
            to={`/temples/${activeRouteParam}`}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors inline-flex items-center gap-1 group-hover:underline"
          >
            View Heritage Profile <span>→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}