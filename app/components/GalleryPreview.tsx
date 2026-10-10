import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";

export default function GalleryPreview() {
  const items = [
    {
      title: "Airport VIP Arrival",
      category: "Airport Welcome Setups",
      image: "https://images.unsplash.com/photo-1540339832862-474599807836?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Royal Indian Garland Greeting",
      category: "Welcome Decorations",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Executive Chauffeur Chaperone",
      category: "Premium Vehicle Fleet",
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Delegation Reception Desk",
      category: "Corporate Reception",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Grand Cultural Dhol Beat",
      category: "Event Hospitality",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "Luxury Concierge Welcome Kit",
      category: "VIP Arrivals",
      image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-24 bg-stone-900 text-stone-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              <Camera className="w-4 h-4" />
              <span>Proven Excellence</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
              Moments of Splendor
            </h2>
          </div>
          <Link
            href="/portal/gallery"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold text-sm transition-colors"
          >
            <span>View Complete Photo Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative h-72 rounded-2xl overflow-hidden border border-stone-800 shadow-xl cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${item.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-widest">
                  {item.category}
                </span>
                <h3 className="text-lg font-bold font-serif text-white group-hover:text-amber-200 transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
