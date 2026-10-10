import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Clock, Star, MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-stone-950">
      {/* Background Image Overlay with Dark Gradients */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* VIP Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-amber-500/10 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Next-Generation VIP Arrival & Greeting Protocol</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif text-white tracking-tight leading-[1.15]">
          Unforgettable Hospitality, <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent italic font-normal">
            From Arrival to Departure.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-stone-300 text-base sm:text-lg leading-relaxed font-light">
          Whether you require gate-side airport escorting, executive limousine pickup, or traditional Indian garland greetings, Namastey orchestrates personalized welcome experiences with white-glove precision.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/portal/booking"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Request Custom Quotation</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/portal/services"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-700 text-stone-200 font-semibold text-base backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Services</span>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-stone-800/80 text-left">
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-white text-sm font-semibold">Airport Fast-Track</h3>
            <p className="text-stone-400 text-xs mt-1">Bypass immigration & check-in lines seamlessly.</p>
          </div>
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <Clock className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-white text-sm font-semibold">Real-Time Tracker</h3>
            <p className="text-stone-400 text-xs mt-1">Live status updates from request to completion.</p>
          </div>
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <Star className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-white text-sm font-semibold">Cultural Themes</h3>
            <p className="text-stone-400 text-xs mt-1">Traditional Indian, Temple & Bhangra welcomes.</p>
          </div>
          <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/60 backdrop-blur-sm">
            <MapPin className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-white text-sm font-semibold">Multi-City Coverage</h3>
            <p className="text-stone-400 text-xs mt-1">Mumbai, Pune, Delhi, Solapur & beyond.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
