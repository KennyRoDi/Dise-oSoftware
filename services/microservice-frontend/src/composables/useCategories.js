import { ref } from 'vue'

export function useCategories() {
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)

  // URL del endpoint
  const API_URL = 'https://entertainflix.azure-api.net/categories'

  async function loadAll({ force = false } = {}) {
    // Si ya cargamos y no forzamos, devolvemos
    if (categories.value.length && !force) return categories.value

    loading.value = true
    error.value = null
    try {
      const headers = {
        'Content-Type': 'application/json'
      }

      // si tu API requiere clave, usa la variable de entorno VITE_API_KEY
      // y el nombre del header apropiado (ej: 'Ocp-Apim-Subscription-Key' o 'x-api-key')
      const apiKey = import.meta.env.VITE_API_KEY
      if (apiKey) {
        // Ajusta el nombre del header según tu configuración de Azure API Management
        headers['Ocp-Apim-Subscription-Key'] = apiKey
        // o: headers['x-api-key'] = apiKey
      }

      const res = await fetch(API_URL, { headers })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} - ${text || res.statusText}`)
      }

      const data = await res.json()

      // Dices que la API devuelve la misma estructura que el JSON,
      // así que asignamos directamente.
      categories.value = Array.isArray(data) ? data : (data.data || [])
      return categories.value
    } catch (err) {
      console.error('Error cargando categorías:', err)
      error.value = err.message || String(err)
      categories.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  function getById(id) {
    return categories.value.find(c => String(c.id) === String(id)) || null
  }

  return {
    categories,
    loading,
    error,
    loadAll,
    getById
  }
}
