import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

// PATCH — mettre à jour le statut d'une commande (admin uniquement)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAdmin(); } catch {
    return Response.json({ error: "Accès refusé" }, { status: 403 });
  }
  const { id } = await params;
  const { status } = await req.json();
  const commande = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } }, user: true },
  });
  return Response.json(commande);
}
