"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdShoppingCart, MdHome, MdInventory2, MdPerson, MdLogout, MdSearch, MdAdminPanelSettings } from "react-icons/md";

type Props = { role?: "CLIENT" | "ADMIN"; userName?: string };

export default function Navbar({ role, userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function loadCart() {
      try {
        const res = await fetch("/api/panier");
        if (res.ok) { const d = await res.json(); setCartCount(d.items?.length ?? 0); }
      } catch { /* */ }
    }
    if (userName) loadCart();
  }, [pathname, userName]);

  async function logout() {
    await fetch("/api/auth/code-login", { method: "DELETE" });
    router.push("/login"); router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/?q=${encodeURIComponent(q.trim())}` : "/");
  }

  return (
    <>
      <div className="navbar-top">
        <div className="container flex items-center justify-between w-full">
          <p className="text-white/60 text-xs">Bienvenue sur MarketFlow</p>
          <div className="flex items-center gap-4">
            {userName
              ? <button onClick={logout} className="flex items-center gap-1 text-white/60 hover:text-white text-xs bg-transparent border-none cursor-pointer"><MdLogout size={13} /> Déconnexion</button>
              : <Link href="/login" className="text-white/60 hover:text-white text-xs no-underline">Connexion / Inscription</Link>
            }
            <Link href="/commandes" className="text-white/60 hover:text-white text-xs no-underline">Mes commandes</Link>
          </div>
        </div>
      </div>

      <header className="navbar-main">
        <div className="container">
          <div className="h-16 md:h-[72px] flex items-center gap-3 md:gap-5">
            <Link href="/" className="shrink-0 no-underline">
              <Image src="/Logo3.png" alt="MarketFlow" width={108} height={38} className="object-contain" priority />
            </Link>

            <form onSubmit={handleSearch} className="navbar-search flex-1 min-w-0">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher des produits..."
                className="flex-1 min-w-0 px-4 py-3 border-none outline-none text-sm text-slate-800 placeholder:text-slate-400 font-[inherit]" />
              <button type="submit" className="bg-[#ff6000] hover:bg-[#e55400] text-white px-4 md:px-5 py-3 flex items-center gap-1.5 font-semibold text-sm border-none cursor-pointer shrink-0 transition-colors">
                <MdSearch size={18} /><span className="hidden md:inline">Rechercher</span>
              </button>
            </form>

            <div className="flex items-center gap-2 shrink-0">
              {userName
                ? <div className="hide-mobile flex items-center gap-1.5 bg-[#f5f5f5] border border-[#e8e8e8] rounded px-3 py-2">
                    <div className="w-6 h-6 rounded-full bg-[#1a2d6b] flex items-center justify-center text-white text-xs font-bold shrink-0">{userName.charAt(0).toUpperCase()}</div>
                    <span className="text-sm font-medium text-slate-700 max-w-20 truncate">{userName}</span>
                  </div>
                : <Link href="/login" className="hide-mobile btn-primary text-sm py-2 px-4 no-underline">Connexion</Link>
              }
              {role === "ADMIN" && (
                <Link href="/admin" className="hide-mobile inline-flex items-center gap-1.5 px-3 py-2 rounded bg-[#fff3ec] text-[#ff6000] text-xs font-bold no-underline border border-[#ffd0b0] hover:bg-[#ffe4cc] transition-colors">
                  <MdAdminPanelSettings size={16} /> Admin
                </Link>
              )}
              <Link href="/panier" className="relative flex items-center justify-center w-10 h-10 rounded hover:bg-[#f5f5f5] no-underline transition-colors" title="Mon panier">
                <MdShoppingCart size={24} className={cartCount > 0 ? "text-[#ff6000]" : "text-slate-600"} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 bg-[#ff6000] text-white rounded-full text-[0.55rem] font-black flex items-center justify-center px-1">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <nav className="hide-mobile flex items-center gap-1 border-t border-[#f0f0f0] py-1 overflow-x-auto">
            <Link href="/" className={`nav-link text-[0.8rem]${pathname === "/" ? " nav-link--active" : ""}`}>Boutique</Link>
            <Link href="/commandes" className={`nav-link text-[0.8rem]${pathname.startsWith("/commandes") ? " nav-link--active" : ""}`}>Mes commandes</Link>
            {role === "ADMIN" && <Link href="/admin" className="nav-link text-[0.8rem] text-[#ff6000]">Administration</Link>}
          </nav>
        </div>
      </header>

      <nav className="mobile-bottom-nav">
        <Link href="/" className={`mobile-bottom-nav-item${pathname === "/" ? " active" : ""}`}><MdHome size={22} /><span>Accueil</span></Link>
        <Link href="/commandes" className={`mobile-bottom-nav-item${pathname.startsWith("/commandes") ? " active" : ""}`}><MdInventory2 size={22} /><span>Commandes</span></Link>
        <Link href="/panier" className={`mobile-bottom-nav-item relative${pathname === "/panier" ? " active" : ""}`}>
          <div className="relative">
            <MdShoppingCart size={22} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1.5 min-w-4 h-4 bg-[#ff6000] text-white rounded-full text-[0.5rem] font-black flex items-center justify-center px-0.5">{cartCount > 9 ? "9+" : cartCount}</span>}
          </div>
          <span>Panier</span>
        </Link>
        {userName
          ? <button onClick={logout} className="mobile-bottom-nav-item border-none cursor-pointer"><MdLogout size={22} /><span>Quitter</span></button>
          : <Link href="/login" className={`mobile-bottom-nav-item${pathname === "/login" ? " active" : ""}`}><MdPerson size={22} /><span>Connexion</span></Link>
        }
      </nav>
    </>
  );
}
