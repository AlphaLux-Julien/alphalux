"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabase"
import PortfolioChart from "../../components/PortfolioChart"

export default function WatchDetail() {
  const { id } = useParams()
  const router = useRouter()
  const [watch, setWatch] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshMsg, setRefreshMsg] = useState("")

  const handleRefreshPrice = async () => {
    setRefreshing(true)
    setRefreshMsg("")
    try {
      const params = new URLSearchParams({
        brand: watch.brand || "",
        ...(watch.model && { model: watch.model }),
        ...(watch.reference && { reference: watch.reference }),
      })
      const res = await fetch(`/api/market-price?${params}`)
      const data = await res.json()

      if (!res.ok || !data.price) {
        setRefreshMsg(data.error || "No listings found on eBay")
        return
      }

      const newValue = Math.round(data.price)
      const { data: userData } = await supabase.auth.getUser()
      await supabase.from("watches").update({ current_value: newValue }).eq("id", watch.id)
      await supabase.from("price_history").insert([{
        watch_id: watch.id,
        user_id: userData.user?.id,
        value: newValue,
      }])

      setWatch((prev: any) => ({ ...prev, current_value: newValue }))
      setHistory((prev) => [...prev, { value: newValue, created_at: new Date().toISOString() }])
      setRefreshMsg(`Updated — ${newValue.toLocaleString("fr-FR")} € (${data.count} listings)`)
    } catch {
      setRefreshMsg("Request failed")
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) { router.push("/login"); return }

      const { data: watchData } = await supabase
        .from("watches")
        .select("*")
        .eq("id", id)
        .eq("user_id", userData.user.id)
        .single()

      if (!watchData) { router.push("/"); return }
      setWatch(watchData)

      const { data: histData } = await supabase
        .from("price_history")
        .select("*")
        .eq("watch_id", id)
        .order("created_at", { ascending: true })

      setHistory(histData || [])
      setLoading(false)
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return }
    await supabase.from("watches").delete().eq("id", watch.id)
    router.push("/")
  }

  const chartData = history.map((h) => ({
    date: new Date(h.created_at).toLocaleDateString("fr-FR"),
    value: Number(h.value || h.price || 0),
  }))

  const profit = Number(watch?.current_value || 0) - Number(watch?.purchase_price || 0)
  const profitPct = watch?.purchase_price > 0 ? ((profit / watch.purchase_price) * 100).toFixed(1) : null
  const isPositive = profit >= 0

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#080808", display: "flex",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Montserrat', sans-serif", fontSize: 10,
      letterSpacing: "0.2em", textTransform: "uppercase", color: "#333"
    }}>
      Loading...
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f0f0f; }

        .detail-page { min-height: 100vh; background: #0f0f0f; font-family: 'Montserrat', sans-serif; color: #e8e0cc; }

        .detail-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 48px; border-bottom: 1px solid #2e2e2e;
          position: sticky; top: 0; background: rgba(15,15,15,0.95);
          backdrop-filter: blur(8px); z-index: 10;
        }
        .logo {
          font-family: 'Cormorant Garamond', serif; font-size: 20px;
          font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase;
          color: #e8e0cc; cursor: pointer;
        }
        .logo span { color: #c9a84c; }
        .header-actions { display: flex; gap: 10px; }
        .btn-back {
          background: transparent; border: 1px solid #444; color: #ccc;
          padding: 6px 16px; font-family: 'Montserrat', sans-serif;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; border-radius: 1px; transition: all 0.2s;
        }
        .btn-back:hover { border-color: #888; color: #fff; }
        .btn-del {
          background: transparent; border: 1px solid #444; color: #ccc;
          padding: 6px 16px; font-family: 'Montserrat', sans-serif;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; border-radius: 1px; transition: all 0.2s;
        }
        .btn-del:hover { border-color: rgba(220,80,80,0.6); color: #dc5050; }
        .btn-del.confirm { border-color: rgba(220,80,80,0.6); color: #dc5050; background: rgba(220,80,80,0.06); }
        .btn-refresh {
          background: transparent; border: 1px solid #8a7340; color: #c9a84c;
          padding: 6px 16px; font-family: 'Montserrat', sans-serif;
          font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;
          cursor: pointer; border-radius: 1px; transition: all 0.2s;
        }
        .btn-refresh:hover:not(:disabled) { background: rgba(201,168,76,0.08); border-color: #c9a84c; }
        .btn-refresh:disabled { opacity: 0.4; cursor: not-allowed; }
        .refresh-msg { font-size: 10px; letter-spacing: 0.1em; padding: 8px 48px; color: #8a7340; border-bottom: 1px solid #111; }

        /* Hero */
        .hero { display: grid; grid-template-columns: 480px 1fr; min-height: 420px; }
        .hero-image { background: #161616; position: relative; overflow: hidden; }
        .hero-image img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(15%); }
        .hero-placeholder {
          width: 100%; height: 100%; min-height: 420px;
          display: flex; align-items: center; justify-content: center;
          background: #161616;
        }
        .hero-info { padding: 48px; display: flex; flex-direction: column; justify-content: space-between; border-left: 1px solid #2e2e2e; }

        .watch-eyebrow {
          font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
          color: #aaa; margin-bottom: 12px;
        }
        .watch-brand-lg {
          font-family: 'Cormorant Garamond', serif; font-size: 52px;
          font-weight: 300; letter-spacing: 0.08em; text-transform: uppercase;
          color: #e8e0cc; line-height: 1;
        }
        .watch-model-lg {
          font-family: 'Cormorant Garamond', serif; font-size: 22px;
          font-style: italic; color: #bbb; letter-spacing: 0.05em; margin-top: 8px;
        }

        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .meta-block { display: flex; flex-direction: column; gap: 4px; }
        .meta-lbl { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; }
        .meta-val { font-size: 13px; color: #ccc; letter-spacing: 0.05em; }

        /* Stats strip */
        .stats-strip {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #2e2e2e; border-top: 1px solid #2e2e2e; border-bottom: 1px solid #2e2e2e;
        }
        .stat-block { background: #161616; padding: 28px 32px; }
        .stat-lbl { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
        .stat-val {
          font-family: 'Cormorant Garamond', serif; font-size: 36px;
          font-weight: 300; color: #c9a84c; letter-spacing: 0.02em; line-height: 1;
        }
        .stat-val.neutral { color: #aaa; }
        .stat-sub { font-size: 11px; margin-top: 6px; }
        .positive { color: #4ab364; }
        .negative { color: #dc5050; }

        /* Chart section */
        .chart-section { padding: 40px 48px; border-bottom: 1px solid #2e2e2e; }
        .section-lbl { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #999; margin-bottom: 20px; }

        /* History table */
        .history-section { padding: 40px 48px; }
        .history-table { width: 100%; border-collapse: collapse; }
        .history-table th {
          font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #999; padding: 10px 0; border-bottom: 1px solid #2e2e2e;
          text-align: left; font-weight: 400;
        }
        .history-table td {
          padding: 12px 0; border-bottom: 1px solid #1e1e1e;
          font-size: 12px; color: #ccc; letter-spacing: 0.05em;
        }
        .history-table td:last-child { text-align: right; color: #c9a84c; }
        .history-empty { font-size: 11px; color: #aaa; font-style: italic; padding: 20px 0; }

        @media (max-width: 768px) {
          .detail-header { padding: 16px 20px; }
          .hero { grid-template-columns: 1fr; }
          .hero-image { height: 240px; }
          .hero-image img { height: 240px; }
          .hero-placeholder { min-height: 240px; }
          .hero-info { padding: 24px; border-left: none; border-top: 1px solid #2e2e2e; }
          .stats-strip { grid-template-columns: 1fr; }
          .stat-val { font-size: 28px; }
          .chart-section { padding: 24px 20px; }
          .history-section { padding: 24px 20px; }
          .history-table td { padding-bottom: 10px; font-size: 11px; }
          .history-table th { font-size: 8px; }
          .refresh-msg { padding: 8px 20px; }
        }
      `}</style>

      <div className="detail-page">

        {/* Header */}
        <header className="detail-header">
          <div className="logo" onClick={() => router.push("/")}>Alpha<span>Lux</span></div>
          <div className="header-actions">
            <button className="btn-refresh" onClick={handleRefreshPrice} disabled={refreshing}>
              {refreshing ? "Fetching..." : "↻ Market price"}
            </button>
            <button className="btn-back" onClick={() => router.push("/")}>← Collection</button>
            <button className={`btn-del${confirmDelete ? " confirm" : ""}`} onClick={handleDelete}>
              {confirmDelete ? "Confirm delete?" : "Delete"}
            </button>
          </div>
        </header>

        {refreshMsg && <div className="refresh-msg">{refreshMsg}</div>}

        {/* Hero */}
        <div className="hero">
          <div className="hero-image">
            {watch.image_url ? (
              <img src={watch.image_url} alt={`${watch.brand} ${watch.model}`} />
            ) : (
              <div className="hero-placeholder">
                <svg width="120" height="120" viewBox="0 0 64 64" fill="none" opacity="0.08">
                  <circle cx="32" cy="32" r="28" stroke="#c9a84c" strokeWidth="1"/>
                  <circle cx="32" cy="32" r="20" stroke="#c9a84c" strokeWidth="0.5"/>
                  <line x1="32" y1="10" x2="32" y2="4" stroke="#c9a84c" strokeWidth="1.5"/>
                  <line x1="32" y1="60" x2="32" y2="54" stroke="#c9a84c" strokeWidth="1.5"/>
                  <line x1="10" y1="32" x2="4" y2="32" stroke="#c9a84c" strokeWidth="1.5"/>
                  <line x1="60" y1="32" x2="54" y2="32" stroke="#c9a84c" strokeWidth="1.5"/>
                  <line x1="32" y1="32" x2="32" y2="18" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="32" y1="32" x2="42" y2="32" stroke="#c9a84c" strokeWidth="1" strokeLinecap="round"/>
                  <circle cx="32" cy="32" r="2" fill="#c9a84c"/>
                </svg>
              </div>
            )}
          </div>
          <div className="hero-info">
            <div>
              <div className="watch-eyebrow">Timepiece · {watch.reference || "No reference"}</div>
              <div className="watch-brand-lg">{watch.brand || "—"}</div>
              <div className="watch-model-lg">{watch.model || "Unknown model"}</div>
            </div>
            <div className="meta-grid">
              {watch.reference && (
                <div className="meta-block">
                  <span className="meta-lbl">Reference</span>
                  <span className="meta-val">{watch.reference}</span>
                </div>
              )}
              {watch.year && (
                <div className="meta-block">
                  <span className="meta-lbl">Year</span>
                  <span className="meta-val">{watch.year}</span>
                </div>
              )}
              {watch.note && (
                <div className="meta-block" style={{ gridColumn: "1 / -1" }}>
                  <span className="meta-lbl">Note</span>
                  <span className="meta-val">{watch.note}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stats-strip">
          <div className="stat-block">
            <div className="stat-lbl">Purchase price</div>
            <div className={`stat-val${!watch.purchase_price ? " neutral" : ""}`}>
              {watch.purchase_price ? `${Number(watch.purchase_price).toLocaleString("fr-FR")} €` : "—"}
            </div>
            <div className="stat-sub" style={{ color: "#aaa" }}>acquisition cost</div>
          </div>
          <div className="stat-block">
            <div className="stat-lbl">Market value</div>
            <div className={`stat-val${!watch.current_value ? " neutral" : ""}`}>
              {watch.current_value ? `${Number(watch.current_value).toLocaleString("fr-FR")} €` : "—"}
            </div>
            <div className="stat-sub" style={{ color: "#aaa" }}>estimated today</div>
          </div>
          <div className="stat-block">
            <div className="stat-lbl">Performance</div>
            <div className={`stat-val${profit === 0 ? " neutral" : ""}`}>
              {profit !== 0 ? `${profit > 0 ? "+" : ""}${profit.toLocaleString("fr-FR")} €` : "—"}
            </div>
            {profitPct && profit !== 0 && (
              <div className={`stat-sub ${isPositive ? "positive" : "negative"}`}>
                {isPositive ? "▲" : "▼"} {profitPct}% vs purchase
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="chart-section">
          <div className="section-lbl">Value over time</div>
          <PortfolioChart data={chartData} />
        </div>

        {/* History table */}
        <div className="history-section">
          <div className="section-lbl">Price history</div>
          {history.length === 0 ? (
            <div className="history-empty">No price history recorded yet.</div>
          ) : (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td>{new Date(h.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}</td>
                    <td>{Number(h.value || h.price || 0).toLocaleString("fr-FR")} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </>
  )
}
