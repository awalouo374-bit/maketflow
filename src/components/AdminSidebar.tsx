"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MdDashboard, MdInventory2, MdCategory, MdShoppingCart } from "react-icons/md";
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
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-inner">
        <div className="admin-sidebar-logo">
          <Image src="/Logo3.png" alt="MarketFlow" width={130} height={48} className="object-contain" />
          <div className="admin-sidebar-divider" />
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-label">Navigation</p>
          {links.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`sidebar-link${active ? " sidebar-link--active" : ""}`}
              >
                <Icon size={18} />
                <span className="hide-mobile">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-footer">
          <Link href="/" className="sidebar-link text-sm">
            ← Voir la boutique
          </Link>
        </div>
      </div>
    </aside>
  );
}
