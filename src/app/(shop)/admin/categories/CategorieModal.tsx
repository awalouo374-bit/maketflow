"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdSave, MdAdd } from "react-icons/md";
import Modal from "@/components/shared/Modal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ErrorAlert from "@/components/shared/ErrorAlert";

type Category = { id: string; name: string; description?: string | null };
type Props = { open: boolean; onClose: () => void; category?: Category };

export default function CategorieModal({ open, onClose, category }: Props) {
  const router = useRouter();
  const isEdit = !!category?.id;
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleClose() {
    setError("");
    setName(category?.name ?? "");
    setDescription(category?.description ?? "");
    onClose();
  }

  async function save(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const url = isEdit ? `/api/categories/${category!.id}` : "/api/categories";
    const res = await fetch(url, { method: isEdit ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description }) });
    setSaving(false);
    if (!res.ok) { setError((await res.json()).error ?? "Erreur"); return; }
    router.refresh();
    if (!isEdit) { setName(""); setDescription(""); }
    handleClose();
  }

  async function del() {
    setDeleting(true);
    await fetch(`/api/categories/${category!.id}`, { method: "DELETE" });
    setDeleting(false); setConfirmDelete(false);
    router.refresh(); handleClose();
  }

  return (
    <>
      <Modal open={open} onClose={handleClose} title={isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"} size="sm">
        <form onSubmit={save}>
          <div className="modal-body">
            {error && <ErrorAlert message={error} />}
            <div>
              <label className="modal-label">Nom de la catégorie *</label>
              <input className="modal-input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex : Électronique" autoFocus />
            </div>
            <div>
              <label className="modal-label">Description</label>
              <textarea className="modal-input resize-none" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Une brève description..." />
              <span className="modal-hint">Visible par les clients dans la boutique.</span>
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
                {saving ? <><span className="spinner-sm" /> Création...</> : <><MdAdd size={15} /> Créer</>}
              </button>
            </div>
          )}
        </form>
      </Modal>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={del} loading={deleting}
        title="Supprimer la catégorie" message={`Supprimer "${category?.name}" dissociera tous ses produits. Action irréversible.`} confirmLabel="Oui, supprimer" />
    </>
  );
}
