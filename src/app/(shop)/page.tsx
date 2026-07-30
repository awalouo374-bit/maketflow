import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLoop, MdLock, MdSupportAgent, MdSearch, MdClose } from "react-icons/md";
import { IconType } from "react-icons";
import EmptyState from "@/components/shared/EmptyState";

type Props = { searchParams: Promise<{ categorie?: string; q?: string }> };
type Trust = { icon: IconType; title: string; sub: string };

const trust: Trust[] = [
  { icon: MdLocalShipping, title: "Livraison offerte",  sub: "dès 50 € d'achat" },
  { icon: MdLoop,          title: "Retours gratuits",   sub: "30 jours" },
  { icon: MdLock,          title: "Paiement sécurisé",  sub: "Transaction chiffrée" },
  { icon: MdSupportAgent,  title: "Support client",     sub: "7j/7" },
];

export default async function Home({ searchParams }: Props) {
  const { categorie, q } = await searchParams;
  const isFiltered = !!(q || categorie);

  const [produits, categories] = await Promise.all([
    prisma.product.findMany({
      where: { published: true, ...(categorie ? { category: { slug: categorie } } : {}), ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) },
      include: { category: true }, orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="mobile-pb">
      {!isFiltered && (
        <>
          <section className="hero-section">
            <div className="hero-glow" />
            <div className="container">
              <div className="hero-grid">
                <div className="flex-1 animate-fade-up">
                  <span className="inline-flex items-center gap-1.5 bg-[#ff6000]/25 text-orange-300 px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-4 border border-[#ff6000]/30">
                    Nouveautés 2025
                  </span>
                  <h1 className="text-white font-extrabold leading-tight tracking-tight mb-4 text-[clamp(1.75rem,5vw,3.25rem)]">
                    Achetez, Vendez,<br /><span className="text-[#ff8c3a]">Grandissez</span> avec nous
                  </h1>
                  <p className="text-white/65 mb-6 leading-relaxed max-w-[400px] text-[0.95rem]">Des milliers de produits sélectionnés. Livraison rapide, retours faciles.</p>
                  <form method="GET" className="flex gap-2 max-w-[460px]">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><MdSearch size={17} className="text-slate-400" /></span>
                      <input name="q" placeholder="Que cherchez-vous ?" className="w-full py-3 pl-10 pr-3 rounded border-none text-sm bg-white text-slate-800 outline-none shadow-lg" />
                    </div>
                    <button type="submit" className="btn-primary px-5 shrink-0">Rechercher</button>
                  </form>
                </div>
                <div className="hero-logo">
                  <Image src="/Logo3.png" alt="MarketFlow" fill className="object-contain drop-shadow-[0_16px_32px_rgba(255,96,0,.4)]" priority />
                </div>
              </div>
            </div>
          </section>
          <div className="trust-strip">
            <div className="container">
              <div className="trust-grid">
                {trust.map(({ icon: Icon, title, sub }) => (
                  <div key={title} className="trust-item">
                    <Icon size={22} className="text-[#ff6000] shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-slate-800 m-0 leading-none mb-0.5">{title}</p>
                      <p className="text-xs text-slate-500 m-0">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="container py-section">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900 m-0 mb-0.5">
              {q ? `Résultats pour "${q}"` : categorie ? (categories.find(c => c.slug === categorie)?.name ?? "Catalogue") : "Nos produits"}
            </h2>
            <p className="text-slate-400 text-xs m-0">{produits.length} article{produits.length !== 1 ? "s" : ""}</p>
          </div>
          {isFiltered && (
            <div className="flex gap-2 flex-wrap">
              <form method="GET" className="flex gap-1.5">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"><MdSearch size={14} className="text-slate-400" /></span>
                  <input name="q" defaultValue={q} placeholder="Affiner..." className="input py-1.5 pl-8 pr-3 text-sm w-36" />
                </div>
                <button type="submit" className="btn-primary py-1.5 px-3 text-sm">OK</button>
              </form>
              <Link href="/" className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-[#e8e8e8] text-slate-500 text-sm no-underline bg-white hover:bg-[#f5f5f5]">
                <MdClose size={14} /> Effacer
              </Link>
            </div>
          )}
        </div>

        <div className="cats-scroll gap-2 mb-5 pb-1">
          <Link href="/" className={categorie ? "cat-pill" : "cat-pill cat-pill--active"}>Tout</Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/?categorie=${c.slug}`} className={categorie === c.slug ? "cat-pill cat-pill--active" : "cat-pill"}>{c.name}</Link>
          ))}
        </div>

        {produits.length === 0
          ? <EmptyState icon={MdSearch} title="Aucun produit trouvé" description="Essayez un autre terme ou explorez toutes les catégories."
              action={<Link href="/" className="btn-primary no-underline">Voir tout</Link>} />
          : <div className="products-grid">{produits.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        }
      </div>
    </main>
  );
}
