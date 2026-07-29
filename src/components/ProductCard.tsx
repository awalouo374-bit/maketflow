"use client";
import Link from "next/link";
import { useState } from "react";

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
    <Link href={`/produit/${product.id}`} style={{ textDecoration: "none" }}>
      <article
        style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all .2s ease", cursor: "pointer" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 16px 40px rgba(26,45,107,.12)"; el.style.borderColor = "#fed7aa"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; el.style.borderColor = "#e2e8f0"; }}>

        {/* Image */}
        <div style={{ height: 200, background: "linear-gradient(135deg,#f0f4ff,#fff4ed)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: "3.5rem", opacity: .4 }}>📦</span>}
          {outOfStock && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ background: "#ef4444", color: "white", fontSize: "0.72rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999, letterSpacing: "0.05em" }}>RUPTURE</span>
            </div>
          )}
          {product.category && (
            <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,.92)", color: "#1a2d6b", fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 999, border: "1px solid #e8ecf8" }}>
              {product.category.name}
            </span>
          )}
        </div>

        {/* Infos */}
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <h3 style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f172a", lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#1a2d6b", letterSpacing: "-0.02em" }}>
              {product.price.toFixed(2)} €
            </span>
            <button onClick={addToCart} disabled={outOfStock || loading} style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: 8, border: "none",
              cursor: outOfStock ? "not-allowed" : "pointer", fontSize: "0.8rem", fontWeight: 700, transition: "all .18s",
              background: added ? "#10b981" : outOfStock ? "#f1f5f9" : "linear-gradient(135deg,#f97316,#ea580c)",
              color: added ? "white" : outOfStock ? "#94a3b8" : "white",
              boxShadow: added || outOfStock ? "none" : "0 3px 10px rgba(249,115,22,.3)",
            }}>
              {added ? "✓ Ajouté" : loading ? "..." : outOfStock ? "Épuisé" : "+ Panier"}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
