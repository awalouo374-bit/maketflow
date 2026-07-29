import prisma from "@/lib/prisma";
import ProduitForm from "../ProduitForm";
import Link from "next/link";

export default async function NouveauProduit() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <Link href="/admin/produits" style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", textDecoration: "none", fontSize: "0.875rem", fontWeight: 500 }}>
          ← Produits
        </Link>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#0f172a", fontSize: "0.875rem", fontWeight: 600 }}>Nouveau produit</span>
      </div>
      <h1 style={{ fontWeight: 800, fontSize: "1.6rem", color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 28 }}>Créer un produit</h1>
      <ProduitForm categories={categories} />
    </div>
  );
}
