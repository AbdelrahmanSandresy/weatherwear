import { useState } from 'react'
import NavBar from '../components/NavBar'
import AddOutfitModal from '../components/AddOutfitModal'
import useWeather from '../hooks/useWeather'
import { useOutfits } from '../contexts/OutfitsContext'
import './HomePage.css'

const CONDITION_ICONS = {
  Sunny: '☀️', Cloudy: '☁️', Rainy: '🌧️', Cold: '🥶', Windy: '💨', Snowy: '❄️',
}

function parseTempRange(tempRange) {
  if (!tempRange) return null
  const m = tempRange.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (!m) return null
  return { min: parseInt(m[1]), max: parseInt(m[2]) }
}

function scoreOutfit(outfit, condition, tempF) {
  const isRainy = condition === 'Rainy'
  const conditionPoints = isRainy ? 2 : 1
  const tempPoints = isRainy ? 1 : 2
  let s = 0
  if (outfit.weatherCondition === condition) s += conditionPoints
  if (tempF != null) {
    const range = parseTempRange(outfit.tempRange)
    if (range && tempF >= range.min && tempF <= range.max) s += tempPoints
  }
  return s
}

function pickBest(pool, condition, tempF) {
  if (!pool.length) return null
  const scored = pool
    .map(o => ({ outfit: o, score: scoreOutfit(o, condition, tempF) }))
    .sort((a, b) => b.score - a.score)
  const best = scored[0]
  return { outfit: best.outfit, exact: best.score >= 2 }
}

function pickPair(outfits, condition, tempF) {
  return {
    top: pickBest(outfits.filter(o => o.category === 'Top'), condition, tempF),
    bottom: pickBest(outfits.filter(o => o.category === 'Bottom'), condition, tempF),
  }
}

function ImageLightbox({ outfit, onClose }) {
  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>✕</button>
        {outfit.imageUrl
          ? <img src={outfit.imageUrl} alt={outfit.name} className="lightbox-img" />
          : <div className="lightbox-no-img">No photo added</div>
        }
        <div className="lightbox-info">
          <span className="lightbox-name">{outfit.name}</span>
          {outfit.description && <span className="lightbox-desc">{outfit.description}</span>}
          {outfit.weatherCondition && (
            <span className="lightbox-tag">
              {CONDITION_ICONS[outfit.weatherCondition]} {outfit.weatherCondition}
              {outfit.tempRange ? ` · ${outfit.tempRange}` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [lightboxOutfit, setLightboxOutfit] = useState(null)
  const { weather, error: weatherError, loading: weatherLoading } = useWeather()
  const { outfits } = useOutfits()

  const pair = weather ? pickPair(outfits, weather.condition, weather.tempF) : { top: null, bottom: null }
  const hasPair = pair.top || pair.bottom
  const hasTaggedOutfits = outfits.some(o => o.category === 'Top' || o.category === 'Bottom')

  return (
    <div className="page">
      <NavBar />
      <main className="home-main">

        <div className="weather-block">
          {weatherLoading && (
            <div className="weather-location">Detecting location...</div>
          )}
          {weatherError && (
            <div className="weather-desc">{weatherError}</div>
          )}
          {weather && (
            <>
              <div className="weather-location">
                {CONDITION_ICONS[weather.condition]} {weather.city} &bull; {weather.tempF}°F
              </div>
              <div className="weather-desc">
                {weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
                {' · '}Feels like {weather.feelsLike}°F · Wind {weather.windSpeed} mph
              </div>
            </>
          )}
        </div>

        <div className="outfit-suggestion">
          <div className="suggestion-label">Today's outfit suggestion</div>
          {!weather && !weatherError && (
            <div className="suggestion-text suggestion-muted">Loading weather...</div>
          )}
          {weatherError && (
            <div className="suggestion-text suggestion-muted">Enable location for outfit suggestions</div>
          )}
          {weather && !hasPair && (
            <div className="suggestion-text suggestion-muted">
              {outfits.length === 0 || !hasTaggedOutfits
                ? 'Tag your outfits as Top or Bottom to get pair suggestions'
                : 'Add outfits to your wardrobe to get suggestions'}
            </div>
          )}
          {weather && hasPair && (
            <div className="suggestion-pair">
              {['top', 'bottom'].map(slot => {
                const entry = pair[slot]
                const outfit = entry?.outfit
                return (
                  <div
                    key={slot}
                    className={`suggestion-slot ${outfit ? 'suggestion-slot-filled' : 'suggestion-slot-empty'}`}
                    onClick={outfit ? () => setLightboxOutfit(outfit) : undefined}
                  >
                    <div className="suggestion-slot-label">{slot.toUpperCase()}</div>
                    {outfit ? (
                      <>
                        {outfit.imageUrl
                          ? <img src={outfit.imageUrl} alt={outfit.name} className="suggestion-slot-img" />
                          : <div className="suggestion-slot-noimg">👕</div>
                        }
                        <div className="suggestion-slot-name">{outfit.name}</div>
                        {!entry.exact && (
                          <div className="suggestion-slot-fallback">best available</div>
                        )}
                      </>
                    ) : (
                      <div className="suggestion-slot-missing">None tagged</div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <section className="home-about">
          <h1 className="home-title">Your Smart Wardrobe Assistant</h1>
          <p>
            Weatherwear takes the guesswork out of getting dressed. Instead of checking the
            forecast and scrambling through your closet, we turn real-time weather conditions
            into personalized outfit recommendations drawn directly from clothes you already own.
          </p>
          <p>
            Whether it's a brisk autumn morning or a scorching summer afternoon, Weatherwear
            reads the temperature, wind, and precipitation so you don't have to. No more
            overdressing on a warm day or showing up underprepared for a cold snap.
          </p>
          <p>
            Build your closet, tag your outfits by condition, and let Weatherwear do the rest.
            Spend less time deciding and more time living.
          </p>
        </section>

        <button className="add-outfit-btn" onClick={() => setShowAddModal(true)}>
          + Add outfit to wardrobe
        </button>
      </main>

      {showAddModal && <AddOutfitModal onClose={() => setShowAddModal(false)} />}
      {lightboxOutfit && <ImageLightbox outfit={lightboxOutfit} onClose={() => setLightboxOutfit(null)} />}
    </div>
  )
}
