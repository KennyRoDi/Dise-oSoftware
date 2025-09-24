<template>
    <div v-if="servicio && servicio.titulo" class="bg-white text-gray-900 font-sans">
        <Navbar />

        <section v-if="servicio.imagenes && servicio.imagenes.length > 1" class="relative h-[60vh] bg-cover bg-center"
            :style="`background-image: url('/assets/images/${servicio.imagenes[1]}')`">
            <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
                <h1 class="text-4xl font-bold mb-2">{{ servicio.titulo }}</h1>
                <p class="text-lg mb-4">{{ servicio.eslogan }}</p>
                <RouterLink :to="`/agendar/${servicio.id}`"
                    class="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200">
                    Agendar
                </RouterLink>
            </div>
        </section>

        <section class="px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h2 class="text-2xl font-bold mb-2">¿Quién Soy?</h2>
                <p class="text-gray-600">{{ servicio.quien_soy }}</p>
            </div>
            <img :src="`/assets/images/${servicio.imagenes[2]}`" class="rounded-md" />
        </section>

        <section class="px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <img :src="`/assets/images/${servicio.imagenes[3]}`" class="rounded-md" />
            <div>
                <h2 class="text-2xl font-bold mb-2">¿Qué Hago?</h2>
                <p class="text-gray-600">{{ servicio.que_hago }}</p>
            </div>
        </section>

        <section class="px-4 py-12 max-w-6xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Paquetes</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <div v-for="(paq, index) in servicio.paquetes" :key="index" class="bg-white border rounded shadow p-4">
                    <a v-if="paq.video_youtube" :href="paq.video_youtube" target="_blank">
                        <img :src="`/assets/images/${servicio.imagenes[index + 4]}`" class="rounded mb-2 cursor-pointer"
                            :alt="paq.nombre" />
                    </a>
                    <img v-else :src="`/assets/images/${servicio.imagenes[index + 4]}`" class="rounded mb-2"
                        :alt="paq.nombre" />

                    <h3 class="font-semibold">{{ paq.nombre }}</h3>
                    <p class="text-sm text-gray-600">{{ paq.descripcion }}</p>
                    <p class="font-bold mt-1">$ {{ paq.precio }}</p>
                    <button @click="showPackageDetails(paq)"
                        class="mt-3 bg-gray-600 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Ver más
                    </button>
                </div>
            </div>
        </section>

        <div v-if="showModal && selectedPackage"
            class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full relative">
                <button @click="closeModal" class="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl">
                    ×
                </button>
                <h3 class="text-xl font-bold mb-3">{{ selectedPackage.nombre }}</h3>
                <p class="text-gray-700 mb-2">{{ selectedPackage.descripcion }}</p>
                <p class="font-bold text-lg mb-3">$ {{ selectedPackage.precio }}</p>
                <div v-if="selectedPackage.detalles && selectedPackage.detalles.length > 0" class="mb-4">
                    <h4 class="font-semibold mb-1">Detalles del paquete:</h4>
                    <ul class="list-disc list-inside text-gray-600">
                        <li v-for="(detail, i) in selectedPackage.detalles" :key="i">{{ detail }}</li>
                    </ul>
                </div>
                <a :href="selectedPackage.video_youtube" target="_blank"
                    class="inline-block bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
                    v-if="selectedPackage.video_youtube">
                    Ver en YouTube
                </a>
            </div>
        </div>

        <section class="px-4 py-12 max-w-6xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Reseñas</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div v-for="(resena, index) in resenasFiltradas" :key="index"
                    class="bg-white border rounded shadow p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <img :src="`/assets/images/${resena.pfp}`" class="w-10 h-10 rounded-full" />
                        <div>
                            <p class="font-semibold">{{ resena.titulo }}</p>
                            <p class="text-sm text-gray-500">{{ resena.usuario }}</p>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600">{{ resena.comentario }}</p>
                </div>
            </div>
        </section>

        <Footer />
    </div>
    <div v-else class="text-center py-20 text-gray-500">Cargando servicio...</div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import serviciosData from '@/assets/json/servicios.json'
import comentariosData from '@/assets/json/comentarios.json'

const route = useRoute()
const servicio = ref(null)
const resenasFiltradas = ref([])

// Variables para controlar la visibilidad del modal y el paquete seleccionado
const showModal = ref(false)
const selectedPackage = ref(null)

// Función para mostrar los detalles del paquete en el modal
const showPackageDetails = (paquete) => {
    selectedPackage.value = paquete
    showModal.value = true
}

// Función para cerrar el modal
const closeModal = () => {
    showModal.value = false
    selectedPackage.value = null
}

watchEffect(() => {
    const id = parseInt(route.params.id)
    const encontrado = serviciosData.find(s => s.id === id)
    if (encontrado) {
        servicio.value = encontrado
        resenasFiltradas.value = comentariosData.filter(c => c.servicio === encontrado.titulo)
    } else {
        servicio.value = null
    }
})
</script>

<style scoped>
/* Puedes añadir cualquier estilo adicional para el modal aquí.
   Por ejemplo, para centrarlo o darle un aspecto específico. */
</style>