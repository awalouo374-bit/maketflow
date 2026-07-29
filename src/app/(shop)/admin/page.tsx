import prisma from "@/lib/prisma";
import Link from "next/link";
import { MdAttachMoney, MdShoppingCart, MdInventory2, MdGroup } from "react-icons/md";
import { IconType } from "react-icons";
import AvatarInitial from "@/components/shared/AvatarInitial";

type Stat = { label: string; value: string | number; icon: IconType; bg: string; color: string; href: string };

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: "#fff4ed", color: "#ea580c", label: "En attente"  },
  CONFIRMED: { bg: "#e8ecf8", color: "#1a2d6b", label: "Confirmée"   },
  SHIPPED:   { bg: "#f5f3ff", color: "#6d28d9", label: "Expédiée"    },
  DELIVERED: { bg: "#ecfdf5", color: "#065f46", label: "Livrée"      },
  CANCELLED: { bg: "#fef2f2", color: "#991b1b", label: "Annulée"     },
};

export default async function AdminDashboard() {
  const [totalProduits, , totalCommandes, totalClients] = await Promise.all([
    prisma.product.count(), prisma.category.count(),
    prisma.order.count(), prisma.user.count({ where: { role: "CLIENT" } }),
  ]);
  const recentOrders = await prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { user: true } });
  const revenue = await prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } });

  const stats: Stat[] = [
    { label: "Chiffre d'affaires", value: `${(revenue._sum.total ?? 0).toFixed(2)} €`, icon: MdAttachMoney, bg: "#fff4ed", color: "#ea580c", href: "/admin/commandes" },
    { label: "Commandes",  value: totalCommandes,  icon: MdShoppingCart, bg: "#e8ecf8", color: "#1a2d6b", href: "/admin/commandes" },
    { label: "Produits",   value: totalProduits,   icon: MdInventory2,   bg: "#fff4ed", color: "#ea580c", href: "/admin/produits" },
    { label: "Clients",    value: totalClients,    icon: MdGroup,        bg: "#e8ecf8", color: "#1a2d6b", href: "#" },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <p className="page-subtitle">Vue d'ensemble de MarketFlow</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="no-underline">
              <div className="card stat-card p-6">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5" style={{ background: s.bg }}>
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <p className="font-extrabold text-[1.8rem] text-slate-900 tracking-tight m-0 mb-1">{s.value}</p>
                <p className="text-slate-500 text-xs font-medium m-0">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-base text-slate-900 m-0">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-xs text-orange-500 font-semibold no-underline">Voir tout →</Link>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {["Client", "Total", "Statut", "Date"].map((h) => (
                <th key={h} className="th-admin">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o, i) => {
              const s = statusStyle[o.status] ?? statusStyle.PENDING;
              return (
                <tr key={o.id} className={`border-t border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <AvatarInitial name={o.user.name} size="sm" />
                      <span className="font-semibold text-sm text-slate-900">{o.user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-orange-500">{o.total.toFixed(2)} €</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-400">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
