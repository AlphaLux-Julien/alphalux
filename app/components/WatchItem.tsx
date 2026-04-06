"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function WatchItem(props: any) {
  const { watch, updatePrice, getHistory, deleteWatch } = props
  const router = useRouter()

  const [history, setHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const profit = Number(watch.current_value || 0) - Number(watch.purchase_price || 0)
  const profitPct =
    watch.purchase_price && watch.purchase_price > 0
      ? ((profit / watch.purchase_price) * 100).toFixed(1)
      : null
  const isPositive = profit >= 0

  const handleHistory = async () => {
    if (!showHistory) {
      const data = await getHistory(watch.id)
      setHistory(data || [])
    }
    setShowHistory(!showHistory)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .watch-card {
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(145deg, #0f0f10, #0a0a0b);
          border: 1px solid #2e2e2e;
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.3s ease, transform 0.3s ease;
          position: relative;
        }
        .watch-card:hover {
          border-color: #8a7340;
          transform: translateY(-2px);
        }
        .watch-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a84c, transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .watch-card:hover::before {
          opacity: 1;
        }

        .card-inner {
          display: grid;
          grid-template-columns: 180px 1fr;
          min-height: 180px;
        }

        .image-side {
          position: relative;
          background: #161616;
          overflow: hidden;
        }
        .image-side img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(20%);
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .watch-card:hover .image-side img {
          filter: grayscale(0%);
          transform: scale(1.03);
        }
        .image-placeholder {
          width: 100%;
          height: 100%;
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, rgba(212,175,55,0.1), transparent);
        }
        .image-placeholder svg {
          opacity: 0.15;
        }

        .info-side {
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
        }

        .watch-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .watch-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          letter-spacing: 0.12em;
          color: #e8e0cc;
          text-transform: uppercase;
          line-height: 1.1;
        }
        .watch-model {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          font-style: italic;
          color: #bbb;
          letter-spacing: 0.05em;
          margin-top: 3px;
        }

        .watch-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .meta-label {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
          font-weight: 500;
        }
        .meta-value {
          font-size: 12px;
          color: #ccc;
          letter-spacing: 0.05em;
        }

        .watch-financials {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          padding-top: 12px;
          border-top: 1px solid #2e2e2e;
        }
        .financial-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .financial-label {
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #999;
        }
        .financial-value {
          font-size: 18px;
          font-weight: 300;
          background: linear-gradient(90deg, #d4af37, #f5d97a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.04em;
        }
        .financial-value.neutral {
          background: none;
          -webkit-text-fill-color: #aaa;
        }

        .profit-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 1px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
        }
        .profit-badge.positive {
          background: rgba(0, 255, 150, 0.08);
          border: 1px solid rgba(0, 255, 150, 0.25);
          border-radius: 4px;
          color: #4ab364;
        }
        .profit-badge.negative {
          background: rgba(220, 80, 80, 0.08);
          border: 1px solid rgba(220, 80, 80, 0.2);
          color: #dc5050;
        }
        .profit-badge.zero {
          background: rgba(255,255,255,0.03);
          border: 1px solid #2e2e2e;
          color: #bbb;
        }

        .card-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .btn-ghost {
          background: transparent;
          border: 1px solid #383838;
          color: #777;
          padding: 5px 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s ease;
        }
        .btn-ghost:hover {
          border-color: #8a7340;
          color: #c9a84c;
        }
        .btn-delete {
          background: transparent;
          border: 1px solid #303030;
          color: #666;
          padding: 5px 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 1px;
          transition: all 0.2s ease;
        }
        .btn-delete:hover {
          border-color: rgba(220, 80, 80, 0.4);
          color: #dc5050;
        }
        .btn-delete.confirm {
          border-color: rgba(220, 80, 80, 0.6);
          color: #dc5050;
          background: rgba(220, 80, 80, 0.06);
        }

        .history-panel {
          border-top: 1px solid #2e2e2e;
          padding: 16px 28px;
          background: #161616;
        }
        .history-title {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #aaa;
          margin-bottom: 12px;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .history-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid #2e2e2e;
        }
        .history-date {
          font-size: 11px;
          color: #aaa;
          letter-spacing: 0.05em;
        }
        .history-price {
          font-size: 12px;
          color: #7a6a40;
          letter-spacing: 0.05em;
        }
        .history-empty {
          font-size: 11px;
          color: #bbb;
          font-style: italic;
        }
      `}</style>

      <div className="watch-card" onClick={() => router.push(`/watch/${watch.id}`)} style={{ cursor: "pointer" }}>
        <div className="card-inner">

          {/* Image */}
          <div className="image-side">
            {watch.image_url ? (
              <img src={watch.image_url} alt={`${watch.brand} ${watch.model}`} />
            ) : (
              <div className="image-placeholder">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
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

          {/* Info */}
          <div className="info-side">
            <div className="watch-header">
              <div>
                <div className="watch-brand">{watch.brand || "—"}</div>
                <div className="watch-model">{watch.model || "Modèle inconnu"}</div>
              </div>
              <div className="card-actions">
                <button className="btn-ghost" onClick={(e) => { e.stopPropagation(); handleHistory() }}>
                  {showHistory ? "Fermer" : "Historique"}
                </button>
                <button
                  className={`btn-delete ${confirmDelete ? "confirm" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirmDelete) {
                      deleteWatch(watch.id)
                    } else {
                      setConfirmDelete(true)
                      setTimeout(() => setConfirmDelete(false), 3000)
                    }
                  }}
                >
                  {confirmDelete ? "Confirmer ?" : "Supprimer"}
                </button>
              </div>
            </div>

            <div className="watch-meta">
              {watch.reference && (
                <div className="meta-item">
                  <span className="meta-label">Ref.</span>
                  <span className="meta-value">{watch.reference}</span>
                </div>
              )}
              {watch.year && (
                <div className="meta-item">
                  <span className="meta-label">Année</span>
                  <span className="meta-value">{watch.year}</span>
                </div>
              )}
              {watch.note && (
                <div className="meta-item">
                  <span className="meta-label">Note</span>
                  <span className="meta-value">{watch.note}</span>
                </div>
              )}
            </div>

            <div className="watch-financials">
              <div style={{ display: "flex", gap: "28px" }}>
                <div className="financial-block">
                  <span className="financial-label">Achat</span>
                  <span className={`financial-value ${!watch.purchase_price ? "neutral" : ""}`}>
                    {watch.purchase_price
                      ? `${Number(watch.purchase_price).toLocaleString("fr-FR")} €`
                      : "—"}
                  </span>
                </div>
                <div className="financial-block">
                  <span className="financial-label">Valeur marché</span>
                  <span className={`financial-value ${!watch.current_value ? "neutral" : ""}`}>
                    {watch.current_value
                      ? `${Number(watch.current_value).toLocaleString("fr-FR")} €`
                      : "—"}
                  </span>
                </div>
              </div>

              <div
                className={`profit-badge ${
                  profit > 0 ? "positive" : profit < 0 ? "negative" : "zero"
                }`}
              >
                <span>{profit > 0 ? "▲" : profit < 0 ? "▼" : "="}</span>
                <span>
                  {profit !== 0
                    ? `${profit > 0 ? "+" : ""}${profit.toLocaleString("fr-FR")} €`
                    : "—"}
                  {profitPct && profit !== 0 ? ` (${profitPct}%)` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="history-panel">
            <div className="history-title">Historique des prix</div>
            {history.length === 0 ? (
              <div className="history-empty">Aucun historique de prix.</div>
            ) : (
              <div className="history-list">
                {history.map((h: any, i: number) => (
                  <div key={i} className="history-row">
                    <span className="history-date">
                      {new Date(h.recorded_at || h.created_at).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="history-price">
                      {Number(h.price).toLocaleString("fr-FR")} €
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}