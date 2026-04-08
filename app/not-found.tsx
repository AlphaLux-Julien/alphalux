"use client"

import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f0f; }

        .not-found {
          min-height: 100vh;
          background: #0f0f0f;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          padding: 40px 24px;
          text-align: center;
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #e8e0cc;
          margin-bottom: 72px;
          cursor: pointer;
        }
        .logo span {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .code {
          font-family: 'Cormorant Garamond', serif;
          font-size: 160px;
          font-weight: 300;
          line-height: 1;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 24px;
        }

        .divider {
          width: 48px;
          height: 1px;
          background: #2e2e2e;
          margin: 0 auto 28px;
        }

        .title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: #e8e0cc;
          letter-spacing: 0.06em;
          margin-bottom: 14px;
        }

        .subtitle {
          font-size: 12px;
          letter-spacing: 0.12em;
          color: #aaa;
          margin-bottom: 48px;
        }

        .btn-cta {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          border: none;
          color: #0a0a0a;
          padding: 14px 40px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
          box-shadow: 0 2px 16px rgba(212,175,55,0.25);
          min-height: 48px;
        }
        .btn-cta:hover {
          background: linear-gradient(135deg, #e0bc45, #fae88a);
          box-shadow: 0 4px 24px rgba(212,175,55,0.4);
        }

        @media (max-width: 768px) {
          .code { font-size: 100px; }
          .title { font-size: 22px; }
          .logo { margin-bottom: 48px; }
        }
      `}</style>

      <div className="not-found">
        <div className="logo" onClick={() => router.push("/")}>Alpha<span>Lux</span></div>
        <div className="code">404</div>
        <div className="divider" />
        <div className="title">Cette page n'existe pas</div>
        <div className="subtitle">La pièce que vous cherchez semble avoir disparu.</div>
        <button className="btn-cta" onClick={() => router.push("/")}>
          Retour au dashboard
        </button>
      </div>
    </>
  )
}
