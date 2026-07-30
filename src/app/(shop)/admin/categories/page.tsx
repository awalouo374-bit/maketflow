import prisma from "@/lib/prisma";
import CategoriesList from "./CategoriesList";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return <CategoriesList categories={categories} />;
}
