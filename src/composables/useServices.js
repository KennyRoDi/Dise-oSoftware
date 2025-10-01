import { ref } from 'vue'

export function useServices() {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  const API_URL_GET = 'https://entertainflix.azure-api.net/services'
  const API_URL_POST = 'https://entertainflix.azure-api.net/pservice'
  // 1. Añadimos la URL base para el DELETE
  const API_URL_DELETE = 'https://entertainflix.azure-api.net' 
  const LOCAL_STORAGE_KEY = 'myServicesData'

  async function loadAll({ force = false } = {}) {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (localData && !force) {
      services.value = localData
      return services.value
    }
    
    loading.value = true
    error.value = null
    try {
      const headers = { 'Content-Type': 'application/json' }
      const apiKey = import.meta.env.VITE_API_KEY
      if (apiKey) headers['Ocp-Apim-Subscription-Key'] = apiKey

      const res = await fetch(API_URL_GET, { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`)
      
      const data = await res.json()
      services.value = Array.isArray(data) ? data : (data.data || [])
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services.value))
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

  async function addPackage(serviceId, newPackageData) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(API_URL_POST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackageData)
      })
      if (res.status !== 201) throw new Error(`La API no confirmó la creación: ${res.statusText}`)
      
      const serviceIndex = services.value.findIndex(s => s.id === serviceId)
      if (serviceIndex === -1) throw new Error('Servicio no encontrado para añadir el paquete.')

      if (!services.value[serviceIndex].paquetes) {
        services.value[serviceIndex].paquetes = []
      }
      services.value[serviceIndex].paquetes.push(newPackageData)

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

  // 2. --- NUEVA FUNCIÓN PARA ELIMINAR PAQUETES ---
  async function deletePackage(serviceId, packageIndex) {
    loading.value = true
    error.value = null
    try {
      // Paso A: Llamada a la API de simulación.
      const res = await fetch(`${API_URL_DELETE}/${serviceId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      // Una respuesta 204 (No Content) es un éxito para DELETE.
      if (res.status !== 204) throw new Error(`La API no confirmó la eliminación: ${res.statusText}`)

      const serviceIndex = services.value.findIndex(s => s.id === serviceId)
      if (serviceIndex === -1) throw new Error('Servicio no encontrado para eliminar el paquete.')

      services.value[serviceIndex].paquetes.splice(packageIndex, 1)

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services.value))

      return true // Éxito
    } catch (err) {
      console.error('Error al eliminar paquete:', err)
      error.value = err.message || String(err)
      throw err // Relanzamos el error para que el componente lo maneje.
    } finally {
      loading.value = false
    }
  }
  
  function getById(id) {
    return services.value.find(s => String(s.id) === String(id)) || null
  }

  // 3. Exportamos la nueva función 'deletePackage'
  return { services, loading, error, loadAll, getById, addPackage, deletePackage }
}