"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/code-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code, name }) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push(data.user.role === "ADMIN" ? "/admin" : "/");
    router.refresh();
  }

  return (
    <>
      <style>{`
        .login-container { min-height: 100vh; display: flex; flex-direction: column; background: linear-gradient(135deg,#0d1a45 0%,#1a2d6b 60%,#2a3f8f 100%); }
        @media (min-width: 768px) { .login-container { flex-direction: row; } }

        .login-left { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 24px; position: relative; overflow: hidden; }
        @media (min-width: 768px) { .login-left { padding: 60px; } }

        .login-right { width: 100%; display: flex; align-items: center; justify-content: center; padding: 32px 24px; background: white; }
        @media (min-width: 768px) { .login-right { width: 480px; padding: 40px 48px; border-radius: 24px 0 0 24px; } }

        .login-logo { width: 160px; height: 160px; position: relative; margin-bottom: 24px; }
        @media (min-width: 768px) { .login-logo { width: 220px; height: 220px; margin-bottom: 32px; } }
      `}</style>

      <div className="login-container">
        {/* Panneau gauche — branding */}
        <div className="login-left">
          <div style={{ position: "absolute", top: -100, right: -60, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,.15) 0%,transparent 70%)", pointerEvents: "none" }} />
          <div className="login-logo">
            <Image src="/Logo3.png" alt="MarketFlow" fill style={{ objectFit: "contain", filter: "drop-shadow(0 12px 30px rgba(249,115,22,.35))" }} />
          </div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "clamp(1.3rem,4vw,1.75rem)", letterSpacing: "-0.03em", textAlign: "center", marginBottom: 12, lineHeight: 1.3 }}>
            Bienvenue sur<br /><span style={{ color: "#f97316" }}>MarketFlow</span>
          </h2>
          <p style={{ color: "#a5b4d4", textAlign: "center", lineHeight: 1.7, maxWidth: 300, fontSize: "0.9rem" }}>
            Achetez, Vendez, Grandissez — la marketplace qui vous propulse.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 32, width: "100%", maxWidth: 280 }}>
            {[["🚚","Livraison rapide & gratuite"],["🔒","Paiement 100% sécurisé"],["⭐","Qualité garantie"]].map(([icon,text]) => (
              <div key={text as string} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.07)", borderRadius: 10, padding: "10px 16px", border: "1px solid rgba(255,255,255,.1)" }}>
                <span style={{ fontSize: "1.1rem" }}>{icon}</span>
                <span style={{ color: "#e2e8f0", fontSize: "0.85rem", fontWeight: 500 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau droit — formulaire */}
        <div className="login-right">
          <div style={{ width: "100%", maxWidth: 380 }}>
            <h1 style={{ fontWeight: 800, fontSize: "clamp(1.3rem,4vw,1.6rem)", color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 6 }}>Connexion</h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 28 }}>Entrez vos identifiants pour accéder à votre compte.</p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>Nom d'utilisateur</span>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Jean Dupont" required autoComplete="username" style={{ padding: "12px 14px" }} />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>Code secret</span>
                <input className="input" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Votre code d'accès" required type="password" autoComplete="current-password" style={{ padding: "12px 14px" }} />
              </label>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚠️</span><span style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 500 }}>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "14px", borderRadius: 12, fontSize: "0.95rem", marginTop: 4 }}>
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />
                      Connexion...
                    </span>
                  : "Se connecter →"}
              </button>
            </form>

            <div style={{ marginTop: 24, padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0", textAlign: "center" }}>
              <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>🔒 Connexion sécurisée par session chiffrée</p>
            </div>

            <p style={{ textAlign: "center", marginTop: 20, color: "#94a3b8", fontSize: "0.85rem" }}>
              <Link href="/" style={{ color: "#f97316", fontWeight: 600, textDecoration: "none" }}>← Retour à la boutique</Link>
            </p>
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
