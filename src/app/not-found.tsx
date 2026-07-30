import Link from "next/link";
import Image from "next/image";
import { MdHome } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 bg-[#f5f5f5]">
      <div className="text-center max-w-[480px]">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <Image src="/Logo3.png" alt="MarketFlow" fill className="object-contain opacity-40" />
        </div>
        <h1 className="font-extrabold text-[5rem] tracking-[-0.06em] leading-none text-[#ff6000]">404</h1>
        <div className="w-12 h-1 bg-[#ff6000] rounded-full mx-auto my-4" />
        <h2 className="font-bold text-xl text-slate-900 mb-3">Page introuvable</h2>
        <p className="text-slate-500 leading-relaxed mb-8 text-sm">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link href="/" className="btn-primary no-underline">
          <MdHome size={18} /> Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
