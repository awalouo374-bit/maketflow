"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLock, MdVerified, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { IconType } from "react-icons";
import ErrorAlert from "@/components/shared/ErrorAlert";

type Feature = { icon: IconType; text: string };
const features: Feature[] = [
  { icon: MdLocalShipping, text: "Livraison rapide & gratuite dès 50€" },
  { icon: MdLock,          text: "Paiement 100% sécurisé" },
  { icon: MdVerified,      text: "Produits vérifiés & garantis" },
];

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setError(""); setLoading(true);
    const res = await fetch("/api/auth/code-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, name }) });
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
          <Image src="/Logo3.png" alt="MarketFlow" fill className="object-contain drop-shadow-[0_12px_32px_rgba(255,96,0,.4)]" />
        </div>
        <h2 className="text-white font-extrabold text-center mb-3 leading-tight text-[clamp(1.4rem,4vw,1.9rem)] tracking-tight">
          Bienvenue sur<br /><span className="text-[#ff8c3a]">MarketFlow</span>
        </h2>
        <p className="text-white/60 text-center text-sm leading-relaxed max-w-[280px] mb-8">
          La marketplace qui connecte acheteurs et vendeurs partout en France.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-[300px]">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/8 rounded-lg px-4 py-3 border border-white/10">
              <Icon size={16} className="text-[#ff8c3a] shrink-0" />
              <span className="text-white/80 text-xs font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="w-full max-w-[380px]">
          <div className="mb-6">
            <h1 className="font-bold text-2xl text-slate-900 mb-1 tracking-tight">Connexion</h1>
            <p className="text-slate-400 text-sm">Accédez à votre espace personnel.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Nom d'utilisateur</label>
              <input className="input py-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex : Jean Dupont" required autoComplete="username" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Code secret</label>
              <div className="relative">
                <input className="input py-3 pr-11" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Votre code d'accès" required type={showCode ? "text" : "password"} autoComplete="current-password" />
                <button type="button" onClick={() => setShowCode(!showCode)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer p-0">
                  {showCode ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>
            {error && <ErrorAlert message={error} />}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm justify-center mt-1">
              {loading ? <span className="flex items-center gap-2 justify-center"><span className="spinner-sm" /> Connexion...</span> : "Se connecter"}
            </button>
          </form>

          <div className="flex items-center gap-2 mt-5 px-4 py-3 bg-[#f5f5f5] rounded border border-[#e8e8e8]">
            <MdLock size={13} className="text-slate-400 shrink-0" />
            <p className="text-[0.72rem] text-slate-400 m-0">Connexion sécurisée par session chiffrée</p>
          </div>

          <p className="text-center mt-5 text-sm text-slate-400">
            <Link href="/" className="text-[#ff6000] font-semibold no-underline hover:text-[#e55400]">← Retour à la boutique</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
