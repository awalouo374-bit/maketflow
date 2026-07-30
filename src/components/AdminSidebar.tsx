"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  MdDashboard, MdInventory2, MdCategory, MdShoppingCart,
  MdLogout, MdMenu, MdClose, MdStorefront,
} from "react-icons/md";
import { IconType } from "react-icons";

type NavLink = { href: string; label: string; icon: IconType; exact?: boolean };

const links: NavLink[] = [
  { href: "/admin",            label: "Dashboard",  icon: MdDashboard,   exact: true },
  { href: "/admin/produits",   label: "Produits",   icon: MdInventory2 },
  { href: "/admin/categories", label: "Catégories", icon: MdCategory },
  { href: "/admin/commandes",  label: "Commandes",  icon: MdShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/code-login", { method: "DELETE" });
    router.push("/login");
    router.refresh();
  }

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center px-6 pt-8 pb-4">
        <Image src="/Logo3.png" alt="MarketFlow" width={130} height={52} className="object-contain" />
        <div className="w-full h-0.5 bg-orange mt-6 rounded-full" />
      </div>

      <div className="flex flex-col flex-1 px-4 pt-4 pb-6 overflow-y-auto">
        <p className="text-[0.65rem] font-bold tracking-[0.15em] text-white/30 uppercase px-3 mb-3">
          Navigation
        </p>

        <nav className="flex flex-col gap-1">
          {links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={onNav}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.9rem] font-semibold no-underline transition-all
                  ${active
                    ? "bg-[#1e2d5a] text-orange border-l-[3px] border-orange"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
              >
                <Icon size={20} className="shrink-0" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-1 border-t border-white/10">
          <Link
            href="/"
            onClick={onNav}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.9rem] font-medium text-white/40 hover:text-white/70 hover:bg-white/5 no-underline transition-all"
          >
            <MdStorefront size={20} className="shrink-0" />
            <span>← Voir la boutique</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[0.9rem] font-medium text-white/40 hover:text-red-400 hover:bg-red-500/10 border-none bg-transparent cursor-pointer text-left w-full transition-all"
          >
            <MdLogout size={20} className="shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-[210px] min-h-screen bg-[#0d1a45] shrink-0">
        <SidebarContent />
      </aside>

      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-[#0d1a45] sticky top-0 z-40">
        <Image src="/Logo3.png" alt="MarketFlow" width={88} height={32} className="object-contain" />
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white border-none cursor-pointer"
        >
          <MdMenu size={20} />
        </button>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="relative w-[210px] bg-[#0d1a45] flex flex-col h-full shadow-2xl">
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white border-none cursor-pointer"
              >
                <MdClose size={18} />
              </button>
            </div>
            <SidebarContent onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
