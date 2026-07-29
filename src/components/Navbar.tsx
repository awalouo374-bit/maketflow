"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdShoppingCart, MdBolt, MdClose, MdMenu, MdStore, MdInventory2, MdPerson } from "react-icons/md";

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
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <header className={`bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md transition-shadow duration-200 ${scrolled ? "shadow-[0_4px_24px_rgba(26,45,107,.08)]" : ""}`}>
        <nav className="container h-[68px] flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center no-underline shrink-0">
            <Image src="/Logo3.png" alt="MarketFlow" width={120} height={44} className="object-contain" priority />
          </Link>

          <div className="hide-mobile flex items-center gap-0.5">
            <Link href="/" className={`nav-link${pathname === "/" ? " nav-link--active" : ""}`}>Boutique</Link>
            <Link href="/commandes" className={`nav-link${pathname.startsWith("/commandes") ? " nav-link--active" : ""}`}>Mes commandes</Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/panier"
              title="Mon panier"
              className={`relative w-[42px] h-[42px] flex items-center justify-center rounded-[10px] no-underline border-[1.5px] transition-colors ${pathname === "/panier" ? "bg-orange-soft border-orange-500" : "bg-white border-slate-200"}`}
            >
              <MdShoppingCart size={20} className={pathname === "/panier" ? "text-orange-500" : "text-slate-500"} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-full text-[0.65rem] font-bold flex items-center justify-center px-1 border-2 border-white">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {role === "ADMIN" && (
              <Link href="/admin" className="hide-mobile inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-soft text-orange-600 text-xs font-bold no-underline border border-orange-200">
                <MdBolt size={16} /> Admin
              </Link>
            )}

            {userName ? (
              <div className="hide-mobile flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-[10px] border border-slate-200">
                  <div className="w-7 h-7 rounded-full bg-linear-to-br from-navy to-navy-light flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{userName}</span>
                </div>
                <button onClick={logout} className="px-3.5 py-1.5 rounded-lg border-[1.5px] border-slate-200 bg-white cursor-pointer text-xs font-semibold text-slate-500">
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary hide-mobile no-underline py-2.5 px-5">
                Se connecter
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hide-desktop w-[42px] h-[42px] border-[1.5px] border-slate-200 rounded-[10px] bg-white cursor-pointer flex items-center justify-center shrink-0"
            >
              {mobileOpen ? <MdClose size={22} className="text-slate-500" /> : <MdMenu size={22} className="text-slate-500" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMobileOpen(false)} className={`nav-link${pathname === "/" ? " nav-link--active" : ""}`}>
            <MdStore size={16} className="mr-1.5" /> Boutique
          </Link>
          <Link href="/commandes" onClick={() => setMobileOpen(false)} className={`nav-link${pathname.startsWith("/commandes") ? " nav-link--active" : ""}`}>
            <MdInventory2 size={16} className="mr-1.5" /> Mes commandes
          </Link>
          {role === "ADMIN" && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="nav-link">
              <MdBolt size={16} className="mr-1.5" /> Admin
            </Link>
          )}
          {userName ? (
            <>
              <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 rounded-lg text-sm text-slate-700">
                <MdPerson size={16} /> {userName}
              </div>
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="px-3.5 py-2.5 rounded-lg border-[1.5px] border-slate-200 bg-white cursor-pointer text-sm font-semibold text-slate-500 text-left"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary no-underline justify-center">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </>
  );
}
