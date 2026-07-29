import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  PENDING:   { label: "En attente",  bg: "#fffbeb", color: "#92400e", icon: "⏳" },
  CONFIRMED: { label: "Confirmée",   bg: "#eff6ff", color: "#1d4ed8", icon: "✅" },
  SHIPPED:   { label: "Expédiée",    bg: "#f5f3ff", color: "#6d28d9", icon: "🚚" },
  DELIVERED: { label: "Livrée",      bg: "#ecfdf5", color: "#065f46", icon: "📬" },
  CANCELLED: { label: "Annulée",     bg: "#fef2f2", color: "#991b1b", icon: "❌" },
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
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <h1 style={{ fontWeight: 800, fontSize: "1.75rem", color: "#0f172a", letterSpacing: "-0.03em", margin: 0 }}>Mes commandes</h1>
        <Link href="/" className="btn-secondary" style={{ textDecoration: "none" }}>+ Nouvelle commande</Link>
      </div>

      {commandes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>📦</div>
          <h2 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Aucune commande</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>Vous n'avez pas encore passé de commande.</p>
          <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>Découvrir la boutique</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {commandes.map((o) => {
            const s = statusConfig[o.status] ?? statusConfig.PENDING;
            return (
              <div key={o.id} className="card" style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 2 }}>COMMANDE #{o.id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: "0.85rem", color: "#475569" }}>{new Date(o.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", background: s.bg, color: s.color, borderRadius: 999, fontSize: "0.8rem", fontWeight: 700 }}>
                    {s.icon} {s.label}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 16, borderBottom: "1px solid #f1f5f9", marginBottom: 16 }}>
                  {o.items.map((i) => (
                    <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                      <span style={{ color: "#475569" }}>{i.product.name} <span style={{ color: "#94a3b8" }}>× {i.quantity}</span></span>
                      <span style={{ fontWeight: 600, color: "#0f172a" }}>{(i.unitPrice * i.quantity).toFixed(2)} €</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#4f46e5", letterSpacing: "-0.02em" }}>Total : {o.total.toFixed(2)} €</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
