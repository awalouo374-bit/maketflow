import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { code, name } = await req.json();

  if (!code || !name)
    return Response.json({ error: "Code et nom requis" }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { code, name },
  });

  if (!user)
    return Response.json({ error: "Utilisateur introuvable" }, { status: 401 });

  // Créer une session en base
  const session = await prisma.session.create({
    data: { userId: user.id },
  });

  // Poser le cookie de session
  const cookieStore = await cookies();
  cookieStore.set("auth_session", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  return Response.json({
    success: true,
    user: { id: user.id, name: user.name, role: user.role },
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    cookieStore.delete("auth_session");
  }

  return Response.json({ success: true });
}
