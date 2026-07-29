"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdShoppingCart, MdInventory2, MdClose, MdLocalShipping } from "react-icons/md";
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
      <div className="text-center">
        <div className="spinner mx-auto mb-3" />
        <p className="text-slate-500">Chargement du panier...</p>
      </div>
    </div>
  );

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-10">
      <h1 className="font-extrabold text-[1.75rem] text-slate-900 tracking-tight mb-8">
        Mon panier <span className="text-slate-400 font-normal text-[1.1rem]">({items.length})</span>
      </h1>

      {items.length === 0 ? (
        <EmptyState
          icon={MdShoppingCart}
          title="Votre panier est vide"
          description="Découvrez nos produits et commencez vos achats."
          action={<Link href="/" className="btn-primary no-underline">Explorer la boutique →</Link>}
        />
      ) : (
        <div className="grid grid-cols-[1fr_360px] gap-7 items-start">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="card px-6 py-5 flex items-center gap-4">
                <div className="w-[72px] h-[72px] rounded-xl bg-linear-to-br from-slate-50 to-[#f0f4ff] overflow-hidden shrink-0 flex items-center justify-center">
                  {item.product.imageUrl
                    ? <img src={item.product.imageUrl} className="w-full h-full object-cover" />
                    : <MdInventory2 size={28} className="text-slate-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[0.95rem] text-slate-900 mb-0.5 truncate">{item.product.name}</p>
                  <p className="text-xs text-slate-400">Qté : {item.quantity} × {item.product.price.toFixed(2)} €</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-[1.05rem] text-indigo-600 mb-2">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  <button
                    onClick={() => remove(item.id)}
                    className="bg-transparent border-none cursor-pointer text-slate-300 text-sm inline-flex items-center gap-1 p-0 hover:text-red-500 transition-colors"
                  >
                    <MdClose size={14} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-7 sticky top-20">
            <h2 className="font-bold text-[1.1rem] text-slate-900 mb-6 pb-4 border-b border-slate-200">Récapitulatif</h2>
            <div className="flex flex-col gap-3 mb-5">
              <CartRow label="Sous-total" value={`${subtotal.toFixed(2)} €`} />
              <CartRow
                label="Livraison"
                value={shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`}
                highlight={shipping === 0}
                icon={shipping === 0 ? <MdLocalShipping size={14} className="text-emerald-500" /> : undefined}
              />
              {subtotal < 50 && subtotal > 0 && (
                <p className="text-[0.78rem] text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  Plus que {(50 - subtotal).toFixed(2)} € pour la livraison gratuite !
                </p>
              )}
            </div>
            <div className="flex justify-between items-center py-4 border-t-2 border-slate-200 mb-5">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-extrabold text-[1.4rem] text-indigo-600 tracking-tight">{total.toFixed(2)} €</span>
            </div>
            <button onClick={commander} disabled={ordering} className="btn-primary w-full py-3.5 rounded-xl text-[0.95rem]">
              {ordering ? "Traitement..." : "Confirmer la commande →"}
            </button>
            <Link href="/" className="block text-center mt-3.5 text-slate-500 text-sm no-underline">
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

function CartRow({ label, value, highlight, icon }: { label: string; value: string; highlight?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex justify-between text-[0.9rem]">
      <span className="text-slate-500">{label}</span>
      <span className={`font-semibold inline-flex items-center gap-1 ${highlight ? "text-emerald-500" : "text-slate-900"}`}>
        {icon}{value}
      </span>
    </div>
  );
}
