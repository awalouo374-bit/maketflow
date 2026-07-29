import prisma from "@/lib/prisma";
import { getSessionUser, requireAdmin } from "@/lib/session";

// GET — liste des commandes (admin : toutes, client : les siennes)
export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const commandes = await prisma.order.findMany({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(commandes);
}

// POST — passer une commande depuis le panier
export async function POST() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Non connecté" }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
  });
  if (!cart || cart.items.length === 0)
    return Response.json({ error: "Panier vide" }, { status: 400 });

  const total = cart.items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  const commande = await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  // Vider le panier après commande
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return Response.json(commande, { status: 201 });
}
