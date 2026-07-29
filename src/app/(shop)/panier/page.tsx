"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Item = { id: string; quantity: number; product: { id: string; name: string; price: number; imageUrl?: string | null; category?: { name: string } | null } };

export default function PanierPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/panier");
    if (!res.ok) { router.push("/login"); return; }
    const data = await res.json();
    setItems(data.items ?? []); setLoading(false);
  }

  async function remove(itemId: string) { await fetch(`/api/panier/${itemId}`, { method: "DELETE" }); load(); }

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
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #e2e8f0", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 12px" }} />
        <p style={{ color: "#64748b" }}>Chargement du panier...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontWeight: 800, fontSize: "1.75rem", color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 32 }}>Mon panier <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "1.1rem" }}>({items.length})</span></h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "4rem", marginBottom: 20 }}>🛒</div>
          <h2 style={{ fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Votre panier est vide</h2>
          <p style={{ color: "#64748b", marginBottom: 28 }}>Découvrez nos produits et commencez vos achats.</p>
          <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>Explorer la boutique →</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>
          {/* Articles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 72, height: 72, borderRadius: 12, background: "linear-gradient(135deg, #f8fafc, #f0f4ff)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.product.imageUrl ? <img src={item.product.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "1.8rem", opacity: .4 }}>📦</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#0f172a", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product.name}</p>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Qté : {item.quantity} × {item.product.price.toFixed(2)} €</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "#4f46e5", marginBottom: 8 }}>{(item.product.price * item.quantity).toFixed(2)} €</p>
                  <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", fontSize: "1rem", padding: 0, transition: "color .15s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")} onMouseLeave={e => (e.currentTarget.style.color = "#cbd5e1")}>
                    ✕ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="card" style={{ padding: 28, position: "sticky", top: 80 }}>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #e2e8f0" }}>Récapitulatif</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <Row label="Sous-total" value={`${subtotal.toFixed(2)} €`} />
              <Row label="Livraison" value={shipping === 0 ? "Gratuite 🎉" : `${shipping.toFixed(2)} €`} highlight={shipping === 0} />
              {subtotal < 50 && subtotal > 0 && <p style={{ fontSize: "0.78rem", color: "#f59e0b", background: "#fffbeb", padding: "8px 12px", borderRadius: 8, border: "1px solid #fde68a" }}>
                Plus que {(50 - subtotal).toFixed(2)} € pour la livraison gratuite !
              </p>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "2px solid #e2e8f0", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: "1.4rem", color: "#4f46e5", letterSpacing: "-0.03em" }}>{total.toFixed(2)} €</span>
            </div>
            <button onClick={commander} disabled={ordering} className="btn-primary" style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: "0.95rem" }}>
              {ordering ? "Traitement..." : "Confirmer la commande →"}
            </button>
            <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 14, color: "#64748b", fontSize: "0.85rem", textDecoration: "none" }}>
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
      <span style={{ color: "#64748b" }}>{label}</span>
      <span style={{ fontWeight: 600, color: highlight ? "#10b981" : "#0f172a" }}>{value}</span>
    </div>
  );
}
