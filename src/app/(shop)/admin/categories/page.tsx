import prisma from "@/lib/prisma";
import CategorieForm from "./CategorieForm";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#0f172a", letterSpacing: "-0.03em", margin: 0, marginBottom: 4 }}>Catégories</h1>
        <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>{categories.length} catégorie{categories.length > 1 ? "s" : ""}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>

        {/* Liste */}
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                {["Catégorie", "Slug", "Produits", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="admin-row" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #ede9fe, #ddd6fe)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🏷</div>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a", margin: 0 }}>{c.name}</p>
                        {c.description && <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>{c.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <code style={{ fontSize: "0.78rem", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 4, fontFamily: "monospace" }}>{c.slug}</code>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#4f46e5" }}>{c._count.products}</span>
                    <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}> produit{c._count.products > 1 ? "s" : ""}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <CategorieForm mode="edit" category={c} />
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>Aucune catégorie créée.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Formulaire création */}
        <div>
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}>Nouvelle catégorie</h2>
            <CategorieForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  );
}
