import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MdHourglassEmpty, MdCheckCircle, MdLocalShipping, MdMarkunread, MdCancel, MdInventory2 } from "react-icons/md";
import { IconType } from "react-icons";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

type StatusConfig = { label: string; bg: string; color: string; icon: IconType };

const statusConfig: Record<string, StatusConfig> = {
  PENDING:   { label: "En attente",  bg: "#fffbeb", color: "#92400e", icon: MdHourglassEmpty },
  CONFIRMED: { label: "Confirmée",   bg: "#eff6ff", color: "#1d4ed8", icon: MdCheckCircle },
  SHIPPED:   { label: "Expédiée",    bg: "#f5f3ff", color: "#6d28d9", icon: MdLocalShipping },
  DELIVERED: { label: "Livrée",      bg: "#ecfdf5", color: "#065f46", icon: MdMarkunread },
  CANCELLED: { label: "Annulée",     bg: "#fef2f2", color: "#991b1b", icon: MdCancel },
};

export default async function CommandesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const commandes = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-[860px] mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-extrabold text-[1.75rem] text-slate-900 tracking-tight m-0">Mes commandes</h1>
        <Link href="/" className="btn-secondary no-underline">+ Nouvelle commande</Link>
      </div>

      {commandes.length === 0 ? (
        <EmptyState
          icon={MdInventory2}
          title="Aucune commande"
          description="Vous n'avez pas encore passé de commande."
          action={<Link href="/" className="btn-primary no-underline">Découvrir la boutique</Link>}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {commandes.map((o) => {
            const s = statusConfig[o.status] ?? statusConfig.PENDING;
            return (
              <div key={o.id} className="card px-7 py-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold tracking-wide mb-0.5">COMMANDE #{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <StatusBadge config={s} />
                </div>

                <div className="flex flex-col gap-1.5 pb-4 border-b border-slate-100 mb-4">
                  {o.items.map((i) => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        {i.product.name} <span className="text-slate-400">× {i.quantity}</span>
                      </span>
                      <span className="font-semibold text-slate-900">{(i.unitPrice * i.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <span className="font-extrabold text-[1.1rem] text-indigo-600 tracking-tight">Total : {o.total.toFixed(2)} €</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
