import { useState } from 'react'
import NavBar from '../components/NavBar'
import AddOutfitModal from '../components/AddOutfitModal'
import ViewOutfitModal from '../components/ViewOutfitModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { useOutfits } from '../contexts/OutfitsContext'
import './ClosetPage.css'

const CONDITION_ICONS = {
  Sunny: '☀️', Cloudy: '☁️', Rainy: '🌧️', Cold: '🥶', Windy: '💨', Snowy: '❄️',
}

export default function ClosetPage() {
  const { outfits, loading, error, deleteOutfit } = useOutfits()
  const [search, setSearch] = useState('')
  const [selectedOutfit, setSelectedOutfit] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = outfits
    .filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  function handleTrashClick(e, outfit) {
    e.stopPropagation()
    setConfirmDelete(outfit)
  }

  function handleConfirmDelete() {
    deleteOutfit(confirmDelete.id)
    setConfirmDelete(null)
  }

  return (
    <div className="page">
      <NavBar />
      <main className="closet-main">
        <div className="closet-header">
          <h1 className="closet-title">My Outfits</h1>
          <div className="closet-header-right">
            <input
              className="search-input"
              type="text"
              placeholder="Search outfits..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="closet-add-btn" onClick={() => setShowAddModal(true)}>
              + Add outfit
            </button>
          </div>
        </div>

        <p className="closet-subtitle">Your outfits, sorted by date added:</p>

        {loading ? (
          <div className="closet-empty">Loading your outfits...</div>
        ) : error ? (
          <div className="closet-empty">Could not load outfits. Please refresh.</div>
        ) : filtered.length === 0 ? (
          <div className="closet-empty">
            {search ? 'No outfits match your search.' : 'No outfits yet — add one from the Home page!'}
          </div>
        ) : (
          <ul className="outfit-list">
            {filtered.map(outfit => (
              <li
                key={outfit.id}
                className="outfit-row"
                onClick={() => setSelectedOutfit(outfit)}
              >
                <div className="outfit-row-left">
                  <span className="outfit-condition-icon">
                    {CONDITION_ICONS[outfit.weatherCondition] || '👕'}
                  </span>
                  <div className="outfit-info">
                    <span className="outfit-name">{outfit.name}</span>
                    <span className="outfit-meta">
                      {outfit.weatherCondition && `${outfit.weatherCondition} · `}
                      {outfit.tempRange && `${outfit.tempRange} · `}
                      {new Date(outfit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="outfit-row-right">
                  {outfit.worn && <span className="worn-badge">Worn ✓</span>}
                  <button
                    className="trash-btn"
                    onClick={e => handleTrashClick(e, outfit)}
                    aria-label="Delete outfit"
                  >
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {showAddModal && <AddOutfitModal onClose={() => setShowAddModal(false)} />}

      {selectedOutfit && (
        <ViewOutfitModal
          outfit={selectedOutfit}
          onClose={() => setSelectedOutfit(null)}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          message={`Delete "${confirmDelete.name}"? This cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  )
}
