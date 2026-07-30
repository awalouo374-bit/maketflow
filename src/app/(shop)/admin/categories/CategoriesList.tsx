"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdLabel, MdEdit, MdAdd, MdDeleteOutline } from "react-icons/md";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import CategorieModal from "./CategorieModal";

type Category = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  _count: { products: number };
};
type Props = { categories: Category[] };

export default function CategoriesList({ categories }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Category | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Category | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);

  function openCreate() { setSelected(undefined); setModalOpen(true); }
  function openEdit(c: Category) { setSelected(c); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setSelected(undefined); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/categories/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false); setDeleteTarget(undefined); router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="page-title">Catégories</h1>
          <p className="page-subtitle">{categories.length} catégorie{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openCreate}
          className="btn-primary inline-flex items-center gap-1.5 shrink-0 px-5 py-2.5 rounded-lg text-sm"
        >
          <MdAdd size={18} /> + Nouvelle catégorie
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[520px]">
            <thead>
              <tr className="bg-muted border-b border-border">
                {["Catégorie", "Slug", "Produits", "Actions"].map((h) => (
                  <th key={h} className="th-admin">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="admin-row border-b border-muted">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-soft flex items-center justify-center shrink-0">
                        <MdLabel size={16} className="text-orange" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 m-0">{c.name}</p>
                        {c.description && (
                          <p className="text-xs text-slate-400 m-0 truncate max-w-[220px]">{c.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <code className="text-xs bg-muted text-slate-500 px-2 py-1 rounded font-mono border border-border">
                      {c.name.toLowerCase().replace(/\s+/g, "-")}
                    </code>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-navy">
                      {c._count.products} produit{c._count.products !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-border text-slate-600 text-xs font-semibold hover:bg-orange hover:text-white hover:border-orange transition-all cursor-pointer"
                      >
                        <MdEdit size={13} /> Modifier
                      </button>
                      <button
                        onClick={() => setDeleteTarget(c)}
                        title="Supprimer"
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 border border-border bg-white cursor-pointer shrink-0 transition-colors"
                      >
                        <MdDeleteOutline size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <EmptyState
            icon={MdLabel}
            title="Aucune catégorie"
            description="Organisez vos produits en créant des catégories."
            action={
              <button onClick={openCreate} className="btn-primary inline-flex items-center gap-1.5">
                <MdAdd size={16} /> Créer une catégorie
              </button>
            }
          />
        )}
      </div>

      <CategorieModal
        key={selected?.id ?? "new"}
        open={modalOpen}
        onClose={closeModal}
        category={selected}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Supprimer la catégorie"
        message={`Supprimer "${deleteTarget?.name}" dissociera tous ses produits. Cette action est irréversible.`}
        confirmLabel="Oui, supprimer"
      />
    </>
  );
}
