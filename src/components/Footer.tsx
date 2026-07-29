import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLoop, MdLock, MdSupportAgent } from "react-icons/md";
import { IconType } from "react-icons";

type Advantage = { icon: IconType; title: string; sub: string };

const advantages: Advantage[] = [
  { icon: MdLocalShipping, title: "Livraison gratuite", sub: "dès 50€" },
  { icon: MdLoop,          title: "Retours gratuits",   sub: "30 jours" },
  { icon: MdLock,          title: "Paiement sécurisé",  sub: "100%" },
  { icon: MdSupportAgent,  title: "Support",             sub: "7j/7" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#0d1a45] text-slate-400">
      <div className="h-1 bg-linear-to-r from-orange-500 via-orange-600 to-orange-500" />

      <div className="container py-10 pb-6">
        <div className="footer-grid">

          <div>
            <div className="mb-4">
              <Image src="/Logo3.png" alt="MarketFlow" width={150} height={56} className="object-contain" />
            </div>
            <p className="text-sm leading-7 max-w-[260px]">
              Votre marketplace de confiance. Des milliers de produits, livrés rapidement et en toute sécurité.
            </p>
            <p className="italic text-orange-500 text-sm mt-2.5">
              "Achetez, Vendez, Grandissez"
            </p>
          </div>

          <div>
            <p className="text-white font-bold text-xs mb-4 tracking-widest uppercase">Boutique</p>
            <div className="flex flex-col gap-3">
              <Link href="/" className="footer-link">Tous les produits</Link>
              <Link href="/panier" className="footer-link">Mon panier</Link>
              <Link href="/commandes" className="footer-link">Mes commandes</Link>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-xs mb-4 tracking-widest uppercase">Compte</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="footer-link">Se connecter</Link>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-xs mb-4 tracking-widest uppercase">Pourquoi nous</p>
            <div className="flex flex-col gap-2.5">
              {advantages.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-2">
                  <Icon size={18} className="text-orange-500 shrink-0" />
                  <span className="text-xs">{title} — {sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom border-t border-white/10 pt-5">
          <p className="text-xs m-0">© {year} MarketFlow. Tous droits réservés.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <span className="footer-legal">Confidentialité</span>
            <span className="footer-legal">CGV</span>
            <span className="footer-legal">Mentions légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
