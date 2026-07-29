import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/session";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: { items: { include: { product: true } } },
  });
}

// GET — récupérer le panier
export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });
  const cart = await getOrCreateCart(user.id);
  return Response.json(cart);
}

// POST — ajouter ou mettre à jour un article
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const { productId, quantity = 1 } = await req.json();
  if (!productId) return Response.json({ error: "productId requis" }, { status: 400 });

  const cart = await getOrCreateCart(user.id);

  const item = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity },
    create: { cartId: cart.id, productId, quantity },
    include: { product: true },
  });
  return Response.json(item);
}

// DELETE — vider le panier
export async function DELETE() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });
  const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return Response.json({ success: true });
}
