import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return Response.json(categories);
}

export async function POST(req: Request) {
  try { await requireAdmin(); } catch {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { name, description, imageUrl } = await req.json();
  if (!name) return Response.json({ error: "Nom requis" }, { status: 400 });

  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const cat = await prisma.category.create({
    data: { name, slug, description, imageUrl },
  });
  return Response.json(cat, { status: 201 });
}
