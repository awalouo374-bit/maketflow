import Link from "next/link";
import Image from "next/image";
import {HomeIcon} from "lucide-react"

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "linear-gradient(135deg,#f0f4ff,#fff4ed)" }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 24px" }}>
          <Image src="/Logo3.png" alt="MarketFlow" fill style={{ objectFit: "contain", opacity: .45 }} />
        </div>
        <h1 style={{ fontWeight: 800, fontSize: "5rem", letterSpacing: "-0.06em", background: "linear-gradient(135deg,#1a2d6b,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
          404
        </h1>
        <div style={{ width: 60, height: 4, background: "linear-gradient(90deg,#f97316,#ea580c)", borderRadius: 999, margin: "16px auto 24px" }} />
        <h2 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#0f172a", marginBottom: 12 }}>Page introuvable</h2>
        <p style={{ color: "#64748b", lineHeight: 1.7, marginBottom: 32 }}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
          <HomeIcon size={5} /> Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
