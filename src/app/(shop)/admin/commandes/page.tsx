import prisma from "@/lib/prisma";
import CommandeStatut from "./CommandeStatut";
import { MdHourglassEmpty, MdCheckCircle, MdLocalShipping, MdMarkunread, MdCancel, MdShoppingCart, MdAttachMoney } from "react-icons/md";
import { IconType } from "react-icons";
import StatusBadge from "@/components/shared/StatusBadge";
import AvatarInitial from "@/components/shared/AvatarInitial";
import EmptyState from "@/components/shared/EmptyState";

type StatusConfig = { bg: string; color: string; label: string; icon: IconType };
type QuickStat = { label: string; value: string | number; icon: IconType };

const statusConfig: Record<string, StatusConfig> = {
  PENDING:   { bg: "#fffbeb", color: "#92400e", label: "En attente",  icon: MdHourglassEmpty },
  CONFIRMED: { bg: "#eff6ff", color: "#1d4ed8", label: "Confirmée",   icon: MdCheckCircle },
  SHIPPED:   { bg: "#f5f3ff", color: "#6d28d9", label: "Expédiée",    icon: MdLocalShipping },
  DELIVERED: { bg: "#ecfdf5", color: "#065f46", label: "Livrée",      icon: MdMarkunread },
  CANCELLED: { bg: "#fef2f2", color: "#991b1b", label: "Annulée",     icon: MdCancel },
};

export default async function AdminCommandes() {
  const commandes = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = commandes.reduce((s, o) => s + (o.status !== "CANCELLED" ? o.total : 0), 0);
  const pending = commandes.filter((o) => o.status === "PENDING").length;

  const quickStats: QuickStat[] = [
    { label: "Total commandes", value: commandes.length,        icon: MdShoppingCart },
    { label: "En attente",      value: pending,                 icon: MdHourglassEmpty },
    { label: "Revenus",         value: `${total.toFixed(2)} €`, icon: MdAttachMoney },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Commandes</h1>
          <p className="page-subtitle">{commandes.length} commande{commandes.length > 1 ? "s" : ""} au total</p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-[10px] px-4 py-2.5">
            <MdHourglassEmpty size={16} className="text-amber-800" />
            <span className="font-semibold text-sm text-amber-800">{pending} commande{pending > 1 ? "s" : ""} en attente</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-7">
        {quickStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card px-5 py-4 flex items-center gap-3.5">
              <Icon size={24} className="text-slate-400" />
              <div>
                <p className="font-extrabold text-[1.3rem] text-slate-900 m-0 tracking-tight">{s.value}</p>
                <p className="text-slate-500 text-xs m-0">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Commande", "Client", "Articles", "Total", "Statut", "Date", "Action"].map((h) => (
                <th key={h} className="th-admin">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commandes.map((o) => {
              const s = statusConfig[o.status] ?? statusConfig.PENDING;
              return (
                <tr key={o.id} className="admin-row border-b border-slate-100">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-xs text-slate-400 font-mono m-0">#{o.id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <AvatarInitial name={o.user.name} size="sm" />
                      <span className="font-semibold text-sm text-slate-900">{o.user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="max-w-[180px]">
                      {o.items.slice(0, 2).map((i) => (
                        <p key={i.id} className="text-xs text-slate-500 m-0 truncate">{i.product.name} ×{i.quantity}</p>
                      ))}
                      {o.items.length > 2 && <p className="text-xs text-slate-400 m-0">+{o.items.length - 2} autre{o.items.length - 2 > 1 ? "s" : ""}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-extrabold text-indigo-600 text-[0.95rem]">{o.total.toFixed(2)} €</td>
                  <td className="px-4 py-3.5"><StatusBadge config={s} size={13} /></td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3.5">
                    <CommandeStatut orderId={o.id} current={o.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {commandes.length === 0 && (
          <EmptyState icon={MdShoppingCart} title="Aucune commande" description="Aucune commande pour le moment." />
        )}
      </div>
    </div>
  );
}
