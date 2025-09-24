<template>
    <div class="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        <Navbar />

        <main class="flex-grow">
            <section class="px-4 py-12 max-w-4xl mx-auto">
                <div class="bg-gray-50 p-6 rounded shadow flex flex-col md:flex-row gap-6 items-center">
                    <img :src="`/assets/images/${usuario?.pfp}`" 
                        class="w-40 h-40 object-cover rounded-full border" />
                    <div>
                        <p class="text-gray-700"><strong>Nombre:</strong> {{ usuario?.nombre }}</p>
                        <p class="text-gray-700"><strong>Usuario:</strong> {{ usuario?.usuario }}</p>
                        <p class="text-gray-700"><strong>Correo:</strong> {{ usuario?.correo }}</p>
                        <p class="text-gray-700"><strong>Contacto:</strong> {{ usuario?.contacto }}</p>
                    </div>
                </div>
            </section>

            <section v-if="solicitudesDelCliente.length" class="px-4 py-12 max-w-6xl mx-auto">
                <h2 class="text-2xl font-bold mb-6">Mis Solicitudes</h2>
                <div class="grid gap-6">
                    <div v-for="(sol, index) in solicitudesDelCliente" :key="index" class="border rounded shadow p-6">
                        <h3 class="font-semibold text-lg mb-1">{{ sol.servicio }} - {{ sol.paquete }}</h3>
                        <p class="text-sm text-gray-500">{{ sol.fecha }} | {{ sol.ubicacion }}</p>
                        <p class="mt-2"><strong>Mensaje:</strong> {{ sol.mensaje }}</p>
                        <p><strong>Contacto:</strong> {{ sol.correo }}</p>
                        <button @click="cancelarSolicitud(index)"
                            class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Cancelar
                        </button>
                    </div>
                </div>
            </section>

            <section v-else class="text-center text-gray-500 py-12 max-w-4xl mx-auto">
                <p>No has enviado ninguna solicitud todavía.</p>
            </section>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import solicitudesBase from '@/assets/json/solicitudes.json'
import { useAuth } from '@/composables/useAuth.js'

const { usuario } = useAuth()
const nuevasSolicitudes = ref(JSON.parse(localStorage.getItem('nuevasSolicitudes') || '[]'))

const solicitudesDelCliente = computed(() => {
    if (!usuario.value) return []
    const base = solicitudesBase.filter(s => s.cliente?.toLowerCase() === usuario.value.nombre.toLowerCase())
    const nuevas = nuevasSolicitudes.value.filter(s => s.cliente?.toLowerCase() === usuario.value.nombre.toLowerCase())
    return [...base, ...nuevas]
})

function cancelarSolicitud(index) {
    nuevasSolicitudes.value.splice(index - solicitudesBase.length, 1)
    localStorage.setItem('nuevasSolicitudes', JSON.stringify(nuevasSolicitudes.value))
}
</script>

<style scoped></style>
