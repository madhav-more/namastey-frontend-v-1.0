"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Sparkles, Check, ArrowRight, ShieldCheck, Clock, Award } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<"packages" | "themes" | "addons">("packages");

  const packages = [
    {
      id: "namastey-classic",
      name: "Namastey Classic",
      tagline: "Sophisticated Traditional Greeting",
      description: "A refined welcome featuring a premium placard, folded hands Namaste, and a sacred vermillion Tilak blessing.",
      price: "₹499",
      includes: [
        "Personalized digital/physical placard",
        "Traditional greeting with folded hands",
        "Sacred vermillion Tilak blessing",
        "Complimentary bottled mineral water",
        "Luggage assistance to the transport bay"
      ],
      duration: "30-45 mins coordination",
      popular: true
    },
    {
      id: "celebration-delight",
      name: "Celebration Delight",
      tagline: "Vibrant & Joyful Milestone Arrival",
      description: "Transform an ordinary arrival into an unforgettable celebration with balloons, fresh flowers, a celebration cake, and active photography.",
      price: "₹1,499",
      includes: [
        "All features of Namastey Classic",
        "Vibrant premium balloon bouquet",
        "Exquisite fresh flower hand bouquet",
        "Delectable personal celebration cake",
        "Professional digital photo capture"
      ],
      duration: "45-60 mins coordination",
      popular: false
    },
    {
      id: "grand-indian-welcome",
      name: "Grand Indian Welcome",
      tagline: "Royal Hospitality Extravaganza",
      description: "The ultimate royal treatment. Experience a grand garland welcome, traditional Aarti ceremony with brass diya, and live shehnai instrumental music.",
      price: "₹2,999",
      includes: [
        "All features of Celebration Delight",
        "Fresh premium marigold/rose garland",
        "Traditional welcoming Aarti ceremony",
        "Live Shehnai performance (subject to availability)",
        "VIP Fast-track airport transit guidance"
      ],
      duration: "60-90 mins coordination",
      popular: false
    },
    {
      id: "custom-package",
      name: "Custom Package",
      tagline: "Bespoke Welcoming Experience",
      description: "Take control of every detail. Choose our base coordination service and layer on custom add-ons according to your guest's exact needs.",
      price: "₹299",
      includes: [
        "Base welcome coordination fee",
        "Personalized digital placard",
        "Flexible add-on structure",
        "Custom request support channel"
      ],
      duration: "Varies by selected add-ons",
      popular: false
    }
  ];

  const themes = [
    {
      id: "indian-traditional",
      name: "Indian Traditional",
      description: "Classic Indian welcome with folded hands Namaste, elegant kurta-clad greeters, and sandalwood fragrance.",
      costume: "Traditional Kurta / Saree with gold border",
      features: ["Sandalwood tilak blessing", "Folded-hands greeting gesture", "Welcome scroll message"]
    },
    {
      id: "south-indian-temple",
      name: "South Indian Temple Welcome",
      description: "Graceful temple-inspired welcome featuring brass lamps, jasmine flowers, and traditional instrumental background music.",
      costume: "White Silk Veshti / Traditional Kanjeevaram Saree",
      features: ["Jasmine flower gajra offering", "Brass kuthu vilakku lighting", "Sacred ash blessing"]
    },
    {
      id: "punjabi-bhangra",
      name: "Punjabi Bhangra Beat",
      description: "High-energy celebratory welcome complete with live dhol drum beats, colorful dancers, and refreshing traditional Lassi.",
      costume: "Vibrant Punjabi Phulkari Kurta & Turban",
      features: ["Live Dhol drums rhythm", "Bhangra dance presentation", "Chilled Punjabi Lassi offering"]
    },
    {
      id: "marwari-aarti",
      name: "Marwari Aarti",
      description: "Royal Rajasthani hospitable reception involving a customized Aarti thali, fresh marigold garlands, and authentic folk music.",
      costume: "Royal Rajasthani Bandhani / Leheriya attire",
      features: ["Royal aarti ceremony", "Saffron tilak blessing", "Marigold petal shower"]
    }
  ];

  const addons = [
    { name: "Fresh Flowers", price: "₹299", desc: "An elegant bouquet of fresh roses and carnations.", icon: "🌸" },
    { name: "Premium Chocolate Box", price: "₹399", desc: "Assorted luxury chocolates from fine chocolatiers.", icon: "🍫" },
    { name: "Recorded Video Greeting", price: "₹199", desc: "Professional videographer captures the greeting moment.", icon: "🎥" },
    { name: "Live Musician", price: "₹1,999", desc: "Live instrumental artist (Flute/Violin/Shehnai) at the gate.", icon: "🎵" },
    { name: "VIP Red Carpet", price: "₹999", desc: "Roll out a premium red carpet walkway for your VIP guest.", icon: "🎗️" }
  ];

  const faqs = [
    {
      q: "How does the quote-based booking system work?",
      a: "Because airport terminal policies, VIP restrictions, luggage volumes, and custom requests vary, all reservations start as a 'Quote Request'. Our admin panel reviews the specifications and submits a personalized quotation. You can then accept and pay via your dashboard."
    },
    {
      q: "Can I book a welcome service for a guest?",
      a: "Absolutely. During checkout, you can select whether you are booking for yourself or sponsoring a guest. You will enter the guest's contact info, flight details, and any specialized requirements."
    },
    {
      q: "What happens if a flight is delayed?",
      a: "Our operations team monitors flight numbers in real-time. If your guest's flight is delayed, our greeting crew will automatically adjust their schedule at no extra charge to ensure they are present right when they land."
    },
    {
      q: "Are the greeters certified?",
      a: "Yes. All Namastey greeters undergo strict background checks, premium hospitality training, and language proficiency tests to deliver a world-class welcome experience."
    }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Header Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Services Catalog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Curated Experiences, Royal Hospitality
          </h1>
          <p className="max-w-2xl mx-auto text-stone-400 text-base md:text-lg">
            Choose from our pre-designed greeting packages, select a regional cultural theme, and customize with bespoke add-ons for the perfect welcome.
          </p>
        </section>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex justify-center border-b border-stone-800">
            <nav className="flex space-x-8" aria-label="Tabs">
              {(["packages", "themes", "addons"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-all ${
                    activeTab === tab
                      ? "border-amber-500 text-amber-400"
                      : "border-transparent text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {tab === "addons" ? "Premium Add-ons" : tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {activeTab === "packages" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-2xl bg-stone-900/40 border p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-stone-900/60 ${
                    pkg.popular
                      ? "border-amber-500/50 shadow-lg shadow-amber-500/5"
                      : "border-stone-800"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 right-4 bg-amber-500 text-stone-950 text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full shadow-lg">
                      Popular
                    </span>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 font-serif">{pkg.name}</h3>
                    <p className="text-xs text-amber-400/90 font-medium mb-3">{pkg.tagline}</p>
                    <p className="text-stone-400 text-sm mb-5 leading-relaxed">{pkg.description}</p>
                    
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-2xl font-bold text-white">{pkg.price}</span>
                      <span className="text-xs text-stone-500">base fee</span>
                    </div>

                    <div className="border-t border-stone-800/80 pt-5 space-y-3">
                      {pkg.includes.map((inc, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <span className="text-xs text-stone-300">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-stone-800/60 flex flex-col gap-3">
                    <div className="flex items-center gap-1 text-[11px] text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                      <span>{pkg.duration}</span>
                    </div>
                    <Link
                      href={`/portal/booking?package=${pkg.id}`}
                      className="w-full text-center py-2.5 rounded-xl bg-amber-500 text-stone-950 font-semibold text-sm hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 group"
                    >
                      <span>Select & Customize</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "themes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="rounded-2xl bg-stone-900/30 border border-stone-800 p-8 flex flex-col justify-between hover:border-amber-500/20 hover:bg-stone-900/50 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-serif font-bold text-white">{theme.name}</h3>
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-stone-400 text-sm mb-6 leading-relaxed">{theme.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-amber-300/80 uppercase font-semibold tracking-wider block mb-1">
                          Attire / Dress Code
                        </span>
                        <p className="text-sm text-stone-300">{theme.costume}</p>
                      </div>

                      <div>
                        <span className="text-xs text-amber-300/80 uppercase font-semibold tracking-wider block mb-2">
                          Key Ceremonies
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {theme.features.map((feat, i) => (
                            <li key={i} className="bg-stone-900/60 border border-stone-800 rounded-lg p-2.5 text-center text-xs text-stone-300">
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-stone-800/80">
                    <Link
                      href={`/portal/booking?theme=${theme.id}`}
                      className="inline-flex items-center gap-2 text-sm text-amber-400 font-semibold hover:text-amber-300 transition-colors group"
                    >
                      <span>Book with this Theme</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "addons" && (
            <div className="max-w-4xl mx-auto bg-stone-900/20 border border-stone-800 rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {addons.map((addon, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-amber-500/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center text-2xl shadow-inner">
                      {addon.icon}
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="font-bold text-white text-sm">{addon.name}</h4>
                        <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          {addon.price}
                        </span>
                      </div>
                      <p className="text-stone-400 text-xs leading-relaxed">{addon.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-stone-800 text-center">
                <p className="text-stone-400 text-xs mb-4">
                  Add-ons can be selected and combined during the Quote Booking Wizard process.
                </p>
                <Link
                  href="/portal/booking"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-sm px-6 py-3 rounded-full hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/10"
                >
                  <span>Open Booking Wizard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Quality Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 to-amber-300/5 border border-amber-500/20 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-3">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Our Premium Standards</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                Experience Luxury at Every Touchpoint
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                From real-time flight tracking coordinates to a dedicated personal greeter panel, we ensure airport welcomes are prompt, luxurious, and seamless.
              </p>
            </div>
            <Link
              href="/portal/booking"
              className="px-8 py-3.5 rounded-full bg-white text-stone-950 font-bold text-sm hover:bg-stone-200 transition-colors shadow-xl shrink-0"
            >
              Request Custom Quote
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif font-bold text-center text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-stone-800/80 pb-5">
                <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <span className="text-amber-500 font-serif">Q.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
