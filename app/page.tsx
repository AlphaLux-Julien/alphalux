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
          background: #080808;
          color: #e8e0cc;
        }

        .page {
          min-height: 100vh;
          background: #080808;
          font-family: 'Montserrat', sans-serif;
        }

        /* ---- HEADER ---- */
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 48px;
          border-bottom: 1px solid #252525;
          position: sticky;
          top: 0;
          background: rgba(8,8,8,0.95);
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
          color: #c9a84c;
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

        /* ---- DASHBOARD ---- */
        .dashboard {
          padding: 40px 48px;
          border-bottom: 1px solid #252525;
        }
        .dashboard-label {
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 24px;
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: #252525;
          border: 1px solid #252525;
          margin-bottom: 36px;
        }
        .stat-card {
          background: #111;
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stat-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
        }
        .stat-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          color: #c9a84c;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .stat-value.neutral {
          color: #666;
        }
        .stat-sub {
          font-size: 11px;
          color: #5a5a5a;
          letter-spacing: 0.05em;
        }
        .stat-sub.positive { color: #4ab364; }
        .stat-sub.negative { color: #dc5050; }

        /* ---- CHART SECTION ---- */
        .chart-section {
          background: #0d0d0d;
          border: 1px solid #252525;
          padding: 24px 28px;
        }
        .chart-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #666;
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
          color: #666;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #252525;
        }
        .watch-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: #252525;
          border: 1px solid #252525;
        }
        .watch-empty {
          padding: 48px;
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555;
          border: 1px solid #252525;
        }
      `}</style>

      <div className="page">

        {/* HEADER */}
        <header className="header">
          <div className="logo">Alpha<span>Lux</span></div>
          <button className="btn-logout" onClick={logout}>Sign out</button>
        </header>

        {/* DASHBOARD */}
        <section className="dashboard">
          <div className="dashboard-label">Portfolio overview</div>

          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-label">Collection value</span>
              <span className={`stat-value ${totalValue === 0 ? "neutral" : ""}`}>
                {totalValue.toLocaleString("fr-FR")} €
              </span>
              <span className="stat-sub">{watches.length} {watches.length > 1 ? "pieces" : "piece"}</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total invested</span>
              <span className={`stat-value ${totalCost === 0 ? "neutral" : ""}`}>
                {totalCost.toLocaleString("fr-FR")} €
              </span>
              <span className="stat-sub">purchase cost</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total profit</span>
              <span className={`stat-value ${totalProfit === 0 ? "neutral" : ""}`}>
                {totalProfit > 0 ? "+" : ""}{totalProfit.toLocaleString("fr-FR")} €
              </span>
              {profitPct && (
                <span className={`stat-sub ${isPositive ? "positive" : "negative"}`}>
                  {isPositive ? "▲" : "▼"} {profitPct}% vs cost
                </span>
              )}
            </div>

            <div className="stat-card">
              <span className="stat-label">Best performer</span>
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
            <div className="chart-title">Portfolio value over time</div>
            <PortfolioChart data={portfolioHistory} />
          </div>
        </section>

        {/* CONTENT */}
        <div className="content">

          {/* ADD FORM */}
          <div>
            <div className="section-title">Add a watch</div>
            <AddWatchForm addWatch={addWatch} />
            {message && <p style={{ color: "#c9a84c", fontSize: 12, marginTop: 12 }}>{message}</p>}
          </div>

          {/* WATCH LIST */}
          <div className="watch-list-section">
            <div className="section-title">
              Collection · {watches.length} {watches.length > 1 ? "pieces" : "piece"}
            </div>
            {watches.length === 0 ? (
              <div className="watch-empty">Your collection is empty</div>
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
    </>
  )
}
