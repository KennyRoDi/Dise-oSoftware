import { ref } from 'vue'

export function useServices() {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  // En dev con vite proxy puedes usar '/api/services' ; en prod puedes usar la URL completa
  const API_URL = 'https://entertainflix.azure-api.net/services'

  async function loadAll({ force = false } = {}) {
    if (services.value.length && !force) return services.value
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
      services.value = Array.isArray(data) ? data : (data.data || [])
      return services.value
    } catch (err) {
      console.error('Error cargando services:', err)
      error.value = err.message || String(err)
      services.value = []
      return []
    } finally {
      loading.value = false
    }
  }
  
  function getById(id) {
    return services.value.find(s => String(s.id) === String(id)) || null
  }

  return { services, loading, error, loadAll, getById }
}
