import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produit = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!produit) return Response.json({ error: "Introuvable" }, { status: 404 });
  return Response.json(produit);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const produit = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      price: body.price != null ? parseFloat(body.price) : undefined,
      stock: body.stock != null ? parseInt(body.stock) : undefined,
      imageUrl: body.imageUrl,
      categoryId: body.categoryId ?? null,
      published: body.published,
    },
    include: { category: true },
  });
  return Response.json(produit);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return Response.json({ success: true });
}
