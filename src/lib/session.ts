import { cookies } from "next/headers";
import prisma from "./prisma";

export type SessionUser = {
  id: string;
  name: string;
  code: string;
  role: "CLIENT" | "ADMIN";
};

/**
 * Récupère l'utilisateur connecté depuis le cookie de session.
 * Retourne null si pas de session valide.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("auth_session")?.value;

  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return null;

  return {
    id: session.user.id,
    name: session.user.name,
    code: session.user.code,
    role: session.user.role as "CLIENT" | "ADMIN",
  };
}

/**
 * Vérifie si l'utilisateur connecté est admin.
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Accès refusé : réservé aux administrateurs");
  }
  return user;
}
