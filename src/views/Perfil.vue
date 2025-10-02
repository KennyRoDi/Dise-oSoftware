<template>
  <div class="page font-sans min-h-screen flex flex-col">
    <Navbar />

    <div v-if="isLoading" class="flex-grow flex justify-center items-center">
      <p class="text-lg muted">Cargando perfil...</p>
    </div>
    <div v-else-if="error" class="flex-grow flex justify-center items-center text-red-500">
      <p>Error al cargar los datos: {{ error }}</p>
    </div>

    <main v-else class="flex-grow">
      <section class="px-4 py-12 max-w-4xl mx-auto">
        <div v-if="perfil" class="profile-card p-6 rounded shadow">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <img :src="`/assets/images/${perfil.imagen}`" alt="Foto" class="w-48 h-48 object-cover rounded-full" />
            <div>
              <h3 class="text-2xl font-bold strong-text">{{ perfil.usuario }}</h3>
              <p class="muted mt-2">{{ perfil.descripcion }}</p>
              <p class="meta-text text-sm mt-2">{{ perfil.categoria }} - {{ perfil.ubicacion }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center muted mt-10">
          No se encontró ningún perfil con ese nombre.
        </div>
      </section>

      <section v-if="servicioAsociadoAlPerfil" class="px-4 py-12 max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold strong-text">Paquetes de {{ servicioAsociadoAlPerfil.titulo }}</h2>
          <button @click="abrirModalParaCrear" class="btn-accept">+ Añadir Paquete</button>
        </div>
        <div v-if="servicioAsociadoAlPerfil.paquetes && servicioAsociadoAlPerfil.paquetes.length > 0" class="grid md:grid-cols-3 gap-6">
          <div
            v-for="(paq, index) in servicioAsociadoAlPerfil.paquetes"
            :key="index"
            class="card p-4 rounded shadow flex flex-col"
          >
            <img
              :src="`/assets/images/${servicioAsociadoAlPerfil.imagenes[index % servicioAsociadoAlPerfil.imagenes.length]}`"
              class="rounded mb-2 w-full h-40 object-cover"
              alt="Imagen del paquete"
            />
            <div class="flex-1">
              <h3 class="font-semibold strong-text">{{ paq.nombre }}</h3>
              <p class="text-sm muted mt-1">{{ paq.descripcion }}</p>
              <p class="font-bold mt-1 strong-text">$ {{ paq.precio }}</p>
            </div>
            <div class="flex gap-2 mt-4 pt-3 border-t">
              <button @click="abrirModalParaEditar(index)" class="btn-edit flex-1">Editar</button>
              <button @click="eliminarPaquete(index)" class="btn-reject flex-1">Eliminar</button>
            </div>
          </div>
        </div>
        <div v-else class="empty-card p-8 rounded-lg muted text-center">
          <p class="text-lg">📦 No hay paquetes para mostrar.</p>
          <p class="text-sm mt-2">¡Añade tu primer paquete para empezar!</p>
        </div>
      </section>

      <section v-if="servicioAsociadoAlPerfil && reseñasDelServicio.length > 0" class="px-4 py-12 max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold strong-text mb-6">Reseñas de {{ servicioAsociadoAlPerfil.titulo }}</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="(resena, index) in reseñasDelServicio" :key="index" class="card p-4 rounded shadow">
            <div class="flex items-center gap-3 mb-2">
              <img :src="`/assets/images/${resena.pfp}`" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <p class="font-semibold strong-text">{{ resena.titulo }}</p>
                <p class="text-sm muted">{{ resena.usuario }}</p>
              </div>
            </div>
            <p class="text-sm muted">{{ resena.comentario }}</p>
          </div>
        </div>
      </section>

      <section v-if="solicitudesGestionadas.length > 0 || servicioAsociadoAlPerfil" class="px-4 py-12 max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold strong-text">Todas las Solicitudes ({{ solicitudesGestionadas.length }})</h2>
          <button @click="restaurarDatos" class="btn-plain flex items-center gap-2" aria-label="Restaurar solicitudes">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.121a3 3 0 010 5.758V16a1 1 0 11-2 0v-6.121a3 3 0 010-5.758V3a1 1 0 011-1zm3 4a1 1 0 011 1v.707a3 3 0 014.586 0V7a1 1 0 112 0v.707a5 5 0 00-7.071 0V7a1 1 0 011-1z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M13 10a1 1 0 011-1h.707a3 3 0 014.586 0V10a1 1 0 112 0v.707a5 5 0 00-7.071 0V10a1 1 0 011-1z" clip-rule="evenodd" /></svg>
            Restaurar Solicitudes
          </button>
        </div>
        <div v-if="solicitudesGestionadas.length > 0" class="grid gap-6">
          <SolicitudCard
            v-for="solicitud in solicitudesGestionadas"
            :key="solicitud.id"
            :solicitud="solicitud"
            @accept="aceptarSolicitud"
            @reject="rechazarSolicitud"
          />
        </div>
        <div v-else class="empty-card p-8 rounded-lg muted text-center">
          <p class="text-lg">📭 No se han recibido solicitudes aún.</p>
          <p class="text-sm mt-2">Las nuevas solicitudes aparecerán aquí automáticamente.</p>
        </div>
      </section>
    </main>

    <Footer />

    <PackageModal
      v-if="mostrarModal"
      :paquete="paqueteEditable"
      :is-editing="editandoIndex !== null"
      @close="cerrarModal"
      @save="guardarPaquete"
    />
  </div>
</template>

Claro, aquí tienes el script de perfil.vue actualizado para que utilice la función deletePackage que acabamos de añadir al composable.

Los cambios principales son dos:

Se importa la función deletePackage desde useServices.

La función eliminarPaquete se modifica para que sea async y llame a deletePackage, en lugar de manipular localStorage directamente.

Script de perfil.vue (Actualizado con DELETE)
Fragmento de código

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import PackageModal from '@/components/PackageModal.vue'
import SolicitudCard from '@/components/SolicitudCard.vue'
import { useProfiles } from '@/composables/useArtist.js'
// 1. Importamos la nueva función 'deletePackage'
import { useServices } from '@/composables/useServices.js'
import comentariosData from '@/assets/json/comentarios.json'
import solicitudesData from '@/assets/json/solicitudes.json'

// --- ESTADO Y COMPOSABLES ---
const route = useRoute()
const { profiles, loadAll: loadAllProfiles, loading: loadingProfiles, error: errorProfiles } = useProfiles()
// 2. Obtenemos 'deletePackage' junto con las otras funciones del composable
const { services, loadAll: loadAllServices, loading: loadingServices, error: errorServices, addPackage, deletePackage } = useServices()

const perfil = ref(null)
const comentarios = ref(comentariosData)
const todasLasSolicitudes = ref([])

const isLoading = computed(() => loadingProfiles.value || loadingServices.value)
const error = computed(() => errorProfiles.value || errorServices.value)

// --- ESTADO PARA EL MODAL (sin cambios) ---
const mostrarModal = ref(false)
const paqueteEditable = ref({ nombre: '', descripcion: '', precio: null })
const editandoIndex = ref(null)

// --- PROPIEDADES COMPUTADAS (sin cambios en su lógica) ---
const servicioAsociadoAlPerfil = computed(() => {
  if (!perfil.value || !services.value) return null
  return services.value.find(s => s.titulo.toLowerCase() === perfil.value.usuario.toLowerCase()) || null
})

const reseñasDelServicio = computed(() => {
  if (!servicioAsociadoAlPerfil.value) return []
  return comentarios.value.filter(c => c.servicio.toLowerCase() === servicioAsociadoAlPerfil.value.titulo.toLowerCase())
})

const solicitudesGestionadas = computed(() => {
  if (!servicioAsociadoAlPerfil.value) return []
  return todasLasSolicitudes.value
    .filter(sol => sol.servicio.toLowerCase() === servicioAsociadoAlPerfil.value.titulo.toLowerCase())
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
})

// --- LÓGICA DE SOLICITUDES (sin cambios) ---
function actualizarEstadoSolicitud(solicitudId, nuevoEstado) {
  const solicitudIndex = todasLasSolicitudes.value.findIndex(s => s.id === solicitudId)
  if (solicitudIndex !== -1) {
    todasLasSolicitudes.value[solicitudIndex].estado = nuevoEstado
    localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value))
  }
}

function aceptarSolicitud(solicitudId) {
  const solicitud = todasLasSolicitudes.value.find(s => s.id === solicitudId)
  if (!solicitud) return
  actualizarEstadoSolicitud(solicitudId, 'aceptada')
  
  const asunto = `¡Su solicitud ha sido aceptada! - ${solicitud.paquete}`
  const cuerpo = `Hola ${solicitud.cliente},\n\n¡Nos complace informarle que su solicitud para el paquete "${solicitud.paquete}" ha sido ACEPTADA!...\n\nSaludos cordiales,\n${perfil.value?.usuario || 'El equipo'}`
  const mailtoLink = `mailto:${solicitud.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
  window.location.href = mailtoLink
}

function rechazarSolicitud(solicitudId) {
  const solicitud = todasLasSolicitudes.value.find(s => s.id === solicitudId)
  if (!solicitud) return
  
  const asunto = `Información sobre su solicitud - ${solicitud.paquete}`
  const cuerpo = `Hola ${solicitud.cliente},\n\nLamentamos informarle que no podremos aceptar su solicitud...\n\nSaludos cordiales,\n${perfil.value?.usuario || 'El equipo'}`
  const mailtoLink = `mailto:${solicitud.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
  window.location.href = mailtoLink
  
  actualizarEstadoSolicitud(solicitudId, 'rechazada')
}

function restaurarDatos() {
  if (confirm('¿Estás seguro de que quieres restaurar todas las solicitudes a su estado inicial?')) {
    localStorage.removeItem('todasLasSolicitudes')
    
    const initialSolicitudes = solicitudesData.map(sol => ({
      ...sol,
      estado: 'pendiente',
      id: sol.id || Date.now() + Math.random().toString(36).substr(2, 9)
    }))
    todasLasSolicitudes.value = initialSolicitudes
    localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value))
    alert('Las solicitudes han sido restauradas exitosamente.')
  }
}

// --- FUNCIONES CRUD PARA PAQUETES ---
function abrirModalParaCrear() {
  editandoIndex.value = null
  paqueteEditable.value = { nombre: '', descripcion: '', precio: 0, video_youtube: '' }
  mostrarModal.value = true
}

function abrirModalParaEditar(index) {
  editandoIndex.value = index
  paqueteEditable.value = { ...servicioAsociadoAlPerfil.value.paquetes[index] }
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
}

async function guardarPaquete(paqueteActualizado) {
  // Bloque IF para CREAR un paquete nuevo (usa el POST)
  if (editandoIndex.value === null) {
    if (!servicioAsociadoAlPerfil.value) {
      alert('Error: No se puede añadir un paquete sin un servicio asociado.')
      return
    }
    const serviceId = servicioAsociadoAlPerfil.value.id

    try {
      await addPackage(serviceId, paqueteActualizado)
      cerrarModal()
    } catch (err) {
      alert(`Error al guardar el paquete: ${err.message}`)
    }
  } 
  // Bloque ELSE para EDITAR (se queda como estaba, para el futuro PUT)
  else {
    const indiceServicioActual = services.value.findIndex(s => s.id === servicioAsociadoAlPerfil.value.id)
    if (indiceServicioActual !== -1) {
      services.value[indiceServicioActual].paquetes[editandoIndex.value] = paqueteActualizado
      localStorage.setItem('myServicesData', JSON.stringify(services.value))
      cerrarModal()
    }
  }
}

// 3. --- FUNCIÓN 'eliminarPaquete' ACTUALIZADA PARA USAR EL COMPOSABLE ---
async function eliminarPaquete(index) {
  if (confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
    if (!servicioAsociadoAlPerfil.value) {
      alert("Error: No se ha encontrado el servicio asociado.");
      return;
    }
    
    const serviceId = servicioAsociadoAlPerfil.value.id;

    try {
      // Llamamos a la nueva función del composable que hace el DELETE
      await deletePackage(serviceId, index);
      alert('Paquete eliminado exitosamente.');
    } catch (err) {
      alert(`Error al eliminar el paquete: ${err.message}`);
    }
  }
}

// --- HOOKS DE CICLO DE VIDA (sin cambios) ---
watch(
  () => route.params.usuario,
  async (newUsuario) => {
    if (newUsuario) {
      await Promise.all([
        loadAllProfiles(),
        loadAllServices()
      ])
      const nombre = newUsuario.trim().toLowerCase()
      perfil.value = profiles.value.find(p => p.usuario.toLowerCase() === nombre) || null
    }
  },
  { immediate: true }
)

onMounted(() => {
  // Carga de solicitudes (desde localStorage o JSON, sin cambios)
  const storedSolicitudes = localStorage.getItem('todasLasSolicitudes')
  if (storedSolicitudes) {
    todasLasSolicitudes.value = JSON.parse(storedSolicitudes)
  } else {
    const initialJsonSolicitudes = solicitudesData.map(sol => ({
      ...sol,
      estado: 'pendiente',
      id: sol.id || Date.now() + Math.random().toString(36).substr(2, 9)
    }))
    todasLasSolicitudes.value = initialJsonSolicitudes;
    localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value))
  }
})
</script>

<style scoped>
/* Page wrapper uses your theme variables (no cambios en themes.css) */
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Perfil header card */
.profile-card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border-radius: 0.5rem;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Generic card used for paquetes/reseñas/solicitudes */
.card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid transparent;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

/* Texto fuerte / títulos */
.strong-text {
  color: var(--color-text);
}

/* Texto atenuado */
.muted {
  color: var(--color-text-light);
}

/* Meta text small */
.meta-text {
  color: var(--color-text-light);
}

/* Links */
.link {
  color: var(--color-primary-button-bg);
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}

/* Botones de acción */
.btn-accept,
.btn-reject,
.btn-plain {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 120ms ease, filter 120ms ease;
}

/* Accept */
.btn-accept {
  background-color: #16a34a; /* green-600 */
  color: #ffffff;
}
.btn-accept:hover {
  background-color: #15803d; /* green-700 */
  transform: translateY(-1px);
}

/* Reject */
.btn-reject {
  background-color: #dc2626; /* red-600 */
  color: #ffffff;
}
.btn-reject:hover {
  background-color: #b91c1c; /* red-700 */
  transform: translateY(-1px);
}

/* Plain small button (restaurar) */
.btn-plain {
  background-color: var(--color-background-light);
  color: var(--color-text);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(0,0,0,0.06);
}
.btn-plain:hover {
  filter: brightness(0.98);
}

/* Empty card */
.empty-card {
  background-color: var(--color-background-light);
  color: var(--color-text-light);
}

/* Ajustes de imagen y objeto-cover */
img.object-cover {
  object-fit: cover;
}

/* Pequeñas utilidades */
.transition-shadow {
  transition: box-shadow 160ms ease, transform 160ms ease;
}

/* Botón de editar */
.btn-edit {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  transition: all 120ms ease;
}
.btn-edit:hover {
  background-color: var(--color-primary-button-text);
  color: var(--color-primary-button-bg);
  transform: translateY(-1px);
}
</style>
