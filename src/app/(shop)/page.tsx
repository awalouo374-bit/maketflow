import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";

type Props = { searchParams: Promise<{ categorie?: string; q?: string }> };

export default async function Home({ searchParams }: Props) {
  const { categorie, q } = await searchParams;
  const isFiltered = !!(q || categorie);

  const [produits, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        published: true,
        ...(categorie ? { category: { slug: categorie } } : {}),
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main>
      <style>{`
        .hero-grid { display: flex; flex-direction: column-reverse; gap: 32px; align-items: center; }
        @media (min-width: 768px) { .hero-grid { flex-direction: row; gap: 48px; align-items: center; } }

        .hero-logo { width: 200px; height: 200px; position: relative; flex-shrink: 0; }
        @media (min-width: 768px) { .hero-logo { width: 280px; height: 280px; } }
        @media (min-width: 1024px) { .hero-logo { width: 340px; height: 340px; } }

        .advantage-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        @media (min-width: 768px) { .advantage-grid { grid-template-columns: repeat(4, 1fr); } }

        .products-grid { display: grid; gap: 16px; grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 640px) { .products-grid { gap: 20px; } }
        @media (min-width: 768px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }

        .search-form { display: flex; gap: 8px; max-width: 520px; }
        @media (max-width: 479px) { .search-form { flex-direction: column; } }

        .cats-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; -ms-overflow-style: none; flex-wrap: nowrap; }
        .cats-scroll::-webkit-scrollbar { display: none; }
        @media (min-width: 768px) { .cats-scroll { flex-wrap: wrap; overflow-x: visible; } }
      `}</style>

      {/* ── Hero ── */}
      {!isFiltered && (
        <>
          <section style={{ background: "linear-gradient(135deg,#0d1a45 0%,#1a2d6b 55%,#2a3f8f 100%)", padding: "48px 16px 56px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,.18) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div className="container">
              <div className="hero-grid">
                {/* Texte */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,.15)", color: "#fb923c", padding: "6px 16px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 20, border: "1px solid rgba(249,115,22,.3)" }}>
                    ✨ NOUVELLE COLLECTION
                  </div>
                  <h1 style={{ color: "white", fontSize: "clamp(1.6rem,4vw,3.25rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.04em", marginBottom: 16 }}>
                    Achetez, Vendez,<br />
                    <span style={{ color: "#f97316" }}>Grandissez</span> avec nous
                  </h1>
                  <p style={{ color: "#a5b4d4", fontSize: "clamp(0.9rem,2vw,1.05rem)", marginBottom: 28, lineHeight: 1.75, maxWidth: 440 }}>
                    Des milliers de produits soigneusement sélectionnés. Livraison rapide, retours faciles.
                  </p>
                  <form method="GET" className="search-form">
                    <div style={{ flex: 1, position: "relative" }}>
                      <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "1rem", pointerEvents: "none" }}>🔍</span>
                      <input name="q" placeholder="Rechercher un produit..." style={{ width: "100%", padding: "13px 16px 13px 42px", borderRadius: 12, border: "none", fontSize: "0.9rem", background: "rgba(255,255,255,.95)", color: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: "13px 22px", borderRadius: 12, whiteSpace: "nowrap", flexShrink: 0 }}>Rechercher</button>
                  </form>
                </div>
                {/* Logo */}
                <div className="hero-logo">
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,.12) 0%,transparent 70%)" }} />
                  <Image src="/Logo3.png" alt="MarketFlow" fill style={{ objectFit: "contain", filter: "drop-shadow(0 16px 32px rgba(249,115,22,.3))" }} priority />
                </div>
              </div>
            </div>
          </section>

          {/* Avantages */}
          <div style={{ background: "#1a2d6b", borderBottom: "3px solid #f97316" }}>
            <div className="container" style={{ padding: "14px 16px" }}>
              <div className="advantage-grid">
                {[["🚚","Livraison gratuite","dès 50€"],["↩️","Retours gratuits","30 jours"],["🔒","Paiement sécurisé","100%"],["⭐","Qualité garantie","ou remboursé"]].map(([icon,title,sub]) => (
                  <div key={title as string} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
                    <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ color: "white", fontWeight: 600, fontSize: "0.8rem", margin: 0, lineHeight: 1.3 }}>{title}</p>
                      <p style={{ color: "#a5b4d4", fontSize: "0.7rem", margin: 0 }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Catalogue ── */}
      <div className="container py-responsive">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: "clamp(1.2rem,3vw,1.5rem)", color: "#0f172a", letterSpacing: "-0.03em", margin: 0, marginBottom: 4 }}>
              {q ? `Résultats pour "${q}"` : categorie ? (categories.find(c => c.slug === categorie)?.name ?? "Catalogue") : "Nos produits"}
            </h2>
            <p style={{ color: "#64748b", fontSize: "0.875rem", margin: 0 }}>{produits.length} produit{produits.length !== 1 ? "s" : ""}</p>
          </div>
          {isFiltered && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <form method="GET" style={{ display: "flex", gap: 6 }}>
                <input name="q" defaultValue={q} placeholder="Rechercher..." style={{ padding: "8px 12px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none", width: 180, fontFamily: "inherit", color: "#0f172a" }} />
                <button type="submit" className="btn-primary" style={{ padding: "8px 14px", borderRadius: 10 }}>OK</button>
              </form>
              <Link href="/" style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", color: "#64748b", fontSize: "0.875rem", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>✕ Reset</Link>
            </div>
          )}
        </div>

        {/* Filtres catégories — scroll horizontal sur mobile */}
        <div className="cats-scroll" style={{ marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}>
          <Link href="/" className={categorie ? "cat-pill" : "cat-pill cat-pill--active"} style={{ whiteSpace: "nowrap" }}>Tous</Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/?categorie=${c.slug}`} className={categorie === c.slug ? "cat-pill cat-pill--active" : "cat-pill"} style={{ whiteSpace: "nowrap" }}>{c.name}</Link>
          ))}
        </div>

        {/* Grille produits */}
        {produits.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 16, opacity: .4 }}>🔍</div>
            <h3 style={{ color: "#0f172a", fontWeight: 700, marginBottom: 8 }}>Aucun produit trouvé</h3>
            <p style={{ color: "#64748b", marginBottom: 24 }}>Essayez un autre terme ou explorez toutes les catégories.</p>
            <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>Voir tous les produits</Link>
          </div>
        ) : (
          <div className="products-grid">
            {produits.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
