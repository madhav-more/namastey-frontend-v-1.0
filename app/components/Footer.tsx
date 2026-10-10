import Link from "next/link";
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, HeartHandshake, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800/60">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
                <Sparkles className="w-5 h-5 text-stone-950" />
              </div>
              <span className="text-2xl font-bold font-serif text-white tracking-tight">
                Namastey<span className="text-amber-400">.</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-stone-400">
              India&apos;s premier welcome service platform. Elevating airport hospitality, executive receptions, and cultural arrivals into unforgettable VIP experiences.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-300">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-medium">100% Certified VIP Protocol</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase font-serif">
              Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portal/services" className="hover:text-amber-400 transition-colors">
                  Airport Meet & Greet
                </Link>
              </li>
              <li>
                <Link href="/portal/services" className="hover:text-amber-400 transition-colors">
                  VIP Fast-Track Immigration
                </Link>
              </li>
              <li>
                <Link href="/portal/services" className="hover:text-amber-400 transition-colors">
                  Corporate Guest Reception
                </Link>
              </li>
              <li>
                <Link href="/portal/services" className="hover:text-amber-400 transition-colors">
                  Grand Indian Welcome (Garland & Aarti)
                </Link>
              </li>
              <li>
                <Link href="/portal/services" className="hover:text-amber-400 transition-colors">
                  Luxury Vehicle Chauffeur
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Links */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase font-serif">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/portal/booking" className="hover:text-amber-400 transition-colors">
                  Submit Quote Request
                </Link>
              </li>
              <li>
                <Link href="/portal/dashboard" className="hover:text-amber-400 transition-colors">
                  Customer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/portal/gallery" className="hover:text-amber-400 transition-colors">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link href="/portal/support" className="hover:text-amber-400 transition-colors">
                  Support & FAQ
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors text-amber-400/90 font-medium">
                  Admin Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase font-serif">
              Global Support
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 98765 43210 (24x7 VIP Desk)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@namastey.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Operating across major airports in Mumbai, Pune, Delhi, Solapur & Bangalore.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Namastey Hospitality Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Luggage & Air Protocol</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
