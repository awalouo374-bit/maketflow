"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; description?: string | null; imageUrl?: string | null };
type Props = { mode: "create" | "edit"; category?: Category };

export default function CategorieForm({ mode, category }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    const url = mode === "edit" ? `/api/categories/${category!.id}` : "/api/categories";
    const method = mode === "edit" ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description }) });
    setSaving(false); router.refresh();
    if (mode === "create") { setName(""); setDescription(""); }
    else setOpen(false);
  }

  async function del() {
    if (!confirm(`Supprimer la catégorie "${category!.name}" ?`)) return;
    await fetch(`/api/categories/${category!.id}`, { method: "DELETE" });
    router.refresh();
  }

  if (mode === "edit") return (
    <>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4f46e5", fontSize: "0.8rem", fontWeight: 600, padding: "4px 8px", borderRadius: 6, transition: "background .15s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#ede9fe")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
          ✏️ Modifier
        </button>
        <button onClick={del} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "0.8rem", fontWeight: 600, padding: "4px 8px", borderRadius: 6, transition: "background .15s" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")} onMouseLeave={e => (e.currentTarget.style.background = "none")}>
          🗑
        </button>
      </div>

      {open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="card" style={{ padding: 32, width: "100%", maxWidth: 420, boxShadow: "0 25px 50px -12px rgba(0,0,0,.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", margin: 0 }}>Modifier la catégorie</h2>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "#94a3b8", padding: 4 }}>✕</button>
            </div>
            <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>Nom *</span>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nom de la catégorie" />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>Description</span>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description optionnelle" style={{ resize: "none", fontFamily: "inherit" }} />
              </label>
              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, padding: "10px" }}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary" style={{ padding: "10px 18px" }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  // Mode création
  return (
    <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>Nom *</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Électronique" />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151", letterSpacing: "0.05em", textTransform: "uppercase" }}>Description</span>
        <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description optionnelle" style={{ resize: "none", fontFamily: "inherit" }} />
      </label>
      <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "10px" }}>
        {saving ? "Création..." : "+ Créer la catégorie"}
      </button>
    </form>
  );
}
