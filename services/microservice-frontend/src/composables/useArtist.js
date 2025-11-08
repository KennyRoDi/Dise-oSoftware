import { ref } from 'vue'

export function useProfiles() {
  const profiles = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Endpoint artist (perfiles)
  const API_URL = 'https://entertainflix.azure-api.net/artist'

  async function loadAll({ force = false } = {}) {
    if (profiles.value.length && !force) return profiles.value
    loading.value = true
    error.value = null
    try {
      const headers = { 'Content-Type': 'application/json' }
      const apiKey = import.meta.env.VITE_API_KEY
      if (apiKey) headers['Ocp-Apim-Subscription-Key'] = apiKey

      const res = await fetch(API_URL, { headers })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} - ${text || res.statusText}`)
      }

      const data = await res.json()
      profiles.value = Array.isArray(data) ? data : (data.data || [])
      return profiles.value
    } catch (err) {
      console.error('Error cargando profiles:', err)
      error.value = err.message || String(err)
      profiles.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  function getById(id) {
    return profiles.value.find(p => String(p.id) === String(id)) || null
  }

  return { profiles, loading, error, loadAll, getById }
}
