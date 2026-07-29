"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLock, MdStar, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { IconType } from "react-icons";
import ErrorAlert from "@/components/shared/ErrorAlert";

type Feature = { icon: IconType; text: string };

const features: Feature[] = [
  { icon: MdLocalShipping, text: "Livraison rapide & gratuite" },
  { icon: MdLock,          text: "Paiement 100% sécurisé" },
  { icon: MdStar,          text: "Qualité garantie ou remboursé" },
];

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/code-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, name }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push(data.user.role === "ADMIN" ? "/admin" : "/");
    router.refresh();
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-glow" />
        <div className="login-glow-2" />

        <div className="login-logo">
          <Image src="/Logo3.png" alt="MarketFlow" fill className="object-contain drop-shadow-[0_16px_40px_rgba(249,115,22,.4)]" />
        </div>

        <h2 className="text-white font-extrabold text-center mb-3 leading-tight text-[clamp(1.4rem,4vw,1.85rem)] tracking-tight">
          Bienvenue sur<br />
          <span className="bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">MarketFlow</span>
        </h2>
        <p className="text-slate-300/70 text-center leading-7 max-w-[300px] text-sm mb-10">
          La marketplace qui connecte acheteurs et vendeurs partout en France.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[300px]">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/6 rounded-2xl px-4 py-3 border border-white/8 backdrop-blur-sm hover:bg-white/9 transition-colors">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-orange-400" />
              </div>
              <span className="text-slate-200 text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="w-full max-w-[400px] animate-fade-up">
          <div className="mb-8">
            <h1 className="font-extrabold text-slate-900 tracking-tight mb-2 text-[clamp(1.5rem,4vw,1.75rem)]">Connexion</h1>
            <p className="text-slate-400 text-sm">Entrez vos identifiants pour accéder à votre espace.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="field-label">Nom d'utilisateur</span>
              <input
                className="input py-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                required
                autoComplete="username"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="field-label">Code secret</span>
              <div className="relative">
                <input
                  className="input py-3 pr-12"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Votre code d'accès"
                  required
                  type={showCode ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  {showCode ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </label>

            {error && <ErrorAlert message={error} />}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3.5 rounded-2xl text-sm mt-1 w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2.5 justify-center">
                  <span className="spinner-sm" />
                  Connexion en cours...
                </span>
              ) : "Se connecter →"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2.5 px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <MdLock size={15} className="text-slate-400 shrink-0" />
            <p className="text-xs text-slate-400 m-0 leading-snug">Connexion sécurisée par session chiffrée — vos données sont protégées.</p>
          </div>

          <p className="text-center mt-6 text-slate-400 text-sm">
            <Link href="/" className="text-orange-500 font-semibold no-underline hover:text-orange-600 transition-colors">← Retour à la boutique</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
