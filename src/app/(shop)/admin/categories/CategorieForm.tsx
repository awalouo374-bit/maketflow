"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdEdit, MdDelete, MdClose } from "react-icons/md";

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
      <div className="flex gap-2">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 bg-transparent border-none cursor-pointer text-indigo-600 text-xs font-semibold px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
        >
          <MdEdit size={14} /> Modifier
        </button>
        <button
          onClick={del}
          className="inline-flex items-center bg-transparent border-none cursor-pointer text-red-500 text-xs font-semibold px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
        >
          <MdDelete size={16} />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-100 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="card p-8 w-full max-w-[420px] shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-[1.1rem] text-slate-900 m-0">Modifier la catégorie</h2>
              <button onClick={() => setOpen(false)} className="bg-transparent border-none cursor-pointer text-slate-400 p-1 flex">
                <MdClose size={20} />
              </button>
            </div>
            <form onSubmit={save} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="field-label">Nom *</span>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nom de la catégorie" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="field-label">Description</span>
                <textarea className="input resize-none" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description optionnelle" />
              </label>
              <div className="flex gap-2.5 mt-1">
                <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5">
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary py-2.5 px-4">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return (
    <form onSubmit={save} className="flex flex-col gap-3.5">
      <label className="flex flex-col gap-1.5">
        <span className="field-label">Nom *</span>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ex: Électronique" />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="field-label">Description</span>
        <textarea className="input resize-none" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Description optionnelle" />
      </label>
      <button type="submit" disabled={saving} className="btn-primary py-2.5">
        {saving ? "Création..." : "+ Créer la catégorie"}
      </button>
    </form>
  );
}
