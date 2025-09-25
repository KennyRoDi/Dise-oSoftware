<template>
  <div class="page font-sans min-h-screen">
    <Navbar />

    <section class="px-4 py-12 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 strong-text text-center">
        Servicios en la categoría: {{ categoriaSeleccionada }}
      </h2>

      <div v-if="serviciosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div
          v-for="serv in serviciosFiltrados"
          :key="serv.id"
          class="card rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
        >
          <router-link :to="`/agendar/${serv.id}`">
            <img
              :src="`/assets/images/${serv.imagenes[0]}`"
              class="w-full h-48 object-cover object-center cursor-pointer"
              :alt="serv.titulo"
            />
          </router-link>

          <div class="p-4">
            <h3 class="font-bold text-lg mb-1 strong-text">{{ serv.titulo }}</h3>
            <p class="text-sm muted mb-2">{{ serv.categoria }}</p>
            <p class="text-sm muted mb-2">Ubicación: {{ serv.ubicacion }}</p>

            <router-link
              :to="`/detalle/${serv.id}`"
              class="btn-primary inline-block text-sm px-4 py-2 rounded mt-2"
            >
              Ver más
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="text-center muted text-lg py-10">
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

<style scoped>
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

.strong-text {
  color: var(--color-text);
}

/* Tarjeta de servicio */
.card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid transparent;
  box-shadow: var(--container-shadow);
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

/* Texto atenuado */
.muted {
  color: var(--color-text-light);
}

/* Botón primario (Ver más) */
.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: filter 120ms ease, opacity 120ms ease;
}
.btn-primary:hover {
  filter: brightness(0.92);
}

/* Asegurar object-fit correcto */
img.object-cover {
  object-fit: cover;
}
</style>
