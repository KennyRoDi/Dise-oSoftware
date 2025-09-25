<template>
  <div class="page font-sans">
    <Navbar />

    <section class="px-4 py-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div v-for="cat in categorias" :key="cat.nombre" class="category-card text-center rounded-md overflow-hidden">
          <img :src="`/assets/images/${cat.imagen}`" :alt="cat.nombre" class="rounded-md w-full h-64 object-cover" />
          <div class="p-4">
            <h3 class="font-semibold mt-2 category-title">{{ cat.nombre }}</h3>
            <p class="text-sm muted mt-1">{{ cat.descripcion }}</p>

            <router-link
              :to="`/catalogo-categoria/${cat.nombre}`"
              class="btn-primary inline-block mt-3 px-4 py-2 rounded hover:opacity-95 transition text-sm"
            >
              Ver más
            </router-link>
          </div>
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

<style scoped>
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Card individual de categoría */
.category-card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid transparent;
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

/* Pequeño hover para destacar */
.category-card:hover {
  transform: translateY(-4px);
}

/* Título */
.category-title {
  color: var(--color-text);
}

/* Texto atenuado (antes text-gray-600) */
.muted {
  color: var(--color-text-light);
}

/* Botón primario */
.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: filter 120ms ease, opacity 120ms ease;
}

/* Ajuste de imagen para garantizar cobertura */
img.object-cover {
  object-fit: cover;
}

/* Si quieres borde visible en cards, cambia border-color a una variable */
</style>
