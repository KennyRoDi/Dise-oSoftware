<template>
    <div class="bg-white text-gray-900 font-sans">
        <Navbar />

        <section class="px-4 py-12 max-w-7xl mx-auto">
            <h2 class="text-3xl font-bold mb-8">Servicios en la categoría: {{ categoriaSeleccionada }}</h2>

            <div v-if="serviciosFiltrados.length > 0"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <div v-for="serv in serviciosFiltrados" :key="serv.id"
                    class="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <router-link :to="`/agendar/${serv.id}`">
                        <img :src="`/assets/images/${serv.imagenes[0]}`"
                            class="w-full h-48 object-cover object-center cursor-pointer" :alt="serv.titulo" />
                    </router-link>

                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-1 text-gray-900">{{ serv.titulo }}</h3>
                        <p class="text-sm text-gray-600 mb-2">{{ serv.categoria }}</p>
                        <p class="text-sm text-gray-500 mb-2">Ubicación: {{ serv.ubicacion }}</p>
                        
                        <router-link :to="`/detalle/${serv.id}`"
                            class="inline-block bg-gray-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                            Ver más
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-gray-500 text-lg py-10">
                <p>No se encontraron servicios en la categoría '{{ categoriaSeleccionada }}'.</p>
                <p class="mt-2">Intenta explorar otras categorías.</p>
            </div>
        </section>

        <Footer />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import serviciosData from '@/assets/json/servicios.json'

const route = useRoute()
const categoriaSeleccionada = route.params.nombre

const servicios = ref(serviciosData)

const serviciosFiltrados = computed(() => {
    return servicios.value.filter(s => s.categoria === categoriaSeleccionada)
})
</script>

<style scoped></style>