import { ref } from 'vue'

// Composable para manejar perfiles de artistas desde la API
export function useProfiles() {
  // Estado reactivo para almacenar la lista de perfiles de artistas
  const profiles = ref([])
  // Indica si la petición a la API está en curso
  const loading = ref(false)
  // Almacena un mensaje de error si la petición falla
  const error = ref(null)

  // Endpoint de la API para los perfiles de artistas
  const API_URL = 'https://entertainflix.azure-api.net/artist'

  // Carga todos los perfiles, usando una caché simple en memoria
  async function loadAll({ force = false } = {}) {
    // Si los perfiles ya existen y no se fuerza la recarga, devuelve los datos actuales
    if (profiles.value.length && !force) return profiles.value
    
    // Inicia el estado de carga y limpia errores previos
    loading.value = true
    error.value = null
    try {
      // Configuración de las cabeceras para la petición
      const headers = { 'Content-Type': 'application/json' }
      // Incluye la API Key si está disponible en las variables de entorno (.env)
      const apiKey = import.meta.env.VITE_API_KEY
      if (apiKey) headers['Ocp-Apim-Subscription-Key'] = apiKey

      // Ejecuta la llamada a la API usando fetch
      const res = await fetch(API_URL, { headers })
      // Si la respuesta no es exitosa (ej. error 404, 500), lanza un error
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`HTTP ${res.status} - ${text || res.statusText}`)
      }

      // Asigna los datos al estado, asegurando que sea un arreglo, y los devuelve
      const data = await res.json()
      profiles.value = Array.isArray(data) ? data : (data.data || [])
      return profiles.value
    } catch (err) {
      // En caso de un error en la petición, lo captura y actualiza el estado de error
      console.error('Error cargando profiles:', err)
      error.value = err.message || String(err)
      profiles.value = [] // Limpia los perfiles en caso de error
      return []
    } finally {
      // Se asegura de que el estado de carga siempre se desactive al finalizar
      loading.value = false
    }
  }

  // Busca un perfil específico por su ID en la lista ya cargada (no hace nueva petición)
  function getById(id) {
    return profiles.value.find(p => String(p.id) === String(id)) || null
  }

  // Expone el estado reactivo y las funciones para que puedan ser usados en los componentes
  return { profiles, loading, error, loadAll, getById }
}