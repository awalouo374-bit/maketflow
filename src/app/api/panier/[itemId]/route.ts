import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

// DELETE — supprimer un article du panier
export async function DELETE(_: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const { itemId } = await params;
  await prisma.cartItem.delete({ where: { id: itemId } });
  return Response.json({ success: true });
}
