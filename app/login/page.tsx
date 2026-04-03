"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage("Please fill in all fields")
      setIsError(true)
      return
    }
    setLoading(true)
    setMessage("")

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
        setIsError(true)
      } else {
        window.location.href = "/"
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
        setIsError(true)
      } else {
        setMessage("Account created — you can now sign in.")
        setIsError(false)
        setMode("login")
      }
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #080808; }

        .login-page {
          min-height: 100vh;
          background: #080808;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Montserrat', sans-serif;
        }

        /* ---- LEFT PANEL ---- */
        .left-panel {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 60px;
          border-right: 1px solid #1e1e1e;
          position: relative;
          overflow: hidden;
        }
        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.04) 0%, transparent 70%);
          pointer-events: none;
        }

        .brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #e8e0cc;
        }
        .brand span { color: #c9a84c; }

        .left-center {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .left-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px;
          font-weight: 300;
          line-height: 1.15;
          color: #e8e0cc;
          letter-spacing: 0.02em;
        }
        .left-tagline em {
          font-style: italic;
          color: #c9a84c;
        }
        .left-sub {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #555;
          line-height: 1.8;
        }

        .left-stats {
          display: flex;
          gap: 40px;
        }
        .left-stat-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          color: #c9a84c;
          letter-spacing: 0.02em;
        }
        .left-stat-lbl {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a3a3a;
          margin-top: 4px;
        }

        /* Watch SVG decoration */
        .watch-deco {
          position: absolute;
          right: -60px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.04;
        }

        /* ---- RIGHT PANEL ---- */
        .right-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .form-card {
          width: 100%;
          max-width: 380px;
        }

        .form-eyebrow {
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 12px;
        }
        .form-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          color: #e8e0cc;
          letter-spacing: 0.05em;
          margin-bottom: 36px;
        }

        .field {
          margin-bottom: 20px;
        }
        .field-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #777;
          margin-bottom: 8px;
          display: block;
        }
        .field-input {
          width: 100%;
          background: #111;
          border: 1px solid #2e2e2e;
          border-radius: 1px;
          padding: 12px 16px;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          color: #d8d0c0;
          letter-spacing: 0.04em;
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input::placeholder { color: #3a3a3a; }
        .field-input:focus { border-color: #8a7340; }

        .message {
          padding: 10px 14px;
          border-radius: 1px;
          font-size: 11px;
          letter-spacing: 0.05em;
          margin-bottom: 20px;
        }
        .message.error {
          background: rgba(220,80,80,0.06);
          border: 1px solid rgba(220,80,80,0.25);
          color: #dc5050;
        }
        .message.success {
          background: rgba(74,179,100,0.06);
          border: 1px solid rgba(74,179,100,0.25);
          color: #4ab364;
        }

        .btn-primary {
          width: 100%;
          background: transparent;
          border: 1px solid #8a7340;
          color: #c9a84c;
          padding: 14px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
          margin-bottom: 20px;
        }
        .btn-primary:hover:not(:disabled) {
          background: rgba(201,168,76,0.08);
          border-color: #c9a84c;
        }
        .btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .toggle-row {
          text-align: center;
        }
        .toggle-text {
          font-size: 11px;
          color: #444;
          letter-spacing: 0.05em;
        }
        .toggle-btn {
          background: none;
          border: none;
          color: #8a7340;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          letter-spacing: 0.05em;
          cursor: pointer;
          padding: 0;
          margin-left: 6px;
          transition: color 0.2s;
        }
        .toggle-btn:hover { color: #c9a84c; }

        .divider {
          height: 1px;
          background: #1e1e1e;
          margin: 28px 0;
        }

        @media (max-width: 768px) {
          .login-page { grid-template-columns: 1fr; }
          .left-panel { display: none; }
          .right-panel { padding: 40px 24px; }
        }
      `}</style>

      <div className="login-page">

        {/* LEFT */}
        <div className="left-panel">
          <div className="brand">Alpha<span>Lux</span></div>

          <div className="left-center">
            <div className="left-tagline">
              Your collection,<br />
              <em>masterfully</em><br />
              tracked.
            </div>
            <div className="left-sub">
              Patrimoine · Clarté · Performance<br />
              Montres & maroquinerie de prestige
            </div>
            <div className="left-stats">
              <div>
                <div className="left-stat-val">+18.4%</div>
                <div className="left-stat-lbl">Rendement moyen</div>
              </div>
              <div>
                <div className="left-stat-val">AlphaLux</div>
                <div className="left-stat-lbl">Pour l'horlogerie</div>
              </div>
            </div>
          </div>

          {/* Decorative watch */}
          <svg className="watch-deco" width="480" height="480" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="#c9a84c" strokeWidth="1"/>
            <circle cx="32" cy="32" r="22" stroke="#c9a84c" strokeWidth="0.5"/>
            <circle cx="32" cy="32" r="16" stroke="#c9a84c" strokeWidth="0.3"/>
            <line x1="32" y1="10" x2="32" y2="4" stroke="#c9a84c" strokeWidth="1.5"/>
            <line x1="32" y1="60" x2="32" y2="54" stroke="#c9a84c" strokeWidth="1.5"/>
            <line x1="10" y1="32" x2="4" y2="32" stroke="#c9a84c" strokeWidth="1.5"/>
            <line x1="60" y1="32" x2="54" y2="32" stroke="#c9a84c" strokeWidth="1.5"/>
            <line x1="32" y1="32" x2="32" y2="16" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="32" y1="32" x2="44" y2="32" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="32" cy="32" r="2.5" fill="#c9a84c"/>
            <line x1="32" y1="14" x2="32" y2="16" stroke="#c9a84c" strokeWidth="1"/>
            <line x1="50" y1="32" x2="48" y2="32" stroke="#c9a84c" strokeWidth="1"/>
            <line x1="32" y1="50" x2="32" y2="48" stroke="#c9a84c" strokeWidth="1"/>
            <line x1="14" y1="32" x2="16" y2="32" stroke="#c9a84c" strokeWidth="1"/>
          </svg>

          <div style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#222" }}>
            © 2026 AlphaLux
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className="form-card">

            <div className="form-eyebrow">
              {mode === "login" ? "Welcome back" : "Create account"}
            </div>
            <div className="form-title">
              {mode === "login" ? "Sign in" : "Join AlphaLux"}
            </div>

            <div className="field">
              <label className="field-label">Email address</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {message && (
              <div className={`message ${isError ? "error" : "success"}`}>
                {message}
              </div>
            )}

            <div className="divider" />

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
            </button>

            <div className="toggle-row">
              <span className="toggle-text">
                {mode === "login" ? "No account yet?" : "Already have an account?"}
              </span>
              <button
                className="toggle-btn"
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMessage("") }}
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
