import { ref } from 'vue'

export function useUsers() {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const API_URL = 'https://entertainflix.azure-api.net/users'

  async function loadAll({ force = false } = {}) {
    if (users.value.length && !force) return users.value
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
      users.value = Array.isArray(data) ? data : (data.data || [])
      return users.value
    } catch (err) {
      console.error('Error cargando users:', err)
      error.value = err.message || String(err)
      users.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  function getById(id) {
    return users.value.find(u => String(u.id) === String(id)) || null
  }

  return { users, loading, error, loadAll, getById }
}
