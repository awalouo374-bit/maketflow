import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalProduits, totalCategories, totalCommandes, totalClients] = await Promise.all([
    prisma.product.count(), prisma.category.count(),
    prisma.order.count(), prisma.user.count({ where: { role: "CLIENT" } }),
  ]);
  const recentOrders = await prisma.order.findMany({ take: 6, orderBy: { createdAt: "desc" }, include: { user: true } });
  const revenue = await prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } });

  const stats = [
    { label: "Chiffre d'affaires", value: `${(revenue._sum.total ?? 0).toFixed(2)} €`, icon: "💰", bg: "#fff4ed", color: "#ea580c", href: "/admin/commandes" },
    { label: "Commandes",  value: totalCommandes,  icon: "🛒", bg: "#e8ecf8", color: "#1a2d6b", href: "/admin/commandes" },
    { label: "Produits",   value: totalProduits,   icon: "📦", bg: "#fff4ed", color: "#ea580c", href: "/admin/produits" },
    { label: "Clients",    value: totalClients,    icon: "👥", bg: "#e8ecf8", color: "#1a2d6b", href: "#" },
  ];

  const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
    PENDING:   { bg: "#fff4ed", color: "#ea580c", label: "En attente"  },
    CONFIRMED: { bg: "#e8ecf8", color: "#1a2d6b", label: "Confirmée"   },
    SHIPPED:   { bg: "#f5f3ff", color: "#6d28d9", label: "Expédiée"    },
    DELIVERED: { bg: "#ecfdf5", color: "#065f46", label: "Livrée"      },
    CANCELLED: { bg: "#fef2f2", color: "#991b1b", label: "Annulée"     },
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#0f172a", letterSpacing: "-0.03em", margin: 0, marginBottom: 4 }}>Tableau de bord</h1>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>Vue d'ensemble de MarketFlow</p>
      </div>

      {/* Stats */}
      <style>{`.stats-grid { display: grid; gap: 16px; grid-template-columns: 1fr; margin-bottom: 28px; } @media (min-width: 640px) { .stats-grid { grid-template-columns: repeat(2,1fr); gap: 18px; } } @media (min-width: 1024px) { .stats-grid { grid-template-columns: repeat(4,1fr); gap: 20px; margin-bottom: 36px; } }`}</style>
      <div className="stats-grid">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} style={{ textDecoration: "none" }}>
            <div className="card stat-card" style={{ padding: "22px 24px" }}>
              <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", marginBottom: 14 }}>{s.icon}</div>
              <p style={{ fontWeight: 800, fontSize: "1.8rem", color: "#0f172a", letterSpacing: "-0.04em", margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: "0.8rem", fontWeight: 500, margin: 0 }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Dernières commandes */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", margin: 0 }}>Dernières commandes</h2>
          <Link href="/admin/commandes" style={{ fontSize: "0.8rem", color: "#f97316", fontWeight: 600, textDecoration: "none" }}>Voir tout →</Link>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Client", "Total", "Statut", "Date"].map((h) => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o, i) => {
              const s = statusStyle[o.status] ?? statusStyle.PENDING;
              return (
                <tr key={o.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafafa" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1a2d6b,#2a3f8f)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.75rem", fontWeight: 700 }}>
                        {o.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a" }}>{o.user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "#f97316" }}>{o.total.toFixed(2)} €</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ background: s.bg, color: s.color, padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700 }}>{s.label}</span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#94a3b8" }}>{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
