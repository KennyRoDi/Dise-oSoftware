<template>
    <div class="bg-white text-gray-900 font-sans min-h-screen">
        <Navbar />

        <section class="px-4 py-12 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-8 text-center">Solicitudes Recibidas</h2>

            <div v-if="solicitudes.length" class="space-y-6">
                <div v-for="(sol, index) in solicitudes" :key="index" class="border rounded shadow p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-semibold">{{ sol.nombre }} - {{ sol.servicio }}</h3>
                            <p class="text-sm text-gray-500">{{ sol.fecha }} | {{ sol.ubicacion }}</p>
                        </div>
                        <div class="space-x-2">
                            <button
                                class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Aceptar</button>
                            <button class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Rechazar</button>
                        </div>
                    </div>

                    <p><strong>Correo:</strong> {{ sol.correo }}</p>
                    <p><strong>Teléfono:</strong> {{ sol.telefono }}</p>
                    <p><strong>Paquete Seleccionado:</strong> {{ sol.paquete }}</p>
                    <p class="mt-2 text-gray-700"><strong>Mensaje:</strong> {{ sol.mensaje }}</p>
                </div>
            </div>

            <div v-else class="text-center text-gray-500">No hay solicitudes por el momento.</div>
        </section>

        <Footer />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import solicitudesData from '@/assets/json/solicitudes.json'
import { useAuth } from '@/composables/useAuth.js'

const { usuario } = useAuth()

const todasLasSolicitudes = ref(solicitudesData)

const solicitudes = computed(() => {
    if (!usuario.value) return []
    return todasLasSolicitudes.value.filter(s => s.oferente === usuario.value.usuario)
})
</script>


<style scoped></style>
