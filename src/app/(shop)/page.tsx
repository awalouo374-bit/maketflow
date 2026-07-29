import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLoop, MdLock, MdStar, MdSearch, MdClose, MdTune } from "react-icons/md";
import { IconType } from "react-icons";
import EmptyState from "@/components/shared/EmptyState";

type Props = { searchParams: Promise<{ categorie?: string; q?: string }> };
type Advantage = { icon: IconType; title: string; sub: string };

const advantages: Advantage[] = [
  { icon: MdLocalShipping, title: "Livraison gratuite", sub: "dès 50€" },
  { icon: MdLoop,          title: "Retours gratuits",   sub: "30 jours" },
  { icon: MdLock,          title: "Paiement sécurisé",  sub: "100%" },
  { icon: MdStar,          title: "Qualité garantie",   sub: "ou remboursé" },
];

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
      {!isFiltered && (
        <>
          <section className="hero-section">
            <div className="hero-glow" />
            <div className="hero-glow-bottom" />
            <div className="container">
              <div className="hero-grid">
                <div className="flex-1 animate-fade-up">
                  <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full text-xs font-bold tracking-widest mb-6 border border-orange-500/25 backdrop-blur-sm">
                    <MdStar size={12} /> NOUVELLE COLLECTION 2025
                  </div>
                  <h1 className="text-white font-extrabold leading-[1.1] tracking-tight mb-5 text-[clamp(2rem,5vw,3.5rem)]">
                    Achetez, Vendez,<br />
                    <span className="bg-linear-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">Grandissez</span>{" "}
                    <span className="text-white/90">avec nous</span>
                  </h1>
                  <p className="text-slate-300/80 mb-8 leading-relaxed max-w-[420px] text-[clamp(0.95rem,2vw,1.1rem)]">
                    Des milliers de produits soigneusement sélectionnés. Livraison rapide, retours faciles, satisfaction garantie.
                  </p>
                  <form method="GET" className="search-form">
                    <div className="flex-1 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 flex pointer-events-none">
                        <MdSearch size={19} className="text-slate-400" />
                      </span>
                      <input
                        name="q"
                        placeholder="Rechercher un produit, une marque..."
                        className="w-full py-3.5 pr-4 pl-12 rounded-2xl border-none text-sm bg-white/95 text-slate-900 outline-none font-[inherit] shadow-[0_4px_24px_rgba(0,0,0,.15)] placeholder:text-slate-400"
                      />
                    </div>
                    <button type="submit" className="btn-primary py-3.5 px-6 rounded-2xl whitespace-nowrap shrink-0 text-sm">
                      Rechercher
                    </button>
                  </form>
                </div>

                <div className="hero-logo">
                  <div className="hero-logo-glow" />
                  <Image src="/Logo3.png" alt="MarketFlow" fill className="object-contain drop-shadow-[0_24px_48px_rgba(249,115,22,.35)]" priority />
                </div>
              </div>
            </div>
          </section>

          <div className="advantage-bar">
            <div className="container">
              <div className="advantage-grid">
                {advantages.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="advantage-item">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm m-0 leading-none mb-0.5">{title}</p>
                      <p className="text-slate-400 text-xs m-0">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container py-responsive">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h2 className="font-extrabold text-slate-900 tracking-tight m-0 mb-1 text-[clamp(1.3rem,3vw,1.6rem)]">
              {q ? `Résultats pour "${q}"` : categorie ? (categories.find(c => c.slug === categorie)?.name ?? "Catalogue") : "Nos produits"}
            </h2>
            <p className="text-slate-400 text-sm m-0 font-medium">
              {produits.length} produit{produits.length !== 1 ? "s" : ""} disponible{produits.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isFiltered && (
            <div className="flex gap-2 flex-wrap items-center">
              <form method="GET" className="flex gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 flex pointer-events-none">
                    <MdSearch size={15} className="text-slate-400" />
                  </span>
                  <input name="q" defaultValue={q} placeholder="Affiner..." className="input w-40 py-2 pl-9 pr-3 text-sm" />
                </div>
                <button type="submit" className="btn-primary py-2 px-4 text-sm">OK</button>
              </form>
              <Link href="/" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm no-underline bg-white hover:bg-slate-50 hover:border-slate-300 transition-colors">
                <MdClose size={14} /> Effacer
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="cats-scroll flex-1 gap-2">
            <Link href="/" className={categorie ? "cat-pill" : "cat-pill cat-pill--active"}>Tout voir</Link>
            {categories.map((c) => (
              <Link key={c.id} href={`/?categorie=${c.slug}`} className={categorie === c.slug ? "cat-pill cat-pill--active" : "cat-pill"}>
                {c.name}
              </Link>
            ))}
          </div>
          <button className="hide-mobile ml-3 shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm bg-white hover:bg-slate-50 transition-colors">
            <MdTune size={16} /> Filtres
          </button>
        </div>

        {produits.length === 0 ? (
          <EmptyState
            icon={MdSearch}
            title="Aucun produit trouvé"
            description="Essayez un autre terme ou explorez toutes les catégories."
            action={<Link href="/" className="btn-primary no-underline">Voir tous les produits</Link>}
          />
        ) : (
          <div className="products-grid">
            {produits.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
