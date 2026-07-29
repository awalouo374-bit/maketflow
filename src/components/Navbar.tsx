"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MdShoppingCart, MdBolt, MdClose, MdMenu, MdStore, MdInventory2, MdPerson, MdLogout } from "react-icons/md";

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
    const fn = () => setScrolled(window.scrollY > 12);
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
      <header className={`bg-white/95 border-b sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-slate-200 shadow-[0_4px_32px_rgba(15,23,42,.1)] backdrop-blur-xl" : "border-transparent backdrop-blur-sm"}`}>
        <nav className="container h-[70px] flex items-center justify-between gap-4">

          <Link href="/" className="flex items-center no-underline shrink-0 group">
            <Image src="/Logo3.png" alt="MarketFlow" width={124} height={44} className="object-contain transition-transform duration-200 group-hover:scale-105" priority />
          </Link>

          <div className="hide-mobile flex items-center gap-1">
            <Link href="/" className={`nav-link${pathname === "/" ? " nav-link--active" : ""}`}>
              <MdStore size={15} /> Boutique
            </Link>
            <Link href="/commandes" className={`nav-link${pathname.startsWith("/commandes") ? " nav-link--active" : ""}`}>
              <MdInventory2 size={15} /> Mes commandes
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/panier"
              title="Mon panier"
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl no-underline border-[1.5px] transition-all duration-200 ${pathname === "/panier" ? "bg-orange-soft border-orange-400 shadow-[0_2px_8px_rgba(249,115,22,.2)]" : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"}`}
            >
              <MdShoppingCart size={19} className={pathname === "/panier" ? "text-orange-500" : "text-slate-500"} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-full text-[0.6rem] font-black flex items-center justify-center px-1 border-2 border-white shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {role === "ADMIN" && (
              <Link href="/admin" className="hide-mobile inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-soft text-orange-600 text-xs font-bold no-underline border border-orange-200 hover:bg-orange-100 hover:border-orange-300 transition-colors">
                <MdBolt size={15} /> Admin
              </Link>
            )}

            {userName ? (
              <div className="hide-mobile flex items-center gap-2">
                <div className="flex items-center gap-2 pl-1.5 pr-3 py-1 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-linear-to-br from-navy to-navy-light flex items-center justify-center text-white text-xs font-black shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 max-w-[100px] truncate">{userName}</span>
                </div>
                <button onClick={logout} title="Déconnexion" className="w-9 h-9 flex items-center justify-center rounded-xl border-[1.5px] border-slate-200 bg-white cursor-pointer text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all">
                  <MdLogout size={17} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn-primary hide-mobile no-underline text-sm py-2 px-5">
                Se connecter
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="hide-desktop w-10 h-10 border-[1.5px] border-slate-200 rounded-xl bg-white cursor-pointer flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
            >
              {mobileOpen ? <MdClose size={21} /> : <MdMenu size={21} />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="mobile-menu">
          <Link href="/" onClick={() => setMobileOpen(false)} className={`nav-link py-3${pathname === "/" ? " nav-link--active" : ""}`}>
            <MdStore size={17} /> Boutique
          </Link>
          <Link href="/commandes" onClick={() => setMobileOpen(false)} className={`nav-link py-3${pathname.startsWith("/commandes") ? " nav-link--active" : ""}`}>
            <MdInventory2 size={17} /> Mes commandes
          </Link>
          {role === "ADMIN" && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="nav-link py-3">
              <MdBolt size={17} /> Admin
            </Link>
          )}
          <div className="h-px bg-slate-100 my-1" />
          {userName ? (
            <>
              <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700 font-medium">
                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-navy to-navy-light flex items-center justify-center text-white text-xs font-black">
                  {userName.charAt(0).toUpperCase()}
                </div>
                {userName}
              </div>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer bg-transparent border-none text-left w-full">
                <MdLogout size={17} /> Déconnexion
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-primary no-underline justify-center w-full mt-1">
              Se connecter
            </Link>
          )}
        </div>
      )}
    </>
  );
}
