<template>
    <div class="bg-white text-gray-900 font-sans">
        <Navbar />

        <section class="px-4 py-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <div v-for="cat in categorias" :key="cat.nombre" class="text-center">
                    <img :src="`/assets/images/${cat.imagen}`" :alt="cat.nombre"
                        class="rounded-md w-full h-64 object-cover" />
                    <h3 class="font-semibold mt-2">{{ cat.nombre }}</h3>
                    <p class="text-sm text-gray-600">{{ cat.descripcion }}</p>
                    <router-link :to="`/catalogo-categoria/${cat.nombre}`"
                        class="inline-block mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm">
                        Ver más
                    </router-link>
                </div>
            </div>
        </section>

        <Footer />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import categoriasData from '@/assets/json/categorias.json'

const categorias = ref(categoriasData)
</script>
