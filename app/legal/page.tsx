"use client"

import { useRouter } from "next/navigation"

export default function LegalPage() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f0f; }

        .legal-page {
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'Montserrat', sans-serif;
          color: #e8e0cc;
        }

        .legal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid #2e2e2e;
          position: sticky;
          top: 0;
          background: rgba(15,15,15,0.95);
          backdrop-filter: blur(8px);
          z-index: 10;
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #e8e0cc;
          cursor: pointer;
        }
        .logo span { color: #c9a84c; }
        .btn-back {
          background: transparent;
          border: 1px solid #444;
          color: #ccc;
          padding: 6px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
        }
        .btn-back:hover { border-color: #888; color: #fff; }

        .legal-body {
          max-width: 780px;
          margin: 0 auto;
          padding: 64px 48px 96px;
        }

        .legal-eyebrow {
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 16px;
        }
        .legal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 42px;
          font-weight: 300;
          letter-spacing: 0.04em;
          color: #e8e0cc;
          margin-bottom: 48px;
          line-height: 1.1;
        }

        .legal-section {
          margin-bottom: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid #1e1e1e;
        }
        .legal-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .section-title {
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 20px;
        }

        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .info-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 16px;
          align-items: baseline;
        }
        .info-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555;
        }
        .info-value {
          font-size: 13px;
          color: #ccc;
          letter-spacing: 0.03em;
        }
        .info-value a {
          color: #8a7340;
          text-decoration: none;
          transition: color 0.2s;
        }
        .info-value a:hover { color: #c9a84c; }

        .host-block {
          margin-bottom: 16px;
          padding-left: 16px;
          border-left: 1px solid #2e2e2e;
        }
        .host-name {
          font-size: 12px;
          color: #ccc;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .host-address {
          font-size: 11px;
          color: #555;
          letter-spacing: 0.03em;
          line-height: 1.6;
        }

        .rgpd-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .rgpd-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .rgpd-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #c9a84c;
          margin-top: 6px;
          flex-shrink: 0;
        }
        .rgpd-text {
          font-size: 13px;
          color: #999;
          letter-spacing: 0.03em;
          line-height: 1.7;
        }
        .rgpd-text a {
          color: #8a7340;
          text-decoration: none;
          transition: color 0.2s;
        }
        .rgpd-text a:hover { color: #c9a84c; }

        .cgu-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cgu-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }
        .cgu-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          color: #333;
          line-height: 1;
          flex-shrink: 0;
          width: 20px;
        }
        .cgu-text {
          font-size: 13px;
          color: #999;
          letter-spacing: 0.03em;
          line-height: 1.7;
        }

        .legal-footer {
          margin-top: 64px;
          padding-top: 24px;
          border-top: 1px solid #1e1e1e;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #333;
          text-align: center;
        }

        @media (max-width: 600px) {
          .legal-header { padding: 20px 24px; }
          .legal-body { padding: 40px 24px 64px; }
          .info-row { grid-template-columns: 1fr; gap: 4px; }
          .legal-title { font-size: 30px; }
        }
      `}</style>

      <div className="legal-page">

        <header className="legal-header">
          <div className="logo" onClick={() => router.push("/")}>Alpha<span>Lux</span></div>
          <button className="btn-back" onClick={() => router.back()}>← Retour</button>
        </header>

        <div className="legal-body">

          <div className="legal-eyebrow">Informations légales</div>
          <h1 className="legal-title">Mentions légales & CGU</h1>

          {/* Éditeur */}
          <div className="legal-section">
            <div className="section-title">Éditeur du site</div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Nom</span>
                <span className="info-value">Julien REBOUL</span>
              </div>
              <div className="info-row">
                <span className="info-label">Forme juridique</span>
                <span className="info-value">Micro-entreprise</span>
              </div>
              <div className="info-row">
                <span className="info-label">SIRET</span>
                <span className="info-value">989 307 970 00016</span>
              </div>
              <div className="info-row">
                <span className="info-label">Adresse</span>
                <span className="info-value">6 Rue Nationale, 74500 Évian-les-Bains</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">
                  <a href="mailto:contact@alphalux.fr">contact@alphalux.fr</a>
                </span>
              </div>
            </div>
          </div>

          {/* Hébergement */}
          <div className="legal-section">
            <div className="section-title">Hébergement</div>
            <div className="host-block">
              <div className="host-name">Vercel Inc.</div>
              <div className="host-address">340 Pine Street, Suite 701<br />San Francisco, CA 94104 — États-Unis</div>
            </div>
            <div className="host-block">
              <div className="host-name">Supabase Inc.</div>
              <div className="host-address">Hébergement des données — région EU</div>
            </div>
          </div>

          {/* RGPD */}
          <div className="legal-section">
            <div className="section-title">Données personnelles · RGPD</div>
            <div className="rgpd-list">
              <div className="rgpd-item">
                <div className="rgpd-dot" />
                <span className="rgpd-text">Données collectées : adresse email uniquement, utilisée à des fins d'authentification.</span>
              </div>
              <div className="rgpd-item">
                <div className="rgpd-dot" />
                <span className="rgpd-text">Aucune revente ni transmission de données à des tiers.</span>
              </div>
              <div className="rgpd-item">
                <div className="rgpd-dot" />
                <span className="rgpd-text">Droit de suppression : envoyez votre demande à <a href="mailto:contact@alphalux.fr">contact@alphalux.fr</a>.</span>
              </div>
              <div className="rgpd-item">
                <div className="rgpd-dot" />
                <span className="rgpd-text">Durée de conservation : les données sont conservées jusqu'à la suppression du compte.</span>
              </div>
            </div>
          </div>

          {/* CGU */}
          <div className="legal-section">
            <div className="section-title">Conditions générales d'utilisation</div>
            <div className="cgu-list">
              <div className="cgu-item">
                <span className="cgu-num">I</span>
                <span className="cgu-text">AlphaLux est un outil de suivi patrimonial à usage personnel. Il ne constitue pas un service de conseil en investissement.</span>
              </div>
              <div className="cgu-item">
                <span className="cgu-num">II</span>
                <span className="cgu-text">Les valorisations affichées proviennent de l'API eBay et sont fournies à titre indicatif uniquement. Elles ne constituent pas une estimation certifiée et ne garantissent pas le prix de revente réel d'un bien.</span>
              </div>
              <div className="cgu-item">
                <span className="cgu-num">III</span>
                <span className="cgu-text">AlphaLux ne saurait être tenu responsable des décisions financières, d'achat ou de vente prises sur la base des données affichées sur la plateforme.</span>
              </div>
            </div>
          </div>

          <div className="legal-footer">© 2026 AlphaLux · Patrimoine · Clarté · Performance</div>

        </div>
      </div>
    </>
  )
}
