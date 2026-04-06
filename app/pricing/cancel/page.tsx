"use client"

import { useRouter } from "next/navigation"

export default function PricingCancelPage() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Montserrat:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0f0f0f;
          color: #e8e0cc;
        }

        .cancel-page {
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #e8e0cc;
          margin-bottom: 56px;
        }
        .logo span {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .cancel-card {
          width: 100%;
          max-width: 480px;
          background: linear-gradient(145deg, #161616, #111111);
          border: 1px solid #2e2e2e;
          padding: 56px 48px;
          text-align: center;
          position: relative;
          box-shadow: 0 16px 64px rgba(0,0,0,0.6);
        }
        .cancel-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #2e2e2e;
        }

        .cancel-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 32px;
          background: rgba(255,255,255,0.03);
          border: 1px solid #2e2e2e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cancel-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #e8e0cc;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .cancel-text {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #888;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .btn-primary {
          display: block;
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
          margin-bottom: 16px;
        }
        .btn-primary:hover {
          background: linear-gradient(135deg, #e0bc45, #fae88a);
          box-shadow: 0 6px 32px rgba(212,175,55,0.5);
          transform: translateY(-1px);
        }

        .btn-ghost {
          display: block;
          width: 100%;
          padding: 12px 24px;
          background: transparent;
          border: none;
          color: #555;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s;
        }
        .btn-ghost:hover {
          color: #888;
        }

        @media (max-width: 768px) {
          .cancel-card {
            padding: 40px 24px;
          }
          .cancel-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="cancel-page">
        <div className="logo">Alpha<span>Lux</span></div>

        <div className="cancel-card">
          <div className="cancel-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M8 8L20 20M20 8L8 20"
                stroke="#555"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h1 className="cancel-title">
            Paiement annulé
          </h1>

          <p className="cancel-text">
            Votre abonnement n'a pas été activé. Vous pouvez réessayer à tout moment.
          </p>

          <button className="btn-primary" onClick={() => router.push("/pricing")}>
            Voir les offres
          </button>

          <button className="btn-ghost" onClick={() => router.push("/")}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </>
  )
}
