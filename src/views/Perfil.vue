<template>
  <div class="page font-sans min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-1">
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

        <div v-else-if="buscado" class="text-center muted mt-10">
          No se encontró ningún perfil con ese nombre.
        </div>
      </section>

      <section v-if="servicioAsociadoAlPerfil" class="px-4 py-12 max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold strong-text mb-6">Paquetes de {{ servicioAsociadoAlPerfil.titulo }}</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="(paq, index) in servicioAsociadoAlPerfil.paquetes"
            :key="index"
            class="card p-4 rounded shadow"
          >
            <img
              :src="`/assets/images/${servicioAsociadoAlPerfil.imagenes[index + 4]}`"
              class="rounded mb-2 w-full h-40 object-cover"
            />
            <h3 class="font-semibold strong-text">{{ paq.nombre }}</h3>
            <p class="text-sm muted mt-1">{{ paq.descripcion }}</p>
            <p class="font-bold mt-1 strong-text">$ {{ paq.precio }}</p>
          </div>
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

      <section
        v-if="solicitudesGestionadas.length > 0 || servicioAsociadoAlPerfil"
        class="px-4 py-12 max-w-6xl mx-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold strong-text">Todas las Solicitudes ({{ solicitudesGestionadas.length }})</h2>

          <button
            @click="restaurarDatos"
            class="btn-plain flex items-center gap-2"
            aria-label="Restaurar solicitudes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4 2a1 1 0 011 1v2.121a3 3 0 010 5.758V16a1 1 0 11-2 0v-6.121a3 3 0 010-5.758V3a1 1 0 011-1zm3 4a1 1 0 011 1v.707a3 3 0 014.586 0V7a1 1 0 112 0v.707a5 5 0 00-7.071 0V7a1 1 0 011-1z"
                clip-rule="evenodd"
              />
              <path
                fill-rule="evenodd"
                d="M13 10a1 1 0 011-1h.707a3 3 0 014.586 0V10a1 1 0 112 0v.707a5 5 0 00-7.071 0V10a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Restaurar Solicitudes
          </button>
        </div>

        <div v-if="solicitudesGestionadas.length > 0" class="grid gap-6">
          <div
            v-for="(solicitud, index) in solicitudesGestionadas"
            :key="solicitud.id || index"
            :class="[
              'solicitud-card transition-shadow rounded-lg p-6',
              solicitud.estado === 'aceptada'
                ? 'solicitud-accepted'
                : solicitud.estado === 'rechazada'
                ? 'solicitud-rejected'
                : 'solicitud-pending'
            ]"
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-bold text-xl strong-text mb-1">{{ solicitud.cliente }}</h3>

                <span
                  :class="[
                    'badge inline-block text-sm px-3 py-1 rounded-full',
                    solicitud.estado === 'aceptada'
                      ? 'badge-accepted'
                      : solicitud.estado === 'rechazada'
                      ? 'badge-rejected'
                      : 'badge-pending'
                  ]"
                >
                  <span v-if="solicitud.estado === 'aceptada'">Aceptada - </span>
                  <span v-else-if="solicitud.estado === 'rechazada'">Rechazada - </span>
                  {{ solicitud.paquete }}
                </span>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="font-semibold strong-text">Email:</span>
                  <a :href="`mailto:${solicitud.correo}`" class="link">
                    {{ solicitud.correo }}
                  </a>
                </div>

                <div class="flex items-center gap-2">
                  <span class="font-semibold strong-text">Teléfono:</span>
                  <span v-if="solicitud.telefono" class="muted">{{ solicitud.telefono }}</span>

                  <a
                    v-else-if="!solicitud.correo.includes('@') && solicitud.correo"
                    :href="`tel:${solicitud.correo}`"
                    class="link"
                  >
                    {{ solicitud.correo }}
                  </a>

                  <span v-else class="muted">N/A</span>
                </div>
              </div>

              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="font-semibold strong-text">Fecha:</span>
                  <span class="muted">{{ formatearFecha(solicitud.fecha) }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="font-semibold strong-text">Ubicación:</span>
                  <span class="muted">{{ solicitud.ubicacion }}</span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <p class="font-semibold strong-text mb-2">Mensaje:</p>

              <div
                :class="[
                  'p-3 rounded-lg',
                  solicitud.estado === 'aceptada'
                    ? 'msg-accepted'
                    : solicitud.estado === 'rechazada'
                    ? 'msg-rejected'
                    : 'msg-pending'
                ]"
              >
                <p class="muted leading-relaxed">{{ solicitud.mensaje }}</p>
              </div>
            </div>

            <div v-if="solicitud.estado === 'pendiente' || !solicitud.estado" class="flex gap-3 pt-4 border-t">
              <button @click="aceptarSolicitud(solicitud.id)" class="btn-accept">Aceptar</button>
              <button @click="rechazarSolicitud(solicitud.id)" class="btn-reject">Rechazar</button>
            </div>

            <div v-else class="flex gap-3 pt-4 border-t muted text-sm">
              Esta solicitud ha sido {{ solicitud.estado === 'aceptada' ? 'aceptada' : 'rechazada' }}.
            </div>
          </div>
        </div>

        <div v-else class="empty-card p-8 rounded-lg muted text-center">
          <p class="text-lg">📭 No se han recibido solicitudes aún.</p>
          <p class="text-sm mt-2">Las nuevas solicitudes aparecerán aquí automáticamente.</p>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
/* (mantuve exactamente tu lógica de script) */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import perfilesData from '@/assets/json/perfiles.json'
import serviciosData from '@/assets/json/servicios.json'
import comentariosData from '@/assets/json/comentarios.json'
import solicitudesData from '@/assets/json/solicitudes.json'

const route = useRoute()
const nombreBusqueda = ref('')
const perfil = ref(null)
const buscado = ref(false)

const servicios = ref(serviciosData)
const comentarios = ref(comentariosData)

const todasLasSolicitudes = ref([])

const servicioAsociadoAlPerfil = computed(() => {
  if (!perfil.value) return null
  return servicios.value.find(s => s.titulo.toLowerCase() === perfil.value.usuario.toLowerCase()) || null
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

function formatearFecha(fecha) {
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }
  return new Date(fecha).toLocaleDateString('es-ES', opciones)
}

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
  const cuerpo = `Hola ${solicitud.cliente},

¡Nos complace informarle que su solicitud para el paquete "${solicitud.paquete}" ha sido ACEPTADA!

Estamos muy emocionados de trabajar con usted para su evento del ${formatearFecha(solicitud.fecha)} en ${solicitud.ubicacion}.

Nos pondremos en contacto con usted muy pronto para coordinar los próximos pasos y asegurar que todo salga perfecto.

Si tiene alguna pregunta, no dude en responder a este correo.

Saludos cordiales,
${perfil.value?.usuario || 'El equipo'}`

  const mailtoLink = `mailto:${solicitud.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
  window.location.href = mailtoLink
}

function rechazarSolicitud(solicitudId) {
  const solicitud = todasLasSolicitudes.value.find(s => s.id === solicitudId)
  if (!solicitud) return

  const asunto = `Información sobre su solicitud - ${solicitud.paquete}`
  const cuerpo = `Hola ${solicitud.cliente},

Lamentamos informarle que no podremos aceptar su solicitud para el evento del ${formatearFecha(solicitud.fecha)} en ${solicitud.ubicacion} para el paquete "${solicitud.paquete}".

Las razones pueden ser varias, como la disponibilidad en la fecha solicitada o limitaciones de capacidad.

Agradecemos su interés en nuestros servicios y esperamos poder atenderle en otra ocasión. Si tiene alguna otra pregunta o desea explorar otras opciones, no dude en contactarnos.

Saludos cordiales,
${perfil.value?.usuario || 'El equipo'}`

  const mailtoLink = `mailto:${solicitud.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
  window.location.href = mailtoLink

  actualizarEstadoSolicitud(solicitudId, 'rechazada')
}

function buscarPerfil() {
  buscado.value = true
  const nombre = nombreBusqueda.value.trim().toLowerCase()
  perfil.value = perfilesData.find(p => p.usuario.toLowerCase() === nombre) || null
}

function restaurarDatos() {
  if (
    confirm(
      '¿Estás seguro de que quieres restaurar todas las solicitudes a su estado inicial? Esto borrará todos los cambios guardados (aceptadas/rechazadas/nuevas).'
    )
  ) {
    localStorage.removeItem('todasLasSolicitudes')
    localStorage.removeItem('nuevasSolicitudes')

    const initialSolicitudes = solicitudesData.map(sol => ({
      ...sol,
      estado: 'pendiente',
      id: sol.id || Date.now() + Math.random().toString(36).substr(2, 9)
    }))
    todasLasSolicitudes.value = initialSolicitudes
    localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value))
    alert('Las solicitudes han sido restauradas exitosamente desde el JSON original.')
  }
}

watch(
  () => route.params.usuario,
  newUsuario => {
    if (newUsuario) {
      nombreBusqueda.value = newUsuario
      buscarPerfil()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (!perfil.value && route.params.usuario) {
    nombreBusqueda.value = route.params.usuario
    buscarPerfil()
  }

  const storedSolicitudes = localStorage.getItem('todasLasSolicitudes')
  if (storedSolicitudes) {
    todasLasSolicitudes.value = JSON.parse(storedSolicitudes)
  } else {
    const initialJsonSolicitudes = solicitudesData.map(sol => ({
      ...sol,
      estado: 'pendiente',
      id: sol.id || Date.now() + Math.random().toString(36).substr(2, 9)
    }))

    const oldNewSolicitudes = JSON.parse(localStorage.getItem('nuevasSolicitudes') || '[]')
    const combinedInitial = [...initialJsonSolicitudes]

    oldNewSolicitudes.forEach(newSol => {
      if (!combinedInitial.some(existingSol => existingSol.id === newSol.id)) {
        combinedInitial.push({
          ...newSol,
          estado: newSol.estado || 'pendiente',
          id: newSol.id || Date.now() + Math.random().toString(36).substr(2, 9)
        })
      }
    })

    todasLasSolicitudes.value = combinedInitial
    localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value))
    localStorage.removeItem('nuevasSolicitudes')
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

/* Solicitud card base */
.solicitud-card {
  border-radius: 0.75rem;
}

/* Estados de solicitud: colores suaves (fijos aquí) */
.solicitud-pending {
  background-color: #ffffff; /* blanco neutro */
  border: 1px solid rgba(148,163,184,0.12);
}
.solicitud-accepted {
  background-color: #ecfdf5; /* green-50 */
  border: 1px solid #bbf7d0; /* green-200 */
}
.solicitud-rejected {
  background-color: #fef2f2; /* red-50 */
  border: 1px solid #fecaca; /* red-200 */
}

/* Badges */
.badge {
  font-weight: 600;
}
.badge-pending {
  background-color: #eff6ff; /* blue-100 */
  color: #1e3a8a; /* blue-800 */
}
.badge-accepted {
  background-color: #d1fae5; /* green-100 */
  color: #065f46; /* green-800 */
}
.badge-rejected {
  background-color: #fee2e2; /* red-100 */
  color: #991b1b; /* red-800 */
}

/* Mensaje dentro de la solicitud */
.msg-pending {
  background-color: #ffffff;
}
.msg-accepted {
  background-color: #ecfdf5;
}
.msg-rejected {
  background-color: #fef2f2;
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
</style>
