import { ref } from 'vue'

// Composable para manejar usuarios desde la API simulada y localStorage
export function useUsers() {
  // Estado reactivo donde se almacenan los usuarios
  const users = ref([])
  // Indica si se está realizando una petición
  const loading = ref(false)
  // Almacena mensajes de error si ocurre un fallo en la API
  const error = ref(null)

  // Rutas de la API
  const API_URL_GET = 'https://entertainflix.azure-api.net/users'   // Obtener todos los usuarios
  const API_URL_POST = 'https://entertainflix.azure-api.net/puser'  // Registrar un nuevo usuario
  const LOCAL_STORAGE_KEY = 'myUsersData'                           // Clave para cachear datos en localStorage

  // Cargar todos los usuarios (intenta primero desde localStorage)
  async function loadAll({ force = false } = {}) {
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (localData && !force) {
      // Si hay datos en cache y no se fuerza la recarga → usar localStorage
      users.value = localData
      return users.value
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
      
      // Guardar usuarios recibidos y almacenarlos en cache
      const data = await res.json()
      users.value = Array.isArray(data) ? data : (data.data || [])
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users.value))

      return users.value
    } catch (err) {
      // Manejo de errores
      console.error('Error cargando users:', err)
      error.value = err.message || String(err)
      users.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  // Registrar un nuevo usuario
  async function registerUser(newUserData) {
    loading.value = true
    error.value = null
    try {
      // Primero cargar lista actual de usuarios (para validar duplicados)
      await loadAll()
      const userExists = users.value.find(u => u.correo.toLowerCase() === newUserData.correo.toLowerCase())
      if (userExists) {
        throw new Error('El correo electrónico ya está registrado.')
      }

      // Petición POST a la API para crear el usuario
      const res = await fetch(API_URL_POST, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': import.meta.env.VITE_API_KEY 
        },
        body: JSON.stringify(newUserData)
      })

      // Validar respuesta: debe ser 201 (Created) o 200 (OK)
      if (res.status !== 201 && res.status !== 200) { 
        const errorBody = await res.text();
        throw new Error(`La API no confirmó el registro: ${res.statusText} - ${errorBody}`)
      }
      
      // Tomar el usuario creado desde la API y asignarle un ID
      const createdUserApi = await res.json()
      const newUser = {
        ...newUserData,
        id: createdUserApi.id 
      }

      // Guardar usuario en memoria y cache local
      users.value.push(newUser)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users.value))
      
      return newUser
    } catch (err) {
      console.error('Error al registrar usuario:', err)
      error.value = err.message || String(err)
      throw err 
    } finally {
      loading.value = false
    }
  }
  
  // Obtener usuario por ID
  function getById(id) {
    return users.value.find(u => String(u.id) === String(id)) || null
  }
  
  // Retornar funciones y estados para usarlos en los componentes
  return { users, loading, error, loadAll, getById, registerUser }
}
