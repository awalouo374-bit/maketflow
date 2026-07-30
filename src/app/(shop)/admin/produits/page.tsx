import prisma from "@/lib/prisma";
import ProduitsList from "./ProduitsList";

export default async function AdminProduits() {
  const [produits, categories] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  return <ProduitsList produits={produits} categories={categories} />;
}
