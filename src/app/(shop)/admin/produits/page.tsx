import prisma from "@/lib/prisma";
import Link from "next/link";
import { MdInventory2, MdEdit } from "react-icons/md";
import EmptyState from "@/components/shared/EmptyState";

export default async function AdminProduits() {
  const produits = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Produits</h1>
          <p className="page-subtitle">{produits.length} produit{produits.length > 1 ? "s" : ""} au total</p>
        </div>
        <Link href="/admin/produits/nouveau" className="btn-primary no-underline">+ Nouveau produit</Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map((h) => (
                <th key={h} className="th-admin">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {produits.map((p) => (
              <tr key={p.id} className="admin-row border-b border-slate-100">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-[42px] h-[42px] rounded-[10px] bg-linear-to-br from-[#f0f4ff] to-orange-soft flex items-center justify-center overflow-hidden shrink-0">
                      {p.imageUrl ? <img src={p.imageUrl} className="w-full h-full object-cover" /> : <MdInventory2 size={20} className="text-slate-300" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 m-0 mb-0.5">{p.name}</p>
                      <p className="text-xs text-slate-400 m-0">#{p.id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {p.category
                    ? <span className="bg-navy-soft text-navy px-2.5 py-0.5 rounded-full text-xs font-semibold">{p.category.name}</span>
                    : <span className="text-slate-300 text-sm">—</span>}
                </td>
                <td className="px-5 py-3.5 font-bold text-orange-500 text-[0.9rem]">{p.price.toFixed(2)} €</td>
                <td className="px-5 py-3.5">
                  <span className={`font-semibold text-sm ${p.stock > 10 ? "text-emerald-600" : p.stock > 0 ? "text-amber-600" : "text-red-500"}`}>
                    {p.stock > 0 ? p.stock : "Épuisé"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.published ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${p.published ? "bg-emerald-500" : "bg-slate-300"}`} />
                    {p.published ? "Publié" : "Masqué"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <Link href={`/admin/produits/${p.id}`} className="admin-edit-btn">
                    <MdEdit size={14} /> Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {produits.length === 0 && (
          <EmptyState icon={MdInventory2} title="Aucun produit" description="Créez votre premier produit !" />
        )}
      </div>
    </div>
  );
}
