<template>
    <div class="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        <Navbar />

        <main class="flex-1">
            <section class="px-4 py-12 max-w-4xl mx-auto">
                <div v-if="perfil" class="bg-gray-50 p-6 rounded shadow">
                    <div class="flex flex-col md:flex-row items-center gap-6">
                        <img :src="`/assets/images/${perfil.imagen}`" alt="Foto"
                            class="w-48 h-48 object-cover rounded-full" />
                        <div>
                            <h3 class="text-2xl font-bold">{{ perfil.usuario }}</h3>
                            <p class="text-gray-600">{{ perfil.descripcion }}</p>
                            <p class="text-sm text-gray-500 mt-2">{{ perfil.categoria }} - {{ perfil.ubicacion }}</p>
                        </div>
                    </div>
                </div>
                <div v-else-if="buscado" class="text-center text-gray-500 mt-10">
                    No se encontró ningún perfil con ese nombre.
                </div>
            </section>

            <section v-if="servicioAsociadoAlPerfil" class="px-4 py-12 max-w-6xl mx-auto">
                <h2 class="text-2xl font-bold mb-6">Paquetes de {{ servicioAsociadoAlPerfil.titulo }}</h2>
                <div class="grid md:grid-cols-3 gap-6">
                    <div v-for="(paq, index) in servicioAsociadoAlPerfil.paquetes" :key="index"
                        class="bg-white border rounded shadow p-4">
                        <img :src="`/assets/images/${servicioAsociadoAlPerfil.imagenes[index + 4]}`"
                            class="rounded mb-2 w-full h-40 object-cover" />
                        <h3 class="font-semibold">{{ paq.nombre }}</h3>
                        <p class="text-sm text-gray-600">{{ paq.descripcion }}</p>
                        <p class="font-bold mt-1">$ {{ paq.precio }}</p>
                    </div>
                </div>
            </section>

            <section v-if="servicioAsociadoAlPerfil && reseñasDelServicio.length > 0"
                class="px-4 py-12 max-w-6xl mx-auto">
                <h2 class="text-2xl font-bold mb-6">Reseñas de {{ servicioAsociadoAlPerfil.titulo }}</h2>
                <div class="grid md:grid-cols-2 gap-6">
                    <div v-for="(resena, index) in reseñasDelServicio" :key="index"
                        class="bg-white border rounded shadow p-4">
                        <div class="flex items-center gap-3 mb-2">
                            <img :src="`/assets/images/${resena.pfp}`" class="w-10 h-10 rounded-full object-cover" />
                            <div>
                                <p class="font-semibold">{{ resena.titulo }}</p>
                                <p class="text-sm text-gray-500">{{ resena.usuario }}</p>
                            </div>
                        </div>
                        <p class="text-sm text-gray-600">{{ resena.comentario }}</p>
                    </div>
                </div>
            </section>

            <section v-if="solicitudesGestionadas.length > 0 || servicioAsociadoAlPerfil" class="px-4 py-12 max-w-6xl mx-auto">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">Todas las Solicitudes ({{ solicitudesGestionadas.length }})</h2>
                    <button @click="restaurarDatos"
                        class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M4 2a1 1 0 011 1v2.121a3 3 0 010 5.758V16a1 1 0 11-2 0v-6.121a3 3 0 010-5.758V3a1 1 0 011-1zm3 4a1 1 0 011 1v.707a3 3 0 014.586 0V7a1 1 0 112 0v.707a5 5 0 00-7.071 0V7a1 1 0 011-1z"
                                clip-rule="evenodd" />
                            <path fill-rule="evenodd"
                                d="M13 10a1 1 0 011-1h.707a3 3 0 014.586 0V10a1 1 0 112 0v.707a5 5 0 00-7.071 0V10a1 1 0 011-1z"
                                clip-rule="evenodd" />
                        </svg>
                        Restaurar Solicitudes
                    </button>
                </div>

                <div v-if="solicitudesGestionadas.length > 0" class="grid gap-6">
                    <div v-for="(solicitud, index) in solicitudesGestionadas" :key="solicitud.id || index" :class="[
                        'border rounded-lg shadow-md p-6 transition-shadow',
                        {
                            'bg-green-50 hover:shadow-lg': solicitud.estado === 'aceptada',
                            'bg-red-50 hover:shadow-lg': solicitud.estado === 'rechazada',
                            'bg-white hover:shadow-lg': solicitud.estado === 'pendiente' || !solicitud.estado
                        }
                    ]">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h3 class="font-bold text-xl text-gray-800 mb-1">
                                    {{ solicitud.cliente }}
                                </h3>
                                <span :class="[
                                    'inline-block text-sm px-3 py-1 rounded-full',
                                    {
                                        'bg-blue-100 text-blue-800': solicitud.estado === 'pendiente' || !solicitud.estado,
                                        'bg-green-200 text-green-800': solicitud.estado === 'aceptada',
                                        'bg-red-200 text-red-800': solicitud.estado === 'rechazada'
                                    }
                                ]">
                                    <span v-if="solicitud.estado === 'aceptada'">Aceptada - </span>
                                    <span v-else-if="solicitud.estado === 'rechazada'">Rechazada - </span>
                                    {{ solicitud.paquete }}
                                </span>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-4 mb-4">
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-gray-700">Email:</span>
                                    <a :href="`mailto:${solicitud.correo}`"
                                        class="text-blue-600 hover:text-blue-800 hover:underline">
                                        {{ solicitud.correo }}
                                    </a>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-gray-700">Teléfono:</span>
                                    <span v-if="solicitud.telefono" class="text-gray-600">{{ solicitud.telefono
                                        }}</span>
                                    <a v-else-if="!solicitud.correo.includes('@') && solicitud.correo"
                                        :href="`tel:${solicitud.correo}`"
                                        class="text-blue-600 hover:text-blue-800 hover:underline">
                                        {{ solicitud.correo }}
                                    </a>
                                    <span v-else class="text-gray-600">N/A</span>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-gray-700">Fecha:</span>
                                    <span class="text-gray-600">{{ formatearFecha(solicitud.fecha) }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-gray-700">Ubicación:</span>
                                    <span class="text-gray-600">{{ solicitud.ubicacion }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <p class="font-semibold text-gray-700 mb-2">Mensaje:</p>
                            <div :class="[
                                'p-3 rounded-lg',
                                {
                                    'bg-gray-50': solicitud.estado === 'pendiente' || !solicitud.estado,
                                    'bg-green-100': solicitud.estado === 'aceptada',
                                    'bg-red-100': solicitud.estado === 'rechazada'
                                }
                            ]">
                                <p class="text-gray-700 leading-relaxed">{{ solicitud.mensaje }}</p>
                            </div>
                        </div>

                        <div v-if="solicitud.estado === 'pendiente' || !solicitud.estado"
                            class="flex gap-3 pt-4 border-t">
                            <button @click="aceptarSolicitud(solicitud.id)"
                                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                                Aceptar
                            </button>
                            <button @click="rechazarSolicitud(solicitud.id)"
                                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
                                Rechazar
                            </button>
                        </div>
                        <div v-else class="flex gap-3 pt-4 border-t text-gray-500 text-sm">
                            Esta solicitud ha sido {{ solicitud.estado === 'aceptada' ? 'aceptada' : 'rechazada' }}.
                        </div>
                    </div>
                </div>
                <div v-else class="bg-gray-50 p-8 rounded-lg text-gray-500 text-center">
                    <p class="text-lg">📭 No se han recibido solicitudes aún.</p>
                    <p class="text-sm mt-2">Las nuevas solicitudes aparecerán aquí automáticamente.</p>
                </div>
            </section>

            </main>

        <Footer />
    </div>
</template>

<script setup>
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

const todasLasSolicitudes = ref([]);

const servicioAsociadoAlPerfil = computed(() => {
    if (!perfil.value) return null
    return servicios.value.find(s => s.titulo.toLowerCase() === perfil.value.usuario.toLowerCase()) || null
})

const reseñasDelServicio = computed(() => {
    if (!servicioAsociadoAlPerfil.value) return []
    return comentarios.value.filter(c => c.servicio.toLowerCase() === servicioAsociadoAlPerfil.value.titulo.toLowerCase())
})

const solicitudesGestionadas = computed(() => {
    if (!servicioAsociadoAlPerfil.value) return [];
    return todasLasSolicitudes.value
        .filter(sol => sol.servicio.toLowerCase() === servicioAsociadoAlPerfil.value.titulo.toLowerCase())
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

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
    const solicitudIndex = todasLasSolicitudes.value.findIndex(s => s.id === solicitudId);
    if (solicitudIndex !== -1) {
        todasLasSolicitudes.value[solicitudIndex].estado = nuevoEstado;
        localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value));
    }
}

function aceptarSolicitud(solicitudId) {
    const solicitud = todasLasSolicitudes.value.find(s => s.id === solicitudId);
    if (!solicitud) return;

    actualizarEstadoSolicitud(solicitudId, 'aceptada');

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
    const solicitud = todasLasSolicitudes.value.find(s => s.id === solicitudId);
    if (!solicitud) return;

    const asunto = `Información sobre su solicitud - ${solicitud.paquete}`
    const cuerpo = `Hola ${solicitud.cliente},

Lamentamos informarle que no podremos aceptar su solicitud para el evento del ${formatearFecha(solicitud.fecha)} en ${solicitud.ubicacion} para el paquete "${solicitud.paquete}".

Las razones pueden ser varias, como la disponibilidad en la fecha solicitada o limitaciones de capacidad.

Agradecemos su interés en nuestros servicios y esperamos poder atenderle en otra ocasión. Si tiene alguna otra pregunta o desea explorar otras opciones, no dude en contactarnos.

Saludos cordiales,
${perfil.value?.usuario || 'El equipo'}`

    const mailtoLink = `mailto:${solicitud.correo}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`

    window.location.href = mailtoLink;

    actualizarEstadoSolicitud(solicitudId, 'rechazada');
}

function buscarPerfil() {
    buscado.value = true
    const nombre = nombreBusqueda.value.trim().toLowerCase()
    perfil.value = perfilesData.find(p => p.usuario.toLowerCase() === nombre) || null
}

function restaurarDatos() {
    if (confirm('¿Estás seguro de que quieres restaurar todas las solicitudes a su estado inicial? Esto borrará todos los cambios guardados (aceptadas/rechazadas/nuevas).')) {
        localStorage.removeItem('todasLasSolicitudes');
        localStorage.removeItem('nuevasSolicitudes'); // Asegurarse de limpiar también esta clave si se usó previamente

        const initialSolicitudes = solicitudesData.map(sol => ({
            ...sol,
            estado: 'pendiente',
            id: sol.id || Date.now() + Math.random().toString(36).substr(2, 9)
        }));
        todasLasSolicitudes.value = initialSolicitudes;
        localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value));
        alert('Las solicitudes han sido restauradas exitosamente desde el JSON original.');
    }
}

watch(() => route.params.usuario, (newUsuario) => {
    if (newUsuario) {
        nombreBusqueda.value = newUsuario
        buscarPerfil()
    }
}, { immediate: true })

onMounted(() => {
    if (!perfil.value && route.params.usuario) {
        nombreBusqueda.value = route.params.usuario
        buscarPerfil()
    }

    const storedSolicitudes = localStorage.getItem('todasLasSolicitudes');
    if (storedSolicitudes) {
        todasLasSolicitudes.value = JSON.parse(storedSolicitudes);
    } else {
        const initialJsonSolicitudes = solicitudesData.map(sol => ({
            ...sol,
            estado: 'pendiente',
            id: sol.id || Date.now() + Math.random().toString(36).substr(2, 9)
        }));

        const oldNewSolicitudes = JSON.parse(localStorage.getItem('nuevasSolicitudes') || '[]');
        const combinedInitial = [...initialJsonSolicitudes];

        oldNewSolicitudes.forEach(newSol => {
            if (!combinedInitial.some(existingSol => existingSol.id === newSol.id)) {
                combinedInitial.push({
                    ...newSol,
                    estado: newSol.estado || 'pendiente', // Usar el estado si ya lo tiene, sino 'pendiente'
                    id: newSol.id || Date.now() + Math.random().toString(36).substr(2, 9)
                });
            }
        });

        todasLasSolicitudes.value = combinedInitial;
        localStorage.setItem('todasLasSolicitudes', JSON.stringify(todasLasSolicitudes.value));
        localStorage.removeItem('nuevasSolicitudes');
    }
})
</script>