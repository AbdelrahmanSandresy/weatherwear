import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import * as outfitsService from '../services/outfitsService'

const OutfitsContext = createContext(null)

function fromRow(row) {
  return {
    id: row.id,
    name: row.outfit_name,
    category: row.category || null,
    weatherCondition: row.weather_condition,
    tempRange: row.temp_range,
    description: row.description,
    imageUrl: row.image_url,
    worn: row.worn,
    wornAt: row.worn_at,
    createdAt: row.created_at,
    userId: row.user_id,
  }
}

function toRow(outfit) {
  return {
    outfit_name: outfit.name,
    category: outfit.category || null,
    weather_condition: outfit.weatherCondition,
    temp_range: outfit.tempRange || null,
    description: outfit.description || '',
    image_url: outfit.imageUrl || null,
    worn: outfit.worn ?? false,
    worn_at: outfit.worn ? new Date().toISOString() : null,
  }
}

export function OutfitsProvider({ children }) {
  const { user } = useAuth()
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOutfits = useCallback(async () => {
    if (!user) { setOutfits([]); setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const data = await outfitsService.fetchOutfits(user.id)
      setOutfits(data.map(fromRow))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchOutfits() }, [fetchOutfits])

  async function addOutfit(outfitData, imageFile) {
    let imageUrl = null
    if (imageFile) {
      const result = await outfitsService.uploadImage(user.id, imageFile)
      imageUrl = result.publicUrl
    }
    try {
      const row = { ...toRow({ ...outfitData, imageUrl }), user_id: user.id }
      const data = await outfitsService.createOutfit(row)
      const newOutfit = fromRow(data)
      setOutfits(prev => [newOutfit, ...prev])
      return newOutfit
    } catch (err) {
      if (imageUrl) outfitsService.deleteImage(imageUrl).catch(() => {})
      throw err
    }
  }

  async function updateOutfit(id, updates, imageFile) {
    const current = outfits.find(o => o.id === id)
    let imageUrl = updates.imageUrl !== undefined ? updates.imageUrl : current?.imageUrl
    if (imageFile) {
      const result = await outfitsService.uploadImage(user.id, imageFile)
      imageUrl = result.publicUrl
      if (current?.imageUrl) {
        outfitsService.deleteImage(current.imageUrl).catch(() => {})
      }
    }
    const merged = { ...current, ...updates, imageUrl }
    const row = toRow(merged)
    if (updates.worn !== undefined) {
      row.worn_at = updates.worn ? new Date().toISOString() : null
    }
    const data = await outfitsService.updateOutfit(id, row)
    setOutfits(prev => prev.map(o => o.id === id ? fromRow(data) : o))
  }

  async function deleteOutfit(id) {
    const outfit = outfits.find(o => o.id === id)
    await outfitsService.deleteOutfit(id)
    if (outfit?.imageUrl) {
      outfitsService.deleteImage(outfit.imageUrl).catch(() => {})
    }
    setOutfits(prev => prev.filter(o => o.id !== id))
  }

  return (
    <OutfitsContext.Provider value={{ outfits, loading, error, addOutfit, updateOutfit, deleteOutfit }}>
      {children}
    </OutfitsContext.Provider>
  )
}

export function useOutfits() {
  return useContext(OutfitsContext)
}
