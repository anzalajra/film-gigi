"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60; // mirrors the server-side lockout window

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0); // seconds remaining while locked

  const locked = cooldown > 0;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          setAttempts(0);
          setError("");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setCooldown(LOCKOUT_SECONDS);
        setError("Terlalu banyak percobaan gagal. Coba lagi nanti.");
      } else {
        setError(`Email atau password salah. (${MAX_ATTEMPTS - next} percobaan tersisa)`);
      }
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  const mm = String(Math.floor(cooldown / 60)).padStart(2, "0");
  const ss = String(cooldown % 60).padStart(2, "0");

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-[#f5c842]/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_70%)]" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5c842] text-black font-black text-lg mb-4">
            FG
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Film Gigi</h1>
          <p className="text-white/40 text-sm mt-1">Masuk ke Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur-sm"
        >
          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Email</label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                disabled={locked}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/25 text-sm transition-colors focus:outline-none focus:border-[#f5c842]/70 focus:bg-white/[0.05] disabled:opacity-50"
                placeholder="admin@filmgigi.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-xs font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={locked}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-11 py-3 text-white placeholder:text-white/25 text-sm transition-colors focus:outline-none focus:border-[#f5c842]/70 focus:bg-white/[0.05] disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-red-400 text-xs bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2.5">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                {error}
                {locked && (
                  <span className="block text-red-400/70 mt-0.5 font-mono">
                    Coba lagi dalam {mm}:{ss}
                  </span>
                )}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || locked}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#f5c842] text-black font-semibold rounded-xl hover:bg-[#f5c842]/90 active:bg-[#f5c842]/80 transition-colors text-sm disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {locked ? "Terkunci sementara" : loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          Dilindungi terhadap percobaan login berlebih
        </p>
      </div>
    </div>
  );
}
