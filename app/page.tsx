"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

import WatchItem from "./components/WatchItem"
import AddWatchForm from "./components/AddWatchForm"
import PortfolioChart from "./components/PortfolioChart"

export default function Home() {
  const [message, setMessage] = useState("")
  const [watches, setWatches] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [portfolioHistory, setPortfolioHistory] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [refreshMsg, setRefreshMsg] = useState("")

  // ---------------- TOTALS ----------------
  const totalValue = watches.reduce((sum, w) => sum + Number(w.current_value || 0), 0)
  const totalCost = watches.reduce((sum, w) => sum + Number(w.purchase_price || 0), 0)
  const totalProfit = totalValue - totalCost
  const profitPct = totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(1) : null
  const isPositive = totalProfit >= 0

  // ---------------- USER ----------------
  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (!data.user) { window.location.href = "/login"; return }

    let profile: { subscription_status: string } | null = null

    // Retry jusqu'à 3 fois pour absorber le délai du webhook Stripe post-paiement
    for (let attempt = 0; attempt < 3; attempt++) {
      const { data: profileData } = await supabase
        .from("users")
        .select("subscription_status")
        .eq("id", data.user.id)
        .single()
      profile = profileData
      if (profile?.subscription_status === "active") break
      if (attempt < 2) await new Promise((r) => setTimeout(r, 2000))
    }

    if (!profile || profile.subscription_status !== "active") {
      window.location.href = "/pricing"
      return
    }

    setUser(data.user)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  // ---------------- FETCH WATCHES ----------------
  const fetchWatches = async () => {
    if (!user) return
    const { data } = await supabase.from("watches").select("*").eq("user_id", user.id)
    setWatches(data || [])
  }

  // ---------------- ADD WATCH ----------------
  const addWatch = async (watch: any) => {
    const { data: userData } = await supabase.auth.getUser()
    const currentUser = userData.user
    if (!currentUser) return
    const payload = {
      brand: watch.brand || null,
      model: watch.model || null,
      reference: watch.reference || null,
      purchase_price: watch.value ? Number(watch.value) : 0,
      current_value: watch.value ? Number(watch.value) : 0,
      year: watch.year ? Number(watch.year) : null,
      note: watch.note || null,
      image_url: watch.image || null,
      user_id: currentUser.id,
    }
    await supabase.from("watches").insert([payload])
    fetchWatches()
  }

  // ---------------- DELETE WATCH ----------------
  const deleteWatch = async (id: string) => {
    await supabase.from("watches").delete().eq("id", id)
    fetchWatches()
  }

  // ---------------- UPDATE PRICE ----------------
  const updatePrice = async (watch: any) => {
    const newValue = Number(watch.purchase_price || 0) + Math.floor(Math.random() * 1000)
    const { error } = await supabase.from("watches").update({ current_value: newValue }).eq("id", watch.id)
    if (!error) {
      await supabase.from("price_history").insert([{ watch_id: watch.id, value: newValue, user_id: user.id }])
      fetchWatches()
      loadPortfolioHistory()
    }
  }

  // ---------------- HISTORY ----------------
  const getHistory = async (watchId: string) => {
    const { data } = await supabase
      .from("price_history").select("*").eq("watch_id", watchId).order("created_at", { ascending: true })
    return data || []
  }

  // ---------------- PORTFOLIO HISTORY ----------------
  const loadPortfolioHistory = async () => {
    if (!user) return
    const { data } = await supabase
      .from("price_history").select("*").eq("user_id", user.id).order("created_at", { ascending: true })
    if (!data) return
    const map: any = {}
    data.forEach((row: any) => {
      const date = new Date(row.created_at).toLocaleDateString("fr-FR")
      if (!map[date]) map[date] = 0
      map[date] += Number(row.value)
    })
    setPortfolioHistory(Object.keys(map).map((date) => ({ date, value: map[date] })))
  }

  // ---------------- REFRESH MARKET PRICES ----------------
  const refreshMarketPrices = async () => {
    setRefreshing(true)
    setRefreshMsg("")
    let updated = 0
    let skipped = 0

    for (const watch of watches) {
      if (!watch.brand || !watch.reference) { skipped++; continue }
      try {
        const res = await fetch(
          `/api/market-price?brand=${encodeURIComponent(watch.brand)}&reference=${encodeURIComponent(watch.reference)}`
        )
        const data = await res.json()
        if (!data.price) { skipped++; continue }

        await supabase.from("watches").update({ current_value: data.price }).eq("id", watch.id)
        await supabase.from("price_history").insert([{ watch_id: watch.id, value: data.price, user_id: user.id }])
        updated++
      } catch {
        skipped++
      }
    }

    await fetchWatches()
    await loadPortfolioHistory()
    setRefreshMsg(`${updated} updated${skipped > 0 ? `, ${skipped} skipped` : ""}`)
    setRefreshing(false)
  }

  // ---------------- EFFECTS ----------------
  useEffect(() => { getUser() }, [])
  useEffect(() => { if (user) { fetchWatches(); loadPortfolioHistory() } }, [user])

  // ---------------- UI ----------------
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Montserrat:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0f0f0f;
          color: #e8e0cc;
        }

        .page {
          min-height: 100vh;
          background: #0f0f0f;
          font-family: 'Montserrat', sans-serif;
        }

        /* ---- HEADER ---- */
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
        }
        .logo span {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-logout {
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
        .btn-logout:hover {
          border-color: #666;
          color: #aaa;
        }
        .btn-refresh-all {
          background: linear-gradient(135deg, #d4af37, #f5d97a);
          border: none;
          color: #0a0a0a;
          padding: 6px 18px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(212,175,55,0.25);
        }
        .btn-refresh-all:hover:not(:disabled) {
          background: linear-gradient(135deg, #e0bc45, #fae88a);
          box-shadow: 0 4px 20px rgba(212,175,55,0.4);
        }
        .btn-refresh-all:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ---- DASHBOARD ---- */
        .dashboard {
          padding: 40px 48px;
          border-bottom: 1px solid #2e2e2e;
        }
        .dashboard-label {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 24px;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #2e2e2e;
          border: 1px solid #2e2e2e;
          margin-bottom: 36px;
        }
        .stat-card {
          background: linear-gradient(145deg, #0f0f10, #0a0a0b);
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          transition: box-shadow 0.3s ease;
        }
        .stat-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.1);
        }
        .stat-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999;
        }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          background: linear-gradient(90deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .stat-value.neutral {
          background: none;
          -webkit-text-fill-color: #666;
        }
        .stat-sub {
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.05em;
        }
        .stat-sub.positive { color: #4ab364; }
        .stat-sub.negative { color: #dc5050; }

        /* ---- CHART SECTION ---- */
        .chart-section {
          background: linear-gradient(145deg, #0f0f10, #0a0a0b);
          border: 1px solid #2e2e2e;
          padding: 24px 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .chart-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 16px;
        }

        /* ---- CONTENT ---- */
        .content {
          padding: 40px 48px;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 40px;
          align-items: start;
        }

        /* ---- WATCH LIST ---- */
        .watch-list-section {}
        .section-title {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #2e2e2e;
        }
        .watch-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: transparent;
          border: none;
        }
        .watch-empty {
          padding: 48px;
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #aaa;
          border: 1px solid #2e2e2e;
        }

        @media (max-width: 768px) {
          .header {
            padding: 16px 20px;
          }
          .btn-logout span { display: none; }
          .dashboard {
            padding: 24px 20px;
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-value {
            font-size: 24px;
          }
          .content {
            padding: 24px 20px;
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page">

        {/* HEADER */}
        <header className="header">
          <div className="logo">Alpha<span>Lux</span></div>
          <button className="btn-logout" onClick={logout}>Déconnexion</button>
        </header>

        {/* DASHBOARD */}
        <section className="dashboard">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div className="dashboard-label" style={{ marginBottom: 0 }}>Vue d'ensemble</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {refreshMsg && <span style={{ fontSize: 10, letterSpacing: "0.1em", color: "#8a7340" }}>{refreshMsg}</span>}
              <button className="btn-refresh-all" onClick={refreshMarketPrices} disabled={refreshing || watches.length === 0}>
                {refreshing ? "Récupération..." : "↻ Actualiser les prix"}
              </button>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Valeur de la collection</span>
              <span className={`stat-value ${totalValue === 0 ? "neutral" : ""}`}>
                {totalValue.toLocaleString("fr-FR")} €
              </span>
              <span className="stat-sub">{watches.length} {watches.length > 1 ? "pièces" : "pièce"}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total investi</span>
              <span className={`stat-value ${totalCost === 0 ? "neutral" : ""}`}>
                {totalCost.toLocaleString("fr-FR")} €
              </span>
              <span className="stat-sub">coût d'acquisition</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Bénéfice total</span>
              <span className={`stat-value ${totalProfit === 0 ? "neutral" : ""}`}>
                {totalProfit > 0 ? "+" : ""}{totalProfit.toLocaleString("fr-FR")} €
              </span>
              {profitPct && (
                <span className={`stat-sub ${isPositive ? "positive" : "negative"}`}>
                  {isPositive ? "▲" : "▼"} {profitPct}% vs coût
                </span>
              )}
            </div>

            <div className="stat-card">
              <span className="stat-label">Meilleure performance</span>
              {watches.length > 0 ? (() => {
                const best = watches.reduce((prev, curr) =>
                  (Number(curr.current_value || 0) - Number(curr.purchase_price || 0)) >
                  (Number(prev.current_value || 0) - Number(prev.purchase_price || 0)) ? curr : prev
                )
                const bestProfit = Number(best.current_value || 0) - Number(best.purchase_price || 0)
                return (
                  <>
                    <span className="stat-value" style={{ fontSize: 20, paddingTop: 4 }}>
                      {best.brand || "—"}
                    </span>
                    <span className={`stat-sub ${bestProfit >= 0 ? "positive" : "negative"}`}>
                      {bestProfit > 0 ? "+" : ""}{bestProfit.toLocaleString("fr-FR")} €
                    </span>
                  </>
                )
              })() : (
                <span className="stat-value neutral" style={{ fontSize: 20 }}>—</span>
              )}
            </div>
          </div>

          <div className="chart-section">
            <div className="chart-title">Évolution du portefeuille</div>
            <PortfolioChart data={portfolioHistory} />
          </div>
        </section>

        {/* CONTENT */}
        <div className="content">

          {/* ADD FORM */}
          <div>
            <div className="section-title">Ajouter une montre</div>
            <AddWatchForm addWatch={addWatch} />
            {message && <p style={{ color: "#c9a84c", fontSize: 12, marginTop: 12 }}>{message}</p>}
          </div>

          {/* WATCH LIST */}
          <div className="watch-list-section">
            <div className="section-title">
              Collection · {watches.length} {watches.length > 1 ? "pièces" : "pièce"}
            </div>
            {watches.length === 0 ? (
              <div className="watch-empty">Votre collection est vide</div>
            ) : (
              <div className="watch-list">
                {watches.map((w) => (
                  <WatchItem
                    key={w.id}
                    watch={w}
                    updatePrice={updatePrice}
                    getHistory={getHistory}
                    deleteWatch={deleteWatch}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
      <footer style={{
        padding: "24px 48px",
        borderTop: "1px solid #1e1e1e",
        display: "flex",
        justifyContent: "center",
        gap: 32,
      }}>
        <span style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#333" }}>
          © 2026 AlphaLux
        </span>
        <a href="/legal" style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "#555", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
          onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
          Mentions légales
        </a>
      </footer>
    </>
  )
}
