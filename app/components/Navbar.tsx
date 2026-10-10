"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Sparkles, User, Shield, Menu, X, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check user token in localStorage
    const storedUser = localStorage.getItem("namastey_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("namastey_token");
    localStorage.removeItem("namastey_user");
    setUser(null);
    window.location.href = "/portal/login";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-stone-900/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-xl"
          : "bg-gradient-to-b from-black/80 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-stone-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white font-serif">
              Namastey<span className="text-amber-400">.</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-amber-300/80 -mt-1 font-sans">
              VIP Welcome Services
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            Home
          </Link>
          <Link href="/portal/services" className="hover:text-amber-400 transition-colors">
            Services Catalogue
          </Link>
          <Link href="/portal/gallery" className="hover:text-amber-400 transition-colors">
            Gallery
          </Link>
          <Link href="/portal/support" className="hover:text-amber-400 transition-colors">
            Support & FAQ
          </Link>
          <Link href="/portal/booking" className="hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold text-amber-400">
            Request Quote <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right CTA / Auth Controls */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={user.role === "admin" || user.role === "super_admin" ? "/admin/dashboard" : "/portal/dashboard"}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/20 transition-all"
              >
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/portal/login"
                className="text-sm font-medium text-stone-300 hover:text-white px-3 py-2 transition-colors"
              >
                Client Login
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-1.5 text-xs text-amber-400/90 border border-amber-500/30 hover:border-amber-400 px-3 py-1.5 rounded-full transition-all bg-stone-900/60"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-stone-300 hover:text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-stone-950/95 backdrop-blur-xl border-b border-stone-800 px-6 py-6 space-y-4 text-stone-200">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-medium hover:text-amber-400"
          >
            Home
          </Link>
          <Link
            href="/portal/services"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-medium hover:text-amber-400"
          >
            Services Catalogue
          </Link>
          <Link
            href="/portal/gallery"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-medium hover:text-amber-400"
          >
            Gallery
          </Link>
          <Link
            href="/portal/support"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-medium hover:text-amber-400"
          >
            Support & FAQ
          </Link>
          <Link
            href="/portal/booking"
            onClick={() => setMobileOpen(false)}
            className="block text-lg font-semibold text-amber-400"
          >
            Request Quote Now
          </Link>

          <div className="pt-4 border-t border-stone-800 flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/portal/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-amber-500 text-stone-950 font-bold"
                >
                  Dashboard ({user.name})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 rounded-lg border border-stone-800 text-stone-400 text-sm"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/portal/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-stone-700 text-stone-200 font-medium"
                >
                  Client Login
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-sm font-medium"
                >
                  Admin Portal Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
