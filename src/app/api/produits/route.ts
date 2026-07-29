import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

// GET /api/produits — liste publique des produits publiés
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("categorie");
  const search = searchParams.get("q");

  const produits = await prisma.product.findMany({
    where: {
      published: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(search
        ? { name: { contains: search, mode: "insensitive" } }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(produits);
}

// POST /api/produits — créer un produit (admin uniquement)
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json();
  const { name, description, price, stock, imageUrl, categoryId, published } = body;

  if (!name || price == null)
    return Response.json({ error: "Nom et prix requis" }, { status: 400 });

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const produit = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: stock ?? 0,
      imageUrl,
      categoryId: categoryId || null,
      published: published ?? true,
    },
    include: { category: true },
  });

  return Response.json(produit, { status: 201 });
}
