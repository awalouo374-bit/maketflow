import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#0d1a45", color: "#94a3b8" }}>
      <div style={{ height: 4, background: "linear-gradient(90deg,#f97316,#ea580c,#f97316)" }} />

      <style>{`
        .footer-link { color: #94a3b8; text-decoration: none; font-size: 0.875rem; transition: color .15s; }
        .footer-link:hover { color: #f97316; }
        .footer-legal { font-size: 0.8rem; cursor: pointer; color: #94a3b8; transition: color .15s; }
        .footer-legal:hover { color: #f97316; }
        .footer-grid { display: grid; gap: 32px; grid-template-columns: 1fr; margin-bottom: 32px; }
        @media (min-width: 640px) { .footer-grid { grid-template-columns: 2fr 1fr; gap: 36px; } }
        @media (min-width: 1024px) { .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 44px; } }
        .footer-bottom { display: flex; flex-direction: column; gap: 16px; align-items: center; text-align: center; }
        @media (min-width: 640px) { .footer-bottom { flex-direction: row; justify-content: space-between; text-align: left; } }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 16px 24px" }}>
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 18 }}>
              <Image src="/Logo3.png" alt="MarketFlow" width={150} height={56} style={{ objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.75, maxWidth: 260 }}>
              Votre marketplace de confiance. Des milliers de produits, livrés rapidement et en toute sécurité.
            </p>
            <p style={{ fontStyle: "italic", color: "#f97316", fontSize: "0.85rem", marginTop: 10 }}>
              "Achetez, Vendez, Grandissez"
            </p>
          </div>

          {/* Boutique */}
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.82rem", marginBottom: 18, letterSpacing: "0.06em", textTransform: "uppercase" }}>Boutique</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/" className="footer-link">Tous les produits</Link>
              <Link href="/panier" className="footer-link">Mon panier</Link>
              <Link href="/commandes" className="footer-link">Mes commandes</Link>
            </div>
          </div>

          {/* Compte */}
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.82rem", marginBottom: 18, letterSpacing: "0.06em", textTransform: "uppercase" }}>Compte</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Link href="/login" className="footer-link">Se connecter</Link>
            </div>
          </div>

          {/* Avantages */}
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.82rem", marginBottom: 18, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pourquoi nous</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["🚚","Livraison gratuite dès 50€"],["↩️","Retours sous 30 jours"],["🔒","Paiement sécurisé"],["📞","Support 7j/7"]].map(([icon,text]) => (
                <div key={text as string} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.9rem" }}>{icon}</span>
                  <span style={{ fontSize: "0.82rem" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 20 }}>
          <p style={{ fontSize: "0.8rem", margin: 0 }}>© {year} MarketFlow. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <span className="footer-legal">Confidentialité</span>
            <span className="footer-legal">CGV</span>
            <span className="footer-legal">Mentions légales</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
