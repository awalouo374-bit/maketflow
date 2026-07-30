import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MdHourglassEmpty, MdCheckCircle, MdLocalShipping, MdMarkunread, MdCancel, MdInventory2, MdReceipt } from "react-icons/md";
import { IconType } from "react-icons";
import StatusBadge from "@/components/shared/StatusBadge";
import EmptyState from "@/components/shared/EmptyState";

type StatusConfig = { label: string; bg: string; color: string; icon: IconType };
const statusConfig: Record<string, StatusConfig> = {
  PENDING:   { label: "En attente",  bg: "#fffbeb", color: "#92400e", icon: MdHourglassEmpty },
  CONFIRMED: { label: "Confirmée",   bg: "#e6f7ff", color: "#0958d9", icon: MdCheckCircle },
  SHIPPED:   { label: "Expédiée",    bg: "#f9f0ff", color: "#722ed1", icon: MdLocalShipping },
  DELIVERED: { label: "Livrée",      bg: "#f6ffed", color: "#389e0d", icon: MdMarkunread },
  CANCELLED: { label: "Annulée",     bg: "#fff1f0", color: "#cf1322", icon: MdCancel },
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
    <main className="bg-[#f5f5f5] min-h-screen mobile-pb">
      <div className="container py-section max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <MdReceipt size={20} className="text-[#ff6000]" />
            <h1 className="font-bold text-lg text-slate-900 m-0">Mes commandes</h1>
          </div>
          <Link href="/" className="btn-secondary no-underline text-sm shrink-0">Continuer mes achats</Link>
        </div>

        {commandes.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-[#e8e8e8]">
            <EmptyState icon={MdInventory2} title="Aucune commande" description="Vous n'avez pas encore passé de commande."
              action={<Link href="/" className="btn-primary no-underline">Découvrir la boutique</Link>} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {commandes.map((o) => {
              const s = statusConfig[o.status] ?? statusConfig.PENDING;
              return (
                <div key={o.id} className="bg-white rounded-lg border border-[#e8e8e8] overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#fafafa] border-b border-[#f0f0f0]">
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-slate-400 font-mono m-0">#{o.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-slate-400 m-0">{new Date(o.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                    <StatusBadge config={s} size={12} />
                  </div>
                  <div className="px-5 py-4">
                    <div className="flex flex-col gap-2 mb-4">
                      {o.items.map((i) => (
                        <div key={i.id} className="flex items-center justify-between gap-4 text-sm">
                          <span className="text-slate-600 truncate">{i.product.name}</span>
                          <span className="text-xs text-slate-400 shrink-0">×{i.quantity}</span>
                          <span className="font-semibold text-slate-800 whitespace-nowrap shrink-0">{(i.unitPrice * i.quantity).toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end items-center border-t border-[#f0f0f0] pt-3">
                      <span className="text-xs text-slate-500 mr-2">Total :</span>
                      <span className="font-extrabold text-base text-[#ff6000]">{o.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
