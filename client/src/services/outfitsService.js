import { apiClient, storageClient } from '../lib/axiosClient'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const BUCKET = 'outfit-images'

export async function fetchOutfits(userId) {
  const res = await apiClient.get('/outfits', {
    params: {
      user_id: `eq.${userId}`,
      order: 'created_at.desc',
    },
  })
  return res.data
}

export async function createOutfit(row) {
  const res = await apiClient.post('/outfits', row, {
    headers: { Prefer: 'return=representation' },
  })
  return res.data[0]
}

export async function updateOutfit(id, updates) {
  const res = await apiClient.patch('/outfits', updates, {
    params: { id: `eq.${id}` },
    headers: { Prefer: 'return=representation' },
  })
  return res.data[0]
}

export async function deleteOutfit(id) {
  await apiClient.delete('/outfits', {
    params: { id: `eq.${id}` },
  })
}

export async function uploadImage(userId, file) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  await storageClient.post(`/object/${BUCKET}/${path}`, file, {
    headers: { 'Content-Type': file.type },
  })
  return { path, publicUrl: getPublicImageUrl(path) }
}

export async function deleteImage(imageUrl) {
  const marker = `/object/public/${BUCKET}/`
  const idx = imageUrl.indexOf(marker)
  if (idx === -1) return
  const path = decodeURIComponent(imageUrl.slice(idx + marker.length))
  await storageClient.delete(`/object/${BUCKET}`, {
    data: { prefixes: [path] },
  })
}

export function getPublicImageUrl(path) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}
