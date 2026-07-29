"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin",            label: "Dashboard",  icon: "📊", exact: true },
  { href: "/admin/produits",   label: "Produits",   icon: "📦" },
  { href: "/admin/categories", label: "Catégories", icon: "🏷" },
  { href: "/admin/commandes",  label: "Commandes",  icon: "🛒" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <>
      <style>{`
        .admin-sidebar { width: 100%; background: #0d1a45; display: flex; padding: 12px; overflow-x: auto; border-bottom: 1px solid rgba(255,255,255,.1); }
        .admin-sidebar-inner { display: flex; gap: 6px; width: 100%; }
        @media (min-width: 768px) {
          .admin-sidebar { width: 248px; min-height: calc(100vh - 68px); flex-direction: column; padding: 20px 14px; overflow-x: visible; border-bottom: none; border-right: 1px solid rgba(255,255,255,.1); }
          .admin-sidebar-inner { flex-direction: column; }
        }
        .admin-sidebar-logo { display: none; }
        @media (min-width: 768px) { .admin-sidebar-logo { display: block; padding: 0 6px; margin-bottom: 28px; } }
        .admin-nav { display: flex; gap: 2; flex: 1; }
        @media (min-width: 768px) { .admin-nav { flex-direction: column; } }
        .admin-nav-label { display: none; }
        @media (min-width: 768px) { .admin-nav-label { display: block; color: #334155; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; padding: 0 10px; margin-bottom: 10px; text-transform: uppercase; } }
        .admin-footer { display: none; }
        @media (min-width: 768px) { .admin-footer { display: block; border-top: 1px solid rgba(255,255,255,.07); padding-top: 16px; } }
      `}</style>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-inner">
          {/* Logo — desktop uniquement */}
          <div className="admin-sidebar-logo">
            <Image src="/Logo3.png" alt="MarketFlow" width={130} height={48} style={{ objectFit: "contain" }} />
            <div style={{ height: 2, background: "linear-gradient(90deg,#f97316,transparent)", borderRadius: 999, marginTop: 12 }} />
          </div>

          {/* Nav */}
          <nav className="admin-nav">
            <p className="admin-nav-label">Navigation</p>
            {links.map((l) => {
              const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
              return (
                <Link key={l.href} href={l.href}
                  className={`sidebar-link${active ? " sidebar-link--active" : ""}`}
                  style={{ whiteSpace: "nowrap", fontSize: "0.8rem", padding: "8px 12px" }}>
                  <span style={{ fontSize: "1rem" }}>{l.icon}</span>
                  <span className="hide-mobile">{l.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer — desktop uniquement */}
          <div className="admin-footer">
            <Link href="/" className="sidebar-link" style={{ fontSize: "0.8rem" }}>
              ← Voir la boutique
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
