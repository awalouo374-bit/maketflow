"use client";
import Link from "next/link";
import { useState } from "react";
import { MdInventory2, MdCheck, MdShoppingCart } from "react-icons/md";

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

  return (
    <Link href={`/produit/${product.id}`} className="no-underline block group">
      <article className="product-card h-full">
        <div className="relative h-52 bg-linear-to-br from-slate-50 to-navy-soft overflow-hidden">
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            : (
              <div className="w-full h-full flex items-center justify-center">
                <MdInventory2 size={52} className="text-slate-200" />
              </div>
            )
          }

          {outOfStock && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">Épuisé</span>
            </div>
          )}

          {product.category && (
            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-navy text-[0.68rem] font-bold px-2.5 py-1 rounded-lg border border-navy-soft shadow-sm">
              {product.category.name}
            </span>
          )}

          {!outOfStock && product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-[0.65rem] font-black px-2 py-0.5 rounded-md">
              Plus que {product.stock}
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="font-semibold text-sm text-slate-900 leading-snug m-0 line-clamp-2 group-hover:text-navy transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-auto gap-3">
            <div>
              <span className="font-extrabold text-xl text-navy tracking-tight leading-none">
                {product.price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 font-medium ml-0.5">€</span>
            </div>

            <button
              onClick={addToCart}
              disabled={outOfStock || loading}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-none font-bold text-xs transition-all duration-200 cursor-pointer shrink-0
                ${added
                  ? "bg-emerald-500 text-white shadow-[0_4px_12px_rgba(16,185,129,.35)]"
                  : outOfStock
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,.38)] hover:shadow-[0_6px_20px_rgba(249,115,22,.45)] hover:-translate-y-0.5"
                }`}
            >
              {added
                ? <><MdCheck size={14} /> Ajouté</>
                : loading
                ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : outOfStock
                ? "Épuisé"
                : <><MdShoppingCart size={14} /> Ajouter</>
              }
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
