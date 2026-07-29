"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdShoppingCart, MdInventory2, MdDelete, MdLocalShipping, MdArrowForward } from "react-icons/md";
import EmptyState from "@/components/shared/EmptyState";

type Item = {
  id: string;
  quantity: number;
  product: { id: string; name: string; price: number; imageUrl?: string | null; category?: { name: string } | null };
};

export default function PanierPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/panier");
    if (!res.ok) { router.push("/login"); return; }
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  async function remove(itemId: string) {
    await fetch(`/api/panier/${itemId}`, { method: "DELETE" });
    load();
  }

  async function commander() {
    setOrdering(true);
    const res = await fetch("/api/commandes", { method: "POST" });
    if (res.ok) { router.push("/commandes"); router.refresh(); } else setOrdering(false);
  }

  useEffect(() => { load(); }, []);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="spinner" />
        <p className="text-slate-400 text-sm font-medium">Chargement de votre panier...</p>
      </div>
    </div>
  );

  return (
    <main className="container py-responsive">
      <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight mb-8 flex items-center gap-3">
        Mon panier
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-navy text-white text-xs font-black">{items.length}</span>
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon={MdShoppingCart}
          title="Votre panier est vide"
          description="Découvrez nos produits et commencez vos achats."
          action={<Link href="/" className="btn-primary no-underline">Explorer la boutique</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="card p-5 flex items-center gap-4 group">
                <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-slate-50 to-navy-soft overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
                  {item.product.imageUrl
                    ? <img src={item.product.imageUrl} className="w-full h-full object-cover" />
                    : <MdInventory2 size={28} className="text-slate-200" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[0.95rem] text-slate-900 truncate mb-1">{item.product.name}</p>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.quantity} × {item.product.price.toFixed(2)} €
                    {item.product.category && <span className="ml-2 px-2 py-0.5 bg-navy-soft text-navy rounded-md text-[0.65rem] font-bold">{item.product.category.name}</span>}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="font-extrabold text-lg text-navy tracking-tight">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  <button
                    onClick={() => remove(item.id)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all bg-transparent border-none cursor-pointer font-medium"
                  >
                    <MdDelete size={14} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-7 sticky top-24">
            <h2 className="font-bold text-base text-slate-900 mb-6 pb-5 border-b border-slate-100 flex items-center gap-2">
              <MdShoppingCart size={18} className="text-slate-400" />
              Récapitulatif
            </h2>

            <div className="flex flex-col gap-3.5 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">{items.length} article{items.length > 1 ? "s" : ""}</span>
                <span className="font-semibold text-slate-900">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5"><MdLocalShipping size={15} /> Livraison</span>
                {shipping === 0
                  ? <span className="font-semibold text-emerald-600">Gratuite</span>
                  : <span className="font-semibold text-slate-900">{shipping.toFixed(2)} €</span>}
              </div>
              {subtotal < 50 && subtotal > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-3 mt-1">
                  <MdLocalShipping size={15} className="text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700 font-medium m-0 leading-snug">
                    Plus que <strong>{(50 - subtotal).toFixed(2)} €</strong> pour la livraison offerte
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center py-4 border-t-2 border-slate-100 mb-6">
              <span className="font-bold text-slate-900">Total TTC</span>
              <span className="font-extrabold text-2xl text-navy tracking-tight">{total.toFixed(2)} €</span>
            </div>

            <button
              onClick={commander}
              disabled={ordering}
              className="btn-primary w-full py-4 rounded-2xl text-sm justify-center gap-2"
            >
              {ordering
                ? <><span className="spinner-sm" /> Traitement en cours...</>
                : <>Confirmer la commande <MdArrowForward size={17} /></>
              }
            </button>

            <Link href="/" className="block text-center mt-4 text-slate-400 text-xs no-underline hover:text-slate-600 transition-colors font-medium">
              ← Continuer mes achats
            </Link>

            <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-slate-100">
              <MdLock size={13} className="text-slate-300" />
              <p className="text-[0.7rem] text-slate-300 m-0">Paiement 100% sécurisé</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
