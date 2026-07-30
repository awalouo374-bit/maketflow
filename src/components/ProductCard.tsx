"use client";
import Link from "next/link";
import { useState } from "react";
import { MdInventory2, MdCheck, MdShoppingCart, MdStar } from "react-icons/md";

type Product = { id: string; name: string; price: number; imageUrl?: string | null; category?: { name: string } | null; stock?: number };

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const outOfStock = product.stock === 0;

  async function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    setLoading(true);
    await fetch("/api/panier", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: product.id, quantity: 1 }) });
    setLoading(false); setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <Link href={`/produit/${product.id}`} className="no-underline block group">
      <article className="product-card h-full">
        <div className="relative aspect-square bg-[#f7f7f7] overflow-hidden">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            : <div className="w-full h-full flex items-center justify-center"><MdInventory2 size={44} className="text-slate-200" /></div>}
          {outOfStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="bg-slate-600 text-white text-[0.65rem] font-bold px-3 py-1 rounded tracking-widest uppercase">Épuisé</span>
            </div>
          )}
          {!outOfStock && product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded">-{product.stock} restants</span>
          )}
        </div>
        <div className="p-3 flex flex-col gap-2 flex-1">
          <h3 className="text-[0.8rem] text-slate-800 leading-snug m-0 line-clamp-2 font-normal group-hover:text-[#ff6000] transition-colors min-h-[2.4rem]">{product.name}</h3>
          <div className="flex items-center gap-0.5 text-amber-400">
            {[1,2,3,4,5].map((i) => <MdStar key={i} size={11} />)}
            <span className="text-[0.65rem] text-slate-400 ml-1">4.8</span>
          </div>
          <div className="mt-auto">
            <div className="text-[#ff6000] font-extrabold text-lg leading-none mb-2">{product.price.toFixed(2)} <span className="text-sm font-medium">€</span></div>
            <button onClick={addToCart} disabled={outOfStock || loading}
              className={`w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all
                ${added ? "bg-green-500 text-white" : outOfStock ? "bg-[#f5f5f5] text-slate-400 cursor-not-allowed" : "bg-[#ff6000] hover:bg-[#e55400] text-white"}`}>
              {added ? <><MdCheck size={13} /> Dans le panier</>
               : loading ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               : outOfStock ? "Épuisé"
               : <><MdShoppingCart size={13} /> Ajouter</>}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
