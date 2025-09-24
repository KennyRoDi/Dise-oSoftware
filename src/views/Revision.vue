<template>
    <div class="bg-white text-gray-900 font-sans min-h-screen">
        <Navbar />
        <section class="px-4 py-12 max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold mb-8">Revisión de Servicios Pendientes</h2>
            
            <div class="mb-6 text-right">
                <button @click="restaurarServiciosRevision"
                    class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors flex items-center gap-2 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M4 2a1 1 0 011 1v2.121a3 3 0 010 5.758V16a1 1 0 11-2 0v-6.121a3 3 0 010-5.758V3a1 1 0 011-1zm3 4a1 1 0 011 1v.707a3 3 0 014.586 0V7a1 1 0 112 0v.707a5 5 0 00-7.071 0V7a1 1 0 011-1z"
                            clip-rule="evenodd" />
                        <path fill-rule="evenodd"
                            d="M13 10a1 1 0 011-1h.707a3 3 0 014.586 0V10a1 1 0 112 0v.707a5 5 0 00-7.071 0V10a1 1 0 011-1z"
                            clip-rule="evenodd" />
                    </svg>
                    Restaurar Pendientes
                </button>
            </div>

            <div v-if="serviciosPendientes.length === 0" class="text-center text-gray-500">
                No hay servicios pendientes por aprobar.
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="serv in serviciosPendientes" :key="serv.id" class="bg-gray-50 border rounded shadow p-4 text-center">
                    <img :src="`/assets/images/${serv.imagenes[0]}`" class="w-full h-48 object-cover rounded mb-2" />
                    <h3 class="text-xl font-semibold">{{ serv.titulo }}</h3>
                    <p class="text-sm text-gray-600 mb-2">{{ serv.eslogan }}</p>
                    <p class="text-xs text-gray-500 mb-4">Solicitado por: {{ serv.solicitadoPor || 'N/A' }} ({{ serv.correoContacto || 'N/A' }})</p>

                    <div class="flex justify-center gap-2 mt-4">
                        <RouterLink :to="`/detalle-prevista/${serv.id}`" class="text-purple-600 hover:underline">Ver más</RouterLink>
                        <button @click="aceptarServicio(serv)" class="text-green-600 font-medium">Aceptar</button>
                        <button @click="rechazarServicio(serv)" class="text-red-600 font-medium">Rechazar</button>
                    </div>
                </div>
            </div>

            <hr class="my-12">
            <h2 class="text-3xl font-bold mb-8">Servicios Aprobados (En Memoria)</h2>
            <div v-if="serviciosAprobados.length === 0" class="text-center text-gray-500">
                No hay servicios aprobados aún.
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div v-for="serv in serviciosAprobados" :key="serv.id" class="bg-white border rounded shadow p-4 text-center">
                    <img :src="`/assets/images/${serv.imagenes[0]}`" class="w-full h-48 object-cover rounded mb-2" />
                    <h3 class="text-xl font-semibold">{{ serv.titulo }}</h3>
                    <p class="text-sm text-gray-600 mb-2">{{ serv.eslogan }}</p>
                    <p class="text-xs text-gray-500 mb-4">Aprobado por: {{ serv.solicitadoPor || 'N/A' }}</p>
                    <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Aprobado</span>
                </div>
            </div>

        </section>
        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import previstaData from '@/assets/json/prevista.json'
import serviciosData from '@/assets/json/servicios.json' // Mantener para referencia de estructura

// Ref para los servicios que están pendientes de revisión (se cargarán desde localStorage o prevista.json)
const serviciosPendientes = ref([]);
// Ref para los servicios que han sido aprobados (se cargarán desde localStorage)
const serviciosAprobados = ref([]);

// --- Funciones de Utilidad ---

// Para simular la persistencia de los servicios pendientes
function guardarServiciosPendientes(servs) {
    localStorage.setItem('serviciosPendientesRevision', JSON.stringify(servs));
}

// Para simular la persistencia de los servicios aprobados
function guardarServiciosAprobados(servs) {
    localStorage.setItem('approvedServices', JSON.stringify(servs));
}

// Función para inicializar o restaurar los datos
function inicializarServicios() {
    // Cargar servicios pendientes del localStorage, si existen
    const storedPendientes = localStorage.getItem('serviciosPendientesRevision');
    if (storedPendientes) {
        serviciosPendientes.value = JSON.parse(storedPendientes);
    } else {
        // Si no hay en localStorage, cargar desde el JSON inicial
        // Asignar IDs únicos si no los tienen y estado 'pendiente' si aplica.
        serviciosPendientes.value = previstaData.map(serv => ({
            ...serv,
            id: serv.id || Date.now() + Math.random().toString(36).substr(2, 9),
            estado: 'pendiente-revision' // Un estado para el proceso de revisión
        }));
        guardarServiciosPendientes(serviciosPendientes.value);
    }

    // Cargar servicios aprobados del localStorage
    const storedAprobados = localStorage.getItem('approvedServices');
    if (storedAprobados) {
        serviciosAprobados.value = JSON.parse(storedAprobados);
    } else {
        serviciosAprobados.value = [];
    }
}

// --- Lógica de Aceptar/Rechazar Servicios ---

function aceptarServicio(servicio) {
    // 1. Marcar el servicio como aceptado
    const servicioAceptado = { ...servicio, estado: 'aprobado' };

    // 2. Añadir a la lista de servicios aprobados (en memoria y localStorage)
    serviciosAprobados.value.push(servicioAceptado);
    guardarServiciosAprobados(serviciosAprobados.value);

    // 3. Eliminar de la lista de servicios pendientes (en memoria y localStorage)
    serviciosPendientes.value = serviciosPendientes.value.filter(s => s.id !== servicio.id);
    guardarServiciosPendientes(serviciosPendientes.value);

    // 4. Enviar correo de aceptación
    const asunto = `¡Su servicio "${servicio.titulo}" ha sido APROBADO!`;
    const cuerpo = `Hola ${servicio.solicitadoPor || 'estimado proveedor'},

¡Nos complace informarle que su servicio "${servicio.titulo}" ha sido revisado y APROBADO por nuestro equipo!

Ahora estará visible en nuestra lista de servicios. Estamos emocionados de tenerle con nosotros.

Si tiene alguna pregunta, no dude en responder a este correo.

Saludos cordiales,
El equipo de EntertainFlix`;

    const mailtoLink = `mailto:${servicio.correoContacto || ''}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailtoLink;

    alert(`Servicio "${servicio.titulo}" aceptado y movido a servicios aprobados.`);
}

function rechazarServicio(servicio) {
    // 1. Marcar el servicio como rechazado (opcional, si quisieras un registro de rechazados)
    const servicioRechazado = { ...servicio, estado: 'rechazado' };

    // 2. Eliminar de la lista de servicios pendientes (en memoria y localStorage)
    serviciosPendientes.value = serviciosPendientes.value.filter(s => s.id !== servicio.id);
    guardarServiciosPendientes(serviciosPendientes.value);

    // 3. Enviar correo de rechazo
    const asunto = `Información sobre su servicio "${servicio.titulo}"`;
    const cuerpo = `Hola ${servicio.solicitadoPor || 'estimado proveedor'},

Lamentamos informarle que su servicio "${servicio.titulo}" no ha sido aprobado en esta ocasión.

Los motivos pueden ser varios:
- El servicio no cumple con nuestros estándares de calidad.
- Información insuficiente o incorrecta.
- Categoría o contenido no apropiado.

Le invitamos a revisar los requisitos de nuestro servicio o a contactarnos si desea más detalles.

Agradecemos su interés en EntertainFlix y esperamos poder colaborar en el futuro.

Saludos cordiales,
El equipo de EntertainFlix`;

    const mailtoLink = `mailto:${servicio.correoContacto || ''}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailtoLink;

    alert(`Servicio "${servicio.titulo}" rechazado.`);
}

// Función para restaurar los servicios pendientes desde el JSON original
function restaurarServiciosRevision() {
    if (confirm('¿Estás seguro de que quieres restaurar la lista de servicios pendientes a su estado inicial? Esto reestablecerá los servicios del JSON original y eliminará los aprobados y rechazados en esta sesión.')) {
        localStorage.removeItem('serviciosPendientesRevision');
        localStorage.removeItem('approvedServices'); // También limpiar los aprobados al restaurar
        inicializarServicios(); // Volver a inicializar con los datos originales
        alert('Los servicios pendientes han sido restaurados.');
    }
}

// --- Ciclo de Vida ---
onMounted(() => {
    inicializarServicios();
});
</script>

<style scoped></style>