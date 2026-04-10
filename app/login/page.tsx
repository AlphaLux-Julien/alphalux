"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const switchMode = (next: "login" | "signup" | "reset") => {
    setMode(next)
    setMessage("")
    setPassword("")
    setConfirmPassword("")
  }

  const handleSubmit = async () => {
    if (mode === "reset") {
      if (!email) {
        setMessage("Veuillez entrer votre adresse email.")
        setIsError(true)
        return
      }
      setLoading(true)
      setMessage("")
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://alphalux.fr/reset-password",
      })
      if (error) {
        setMessage(error.message)
        setIsError(true)
      } else {
        setMessage("Un email de réinitialisation a été envoyé.")
        setIsError(false)
      }
      setLoading(false)
      return
    }

    if (!email || !password) {
      setMessage("Veuillez remplir tous les champs.")
      setIsError(true)
      return
    }
    if (mode === "signup" && password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.")
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
        setMessage("Vérifiez votre email pour confirmer votre compte.")
        setIsError(false)
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Playfair+Display:ital@1&family=Montserrat:wght@300;400;500;600&display=swap');

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
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 0.88em;
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

        .field-input-wrap {
          position: relative;
        }
        .field-input-wrap .field-input {
          padding-right: 42px;
        }
        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #555;
          font-size: 15px;
          line-height: 1;
          padding: 0;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .eye-btn:hover { color: #c9a84c; }

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
          .right-panel { padding: 32px 24px; }
          .form-card { max-width: 100%; }
          .form-title { font-size: 26px; }
          .field-input { min-height: 44px; }
          .btn-primary { min-height: 48px; }
        }
      `}</style>

      <div className="login-page">

        {/* LEFT */}
        <div className="left-panel">
          <div className="brand">Alpha<span>Lux</span></div>

          <div className="left-center">
            <div className="left-tagline">
              Votre collection,<br />
              <em>maîtrisée.</em>
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
                <div className="left-stat-val" style={{ fontSize: 14, letterSpacing: "0.08em" }}>Patrimoine · Clarté · Performance</div>
                <div className="left-stat-lbl">Notre promesse</div>
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

          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#222" }}>
              © 2026 AlphaLux
            </span>
            <a href="/legal" style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#444", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
              Mentions légales
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className="form-card">

            <div className="form-eyebrow">
              {mode === "login" ? "Bienvenue" : mode === "signup" ? "Créer un compte" : "Récupération"}
            </div>
            <div className="form-title">
              {mode === "login" ? "Connexion" : mode === "signup" ? "Rejoindre AlphaLux" : "Mot de passe oublié"}
            </div>

            <div className="field">
              <label className="field-label">Adresse email</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {mode !== "reset" && (
              <div className="field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Mot de passe</label>
                  {mode === "login" && (
                    <button
                      className="toggle-btn"
                      style={{ fontSize: 9, letterSpacing: "0.1em" }}
                      onClick={() => switchMode("reset")}
                    >
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <div className="field-input-wrap">
                  <input
                    className="field-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="eye-btn" type="button" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === "signup" && (
              <div className="field">
                <label className="field-label">Confirmer le mot de passe</label>
                <div className="field-input-wrap">
                  <input
                    className="field-input"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button className="eye-btn" type="button" onClick={() => setShowConfirmPassword(p => !p)}>
                    {showConfirmPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

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
              {loading
                ? "Veuillez patienter..."
                : mode === "login"
                ? "Se connecter"
                : mode === "signup"
                ? "Créer mon compte"
                : "Envoyer le lien"}
            </button>

            {mode === "reset" ? (
              <div className="toggle-row">
                <button className="toggle-btn" onClick={() => switchMode("login")}>
                  ← Retour à la connexion
                </button>
              </div>
            ) : (
              <div className="toggle-row">
                <span className="toggle-text">
                  {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
                </span>
                <button
                  className="toggle-btn"
                  onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "S'inscrire" : "Se connecter"}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </>
  )
}
