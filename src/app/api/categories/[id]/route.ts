import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const { name, description, imageUrl } = await req.json();
  const cat = await prisma.category.update({
    where: { id },
    data: { name, description, imageUrl },
  });
  return Response.json(cat);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return Response.json({ success: true });
}
