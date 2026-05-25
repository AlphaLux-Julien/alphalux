"use client"

import { useState } from "react"

export default function LandingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const features = [
    "Montres illimitées",
    "Valorisation marché en temps réel",
    "Graphiques & historique de prix",
    "Mise à jour automatique quotidienne",
    "Support prioritaire",
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=Playfair+Display:ital,wght@1,400;1,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0f0f0f;
          color: #e8e0cc;
          overflow-x: hidden;
        }

        .landing {
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'Montserrat', sans-serif;
        }

        /* ─── HEADER ─── */
        .lp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 64px;
          border-bottom: 1px solid #1e1e1e;
          position: sticky;
          top: 0;
          background: rgba(15,15,15,0.97);
          backdrop-filter: blur(12px);
          z-index: 100;
        }
        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #e8e0cc;
          text-decoration: none;
        }
        .logo span {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .lp-header-nav {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .lp-nav-link {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #777;
          text-decoration: none;
          transition: color 0.2s;
        }
        .lp-nav-link:hover { color: #c9a84c; }
        .btn-login {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #aaa;
          text-decoration: none;
          border: 1px solid #2e2e2e;
          padding: 8px 20px;
          transition: all 0.2s;
        }
        .btn-login:hover {
          border-color: #555;
          color: #e8e0cc;
        }

        /* ─── HERO ─── */
        .hero {
          min-height: calc(100vh - 73px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 64px;
          padding: 80px 64px;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {}
        .hero-eyebrow {
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8a7340;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 24px;
          height: 1px;
          background: linear-gradient(90deg, #d4af37, transparent);
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          font-weight: 300;
          letter-spacing: 0.03em;
          color: #e8e0cc;
          line-height: 1.05;
          margin-bottom: 28px;
        }
        .hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-subtitle {
          font-size: 13px;
          letter-spacing: 0.06em;
          color: #888;
          line-height: 1.9;
          max-width: 460px;
          margin-bottom: 48px;
        }
        .hero-cta-row {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .btn-cta-gold {
          display: inline-block;
          padding: 16px 40px;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          color: #0a0a0a;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 4px 32px rgba(212,175,55,0.35);
        }
        .btn-cta-gold:hover {
          background: linear-gradient(135deg, #e0bc45, #fae88a);
          box-shadow: 0 6px 40px rgba(212,175,55,0.55);
          transform: translateY(-2px);
        }
        .hero-tagline {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #555;
        }

        /* ─── MOCKUP ─── */
        .hero-mockup {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mockup-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 65%);
          pointer-events: none;
        }
        .mockup-frame {
          width: 100%;
          max-width: 520px;
          background: #111;
          border: 1px solid #2a2a2a;
          box-shadow: 0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.06);
          overflow: hidden;
          position: relative;
        }
        .mockup-frame::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #d4af37, #f5d97a, transparent);
        }
        .mockup-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          border-bottom: 1px solid #1e1e1e;
          background: rgba(15,15,15,0.9);
        }
        .mockup-logo-sm {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #888;
        }
        .mockup-logo-sm span {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .mockup-dot-row {
          display: flex;
          gap: 5px;
        }
        .mockup-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2a2a2a;
        }
        .mockup-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mockup-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .mockup-stat {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          padding: 10px 12px;
        }
        .mockup-stat-label {
          font-size: 7px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 6px;
        }
        .mockup-stat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .mockup-chart-area {
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          padding: 12px 14px;
          height: 80px;
          position: relative;
          overflow: hidden;
        }
        .mockup-chart-label {
          font-size: 7px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 8px;
        }
        .mockup-chart-svg {
          width: 100%;
          height: 48px;
        }
        .mockup-watches {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mockup-watch-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          padding: 8px 12px;
        }
        .mockup-watch-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mockup-watch-brand {
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #aaa;
        }
        .mockup-watch-ref {
          font-size: 7px;
          letter-spacing: 0.1em;
          color: #444;
        }
        .mockup-watch-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 14px;
          font-weight: 300;
          color: #c9a84c;
        }
        .mockup-watch-perf {
          font-size: 8px;
          letter-spacing: 0.08em;
        }
        .mockup-watch-perf.pos { color: #4ab364; }
        .mockup-watch-perf.neg { color: #dc5050; }

        /* ─── DIVIDER ─── */
        .section-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #2e2e2e 20%, #2e2e2e 80%, transparent);
          margin: 0 64px;
        }

        /* ─── FEATURES ─── */
        .features {
          padding: 100px 64px;
        }
        .section-eyebrow {
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8a7340;
          text-align: center;
          margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px;
          font-weight: 300;
          letter-spacing: 0.04em;
          text-align: center;
          color: #e8e0cc;
          margin-bottom: 64px;
          line-height: 1.1;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          background: #1a1a1a;
          border: 1px solid #1a1a1a;
        }
        .feature-card {
          background: #0f0f0f;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: background 0.3s;
        }
        .feature-card:hover {
          background: #111;
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212,175,55,0.06);
          border: 1px solid rgba(212,175,55,0.15);
          font-size: 22px;
        }
        .feature-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: #d4c8b0;
          line-height: 1.2;
        }
        .feature-desc {
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #666;
          line-height: 1.9;
        }
        .feature-rule {
          width: 28px;
          height: 1px;
          background: linear-gradient(90deg, #d4af37, transparent);
          margin-top: auto;
        }

        /* ─── PRICING ─── */
        .pricing-section {
          padding: 100px 64px;
          background: #0a0a0a;
          border-top: 1px solid #1a1a1a;
          border-bottom: 1px solid #1a1a1a;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .toggle-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 56px;
        }
        .toggle-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #555;
          transition: color 0.2s;
        }
        .toggle-label.active { color: #e8e0cc; }
        .toggle-track {
          width: 48px;
          height: 24px;
          background: #1e1e1e;
          border: 1px solid #2e2e2e;
          border-radius: 12px;
          position: relative;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .toggle-track.yearly {
          border-color: #d4af37;
          background: rgba(212,175,55,0.08);
        }
        .toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #444;
          transition: transform 0.2s, background 0.2s;
        }
        .toggle-track.yearly .toggle-thumb {
          transform: translateX(24px);
          background: linear-gradient(135deg, #d4af37, #f5d97a);
        }
        .badge-save {
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.25);
          color: #d4af37;
          padding: 3px 10px;
        }
        .pricing-card {
          width: 100%;
          max-width: 460px;
          background: linear-gradient(145deg, #131313, #0e0e0e);
          border: 1px solid #2a2a2a;
          padding: 48px 44px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.7);
        }
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #d4af37, #f5d97a, #d4af37);
        }
        .card-badge {
          display: inline-block;
          font-size: 8px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          color: #0a0a0a;
          padding: 4px 14px;
          margin-bottom: 28px;
        }
        .card-plan-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #e8e0cc;
          margin-bottom: 8px;
        }
        .card-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-bottom: 4px;
        }
        .card-price-currency {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 52px;
          font-weight: 300;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .card-price-period {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #555;
        }
        .card-price-note {
          font-size: 10px;
          letter-spacing: 0.08em;
          color: #555;
          margin-bottom: 32px;
          min-height: 16px;
        }
        .card-divider {
          height: 1px;
          background: #222;
          margin-bottom: 28px;
        }
        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 40px;
        }
        .feat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #b8b0a0;
        }
        .feat-check {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-cta-pricing {
          display: block;
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          border: none;
          color: #0a0a0a;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 24px rgba(212,175,55,0.3);
        }
        .btn-cta-pricing:hover {
          background: linear-gradient(135deg, #e0bc45, #fae88a);
          box-shadow: 0 6px 36px rgba(212,175,55,0.5);
          transform: translateY(-1px);
        }
        .card-guarantee {
          margin-top: 16px;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #383838;
          text-align: center;
        }

        /* ─── FOOTER ─── */
        .lp-footer {
          padding: 48px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-copy {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #333;
        }
        .footer-right {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .footer-link {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #444;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-link:hover { color: #c9a84c; }

        /* ─── RESPONSIVE ─── */
        @media (max-width: 1024px) {
          .hero {
            grid-template-columns: 1fr;
            padding: 60px 40px;
            text-align: center;
            min-height: auto;
            gap: 48px;
          }
          .hero-content { order: 1; }
          .hero-mockup { order: 2; }
          .hero-subtitle { margin: 0 auto 48px; }
          .hero-cta-row { justify-content: center; }
          .hero-eyebrow { justify-content: center; }
          .features { padding: 72px 40px; }
          .features-grid { grid-template-columns: 1fr; }
          .pricing-section { padding: 72px 24px; }
          .lp-header { padding: 20px 24px; }
          .section-divider { margin: 0 24px; }
          .lp-footer { padding: 36px 24px; flex-direction: column; gap: 24px; text-align: center; }
          .footer-right { flex-wrap: wrap; justify-content: center; }
        }
        @media (max-width: 640px) {
          .hero-title { font-size: 42px; }
          .section-title { font-size: 32px; }
          .hero { padding: 48px 20px; }
          .features { padding: 60px 20px; }
          .feature-card { padding: 36px 24px; }
          .lp-header-nav .lp-nav-link { display: none; }
          .mockup-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="landing">

        {/* ── HEADER ── */}
        <header className="lp-header">
          <a href="/landing" className="logo">Alpha<span>Lux</span></a>
          <nav className="lp-header-nav">
            <a href="#features" className="lp-nav-link">Fonctionnalités</a>
            <a href="#pricing" className="lp-nav-link">Tarifs</a>
            <a href="/login" className="btn-login">Connexion</a>
          </nav>
        </header>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-content">
            <p className="hero-eyebrow">Tableau de bord patrimonial</p>
            <h1 className="hero-title">
              Votre collection,<br />
              <em>maîtrisée.</em>
            </h1>
            <p className="hero-subtitle">
              Suivez la valeur de vos montres de luxe en temps réel. Valorisation marché automatique, graphiques de performance, patrimoine consolidé.
            </p>
            <div className="hero-cta-row">
              <a href="/pricing" className="btn-cta-gold">Commencer maintenant</a>
              <span className="hero-tagline">La précision au service du prestige.</span>
            </div>
          </div>

          <div className="hero-mockup">
            <div className="mockup-glow" />
            <div className="mockup-frame">
              <div className="mockup-topbar">
                <span className="mockup-logo-sm">Alpha<span>Lux</span></span>
                <div className="mockup-dot-row">
                  <div className="mockup-dot" />
                  <div className="mockup-dot" />
                  <div className="mockup-dot" />
                </div>
              </div>
              <div className="mockup-body">
                <div className="mockup-stats">
                  <div className="mockup-stat">
                    <div className="mockup-stat-label">Collection</div>
                    <div className="mockup-stat-val">84 200 €</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-label">Investi</div>
                    <div className="mockup-stat-val">62 000 €</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-label">Bénéfice</div>
                    <div className="mockup-stat-val">+22 200 €</div>
                  </div>
                  <div className="mockup-stat">
                    <div className="mockup-stat-label">Performance</div>
                    <div className="mockup-stat-val">+35,8%</div>
                  </div>
                </div>
                <div className="mockup-chart-area">
                  <div className="mockup-chart-label">Évolution du portefeuille</div>
                  <svg className="mockup-chart-svg" viewBox="0 0 460 48" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,40 C40,38 60,32 100,28 C140,24 160,26 200,20 C240,14 270,16 310,10 C340,6 380,8 420,4 L460,2 L460,48 L0,48 Z"
                      fill="url(#chartGrad)"
                    />
                    <path
                      d="M0,40 C40,38 60,32 100,28 C140,24 160,26 200,20 C240,14 270,16 310,10 C340,6 380,8 420,4 L460,2"
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="mockup-watches">
                  {[
                    { brand: "Rolex", ref: "116610LN", val: "14 800 €", perf: "+18%", pos: true },
                    { brand: "Patek Philippe", ref: "5711/1A", val: "38 500 €", perf: "+62%", pos: true },
                    { brand: "Audemars Piguet", ref: "15400ST", val: "30 900 €", perf: "+24%", pos: true },
                  ].map((w) => (
                    <div key={w.ref} className="mockup-watch-row">
                      <div className="mockup-watch-info">
                        <span className="mockup-watch-brand">{w.brand}</span>
                        <span className="mockup-watch-ref">{w.ref}</span>
                      </div>
                      <span className="mockup-watch-val">{w.val}</span>
                      <span className={`mockup-watch-perf ${w.pos ? "pos" : "neg"}`}>{w.perf}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── FEATURES ── */}
        <section className="features" id="features">
          <p className="section-eyebrow">Fonctionnalités</p>
          <h2 className="section-title">Tout ce dont votre collection a besoin</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <polyline points="4,24 12,14 18,19 28,8" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22,8 28,8 28,14" stroke="#c9a84c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="feature-title">Valorisation en temps réel</h3>
              <p className="feature-desc">Prix marché mis à jour quotidiennement via eBay. Suivez précisément la cote de chaque pièce de votre collection sans effort.</p>
              <div className="feature-rule" />
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="18" width="5" height="10" rx="0.5" stroke="#c9a84c" strokeWidth="1.8" />
                  <rect x="13" y="11" width="5" height="17" rx="0.5" stroke="#c9a84c" strokeWidth="1.8" />
                  <rect x="22" y="5" width="5" height="23" rx="0.5" stroke="#c9a84c" strokeWidth="1.8" />
                </svg>
              </div>
              <h3 className="feature-title">Graphiques de performance</h3>
              <p className="feature-desc">Visualisez l'évolution de chaque montre depuis l'achat. Des courbes élégantes pour décisions éclairées.</p>
              <div className="feature-rule" />
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <polygon points="16,3 29,16 16,29 3,16" stroke="#c9a84c" strokeWidth="1.8" strokeLinejoin="round" />
                  <polygon points="16,9 23,16 16,23 9,16" stroke="#c9a84c" strokeWidth="1.4" strokeLinejoin="round" strokeDasharray="2 2" />
                </svg>
              </div>
              <h3 className="feature-title">Patrimoine consolidé</h3>
              <p className="feature-desc">Vue d'ensemble de votre collection complète : valeur totale, bénéfice, meilleure performance. Votre patrimoine horloger en un coup d'œil.</p>
              <div className="feature-rule" />
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ── PRICING ── */}
        <section className="pricing-section" id="pricing">
          <p className="section-eyebrow">Abonnement</p>
          <h2 className="section-title" style={{ marginBottom: 40 }}>AlphaLux Premium</h2>
          <p style={{ fontSize: 12, letterSpacing: "0.08em", color: "#666", marginBottom: 48, textAlign: "center" }}>
            Accédez à toutes les fonctionnalités pour piloter votre patrimoine horloger.
          </p>

          <div className="toggle-wrapper">
            <span className={`toggle-label ${!isYearly ? "active" : ""}`}>Mensuel</span>
            <div
              className={`toggle-track ${isYearly ? "yearly" : ""}`}
              onClick={() => setIsYearly(!isYearly)}
              role="switch"
              aria-checked={isYearly}
            >
              <div className="toggle-thumb" />
            </div>
            <span className={`toggle-label ${isYearly ? "active" : ""}`}>Annuel</span>
            {isYearly && <span className="badge-save">Économisez 111€</span>}
          </div>

          <div className="pricing-card">
            <div className="card-badge">Premium</div>
            <div className="card-plan-name">Collection complète</div>
            <div className="card-price-row">
              <span className="card-price-currency">€</span>
              <span className="card-price">{isYearly ? "249" : "29,99"}</span>
            </div>
            <div className="card-price-period">{isYearly ? "/ an" : "/ mois"}</div>
            <div className="card-price-note">
              {isYearly ? "soit 20,75€ / mois — 2 mois offerts" : ""}
            </div>
            <div className="card-divider" />
            <ul className="features-list">
              {features.map((f) => (
                <li key={f} className="feat-item">
                  <div className="feat-check">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <a href="/pricing" className="btn-cta-pricing">Commencer maintenant</a>
            <p className="card-guarantee">Paiement sécurisé · Résiliation à tout moment</p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="footer-left">
            <a href="/landing" className="logo" style={{ fontSize: 16, letterSpacing: "0.2em" }}>Alpha<span>Lux</span></a>
            <span className="footer-copy">© 2026 AlphaLux</span>
          </div>
          <div className="footer-right">
            <a href="/legal" className="footer-link">Mentions légales</a>
            <a href="mailto:contact@alphalux.fr" className="footer-link">Contact</a>
            <a href="/login" className="footer-link">Connexion</a>
          </div>
        </footer>
      </div>
    </>
  )
}
