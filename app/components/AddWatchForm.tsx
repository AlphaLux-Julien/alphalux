"use client"

import { useState, useRef } from "react"
import { supabase } from "../../lib/supabase"

export default function AddWatchForm({ addWatch }: { addWatch: (watch: any) => void }) {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [reference, setReference] = useState("")
  const [value, setValue] = useState("")
  const [year, setYear] = useState("")
  const [note, setNote] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!brand.trim()) e.brand = "Obligatoire"
    if (!value.trim()) e.value = "Obligatoire"
    else if (isNaN(Number(value)) || Number(value) <= 0) e.value = "Must be a positive number"
    if (year && (isNaN(Number(year)) || Number(year) < 1900 || Number(year) > new Date().getFullYear()))
      e.year = `Between 1900 and ${new Date().getFullYear()}`
    return e
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setErrors(prev => ({ ...prev, image: "File must be an image" }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Max 5MB" }))
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) { setUploading(false); return }

    const ext = file.name.split(".").pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from("watch-images")
      .upload(path, file, { upsert: false })

    if (error) {
      setErrors(prev => ({ ...prev, image: "Upload failed, try again" }))
      setImagePreview(null)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("watch-images")
      .getPublicUrl(path)

    setImageUrl(urlData.publicUrl)
    setErrors(prev => { const n = { ...prev }; delete n.image; return n })
    setUploading(false)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleAdd = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    addWatch({ brand, model, reference, value, year, image: imageUrl, note })
    setBrand(""); setModel(""); setReference("")
    setValue(""); setYear(""); setNote("")
    setImagePreview(null); setImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  const textFields = [
    { key: "brand", label: "Marque", value: brand, set: setBrand, placeholder: "Rolex, Omega, Patek...", required: true },
    { key: "model", label: "Modèle", value: model, set: setModel, placeholder: "Submariner, Speedmaster..." },
    { key: "reference", label: "Référence", value: reference, set: setReference, placeholder: "126610LN" },
    { key: "value", label: "Prix d'achat (€)", value, set: setValue, placeholder: "9500", required: true, type: "number" },
    { key: "year", label: "Année", value: year, set: setYear, placeholder: "2022", type: "number" },
    { key: "note", label: "Note", value: note, set: setNote, placeholder: "Complet, non porté..." },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500&display=swap');
        .form-wrap { font-family:'Montserrat',sans-serif; background:#161616; border:1px solid #2e2e2e; padding:28px; }
        .form-field { margin-bottom:18px; }
        .form-label { display:flex; justify-content:space-between; align-items:center; font-size:9px; letter-spacing:.2em; text-transform:uppercase; color:#999; margin-bottom:6px; }
        .form-label .req { color:#c9a84c; }
        .form-label .err-msg { color:#dc5050; font-size:9px; letter-spacing:.05em; text-transform:none; }
        .form-input { width:100%; background:#1a1a1a; border:1px solid #2e2e2e; border-radius:1px; padding:10px 14px; font-family:'Montserrat',sans-serif; font-size:12px; color:#d8d0c0; letter-spacing:.04em; outline:none; transition:border-color .2s; box-sizing:border-box; -moz-appearance:textfield; }
        .form-input::-webkit-outer-spin-button,.form-input::-webkit-inner-spin-button { -webkit-appearance:none; }
        .form-input::placeholder { color:#555; }
        .form-input:focus { border-color:#8a7340; }
        .form-input.has-error { border-color:rgba(220,80,80,.5); }
        .upload-zone { width:100%; border:1px dashed #2a2a2a; border-radius:1px; padding:20px; text-align:center; cursor:pointer; transition:border-color .2s,background .2s; background:#0d0d0d; box-sizing:border-box; }
        .upload-zone:hover { border-color:#8a7340; background:rgba(201,168,76,.03); }
        .upload-zone.has-error { border-color:rgba(220,80,80,.5); }
        .upload-icon { color:#999; font-size:22px; margin-bottom:6px; }
        .upload-text { font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:#999; }
        .upload-sub { font-size:9px; color:#555; margin-top:4px; letter-spacing:.08em; }
        .upload-loading { font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:#8a7340; }
        .image-preview-wrap { position:relative; width:100%; height:140px; border:1px solid #2e2e2e; overflow:hidden; border-radius:1px; }
        .image-preview-wrap img { width:100%; height:100%; object-fit:cover; filter:grayscale(20%); }
        .image-remove { position:absolute; top:8px; right:8px; background:rgba(0,0,0,.8); border:1px solid #444; color:#999; width:24px; height:24px; border-radius:1px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; transition:all .2s; }
        .image-remove:hover { border-color:#dc5050; color:#dc5050; }
        .image-ok { position:absolute; bottom:8px; left:8px; background:rgba(0,0,0,.7); border:1px solid rgba(74,179,100,.3); color:#4ab364; font-size:9px; letter-spacing:.12em; text-transform:uppercase; padding:3px 8px; border-radius:1px; }
        .form-divider { height:1px; background:#2e2e2e; margin:22px 0; }
        .btn-submit { width:100%; background:transparent; border:1px solid #8a7340; color:#c9a84c; padding:12px; font-family:'Montserrat',sans-serif; font-size:10px; letter-spacing:.25em; text-transform:uppercase; cursor:pointer; border-radius:1px; transition:all .2s; }
        .btn-submit:hover { background:rgba(201,168,76,.08); border-color:#c9a84c; }
        .btn-submit.submitted { border-color:#4ab364; color:#4ab364; }
        .btn-submit:disabled { opacity:.5; cursor:not-allowed; }
        .success-msg { margin-top:12px; font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:#4ab364; text-align:center; animation:fadeIn .3s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:none;} }
      `}</style>

      <div className="form-wrap">
        {textFields.map(({ key, label, value: val, set, placeholder, required, type }) => (
          <div className="form-field" key={key}>
            <div className="form-label">
              <span>{label}{required && <span className="req"> *</span>}</span>
              {errors[key] && <span className="err-msg">{errors[key]}</span>}
            </div>
            <input
              className={`form-input${errors[key] ? " has-error" : ""}`}
              type={type || "text"}
              placeholder={placeholder}
              value={val}
              onChange={(e) => {
                set(e.target.value)
                if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
              }}
            />
          </div>
        ))}

        {/* Image upload */}
        <div className="form-field">
          <div className="form-label">
            <span>Photo</span>
            {errors.image && <span className="err-msg">{errors.image}</span>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {imagePreview ? (
            <div className="image-preview-wrap">
              <img src={imagePreview} alt="Preview" />
              <button className="image-remove" onClick={handleRemoveImage}>✕</button>
              {imageUrl && !uploading && <span className="image-ok">✓ Uploaded</span>}
              {uploading && <span className="image-ok" style={{ color: "#8a7340", borderColor: "rgba(138,115,64,.3)" }}>Envoi...</span>}
            </div>
          ) : (
            <div
              className={`upload-zone${errors.image ? " has-error" : ""}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="upload-loading">Envoi en cours...</div>
              ) : (
                <>
                  <div className="upload-icon">↑</div>
                  <div className="upload-text">Cliquer pour ajouter</div>
                  <div className="upload-sub">JPG, PNG, WEBP — max 5MB</div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="form-divider" />

        <button
          className={`btn-submit${success ? " submitted" : ""}`}
          onClick={handleAdd}
          disabled={uploading}
        >
          {success ? "✓ Montre ajoutée" : uploading ? "Envoi en cours..." : "Ajouter à la collection"}
        </button>

        {success && <div className="success-msg">Ajoutée avec succès</div>}
      </div>
    </>
  )
}
