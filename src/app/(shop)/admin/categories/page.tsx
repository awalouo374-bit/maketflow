import prisma from "@/lib/prisma";
import CategorieForm from "./CategorieForm";
import { MdLabel } from "react-icons/md";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Catégories</h1>
          <p className="page-subtitle">{categories.length} catégorie{categories.length > 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-7 items-start">
        <div className="card overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Catégorie", "Slug", "Produits", "Actions"].map((h) => (
                  <th key={h} className="th-admin">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="admin-row border-b border-slate-100">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-linear-to-br from-violet-100 to-violet-200 rounded-lg flex items-center justify-center">
                        <MdLabel size={18} className="text-violet-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 m-0">{c.name}</p>
                        {c.description && <p className="text-xs text-slate-400 m-0">{c.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <code className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">{c.slug}</code>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-[0.9rem] text-indigo-600">{c._count.products}</span>
                    <span className="text-slate-400 text-xs"> produit{c._count.products > 1 ? "s" : ""}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <CategorieForm mode="edit" category={c} />
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-slate-400">Aucune catégorie créée.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-base text-slate-900 mb-5 pb-4 border-b border-slate-200">Nouvelle catégorie</h2>
          <CategorieForm mode="create" />
        </div>
      </div>
    </div>
  );
}
