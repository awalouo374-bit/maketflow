"use client";
import Link from "next/link";
import { useState } from "react";
import { MdInventory2, MdCheck } from "react-icons/md";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: { name: string } | null;
  stock?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const outOfStock = product.stock === 0;

  async function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (outOfStock) return;
    setLoading(true);
    await fetch("/api/panier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
    });
    setLoading(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  const btnBase = "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border-none text-xs font-bold transition-all duration-150 cursor-pointer";
  const btnColor = added
    ? "bg-emerald-500 text-white shadow-none"
    : outOfStock
    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
    : "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_3px_10px_rgba(249,115,22,.3)]";

  return (
    <Link href={`/produit/${product.id}`} className="no-underline">
      <article className="product-card">
        <div className="h-[200px] bg-linear-to-br from-[#f0f4ff] to-orange-soft flex items-center justify-center relative overflow-hidden">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            : <MdInventory2 size={56} className="text-slate-300" />}

          {outOfStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="bg-red-500 text-white text-[0.72rem] font-bold px-3 py-1 rounded-full tracking-wide">RUPTURE</span>
            </div>
          )}

          {product.category && (
            <span className="absolute top-2.5 left-2.5 bg-white/90 text-navy text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full border border-navy-soft">
              {product.category.name}
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2.5 flex-1">
          <h3 className="font-semibold text-[0.9rem] text-slate-900 leading-snug m-0 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-auto gap-2">
            <span className="font-extrabold text-[1.15rem] text-navy tracking-tight">
              {product.price.toFixed(2)} €
            </span>
            <button
              onClick={addToCart}
              disabled={outOfStock || loading}
              className={`${btnBase} ${btnColor}`}
            >
              {added ? <><MdCheck size={14} /> Ajouté</> : loading ? "..." : outOfStock ? "Épuisé" : "+ Panier"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
