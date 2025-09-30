<template>
  <div class="page font-sans">
    <Navbar />

    <div v-if="loadingServicio" class="text-center py-20 muted">
      Cargando servicio...
    </div>
    <div v-else-if="errorServicio" class="text-center py-20 text-red-500">
      <p>Ocurrió un error al cargar el servicio.</p>
      <p class="text-sm mt-2">{{ errorServicio }}</p>
    </div>

    <div v-else-if="servicio">
      <section v-if="servicio.imagenes && servicio.imagenes.length > 1" class="relative h-[60vh] bg-cover bg-center"
        :style="`background-image: url('/assets/images/${servicio.imagenes[1]}')`">
        <div class="hero-overlay flex flex-col justify-center items-center text-center px-4">
          <h1 class="text-4xl font-bold mb-2">{{ servicio.titulo }}</h1>
          <p class="text-lg mb-4 muted eslogan">{{ servicio.eslogan }}</p>
          <RouterLink :to="`/agendar/${servicio.id}`" class="btn-primary px-6 py-2 rounded font-semibold">
            Agendar
          </RouterLink>
        </div>
      </section>

      <Footer />
    </div>
    
    <div v-else class="text-center py-20 muted">
      <p>Servicio no encontrado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useServices } from '@/composables/useServices.js'
import comentariosData from '@/assets/json/comentarios.json'

const route = useRoute()

const { services, loadAll, getById, loading: loadingServicio, error: errorServicio } = useServices()
const servicio = ref(null)
const resenasFiltradas = ref([])
const showModal = ref(false)
const selectedPackage = ref(null)

const showPackageDetails = (paquete) => {
    selectedPackage.value = paquete
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedPackage.value = null
}
watchEffect(async () => {
    const id = parseInt(route.params.id)
    if (!id) return
    
    // Primero, nos aseguramos de que todos los servicios estén cargados
    await loadAll()
    // Luego, usamos getById para buscar en la lista que ya tenemos en memoria
    const encontrado = getById(id)

    if (encontrado) {
        servicio.value = encontrado
        // La lógica para filtrar comentarios no cambia
        resenasFiltradas.value = comentariosData.filter(c => c.servicio === encontrado.titulo)
    } else {
        servicio.value = null
    }
})
</script>

<style scoped>
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

/* muted text */
.muted {
  color: var(--color-text-light);
  transition: color 180ms ease;
}

/* Cards */
.card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

/* Primary button (ej. Agendar) */
.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 180ms ease, color 180ms ease;
  text-decoration: none;
}


/* Secondary/alt button (ej. Ver más) */
.btn-alt {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid var(--color-footer-text);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: background-color 180ms ease, color 180ms ease;
  cursor: pointer;
}

/* YouTube-like button in modal */
.btn-youtube {
  background-color: #ef4444; /* rojo YouTube */
  color: #fff;
  text-decoration: none;
  transition: opacity 150ms ease;
}

/* Hero overlay: semitransparente sobre la imagen de fondo */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45));
  color: var(--color-header-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Modal backdrop y modal */
.modal-backdrop {
  background-color: rgba(0,0,0,0.6);
}

.modal {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border-radius: 0.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  transition: background-color 180ms ease, color 180ms ease;
}

/* Close button dentro del modal */
.close-btn {
  background: transparent;
  border: none;
  color: var(--color-footer-text);
  cursor: pointer;
  font-weight: 700;
}

/* Imágenes */
img.rounded-md {
  object-fit: cover;
}

/* suavizado en enlaces/botones que usan colores del theme */
.btn-primary:hover,
.btn-alt:hover,
.btn-youtube:hover {
  opacity: 0.9;
}
.hero-overlay .eslogan {
  color: var(--color-text2); /* cambia la variable si prefieres otra */
  transition: color 180ms ease;
}

/* asegurar que los textos con tamaño ya definidos mantengan contraste */
h1{
    color: var(--color-text2)
}
h2, h3, h4 {
  color: var(--color-text);
}
</style>
