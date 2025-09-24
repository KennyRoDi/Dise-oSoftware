<template>
    <div class="bg-white text-gray-900 font-sans">
        <Navbar />

        <!-- Hero -->
        <section class="text-center px-4 py-12">
            <h2 class="text-3xl font-bold mb-4">Conecta con servicios de entretenimiento</h2>
            <p class="text-lg text-gray-600 mb-6">
                Disfruta de la facilidad de comunicación con artistas y oferentes de entretenimiento como nunca antes se
                había visto
            </p>
            <RouterLink to="/categorias" class="inline-block bg-black text-white px-6 py-2 rounded mb-8">Ver Categorías
            </RouterLink>
            <!-- Carrusel Categorías -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                <div v-for="cat in categorias.slice(0, 3)" :key="cat.nombre" class="text-center">
                    <img :src="`/assets/images/${cat.imagen}`" :alt="cat.nombre" class="rounded-md" />
                    <h3 class="font-semibold mt-2">{{ cat.nombre }}</h3>
                    <p class="text-sm text-gray-600">{{ cat.descripcion }}</p>
                </div>
            </div>
        </section>

        <!-- Servicios -->
        <section class="px-4 py-12">
            <div class="text-center mb-6">
                <RouterLink to="/servicios" class="inline-block bg-black text-white px-6 py-2 rounded mb-8">Ver Servicios</RouterLink>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                <div v-for="serv in servicios.slice(0, 3)" :key="serv.id" class="text-center">
                    <img :src="`/assets/images/${serv.imagenes[0]}`" class="rounded-md" />
                    <h3 class="font-semibold mt-2">{{ serv.titulo }}</h3>
                    <p class="text-sm text-gray-600">{{ serv.eslogan }}</p>
                </div>
            </div>
        </section>

        <!-- Destacados -->
        <section class="px-4 py-12">
            <div class="text-center mb-6">
                <RouterLink to="/servicios" class="inline-block bg-black text-white px-6 py-2 rounded mb-8">Destacados</RouterLink>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                <div v-for="dest in destacados.slice(0, 3)" :key="dest.id" class="text-center">
                    <img :src="`/assets/images/${dest.imagenes[0]}`" class="rounded-md" />
                    <h3 class="font-semibold mt-2">{{ dest.titulo }}</h3>
                    <p class="text-sm text-gray-600">{{ dest.eslogan }}</p>
                </div>
            </div>
        </section>

        <!-- Comentarios -->
        <section class="px-4 py-12">
            <div class="text-center mb-6">
                <span class="inline-block bg-black text-white px-6 py-2 rounded mb-8">Comentarios</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                <div v-for="com in comentarios.slice(0, 3)" :key="com.usuario + com.servicio"
                    class="p-4 border rounded">
                    <p class="mb-2 font-medium">{{ com.titulo }}</p>
                    <div class="flex items-center space-x-2">
                        <img :src="`/assets/images/${com.pfp}`" class="w-8 h-8 rounded-full" />
                        <div>
                            <p class="text-sm font-semibold">{{ com.usuario }}</p>
                            <p class="text-xs text-gray-500">{{ com.puntuacion }}/5</p>
                        </div>
                    </div>
                    <p class="mt-2 text-sm text-gray-600">{{ com.comentario }}</p>
                </div>
            </div>
            <div class="flex justify-center gap-4 mt-6">
                <RouterLink to="/" class="bg-black text-white px-4 py-2 rounded">Inicio</RouterLink>
                <button class="bg-gray-200 px-4 py-2 rounded">Deja un comentario</button>
            </div>
        </section>

        <Footer />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

import categoriasData from '@/assets/json/categorias.json'
import serviciosData from '@/assets/json/servicios.json'
import comentariosData from '@/assets/json/comentarios.json'

const categorias = ref(categoriasData)
const servicios = ref(serviciosData)
const destacados = ref(serviciosData.slice(0, 3))
const comentarios = ref(comentariosData)
</script>

<style scoped></style>
