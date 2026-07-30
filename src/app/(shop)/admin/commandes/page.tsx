import prisma from "@/lib/prisma";
import CommandeStatut from "./CommandeStatut";
import { MdHourglassEmpty, MdCheckCircle, MdLocalShipping, MdMarkunread, MdCancel, MdShoppingCart, MdAttachMoney } from "react-icons/md";
import { IconType } from "react-icons";
import StatusBadge from "@/components/shared/StatusBadge";
import AvatarInitial from "@/components/shared/AvatarInitial";
import EmptyState from "@/components/shared/EmptyState";

type StatusConfig = { bg: string; color: string; label: string; icon: IconType };

const statusConfig: Record<string, StatusConfig> = {
  PENDING:   { bg: "#fffbeb", color: "#92400e", label: "En attente", icon: MdHourglassEmpty },
  CONFIRMED: { bg: "#e6f7ff", color: "#0958d9", label: "Confirmée",  icon: MdCheckCircle },
  SHIPPED:   { bg: "#f9f0ff", color: "#722ed1", label: "Expédiée",   icon: MdLocalShipping },
  DELIVERED: { bg: "#f6ffed", color: "#389e0d", label: "Livrée",     icon: MdMarkunread },
  CANCELLED: { bg: "#fff1f0", color: "#cf1322", label: "Annulée",    icon: MdCancel },
};

export default async function AdminCommandes() {
  const commandes = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = commandes.reduce((s, o) => s + (o.status !== "CANCELLED" ? o.total : 0), 0);
  const pending = commandes.filter((o) => o.status === "PENDING").length;

  const stats = [
    { label: "Commandes", value: commandes.length, icon: MdShoppingCart, color: "#1a2d6b" },
    { label: "En attente", value: pending,          icon: MdHourglassEmpty, color: "#92400e" },
    { label: "Revenus",    value: `${total.toFixed(2)} €`, icon: MdAttachMoney, color: "#ff6000" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="page-title">Commandes</h1>
          <p className="page-subtitle">{commandes.length} commande{commandes.length !== 1 ? "s" : ""} au total</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded px-4 py-2 shrink-0">
            <MdHourglassEmpty size={14} className="text-amber-700" />
            <span className="font-semibold text-sm text-amber-700">{pending} en attente</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-[#e8e8e8] rounded-lg px-5 py-4 flex items-center gap-3 stat-card">
              <Icon size={20} style={{ color: s.color }} className="shrink-0" />
              <div>
                <p className="font-bold text-xl text-slate-900 m-0 tracking-tight">{s.value}</p>
                <p className="text-slate-400 text-xs m-0">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-[#e8e8e8] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-[#f0f0f0]">
                {["Commande", "Client", "Articles", "Total", "Statut", "Date", "Action"].map((h) => (
                  <th key={h} className="th-admin">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commandes.map((o) => {
                const s = statusConfig[o.status] ?? statusConfig.PENDING;
                return (
                  <tr key={o.id} className="admin-row border-b border-[#f5f5f5]">
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-slate-400 m-0 whitespace-nowrap">#{o.id.slice(-8).toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <AvatarInitial name={o.user.name} size="sm" />
                        <span className="font-medium text-sm text-slate-800 whitespace-nowrap max-w-24 truncate">{o.user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-[160px]">
                        {o.items.slice(0, 2).map((i) => (
                          <p key={i.id} className="text-xs text-slate-500 m-0 truncate">{i.product.name} ×{i.quantity}</p>
                        ))}
                        {o.items.length > 2 && <p className="text-xs text-slate-400 m-0">+{o.items.length - 2} autre{o.items.length - 2 > 1 ? "s" : ""}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#ff6000] whitespace-nowrap">{o.total.toFixed(2)} €</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge config={s} size={12} /></td>
                    <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <CommandeStatut orderId={o.id} current={o.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {commandes.length === 0 && <EmptyState icon={MdShoppingCart} title="Aucune commande" description="Aucune commande pour le moment." />}
      </div>
    </div>
  );
}
