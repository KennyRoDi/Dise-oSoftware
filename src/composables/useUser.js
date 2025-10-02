import { ref } from 'vue'

export function useUsers() {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  const API_URL_GET = 'https://entertainflix.azure-api.net/users'
  const API_URL_POST = 'https://entertainflix.azure-api.net/puser'
  const LOCAL_STORAGE_KEY = 'myUsersData'

  async function loadAll({ force = false } = {}) {
    // Leemos de localStorage primero para mantener los usuarios registrados
    const localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (localData && !force) {
      users.value = localData
      return users.value
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
      users.value = Array.isArray(data) ? data : (data.data || [])
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users.value))
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

  // --- FUNCIÓN PARA REGISTRAR USUARIOS (POST SIMULADO) ---
  async function registerUser(newUserData) {
    loading.value = true
    error.value = null
    try {
      // 1. Validar que el correo no exista ya
      await loadAll()
      const userExists = users.value.find(u => u.correo.toLowerCase() === newUserData.correo.toLowerCase())
      if (userExists) {
        throw new Error('El correo electrónico ya está registrado.')
      }

      // 2. Llamada a la API de simulación (esta API devuelve el objeto con un ID)
      const res = await fetch(API_URL_POST, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': import.meta.env.VITE_API_KEY 
        },
        body: JSON.stringify(newUserData)
      })
      if (res.status !== 201 && res.status !== 200) { // Aceptamos 201 Created o 200 OK
        const errorBody = await res.text();
        throw new Error(`La API no confirmó el registro: ${res.statusText} - ${errorBody}`)
      }
      
      const createdUserApi = await res.json()

      // 3. Añadimos el nuevo usuario a nuestra lista local y guardamos en localStorage
      // Usamos los datos del formulario y el ID que nos dio la API simulada.
      const newUser = {
        ...newUserData,
        id: createdUserApi.id 
      }
      users.value.push(newUser)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users.value))
      
      return newUser
    } catch (err) {
      console.error('Error al registrar usuario:', err)
      error.value = err.message || String(err)
      throw err // Re-lanzamos el error para que el componente lo capture
    } finally {
      loading.value = false
    }
  }
  
  function getById(id) {
    return users.value.find(u => String(u.id) === String(id)) || null
  }
  
  return { users, loading, error, loadAll, getById, registerUser }
}