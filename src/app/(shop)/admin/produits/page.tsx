import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProduits() {
  const produits = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#0f172a", letterSpacing: "-0.03em", margin: 0, marginBottom: 4 }}>Produits</h1>
          <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>{produits.length} produit{produits.length > 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn-primary" style={{ textDecoration: "none" }}>
          + Nouveau produit
        </Link>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {produits.map((p) => (
              <tr key={p.id} className="admin-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "14px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#f0f4ff,#fff4ed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", overflow: "hidden", flexShrink: 0 }}>
                      {p.imageUrl ? <img src={p.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📦"}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a", margin: 0, marginBottom: 2 }}>{p.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>#{p.id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {p.category
                    ? <span style={{ background: "#e8ecf8", color: "#1a2d6b", padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600 }}>{p.category.name}</span>
                    : <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>—</span>}
                </td>
                <td style={{ padding: "14px 20px", fontWeight: 700, color: "#f97316", fontSize: "0.9rem" }}>{p.price.toFixed(2)} €</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: p.stock > 10 ? "#059669" : p.stock > 0 ? "#d97706" : "#ef4444" }}>
                    {p.stock > 0 ? p.stock : "Épuisé"}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600, background: p.published ? "#ecfdf5" : "#f1f5f9", color: p.published ? "#065f46" : "#64748b" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.published ? "#10b981" : "#cbd5e1", display: "inline-block" }} />
                    {p.published ? "Publié" : "Masqué"}
                  </span>
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <Link href={`/admin/produits/${p.id}`} className="admin-edit-btn">✏️ Modifier</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {produits.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>📦</div>
            <p style={{ fontWeight: 500 }}>Aucun produit. Créez votre premier produit !</p>
          </div>
        )}
      </div>
    </div>
  );
}
