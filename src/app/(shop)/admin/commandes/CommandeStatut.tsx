"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Statut = { value: string; label: string; color: string; bg: string };

const statuts: Statut[] = [
  { value: "PENDING",   label: "En attente",  color: "#92400e", bg: "#fffbeb" },
  { value: "CONFIRMED", label: "Confirmée",   color: "#0958d9", bg: "#e6f7ff" },
  { value: "SHIPPED",   label: "Expédiée",    color: "#722ed1", bg: "#f9f0ff" },
  { value: "DELIVERED", label: "Livrée",      color: "#389e0d", bg: "#f6ffed" },
  { value: "CANCELLED", label: "Annulée",     color: "#cf1322", bg: "#fff1f0" },
];

type Props = { orderId: string; current: string };

export default function CommandeStatut({ orderId, current }: Props) {
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
    <select
      value={current}
      onChange={(e) => update(e.target.value)}
      disabled={loading}
      className="status-select"
      style={{ background: currentStatut.bg, color: currentStatut.color, opacity: loading ? 0.6 : 1 }}
    >
      {statuts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>
  );
}
