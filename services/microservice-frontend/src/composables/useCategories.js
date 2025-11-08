import { ref } from 'vue'

// Composable para manejar categorías desde la API
export function useCategories() {
  // Estado reactivo donde se almacenan las categorías
  const categories = ref([])
  // Indica si se está cargando información
  const loading = ref(false)
  // Almacena mensajes de error si ocurre un fallo en la API
  const error = ref(null)

  // Endpoint de la API para obtener categorías
  const API_URL = 'https://entertainflix.azure-api.net/categories'

  // Cargar todas las categorías (usa cache en memoria si ya se cargaron)
  async function loadAll({ force = false } = {}) {
    // Si ya hay categorías cargadas y no se fuerza recarga → retornar las actuales
    if (categories.value.length && !force) return categories.value

    loading.value = true
    error.value = null
    try {
      // Headers de la petición (con API KEY si existe en .env)
      const headers = { 'Content-Type': 'application/json' }
      const apiKey = import.meta.env.VITE_API_KEY
      if (apiKey) {
        headers['Ocp-Apim-Subscription-Key'] = apiKey
      }

      // Llamada a la API (GET)
      const res = await fetch(API_URL, { headers })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} - ${text || res.statusText}`)
      }

      // Guardar categorías obtenidas (asegurar formato de arreglo)
      const data = await res.json()
      categories.value = Array.isArray(data) ? data : (data.data || [])
      
      return categories.value
    } catch (err) {
      // Manejo de errores
      console.error('Error cargando categorías:', err)
      error.value = err.message || String(err)
      categories.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Buscar categoría por ID
  function getById(id) {
    return categories.value.find(c => String(c.id) === String(id)) || null
  }

  // Retornar estados y funciones para usarlos en componentes
  return {
    categories,
    loading,
    error,
    loadAll,
    getById
  }
}
