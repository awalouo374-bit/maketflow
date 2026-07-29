import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLoop, MdLock, MdStar, MdSearch, MdClose } from "react-icons/md";
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
            <div className="container">
              <div className="hero-grid">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-orange-500/15 text-orange-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-5 border border-orange-500/30">
                    <MdStar size={14} /> NOUVELLE COLLECTION
                  </div>
                  <h1 className="text-white font-extrabold leading-tight tracking-tight mb-4 text-[clamp(1.6rem,4vw,3.25rem)]">
                    Achetez, Vendez,<br />
                    <span className="text-orange-500">Grandissez</span> avec nous
                  </h1>
                  <p className="text-[#a5b4d4] mb-7 leading-7 max-w-[440px] text-[clamp(0.9rem,2vw,1.05rem)]">
                    Des milliers de produits soigneusement sélectionnés. Livraison rapide, retours faciles.
                  </p>
                  <form method="GET" className="search-form">
                    <div className="flex-1 relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex pointer-events-none">
                        <MdSearch size={18} className="text-slate-400" />
                      </span>
                      <input name="q" placeholder="Rechercher un produit..." className="w-full py-3 pr-4 pl-[42px] rounded-xl border-none text-[0.9rem] bg-white/95 text-slate-900 outline-none box-border font-[inherit]" />
                    </div>
                    <button type="submit" className="btn-primary py-3 px-5 rounded-xl whitespace-nowrap shrink-0">Rechercher</button>
                  </form>
                </div>
                <div className="hero-logo">
                  <div className="hero-logo-glow" />
                  <Image src="/Logo3.png" alt="MarketFlow" fill className="object-contain drop-shadow-[0_16px_32px_rgba(249,115,22,.3)]" priority />
                </div>
              </div>
            </div>
          </section>

          <div className="advantage-bar">
            <div className="container py-3.5">
              <div className="advantage-grid">
                {advantages.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="flex items-center gap-2 py-2">
                    <Icon size={20} className="text-orange-500 shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-xs m-0 leading-snug">{title}</p>
                      <p className="text-[#a5b4d4] text-[0.7rem] m-0">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container py-responsive">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-extrabold text-slate-900 tracking-tight m-0 mb-1 text-[clamp(1.2rem,3vw,1.5rem)]">
              {q ? `Résultats pour "${q}"` : categorie ? (categories.find(c => c.slug === categorie)?.name ?? "Catalogue") : "Nos produits"}
            </h2>
            <p className="text-slate-500 text-sm m-0">{produits.length} produit{produits.length !== 1 ? "s" : ""}</p>
          </div>
          {isFiltered && (
            <div className="flex gap-2 flex-wrap">
              <form method="GET" className="flex gap-1.5">
                <input name="q" defaultValue={q} placeholder="Rechercher..." className="input w-[180px] py-2 px-3 rounded-[10px] text-sm" />
                <button type="submit" className="btn-primary py-2 px-3.5 rounded-[10px]">OK</button>
              </form>
              <Link href="/" className="inline-flex items-center gap-1 px-3.5 py-2 rounded-[10px] border-[1.5px] border-slate-200 text-slate-500 text-sm no-underline">
                <MdClose size={14} /> Reset
              </Link>
            </div>
          )}
        </div>

        <div className="cats-scroll mb-7 pb-4 border-b border-slate-200">
          <Link href="/" className={categorie ? "cat-pill" : "cat-pill cat-pill--active"}>Tous</Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/?categorie=${c.slug}`} className={categorie === c.slug ? "cat-pill cat-pill--active" : "cat-pill"}>
              {c.name}
            </Link>
          ))}
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
