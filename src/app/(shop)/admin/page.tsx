import prisma from "@/lib/prisma";
import Link from "next/link";
import { MdAttachMoney, MdShoppingCart, MdInventory2, MdGroup } from "react-icons/md";
import { IconType } from "react-icons";
import AvatarInitial from "@/components/shared/AvatarInitial";

type Stat = { label: string; value: string | number; icon: IconType; color: string; href: string };

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: "#fffbeb", color: "#92400e", label: "En attente"  },
  CONFIRMED: { bg: "#e6f7ff", color: "#0958d9", label: "Confirmée"   },
  SHIPPED:   { bg: "#f9f0ff", color: "#722ed1", label: "Expédiée"    },
  DELIVERED: { bg: "#f6ffed", color: "#389e0d", label: "Livrée"      },
  CANCELLED: { bg: "#fff1f0", color: "#cf1322", label: "Annulée"     },
};

export default async function AdminDashboard() {
  const [totalProduits, , totalCommandes, totalClients] = await Promise.all([
    prisma.product.count(), prisma.category.count(),
    prisma.order.count(), prisma.user.count({ where: { role: "CLIENT" } }),
  ]);
  const recentOrders = await prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { user: true } });
  const revenue = await prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } });

  const stats: Stat[] = [
    { label: "Revenus",    value: `${(revenue._sum.total ?? 0).toFixed(2)} €`, icon: MdAttachMoney, color: "#ff6000", href: "/admin/commandes" },
    { label: "Commandes",  value: totalCommandes,  icon: MdShoppingCart, color: "#1a2d6b", href: "/admin/commandes" },
    { label: "Produits",   value: totalProduits,   icon: MdInventory2,   color: "#ff6000", href: "/admin/produits" },
    { label: "Clients",    value: totalClients,    icon: MdGroup,        color: "#1a2d6b", href: "#" },
  ];

  return (
    <div>
      <div className="mb-5">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">Vue d'ensemble — MarketFlow</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="no-underline">
              <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 stat-card">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} style={{ color: s.color }} />
                  <span className="text-[0.6rem] text-slate-400 uppercase tracking-wider font-semibold">{s.label}</span>
                </div>
                <p className="font-extrabold text-2xl text-slate-900 m-0 tracking-tight">{s.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-[#e8e8e8] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f0f0] flex justify-between items-center">
          <h2 className="font-bold text-sm text-slate-800 m-0">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-xs text-[#ff6000] font-semibold no-underline hover:text-[#e55400]">Voir tout →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[480px]">
            <thead>
              <tr className="bg-[#fafafa]">
                {["Client", "Total", "Statut", "Date"].map((h) => <th key={h} className="th-admin">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => {
                const s = statusStyle[o.status] ?? statusStyle.PENDING;
                return (
                  <tr key={o.id} className={`border-t border-[#f5f5f5] ${i % 2 ? "bg-[#fafafa]/50" : ""}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <AvatarInitial name={o.user.name} size="sm" />
                        <span className="font-medium text-sm text-slate-800 truncate max-w-[120px]">{o.user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-bold text-[#ff6000] text-sm whitespace-nowrap">{o.total.toFixed(2)} €</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-400 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
