import { ref } from 'vue'

// Composable para manejar los servicios desde la API y el localStorage
export function useServices() {
  // Estado reactivo donde se guardan los servicios cargados
  const services = ref([])
  // Indica si una operación (GET, POST, DELETE) está en proceso
  const loading = ref(false)
  // Guarda el mensaje de error en caso de fallos con la API
  const error = ref(null)

  // Rutas de la API
  const API_URL_GET = 'https://entertainflix.azure-api.net/services'   // Obtener todos los servicios
  const API_URL_POST = 'https://entertainflix.azure-api.net/pservice'  // Crear nuevo paquete
  const API_URL_DELETE = 'https://entertainflix.azure-api.net'         // Eliminar paquete/servicio
  const LOCAL_STORAGE_KEY = 'myServicesData'                           // Clave para cachear datos en localStorage

  // Cargar todos los servicios (con cache en localStorage)
  async function loadAll({ force = false } = {}) {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (localData && !force) {
      // Si hay datos en cache y no se fuerza la recarga → usar localStorage
      services.value = localData
      return services.value
    }
    
    loading.value = true
    error.value = null
    try {
      // Configurar headers (incluyendo API KEY si existe en .env)
      const headers = { 'Content-Type': 'application/json' }
      const apiKey = import.meta.env.VITE_API_KEY
      if (apiKey) headers['Ocp-Apim-Subscription-Key'] = apiKey

      // Petición GET a la API
      const res = await fetch(API_URL_GET, { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
      
      // Guardar datos en el estado y cachearlos en localStorage
      const data = await res.json()
      services.value = Array.isArray(data) ? data : (data.data || [])
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services.value))

      return services.value
    } catch (err) {
      // Manejo de error
      console.error('Error cargando services:', err)
      error.value = err.message || String(err)
      services.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Añadir un paquete a un servicio existente
  async function addPackage(serviceId, newPackageData) {
    loading.value = true
    error.value = null
    try {
      // Petición POST a la API
      const res = await fetch(API_URL_POST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackageData)
      })
      if (res.status !== 201) throw new Error(`La API no confirmó la creación: ${res.statusText}`)
      
      // Buscar el servicio al que se le añadirá el paquete
      const serviceIndex = services.value.findIndex(s => s.id === serviceId)
      if (serviceIndex === -1) throw new Error('Servicio no encontrado para añadir el paquete.')

      // Crear array de paquetes si no existe y agregar el nuevo paquete
      if (!services.value[serviceIndex].paquetes) {
        services.value[serviceIndex].paquetes = []
      }
      services.value[serviceIndex].paquetes.push(newPackageData)

      // Actualizar cache en localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services.value))
      return true
    } catch (err) {
      console.error('Error al añadir paquete:', err)
      error.value = err.message || String(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Eliminar un paquete de un servicio
  async function deletePackage(serviceId, packageIndex) {
    loading.value = true
    error.value = null
    try {
      // Petición DELETE a la API
      const res = await fetch(`${API_URL_DELETE}/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.status !== 204) throw new Error(`La API no confirmó la eliminación: ${res.statusText}`)

      // Buscar servicio y eliminar el paquete de la lista
      const serviceIndex = services.value.findIndex(s => s.id === serviceId)
      if (serviceIndex === -1) throw new Error('Servicio no encontrado para eliminar el paquete.')

      services.value[serviceIndex].paquetes.splice(packageIndex, 1)

      // Actualizar cache en localStorage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services.value))
      return true 
    } catch (err) {
      console.error('Error al eliminar paquete:', err)
      error.value = err.message || String(err)
      throw err 
    } finally {
      loading.value = false
    }
  }
  
  // Buscar un servicio por su ID
  function getById(id) {
    return services.value.find(s => String(s.id) === String(id)) || null
  }

  // Retornar funciones y estados para usarlos en los componentes
  return { services, loading, error, loadAll, getById, addPackage, deletePackage }
}
