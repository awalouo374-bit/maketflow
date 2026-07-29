"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = { role?: "CLIENT" | "ADMIN"; userName?: string };

export default function Navbar({ role, userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/panier");
        if (res.ok) { const d = await res.json(); setCartCount(d.items?.length ?? 0); }
      } catch { /* */ }
    }
    if (userName) loadCart();
  }, [pathname, userName]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  async function logout() {
    await fetch("/api/auth/code-login", { method: "DELETE" });
    router.push("/login"); router.refresh();
  }

  return (
    <>
      <style>{`
        .nav-link { display: inline-flex; align-items: center; padding: 7px 14px; border-radius: 8px; text-decoration: none; font-size: 0.875rem; font-weight: 500; color: #475569; background: transparent; border-bottom: 2px solid transparent; }
        .nav-link--active { color: #f97316; background: #fff4ed; border-bottom-color: #f97316; }
        .nav-link:hover:not(.nav-link--active) { background: #f8fafc; color: #0f172a; }
        .mobile-menu { position: fixed; top: 68px; left: 0; right: 0; background: white; border-bottom: 1px solid #e2e8f0; padding: 16px; z-index: 40; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 8px 16px rgba(0,0,0,.08); }
        @media (min-width: 768px) { .mobile-menu { display: none; } }
      `}</style>

      <header style={{
        background: scrolled ? "rgba(255,255,255,.98)" : "white",
        borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(12px)", boxShadow: scrolled ? "0 4px 24px rgba(26,45,107,.08)" : "none",
        transition: "box-shadow .2s",
      }}>
        <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
            <Image src="/Logo3.png" alt="MarketFlow" width={120} height={44} style={{ objectFit: "contain" }} priority />
          </Link>

          {/* Desktop nav — caché sur mobile */}
          <div style={{ display: "none" }} className="hide-mobile">
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Link href="/" className={`nav-link${pathname === "/" ? " nav-link--active" : ""}`}>Boutique</Link>
              <Link href="/commandes" className={`nav-link${pathname.startsWith("/commandes") ? " nav-link--active" : ""}`}>Mes commandes</Link>
            </div>
          </div>

          {/* Actions droite */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Panier */}
            <Link href="/panier" title="Mon panier" style={{ position: "relative", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "1.5px solid #e2e8f0", textDecoration: "none", fontSize: "1.15rem", background: pathname === "/panier" ? "#fff4ed" : "white", borderColor: pathname === "/panier" ? "#f97316" : "#e2e8f0" }}>
              🛒
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: -7, right: -7, minWidth: 20, height: 20, background: "linear-gradient(135deg,#f97316,#ea580c)", color: "white", borderRadius: 999, fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid white" }}>
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* Admin badge — caché sur très petit mobile */}
            {role === "ADMIN" && (
              <Link href="/admin" className="hide-mobile" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "#fff4ed", color: "#ea580c", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", border: "1px solid #fed7aa" }}>
                ⚡ Admin
              </Link>
            )}

            {/* User desktop — caché sur mobile */}
            {userName ? (
              <div style={{ display: "none" }} className="hide-mobile">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 12px 5px 6px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#1a2d6b,#2a3f8f)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</span>
                  </div>
                  <button onClick={logout} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "#64748b" }}>
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary hide-mobile" style={{ textDecoration: "none", padding: "9px 20px" }}>
                Se connecter
              </Link>
            )}

            {/* Hamburger mobile */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="hide-desktop" style={{ width: 42, height: 42, border: "1.5px solid #e2e8f0", borderRadius: 10, background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0 }}>
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </header>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMobileOpen(false)} className={`nav-link${pathname === "/" ? " nav-link--active" : ""}`}>🏪 Boutique</Link>
          <Link href="/commandes" onClick={() => setMobileOpen(false)} className={`nav-link${pathname.startsWith("/commandes") ? " nav-link--active" : ""}`}>📦 Mes commandes</Link>
          {role === "ADMIN" && <Link href="/admin" onClick={() => setMobileOpen(false)} className="nav-link">⚡ Admin</Link>}
          {userName ? (
            <>
              <div style={{ padding: "8px 14px", background: "#f8fafc", borderRadius: 8, fontSize: "0.875rem", color: "#374151" }}>👤 {userName}</div>
              <button onClick={() => { logout(); setMobileOpen(false); }} style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "#64748b", textAlign: "left" }}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ textDecoration: "none", justifyContent: "center" }}>
              Se connecter
            </Link>
          )}
        </div>
      )}
    </>
  );
}
