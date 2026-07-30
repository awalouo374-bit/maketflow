import Link from "next/link";
import Image from "next/image";
import { MdLocalShipping, MdLoop, MdLock, MdSupportAgent } from "react-icons/md";
import { IconType } from "react-icons";

type Guarantee = { icon: IconType; title: string; sub: string };
const guarantees: Guarantee[] = [
  { icon: MdLocalShipping, title: "Livraison gratuite", sub: "dès 50€" },
  { icon: MdLoop,          title: "Retours gratuits",   sub: "30 jours" },
  { icon: MdLock,          title: "Paiement sécurisé",  sub: "100%" },
  { icon: MdSupportAgent,  title: "Support 7j/7",       sub: "Réactif" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#222] text-[#999] mobile-pb">
      <div className="bg-slate-900">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#333]">
            {guarantees.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 px-4 py-4">
                <Icon size={20} className="text-[#ff6000] shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold m-0 leading-none mb-0.5">{title}</p>
                  <p className="text-[#666] text-xs m-0">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="container py-10">
        <div className="footer-grid">
          <div>
            <div className="mb-4 opacity-80"><Image src="/Logo3.png" alt="MarketFlow" width={110} height={40} className="object-contain" /></div>
            <p className="text-[0.82rem] leading-6 text-[#888] max-w-[260px] mb-4">Votre marketplace de confiance. Des milliers de produits livrés rapidement et en toute sécurité.</p>
            <div className="flex gap-2 mt-4">
              {["f","in","tw"].map((s) => (
                <div key={s} className="w-7 h-7 rounded bg-[#333] flex items-center justify-center text-[0.65rem] text-[#888] hover:bg-[#ff6000] hover:text-white cursor-pointer transition-all uppercase font-bold">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-white text-xs font-bold mb-4 tracking-widest uppercase">Boutique</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="footer-link">Tous les produits</Link>
              <Link href="/panier" className="footer-link">Mon panier</Link>
              <Link href="/commandes" className="footer-link">Mes commandes</Link>
            </div>
          </div>
          <div>
            <p className="text-white text-xs font-bold mb-4 tracking-widest uppercase">Compte</p>
            <div className="flex flex-col gap-2.5">
              <Link href="/login" className="footer-link">Se connecter</Link>
              <Link href="/login" className="footer-link">Créer un compte</Link>
            </div>
          </div>
          <div>
            <p className="text-white text-xs font-bold mb-4 tracking-widest uppercase">Service client</p>
            <div className="flex flex-col gap-2.5">
              <span className="text-[0.82rem] text-[#888]">Lun–Ven : 9h–18h</span>
              <span className="text-[#ff6000] font-semibold text-sm">support@marketflow.fr</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom border-t border-[#333] pt-5">
          <p className="text-[0.72rem] text-[#555] m-0">© {year} MarketFlow. Tous droits réservés.</p>
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
