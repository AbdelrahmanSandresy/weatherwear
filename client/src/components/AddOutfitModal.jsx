import { useState, useEffect } from 'react'
import { useOutfits } from '../contexts/OutfitsContext'
import './Modal.css'

const WEATHER_CONDITIONS = ['Sunny', 'Cloudy', 'Rainy', 'Cold', 'Windy', 'Snowy']
const OUTFIT_TYPES = ['Top', 'Bottom', 'Full Outfit']
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMAGE_MB = 5

export default function AddOutfitModal({ onClose }) {
  const { addOutfit } = useOutfits()
  const [form, setForm] = useState({
    name: '',
    category: '',
    weatherCondition: '',
    tempRange: '',
    description: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Outfit name is required'
    if (!form.weatherCondition) e.weatherCondition = 'Select a weather condition'
    return e
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSaveError('Only JPEG, PNG, GIF, and WebP images are allowed.')
      return
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setSaveError(`Image must be under ${MAX_IMAGE_MB}MB.`)
      return
    }
    setSaveError(null)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    setSaveError(null)
    try {
      await addOutfit(form, imageFile)
      onClose()
    } catch (err) {
      setSaveError(err.message || 'Failed to save outfit. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Outfit</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Photo</label>
            <div
              className="image-upload-area"
              onClick={() => document.getElementById('add-outfit-image').click()}
            >
              {imagePreview
                ? <img src={imagePreview} alt="Preview" className="image-preview" onError={() => setImagePreview(null)} />
                : <span className="image-upload-placeholder">Tap to add photo</span>
              }
            </div>
            <input
              id="add-outfit-image"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <div className="chip-group">
              {OUTFIT_TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`chip ${form.category === t ? 'chip-active' : ''}`}
                  onClick={() => set('category', t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Outfit Name</label>
            <input
              type="text"
              placeholder="e.g. Summer Casual"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Weather Condition</label>
            <div className="chip-group">
              {WEATHER_CONDITIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`chip ${form.weatherCondition === c ? 'chip-active' : ''}`}
                  onClick={() => set('weatherCondition', c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {errors.weatherCondition && <span className="field-error">{errors.weatherCondition}</span>}
          </div>

          <div className="form-group">
            <label>Temp Range</label>
            <input
              type="text"
              placeholder="e.g. 60–75°F"
              value={form.tempRange}
              onChange={e => set('tempRange', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="e.g. Light jacket, jeans, sneakers"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="modal-footer">
          {saveError && <p className="save-error">{saveError}</p>}
          <div className="modal-footer-actions">
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'SAVE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
