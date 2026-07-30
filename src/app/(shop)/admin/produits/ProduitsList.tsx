"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdInventory2, MdEdit, MdAdd, MdDeleteOutline } from "react-icons/md";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import ProduitModal from "./ProduitModal";

type Category = { id: string; name: string };
type Produit = {
  id: string; name: string; price: number; stock: number; published: boolean;
  imageUrl: string | null; categoryId: string | null; description: string | null;
  category: { id: string; name: string } | null;
};
type Props = { produits: Produit[]; categories: Category[] };

export default function ProduitsList({ produits, categories }: Props) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Produit | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Produit | undefined>(undefined);
  const [deleting, setDeleting] = useState(false);

  function openCreate() { setSelected(undefined); setModalOpen(true); }
  function openEdit(p: Produit) { setSelected(p); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setSelected(undefined); }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/produits/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false); setDeleteTarget(undefined); router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="page-title">Produits</h1>
          <p className="page-subtitle">{produits.length} produit{produits.length !== 1 ? "s" : ""} au total</p>
        </div>
        <button onClick={openCreate} className="btn-primary inline-flex items-center gap-1.5 shrink-0 px-5 py-2.5 rounded-lg text-sm">
          <MdAdd size={18} /> + Nouveau produit
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[620px]">
            <thead>
              <tr className="bg-muted border-b border-border">
                {["Produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map((h) => (
                  <th key={h} className="th-admin">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p.id} className="admin-row border-b border-muted">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
                        {p.imageUrl
                          ? <img src={p.imageUrl} className="w-full h-full object-cover" />
                          : <MdInventory2 size={18} className="text-slate-300" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 m-0 mb-0.5 truncate max-w-40">{p.name}</p>
                        <p className="text-xs text-slate-400 m-0 font-mono">#{p.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {p.category
                      ? <span className="bg-navy-soft text-navy px-2.5 py-1 rounded-md text-xs font-semibold">{p.category.name}</span>
                      : <span className="text-slate-300 text-sm">—</span>}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-orange whitespace-nowrap">{p.price.toFixed(2)} €</td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`font-semibold text-sm ${p.stock > 10 ? "text-green-600" : p.stock > 0 ? "text-amber-600" : "text-red-500"}`}>
                      {p.stock > 0 ? p.stock : "Épuisé"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${p.published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.published ? "bg-green-500" : "bg-slate-400"}`} />
                      {p.published ? "Publié" : "Masqué"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-border text-slate-600 text-xs font-semibold hover:bg-orange hover:text-white hover:border-orange transition-all cursor-pointer"
                      >
                        <MdEdit size={13} /> Modifier
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
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
        {produits.length === 0 && (
          <EmptyState
            icon={MdInventory2}
            title="Aucun produit"
            description="Créez votre premier produit pour commencer à vendre."
            action={
              <button onClick={openCreate} className="btn-primary inline-flex items-center gap-1.5">
                <MdAdd size={16} /> Créer un produit
              </button>
            }
          />
        )}
      </div>

      <ProduitModal
        key={selected?.id ?? "new"}
        open={modalOpen}
        onClose={closeModal}
        produit={selected}
        categories={categories}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Supprimer le produit"
        message={`Supprimer définitivement "${deleteTarget?.name}" ? Cette action est irréversible.`}
        confirmLabel="Oui, supprimer"
      />
    </>
  );
}
