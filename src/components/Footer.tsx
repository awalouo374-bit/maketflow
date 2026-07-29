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
    <footer className="bg-[#0b1740] text-slate-400">
      <div className="h-1 bg-linear-to-r from-orange-600 via-orange-500 to-orange-400" />

      <div className="container py-14 pb-8">
        <div className="footer-grid">

          <div>
            <div className="mb-6">
              <Image src="/Logo3.png" alt="MarketFlow" width={150} height={52} className="object-contain brightness-90" />
            </div>
            <p className="text-sm leading-7 text-slate-400 max-w-[280px]">
              Votre marketplace de confiance. Des milliers de produits sélectionnés, livrés rapidement et en toute sécurité.
            </p>
            <p className="italic text-orange-400/80 text-sm mt-4 font-medium">
              "Achetez, Vendez, Grandissez"
            </p>

            <div className="flex gap-3 mt-6">
              {["f", "in", "tw"].map((s) => (
                <div key={s} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer transition-all uppercase font-bold">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-xs mb-5 tracking-widest uppercase">Boutique</p>
            <div className="flex flex-col gap-3">
              <Link href="/" className="footer-link hover:pl-1 transition-all">Tous les produits</Link>
              <Link href="/panier" className="footer-link hover:pl-1 transition-all">Mon panier</Link>
              <Link href="/commandes" className="footer-link hover:pl-1 transition-all">Mes commandes</Link>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-xs mb-5 tracking-widest uppercase">Compte</p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="footer-link hover:pl-1 transition-all">Se connecter</Link>
              <Link href="/login" className="footer-link hover:pl-1 transition-all">Créer un compte</Link>
            </div>
          </div>

          <div>
            <p className="text-white font-bold text-xs mb-5 tracking-widest uppercase">Nos garanties</p>
            <div className="flex flex-col gap-4">
              {advantages.map(({ icon: Icon, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-slate-200 text-xs font-semibold leading-none mb-0.5">{title}</p>
                    <p className="text-slate-500 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom border-t border-white/[.07] pt-6">
          <p className="text-xs text-slate-500 m-0">© {year} MarketFlow. Tous droits réservés.</p>
          <div className="flex gap-5 flex-wrap justify-center">
            <span className="footer-legal">Confidentialité</span>
            <span className="footer-legal">CGV</span>
            <span className="footer-legal">Mentions légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
