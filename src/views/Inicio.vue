<template>
  <div class="page font-sans">
    <Navbar />

    <!-- Hero -->
    <section class="text-center px-4 py-12">
      <h2 class="text-3xl font-bold mb-4">Conecta con servicios de entretenimiento</h2>
      <p class="text-lg muted mb-6">
        Disfruta de la facilidad de comunicación con artistas y oferentes de entretenimiento como nunca antes se
        había visto
      </p>

      <RouterLink to="/categorias" class="btn-primary inline-block px-6 py-2 rounded mb-8">Ver Categorías</RouterLink>

      <!-- Carrusel Categorías -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div v-for="cat in categorias.slice(0, 3)" :key="cat.nombre" class="text-center">
          <img :src="`/assets/images/${cat.imagen}`" :alt="cat.nombre" class="rounded-md" />
          <h3 class="font-semibold mt-2">{{ cat.nombre }}</h3>
          <p class="text-sm muted">{{ cat.descripcion }}</p>
        </div>
      </div>
    </section>

    <!-- Servicios -->
    <section class="px-4 py-12">
      <div class="text-center mb-6">
        <RouterLink to="/servicios" class="btn-primary inline-block px-6 py-2 rounded mb-8">Ver Servicios</RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div v-for="serv in servicios.slice(0, 3)" :key="serv.id" class="text-center">
          <img :src="`/assets/images/${serv.imagenes[0]}`" class="rounded-md" />
          <h3 class="font-semibold mt-2">{{ serv.titulo }}</h3>
          <p class="text-sm muted">{{ serv.eslogan }}</p>
        </div>
      </div>
    </section>

    <!-- Destacados -->
    <section class="px-4 py-12">
      <div class="text-center mb-6">
        <RouterLink to="/servicios" class="btn-primary inline-block px-6 py-2 rounded mb-8">Destacados</RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div v-for="dest in destacados.slice(0, 3)" :key="dest.id" class="text-center">
          <img :src="`/assets/images/${dest.imagenes[0]}`" class="rounded-md" />
          <h3 class="font-semibold mt-2">{{ dest.titulo }}</h3>
          <p class="text-sm muted">{{ dest.eslogan }}</p>
        </div>
      </div>
    </section>

    <!-- Comentarios -->
    <section class="px-4 py-12">
      <div class="text-center mb-6">
        <span class="btn-primary inline-block px-6 py-2 rounded mb-8">Comentarios</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
        <div v-for="com in comentarios.slice(0, 3)" :key="com.usuario + com.servicio" class="p-4 card rounded">
          <p class="mb-2 font-medium">{{ com.titulo }}</p>

          <div class="flex items-center space-x-2">
            <img :src="`/assets/images/${com.pfp}`" class="w-8 h-8 rounded-full" />
            <div>
              <p class="text-sm font-semibold">{{ com.usuario }}</p>
              <p class="text-xs muted">{{ com.puntuacion }}/5</p>
            </div>
          </div>

          <p class="mt-2 text-sm muted">{{ com.comentario }}</p>
        </div>
      </div>

      <div class="flex justify-center gap-4 mt-6">
        <RouterLink to="/" class="btn-primary px-4 py-2 rounded">Inicio</RouterLink>
        <button class="btn-secondary px-4 py-2 rounded">Deja un comentario</button>
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

<style scoped>
/* Wrapper principal: usa variables definidas en themes.css (no se cambia themes.css) */
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Texto "muted" (antes text-gray-600 / text-gray-500) */
.muted {
  color: var(--color-text-light);
  transition: color 180ms ease;
}

/* Tarjetas / items con borde sutil */
.card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid var(--color-background-light);
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

/* Botones primarios (antes bg-black text-white) */
.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Botones secundarios (antes bg-gray-200) */
.btn-secondary {
  background-color: var(--color-background-light);
  color: var(--color-text);
  transition: background-color 180ms ease, color 180ms ease;
}

img.rounded-md {
  width: 100%;
  height: 200px; /* ajusta según el alto que quieras */
  object-fit: cover;
  border-radius: 0.375rem; /* lo mismo que rounded-md */
}

a.btn-primary, a.btn-secondary {
  text-decoration: none;
}
</style>
