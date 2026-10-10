"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";
import { api } from "../../utils/api";

export default function ClientLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.success && response.data?.token) {
        localStorage.setItem("namastey_token", response.data.token);
        localStorage.setItem("namastey_user", JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        window.location.href = "/portal/dashboard";
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-300/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-stone-900/40 border border-stone-800/80 rounded-2xl p-8 backdrop-blur-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-stone-950" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-serif">
              Namastey<span className="text-amber-400">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-xs text-stone-400">
            Sign in to review quotes, coordinate timelines, and manage bookings.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-800/60 text-center">
          <p className="text-xs text-stone-400">
            Don't have an account?{" "}
            <Link href="/portal/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
          <div className="mt-4">
            <Link href="/admin/login" className="text-[11px] text-amber-500/60 hover:text-amber-500 transition-colors">
              Access Coordinator Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
