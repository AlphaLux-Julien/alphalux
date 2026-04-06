"use client"

import { useRouter } from "next/navigation"

export default function PricingSuccessPage() {
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

        .success-page {
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

        .success-card {
          width: 100%;
          max-width: 480px;
          background: linear-gradient(145deg, #161616, #111111);
          border: 1px solid #2e2e2e;
          padding: 56px 48px;
          text-align: center;
          position: relative;
          box-shadow: 0 16px 64px rgba(0,0,0,0.6);
        }
        .success-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #d4af37, #f5d97a, #d4af37);
        }

        .checkmark-wrapper {
          width: 72px;
          height: 72px;
          margin: 0 auto 32px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #e8e0cc;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .success-text {
          font-size: 12px;
          letter-spacing: 0.08em;
          color: #888;
          line-height: 1.7;
          margin-bottom: 40px;
        }

        .btn-primary {
          display: inline-block;
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
        .btn-primary:hover {
          background: linear-gradient(135deg, #e0bc45, #fae88a);
          box-shadow: 0 6px 32px rgba(212,175,55,0.5);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .success-card {
            padding: 40px 24px;
          }
          .success-title {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="success-page">
        <div className="logo">Alpha<span>Lux</span></div>

        <div className="success-card">
          <div className="checkmark-wrapper">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M6 16L13 23L26 9"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="success-title">
            Bienvenue dans AlphaLux Premium
          </h1>

          <p className="success-text">
            Votre abonnement est actif. Vous avez maintenant accès à toutes les fonctionnalités.
          </p>

          <button className="btn-primary" onClick={() => router.push("/")}>
            Accéder à ma collection
          </button>
        </div>
      </div>
    </>
  )
}
