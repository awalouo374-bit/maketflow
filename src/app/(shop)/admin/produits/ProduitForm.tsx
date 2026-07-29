"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type Produit = { id?: string; name?: string; description?: string | null; price?: number; stock?: number; imageUrl?: string | null; categoryId?: string | null; published?: boolean };

export default function ProduitForm({ produit, categories }: { produit?: Produit; categories: Category[] }) {
  const router = useRouter();
  const isEdit = !!produit?.id;
  const [form, setForm] = useState({
    name: produit?.name ?? "",
    description: produit?.description ?? "",
    price: produit?.price ?? "",
    stock: produit?.stock ?? 0,
    imageUrl: produit?.imageUrl ?? "",
    categoryId: produit?.categoryId ?? "",
    published: produit?.published ?? true,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set(k: string, v: unknown) { setForm((f) => ({ ...f, [k]: v })); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const url = isEdit ? `/api/produits/${produit!.id}` : "/api/produits";
    const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error); return; }
    router.push("/admin/produits"); router.refresh();
  }

  async function del() {
    if (!confirm(`Supprimer "${produit!.name}" ? Cette action est irréversible.`)) return;
    await fetch(`/api/produits/${produit!.id}`, { method: "DELETE" });
    router.push("/admin/produits"); router.refresh();
  }

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
      {children}
    </label>
  );

  return (
    <form onSubmit={save} style={{ maxWidth: 720 }}>
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
          <span>⚠️</span><span style={{ color: "#ef4444", fontSize: "0.875rem" }}>{error}</span>
        </div>
      )}

      <div className="card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Field label="Nom du produit *">
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Ex: Smartphone Pro X" style={{ gridColumn: "span 2" }} />
          </Field>
          <Field label="Prix (€) *">
            <input className="input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} required placeholder="0.00" />
          </Field>
          <Field label="Stock">
            <input className="input" type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" />
          </Field>
        </div>

        <Field label="Description">
          <textarea className="input" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Décrivez votre produit..." style={{ resize: "vertical", fontFamily: "inherit" }} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Field label="URL de l'image">
            <input className="input" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
          </Field>
          <Field label="Catégorie">
            <select className="input" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              <option value="">— Sans catégorie —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
        </div>

        {/* Aperçu image */}
        {form.imageUrl && (
          <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0", height: 160, background: "#f8fafc" }}>
            <img src={form.imageUrl as string} alt="Aperçu" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => (e.currentTarget.style.display = "none")} />
          </div>
        )}

        {/* Toggle publié */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
          <button type="button" onClick={() => set("published", !form.published)} style={{
            width: 44, height: 24, borderRadius: 999, border: "none", cursor: "pointer", transition: "background .2s",
            background: form.published ? "#4f46e5" : "#cbd5e1", position: "relative", flexShrink: 0,
          }}>
            <span style={{ position: "absolute", top: 3, left: form.published ? 23 : 3, width: 18, height: 18, background: "white", borderRadius: "50%", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
          </button>
          <div>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "#0f172a", margin: 0 }}>{form.published ? "Produit publié" : "Produit masqué"}</p>
            <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>{form.published ? "Visible dans la boutique" : "Invisible pour les clients"}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "11px 24px" }}>
          {saving ? "Enregistrement..." : isEdit ? "💾 Enregistrer" : "✨ Créer le produit"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary" style={{ padding: "11px 20px" }}>Annuler</button>
        {isEdit && (
          <button type="button" onClick={del} className="btn-danger" style={{ padding: "11px 20px", marginLeft: "auto" }}>🗑 Supprimer</button>
        )}
      </div>
    </form>
  );
}
