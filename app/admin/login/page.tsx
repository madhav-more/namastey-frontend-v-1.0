"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight, Lock, Mail } from "lucide-react";
import { api } from "../../utils/api";

export default function AdminLoginPage() {
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
        const user = response.data.user;
        if (user.role === "admin" || user.role === "super_admin") {
          localStorage.setItem("namastey_token", response.data.token);
          localStorage.setItem("namastey_user", JSON.stringify(user));
          window.location.href = "/admin/dashboard";
        } else {
          setError("Access Denied: You do not have permissions to access the Coordinator Dashboard.");
        }
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please verify coordinator details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Red/Amber Warning Ambient Accent */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-amber-950/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-stone-900/40 border border-red-500/20 rounded-2xl p-8 backdrop-blur-md relative z-10 shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-serif">
              Namastey<span className="text-red-500">.</span>
            </span>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-white mb-2">Coordinator Portal</h1>
          <p className="text-xs text-stone-400">
            Sign in with administrative privileges to manage booking quotes and active operations.
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
              Admin Email
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
                placeholder="admin@namastey.com"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-red-500/50 transition-colors"
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
                className="w-full bg-stone-950 border border-stone-800 rounded-xl py-3 pl-10 pr-4 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-red-500/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/10"
          >
            {loading ? "Verifying Credentials..." : "Authenticate"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-800/60 text-center">
          <Link href="/portal/login" className="text-xs text-stone-400 hover:text-stone-200 transition-colors">
            Return to Client Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
