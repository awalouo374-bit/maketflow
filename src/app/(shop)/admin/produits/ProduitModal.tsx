"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdImage, MdSave, MdAddCircle } from "react-icons/md";
import Modal from "@/components/shared/Modal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ErrorAlert from "@/components/shared/ErrorAlert";

type Category = { id: string; name: string };
type Produit = { id?: string; name?: string; description?: string | null; price?: number; stock?: number; imageUrl?: string | null; categoryId?: string | null; published?: boolean };
type Props = { open: boolean; onClose: () => void; produit?: Produit; categories: Category[] };

export default function ProduitModal({ open, onClose, produit, categories }: Props) {
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function f(k: string, v: unknown) { setForm((p) => ({ ...p, [k]: v })); }

  function handleClose() { setError(""); onClose(); }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const url = isEdit ? `/api/produits/${produit!.id}` : "/api/produits";
    const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error ?? "Erreur"); return; }
    router.refresh(); handleClose();
  }

  async function del() {
    setDeleting(true);
    await fetch(`/api/produits/${produit!.id}`, { method: "DELETE" });
    setDeleting(false); setConfirmDelete(false);
    router.refresh(); handleClose();
  }

  return (
    <>
      <Modal open={open} onClose={handleClose} title={isEdit ? "Modifier le produit" : "Nouveau produit"} size="lg">
        <form onSubmit={save}>
          <div className="modal-body">
            {error && <ErrorAlert message={error} />}

            <div>
              <label className="modal-label">Nom du produit *</label>
              <input className="modal-input" value={form.name} onChange={(e) => f("name", e.target.value)} required placeholder="Ex : Smartphone Pro X" autoFocus />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="modal-label">Prix (€) *</label>
                <input className="modal-input" type="number" step="0.01" min="0" value={form.price} onChange={(e) => f("price", e.target.value)} required placeholder="0.00" />
              </div>
              <div>
                <label className="modal-label">Stock</label>
                <input className="modal-input" type="number" min="0" value={form.stock} onChange={(e) => f("stock", e.target.value)} placeholder="0" />
                <span className="modal-hint">Quantité disponible</span>
              </div>
            </div>

            <div>
              <label className="modal-label">Description</label>
              <textarea className="modal-input resize-none" rows={3} value={form.description} onChange={(e) => f("description", e.target.value)} placeholder="Décrivez ce produit..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="modal-label">Catégorie</label>
                <select className="modal-input" value={form.categoryId} onChange={(e) => f("categoryId", e.target.value)}>
                  <option value="">— Sans catégorie —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="modal-label">URL image</label>
                <div className="modal-input-icon">
                  <span className="icon"><MdImage size={15} /></span>
                  <input className="modal-input" value={form.imageUrl} onChange={(e) => f("imageUrl", e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>

            {form.imageUrl && (
              <div className="rounded-lg overflow-hidden border border-border h-36 bg-muted">
                <img src={form.imageUrl as string} alt="Aperçu" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border">
              <div>
                <p className="text-sm font-semibold text-slate-800 m-0">{form.published ? "Produit publié" : "Produit masqué"}</p>
                <p className="text-xs text-slate-400 m-0 mt-0.5">{form.published ? "Visible dans la boutique" : "Brouillon invisible"}</p>
              </div>
              <button type="button" onClick={() => f("published", !form.published)} className="toggle-track" style={{ background: form.published ? "#ff6000" : "#d9d9d9" }}>
                <span className="toggle-thumb" style={{ left: form.published ? 23 : 3 }} />
              </button>
            </div>
          </div>

          {isEdit ? (
            <div className="modal-footer-3">
              <button type="button" onClick={() => setConfirmDelete(true)} className="modal-btn-danger col-span-2 sm:col-span-1">Supprimer</button>
              <button type="button" onClick={handleClose} className="modal-btn-cancel">Annuler</button>
              <button type="submit" disabled={saving} className="modal-btn-confirm">
                {saving ? <><span className="spinner-sm" /> Enregistrement...</> : <><MdSave size={15} /> Enregistrer</>}
              </button>
            </div>
          ) : (
            <div className="modal-footer">
              <button type="button" onClick={handleClose} className="modal-btn-cancel">Annuler</button>
              <button type="submit" disabled={saving} className="modal-btn-confirm">
                {saving ? <><span className="spinner-sm" /> Création...</> : <><MdAddCircle size={15} /> Créer le produit</>}
              </button>
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={del} loading={deleting}
        title="Supprimer le produit" message={`Supprimer définitivement "${produit?.name}" ? Cette action est irréversible.`} confirmLabel="Oui, supprimer" />
    </>
  );
}
