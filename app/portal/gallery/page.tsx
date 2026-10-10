"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useState } from "react";
import { Sparkles, Eye, Camera, Calendar } from "lucide-react";

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "airport" | "vip" | "decor" | "fleet">("all");
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const galleryItems = [
    {
      id: 1,
      category: "airport",
      title: "Gate 1 Aerobridge Greeting",
      desc: "Traditional welcome plaque greeting for an incoming international corporate delegate.",
      symbol: "✈️",
      date: "June 2026"
    },
    {
      id: 2,
      category: "vip",
      title: "Royal Aarti Welcome",
      desc: "Sacred Aarti blessing and marigold garland welcome ceremony in the arrival lounge.",
      symbol: "🌸",
      date: "July 2026"
    },
    {
      id: 3,
      category: "decor",
      title: "VIP Arrival Lounge Setup",
      desc: "Custom brass lamps, fresh floral arches, and red carpet installation for high-profile milestones.",
      symbol: "🏺",
      date: "May 2026"
    },
    {
      id: 4,
      category: "fleet",
      title: "Premium Luxury Sedans",
      desc: "Rolls Royce and Mercedes Benz fleet aligned in the VIP terminal bay for airport transfers.",
      symbol: "🚗",
      date: "July 2026"
    },
    {
      id: 5,
      category: "airport",
      title: "Luggage Porter Operations",
      desc: "Seamless luggage handling from customs conveyor directly to the parked VIP vehicle.",
      symbol: "💼",
      date: "May 2026"
    },
    {
      id: 6,
      category: "vip",
      title: "South Indian Temple Ceremony",
      desc: "Kurta-clad greeting coordinators conducting traditional temple welcomes.",
      symbol: "🥥",
      date: "April 2026"
    },
    {
      id: 7,
      category: "decor",
      title: "Personalized Garlands Detail",
      desc: "Handcrafted rose and jasmine flower garlands designed specifically for incoming dignitaries.",
      symbol: "🌹",
      date: "March 2026"
    },
    {
      id: 8,
      category: "fleet",
      title: "VIP Buggy Transfers",
      desc: "Airside electric buggy transport escorting guests through airport transit zones.",
      symbol: "🏎️",
      date: "July 2026"
    }
  ];

  const filteredItems = filter === "all" ? galleryItems : galleryItems.filter(item => item.category === filter);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
              <Camera className="w-3.5 h-3.5" />
              <span>Namastey Visual Portfolio</span>
            </div>
            <h1 className="text-4xl font-serif font-bold text-white mb-4">
              Moments of Royal Welcome
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm">
              Take a visual tour of our bespoke airport greetings, regional themes, floral aesthetics, and luxury vehicle operations.
            </p>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: "all", label: "All Portfolio" },
              { id: "airport", label: "Airport Greeting" },
              { id: "vip", label: "VIP Ceremonies" },
              { id: "decor", label: "Event Decor" },
              { id: "fleet", label: "Luxury Fleets" }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  filter === btn.id
                    ? "bg-amber-500 border-amber-500 text-stone-950"
                    : "border-stone-850 bg-stone-900/20 text-stone-400 hover:text-stone-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActivePhoto(item.title)}
                className="group relative rounded-2xl bg-stone-900/30 border border-stone-850 p-6 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-amber-500/25 transition-all duration-300"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-4xl mb-4 group-hover:scale-102 transition-transform shadow-inner relative">
                    <span>{item.symbol}</span>
                    <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-amber-400" />
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
                  <p className="text-stone-400 text-xs leading-relaxed line-clamp-3">{item.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/60 flex items-center justify-between text-[10px] text-stone-500">
                  <span className="capitalize text-amber-500/80 font-bold tracking-wider">{item.category}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </section>
      </main>

      {/* Lightbox Modal (Simulated) */}
      {activePhoto && (
        <div 
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="max-w-2xl w-full text-center space-y-4" onClick={e => e.stopPropagation()}>
            <div className="h-64 sm:h-96 rounded-2xl bg-stone-900 flex items-center justify-center border border-stone-800 relative">
              <span className="text-8xl select-none">
                {galleryItems.find(i => i.title === activePhoto)?.symbol}
              </span>
              <button 
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-stone-800 text-white text-xs font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">{activePhoto}</h2>
              <p className="text-stone-400 text-xs sm:text-sm mt-1">
                {galleryItems.find(i => i.title === activePhoto)?.desc}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
