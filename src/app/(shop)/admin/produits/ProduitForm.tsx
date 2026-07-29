"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdSave, MdAddCircle, MdDelete } from "react-icons/md";
import FormField from "@/components/shared/FormField";
import ErrorAlert from "@/components/shared/ErrorAlert";

type Category = { id: string; name: string };
type Produit = {
  id?: string;
  name?: string;
  description?: string | null;
  price?: number;
  stock?: number;
  imageUrl?: string | null;
  categoryId?: string | null;
  published?: boolean;
};

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

  return (
    <form onSubmit={save} className="max-w-[720px]">
      {error && <ErrorAlert message={error} />}

      <div className="card p-7 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-5">
          <FormField label="Nom du produit *">
            <input className="input col-span-2" value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Ex: Smartphone Pro X" />
          </FormField>
          <FormField label="Prix (€) *">
            <input className="input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} required placeholder="0.00" />
          </FormField>
          <FormField label="Stock">
            <input className="input" type="number" min="0" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" />
          </FormField>
        </div>

        <FormField label="Description">
          <textarea className="input resize-y" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Décrivez votre produit..." />
        </FormField>

        <div className="grid grid-cols-2 gap-5">
          <FormField label="URL de l'image">
            <input className="input" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." />
          </FormField>
          <FormField label="Catégorie">
            <select className="input" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              <option value="">— Sans catégorie —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
        </div>

        {form.imageUrl && (
          <div className="rounded-xl overflow-hidden border border-slate-200 h-40 bg-slate-50">
            <img src={form.imageUrl as string} alt="Aperçu" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
          </div>
        )}

        <div className="flex items-center gap-3 px-4 py-3.5 bg-slate-50 rounded-[10px] border border-slate-200">
          <button
            type="button"
            onClick={() => set("published", !form.published)}
            className="toggle-track shrink-0"
            style={{ background: form.published ? "#4f46e5" : "#cbd5e1" }}
          >
            <span className="toggle-thumb" style={{ left: form.published ? 23 : 3 }} />
          </button>
          <div>
            <p className="font-semibold text-sm text-slate-900 m-0">{form.published ? "Produit publié" : "Produit masqué"}</p>
            <p className="text-xs text-slate-500 m-0">{form.published ? "Visible dans la boutique" : "Invisible pour les clients"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <button type="submit" disabled={saving} className="btn-primary py-3 px-6 inline-flex items-center gap-1.5">
          {saving ? "Enregistrement..." : isEdit ? <><MdSave size={16} /> Enregistrer</> : <><MdAddCircle size={16} /> Créer le produit</>}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary py-3 px-5">Annuler</button>
        {isEdit && (
          <button type="button" onClick={del} className="btn-danger py-3 px-5 ml-auto inline-flex items-center gap-1.5">
            <MdDelete size={16} /> Supprimer
          </button>
        )}
      </div>
    </form>
  );
}
