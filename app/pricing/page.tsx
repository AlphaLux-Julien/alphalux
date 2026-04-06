"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"

export default function PricingPage() {
  const router = useRouter()
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const monthlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY_ID!
  const yearlyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY_ID!

  const handleSubscribe = async () => {
    setLoading(true)
    setError("")

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push("/login")
        return
      }

      const priceId = isYearly ? yearlyPriceId : monthlyPriceId

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || "Une erreur est survenue.")
        return
      }

      window.location.href = data.url
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Montserrat:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0f0f0f;
          color: #e8e0cc;
        }

        .pricing-page {
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* HEADER */
        .header {
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
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #e8e0cc;
          text-decoration: none;
        }
        .logo span {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-back {
          background: transparent;
          border: 1px solid #383838;
          color: #777;
          padding: 6px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
        }
        .btn-back:hover {
          border-color: #666;
          color: #aaa;
        }

        /* MAIN */
        .pricing-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 72px 24px;
        }

        .pricing-eyebrow {
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #8a7340;
          margin-bottom: 16px;
        }

        .pricing-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 300;
          letter-spacing: 0.05em;
          text-align: center;
          color: #e8e0cc;
          margin-bottom: 12px;
          line-height: 1.1;
        }

        .pricing-subtitle {
          font-size: 12px;
          letter-spacing: 0.1em;
          color: #777;
          text-align: center;
          margin-bottom: 48px;
        }

        /* TOGGLE */
        .toggle-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 56px;
        }
        .toggle-label {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #777;
          transition: color 0.2s;
        }
        .toggle-label.active {
          color: #e8e0cc;
        }
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
          top: 3px;
          left: 3px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #555;
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
          background: rgba(212,175,55,0.12);
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          padding: 3px 10px;
          border-radius: 2px;
        }

        /* CARD */
        .pricing-card {
          width: 100%;
          max-width: 440px;
          background: linear-gradient(145deg, #161616, #111111);
          border: 1px solid #2e2e2e;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 16px 64px rgba(0,0,0,0.6);
        }
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #d4af37, #f5d97a, #d4af37);
        }

        .card-badge {
          display: inline-block;
          font-size: 8px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          color: #0a0a0a;
          padding: 4px 12px;
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
          gap: 6px;
          margin-bottom: 6px;
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
        .card-price-currency {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .card-price-period {
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #666;
        }
        .card-price-note {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: #666;
          margin-bottom: 32px;
          min-height: 16px;
        }

        .card-divider {
          height: 1px;
          background: #2e2e2e;
          margin-bottom: 28px;
        }

        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 40px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #c8c0b0;
        }
        .feature-check {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-check svg {
          display: block;
        }

        /* CTA BUTTON */
        .btn-cta {
          width: 100%;
          padding: 16px 24px;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          border: none;
          color: #0a0a0a;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 4px 24px rgba(212,175,55,0.3);
        }
        .btn-cta:hover:not(:disabled) {
          background: linear-gradient(135deg, #e0bc45, #fae88a);
          box-shadow: 0 6px 32px rgba(212,175,55,0.5);
          transform: translateY(-1px);
        }
        .btn-cta:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .error-msg {
          margin-top: 12px;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: #dc5050;
          text-align: center;
        }

        .card-guarantee {
          margin-top: 16px;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #444;
          text-align: center;
        }

        @media (max-width: 768px) {
          .header {
            padding: 16px 20px;
          }
          .pricing-main {
            padding: 48px 16px;
          }
          .pricing-title {
            font-size: 34px;
          }
          .pricing-card {
            padding: 36px 24px;
          }
          .card-price {
            font-size: 42px;
          }
          .toggle-wrapper {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>

      <div className="pricing-page">
        {/* HEADER */}
        <header className="header">
          <a href="/" className="logo">Alpha<span>Lux</span></a>
          <button className="btn-back" onClick={() => router.push("/")}>
            ← Retour
          </button>
        </header>

        {/* MAIN */}
        <main className="pricing-main">
          <p className="pricing-eyebrow">Abonnement</p>
          <h1 className="pricing-title">
            AlphaLux Premium
          </h1>
          <p className="pricing-subtitle">
            Accédez à toutes les fonctionnalités pour piloter votre patrimoine horloger.
          </p>

          {/* TOGGLE MENSUEL / ANNUEL */}
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

          {/* CARD */}
          <div className="pricing-card">
            <div className="card-badge">Premium</div>
            <div className="card-plan-name">Collection complète</div>

            <div className="card-price-row">
              <span className="card-price-currency">€</span>
              <span className="card-price">{isYearly ? "249" : "29,99"}</span>
            </div>
            <div className="card-price-period">
              {isYearly ? "/ an" : "/ mois"}
            </div>
            <div className="card-price-note">
              {isYearly ? "soit 20,75€ / mois — 2 mois offerts" : ""}
            </div>

            <div className="card-divider" />

            <ul className="features-list">
              {features.map((feature) => (
                <li key={feature} className="feature-item">
                  <div className="feature-check">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="#d4af37"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className="btn-cta"
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? "Redirection..." : "Commencer maintenant"}
            </button>

            {error && <p className="error-msg">{error}</p>}

            <p className="card-guarantee">
              Paiement sécurisé · Résiliation à tout moment
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
