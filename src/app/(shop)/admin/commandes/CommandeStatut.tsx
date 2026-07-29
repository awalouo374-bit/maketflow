"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statuts = [
  { value: "PENDING",   label: "En attente",  color: "#92400e", bg: "#fffbeb" },
  { value: "CONFIRMED", label: "Confirmée",   color: "#1d4ed8", bg: "#eff6ff" },
  { value: "SHIPPED",   label: "Expédiée",    color: "#6d28d9", bg: "#f5f3ff" },
  { value: "DELIVERED", label: "Livrée",      color: "#065f46", bg: "#ecfdf5" },
  { value: "CANCELLED", label: "Annulée",     color: "#991b1b", bg: "#fef2f2" },
];

export default function CommandeStatut({ orderId, current }: { orderId: string; current: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const currentStatut = statuts.find((s) => s.value === current) ?? statuts[0];

  async function update(status: string) {
    setLoading(true);
    await fetch(`/api/commandes/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select value={current} onChange={(e) => update(e.target.value)} disabled={loading}
      style={{
        padding: "6px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0",
        fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
        background: currentStatut.bg, color: currentStatut.color,
        outline: "none", transition: "all .15s", opacity: loading ? .6 : 1,
        fontFamily: "inherit",
      }}>
      {statuts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}
