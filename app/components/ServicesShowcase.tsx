import Link from "next/link";
import { Plane, Building2, Gift, CheckCircle2, ArrowRight } from "lucide-react";

export default function ServicesShowcase() {
  const categories = [
    {
      title: "Airport Services",
      icon: Plane,
      description: "Gate-to-curb escorting, priority clearance, porter handling, and wheelchair support.",
      image: "https://images.unsplash.com/photo-1540339832862-474599807836?q=80&w=1974&auto=format&fit=crop",
      services: ["Gate Meet & Greet", "VIP Fast-Track Immigration", "Curbside Airport Pickup", "Dedicated Baggage Porter", "Specialized Wheelchair Support"],
    },
    {
      title: "Corporate Services",
      icon: Building2,
      description: "Flawless arrival reception for corporate executives, board members, and high-value delegates.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2070&auto=format&fit=crop",
      services: ["Executive Chauffeur Pickup", "Delegations Visitor Reception", "Corporate Event Hospitality", "Customized Branding Placards", "Real-time Corporate Flight Tracking"],
    },
    {
      title: "Premium Hospitality",
      icon: Gift,
      description: "Memorable cultural welcome experiences featuring garlands, aarti, luxury cars, and gift hampers.",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
      services: ["Fresh Flower Bouquet", "Sacred Aarti & Tilak Blessing", "Custom Luxury Welcome Kit", "Premium Fleet Transport", "24x7 Dedicated Concierge"],
    },
  ];

  return (
    <section className="py-24 bg-stone-900 text-stone-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-amber-400 font-semibold font-sans">
            Curated Services
          </h2>
          <p className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
            Tailored Hospitality For Every Journey
          </p>
          <p className="text-stone-400 text-base font-light">
            Select from our comprehensive suites designed for international travelers, corporate VIPs, and family celebrations.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-stone-950/80 border border-stone-800/80 overflow-hidden hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between shadow-2xl"
              >
                {/* Top Image Banner */}
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-stone-950/80 backdrop-blur-md border border-stone-800 text-amber-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-stone-400 text-sm mt-2 font-light leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Services Included Checklist */}
                    <div className="mt-6 space-y-2.5 pt-4 border-t border-stone-800/60">
                      {cat.services.map((s, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-xs text-stone-300">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA link */}
                  <div className="pt-6">
                    <Link
                      href="/portal/booking"
                      className="w-full py-3 rounded-xl bg-stone-900 group-hover:bg-amber-500 group-hover:text-stone-950 text-amber-400 font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border border-stone-800 group-hover:border-amber-500"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link
            href="/portal/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-stone-950 border border-stone-700 hover:border-amber-400 text-stone-200 hover:text-amber-300 text-sm font-semibold transition-all shadow-xl"
          >
            <span>View Complete Catalogue & Inclusions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
