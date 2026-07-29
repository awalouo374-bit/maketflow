import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Créer l'admin
  const admin = await prisma.user.upsert({
    where: { code: "ADMIN123" },
    update: {},
    create: { code: "ADMIN123", name: "Administrateur", role: "ADMIN" },
  });
  console.log("✅ Admin créé :", admin.name, "| code:", admin.code);

  // Catégories
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: "electronique" }, update: {}, create: { name: "Électronique", slug: "electronique", description: "Appareils électroniques" } }),
    prisma.category.upsert({ where: { slug: "vetements" }, update: {}, create: { name: "Vêtements", slug: "vetements", description: "Mode et accessoires" } }),
    prisma.category.upsert({ where: { slug: "maison" }, update: {}, create: { name: "Maison", slug: "maison", description: "Décoration et mobilier" } }),
  ]);
  console.log("✅ Catégories créées");

  // Produits
  const produits = [
    { name: "Smartphone Pro X", price: 799.99, stock: 50, categoryId: cats[0].id, description: "Dernier modèle haute performance" },
    { name: "Casque Bluetooth", price: 129.99, stock: 100, categoryId: cats[0].id, description: "Son premium sans fil" },
    { name: "T-Shirt Premium", price: 29.99, stock: 200, categoryId: cats[1].id, description: "Coton biologique doux" },
    { name: "Veste Légère", price: 89.99, stock: 80, categoryId: cats[1].id, description: "Idéale pour toutes saisons" },
    { name: "Lampe Design", price: 59.99, stock: 60, categoryId: cats[2].id, description: "Éclairage moderne LED" },
  ];

  for (const p of produits) {
    const slug = p.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    await prisma.product.upsert({ where: { slug }, update: {}, create: { ...p, slug } });
  }
  console.log(" Produits créés");
  console.log("\n Connexion admin → Nom: Administrateur | Code: ADMIN123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
