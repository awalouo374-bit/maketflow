import prisma from "@/lib/prisma";
import CommandeStatut from "./CommandeStatut";

const statusConfig: Record<string, { bg: string; color: string; label: string; icon: string }> = {
  PENDING:   { bg: "#fffbeb", color: "#92400e", label: "En attente",  icon: "⏳" },
  CONFIRMED: { bg: "#eff6ff", color: "#1d4ed8", label: "Confirmée",   icon: "✅" },
  SHIPPED:   { bg: "#f5f3ff", color: "#6d28d9", label: "Expédiée",    icon: "🚚" },
  DELIVERED: { bg: "#ecfdf5", color: "#065f46", label: "Livrée",      icon: "📬" },
  CANCELLED: { bg: "#fef2f2", color: "#991b1b", label: "Annulée",     icon: "❌" },
};

export default async function AdminCommandes() {
  const commandes = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = commandes.reduce((s, o) => s + (o.status !== "CANCELLED" ? o.total : 0), 0);
  const pending = commandes.filter((o) => o.status === "PENDING").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#0f172a", letterSpacing: "-0.03em", margin: 0, marginBottom: 4 }}>Commandes</h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>{commandes.length} commande{commandes.length > 1 ? "s" : ""} au total</p>
        </div>
        {pending > 0 && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span>⏳</span>
            <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#92400e" }}>{pending} commande{pending > 1 ? "s" : ""} en attente</span>
          </div>
        )}
      </div>

      {/* Stats rapides */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total commandes", value: commandes.length, icon: "🛒" },
          { label: "En attente", value: pending, icon: "⏳" },
          { label: "Revenus", value: `${total.toFixed(2)} €`, icon: "💰" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: "1.3rem", color: "#0f172a", margin: 0, letterSpacing: "-0.03em" }}>{s.value}</p>
              <p style={{ color: "#64748b", fontSize: "0.78rem", margin: 0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table commandes */}
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Commande", "Client", "Articles", "Total", "Statut", "Date", "Action"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commandes.map((o) => {
              const s = statusConfig[o.status] ?? statusConfig.PENDING;
              return (
                <tr key={o.id} className="admin-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.78rem", color: "#94a3b8", fontFamily: "monospace", margin: 0 }}>#{o.id.slice(-8).toUpperCase()}</p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>
                        {o.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a" }}>{o.user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ maxWidth: 180 }}>
                      {o.items.slice(0, 2).map((i) => (
                        <p key={i.id} style={{ fontSize: "0.78rem", color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {i.product.name} ×{i.quantity}
                        </p>
                      ))}
                      {o.items.length > 2 && <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>+{o.items.length - 2} autre{o.items.length - 2 > 1 ? "s" : ""}</p>}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 800, color: "#4f46e5", fontSize: "0.95rem" }}>{o.total.toFixed(2)} €</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", background: s.bg, color: s.color, borderRadius: 999, fontSize: "0.75rem", fontWeight: 700 }}>
                      {s.icon} {s.label}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "0.8rem", color: "#94a3b8" }}>
                    {new Date(o.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <CommandeStatut orderId={o.id} current={o.status} />
                  </td>
                </tr>
              );
            })}
            {commandes.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🛒</div>
                <p>Aucune commande pour le moment.</p>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
