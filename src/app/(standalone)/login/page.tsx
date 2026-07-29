"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLock, MdStar } from "react-icons/md";
import { IconType } from "react-icons";
import ErrorAlert from "@/components/shared/ErrorAlert";

type Feature = { icon: IconType; text: string };

const features: Feature[] = [
  { icon: MdLocalShipping, text: "Livraison rapide & gratuite" },
  { icon: MdLock,          text: "Paiement 100% sécurisé" },
  { icon: MdStar,          text: "Qualité garantie" },
];

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        <div className="login-logo">
          <Image src="/Logo3.png" alt="MarketFlow" fill className="object-contain drop-shadow-[0_12px_30px_rgba(249,115,22,.35)]" />
        </div>
        <h2 className="text-white font-extrabold text-center mb-3 leading-tight text-[clamp(1.3rem,4vw,1.75rem)] tracking-tight">
          Bienvenue sur<br /><span className="text-orange-500">MarketFlow</span>
        </h2>
        <p className="text-[#a5b4d4] text-center leading-7 max-w-[300px] text-[0.9rem]">
          Achetez, Vendez, Grandissez — la marketplace qui vous propulse.
        </p>
        <div className="flex flex-col gap-3 mt-8 w-full max-w-[280px]">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 bg-white/[.07] rounded-[10px] px-4 py-2.5 border border-white/10">
              <Icon size={18} className="text-orange-500 shrink-0" />
              <span className="text-border text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="login-right">
        <div className="w-full max-w-[380px]">
          <h1 className="font-extrabold text-slate-900 tracking-tight mb-1.5 text-[clamp(1.3rem,4vw,1.6rem)]">Connexion</h1>
          <p className="text-slate-500 text-[0.9rem] mb-7">Entrez vos identifiants pour accéder à votre compte.</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-[18px]">
            <label className="flex flex-col gap-1.5">
              <span className="field-label">Nom d'utilisateur</span>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Jean Dupont" required autoComplete="username" />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="field-label">Code secret</span>
              <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Votre code d'accès" required type="password" autoComplete="current-password" />
            </label>

            {error && <ErrorAlert message={error} />}

            <button type="submit" disabled={loading} className="btn-primary py-3.5 rounded-xl text-[0.95rem] mt-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner-sm" />
                  Connexion...
                </span>
              ) : "Se connecter →"}
            </button>
          </form>

          <div className="mt-6 px-4 py-3 bg-slate-50 rounded-[10px] border border-slate-200 flex items-center justify-center gap-2">
            <MdLock size={14} className="text-slate-500" />
            <p className="text-[0.78rem] text-slate-500 m-0">Connexion sécurisée par session chiffrée</p>
          </div>

          <p className="text-center mt-5 text-slate-400 text-sm">
            <Link href="/" className="text-orange-500 font-semibold no-underline">← Retour à la boutique</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
