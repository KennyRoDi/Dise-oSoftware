<template>
    <div v-if="servicio && servicio.titulo" class="page font-sans">
        <Navbar />

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

        <section class="px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h2 class="text-2xl font-bold mb-2">¿Quién Soy?</h2>
                <p class="muted">{{ servicio.quien_soy }}</p>
            </div>
            <img :src="`/assets/images/${servicio.imagenes[2]}`" class="rounded-md" />
        </section>

        <section class="px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <img :src="`/assets/images/${servicio.imagenes[3]}`" class="rounded-md" />
            <div>
                <h2 class="text-2xl font-bold mb-2">¿Qué Hago?</h2>
                <p class="muted">{{ servicio.que_hago }}</p>
            </div>
        </section>

        <section class="px-4 py-12 max-w-6xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Paquetes</h2>
            <div class="grid md:grid-cols-3 gap-6">
                <div v-for="(paq, index) in servicio.paquetes" :key="index" class="card p-4">
                    <a v-if="paq.video_youtube" :href="paq.video_youtube" target="_blank">
                        <img :src="`/assets/images/${servicio.imagenes[index + 4]}`" class="rounded mb-2 cursor-pointer"
                            :alt="paq.nombre" />
                    </a>
                    <img v-else :src="`/assets/images/${servicio.imagenes[index + 4]}`" class="rounded mb-2"
                        :alt="paq.nombre" />

                    <h3 class="font-semibold">{{ paq.nombre }}</h3>
                    <p class="text-sm muted">{{ paq.descripcion }}</p>
                    <p class="font-bold mt-1">$ {{ paq.precio }}</p>
                    <button @click="showPackageDetails(paq)" class="btn-alt mt-3">
                        Ver más
                    </button>
                </div>
            </div>
        </section>

        <div v-if="showModal && selectedPackage" class="modal-backdrop fixed inset-0 flex items-center justify-center p-4 z-50">
            <div class="modal relative max-w-md w-full rounded-lg p-6">
                <button @click="closeModal" class="close-btn absolute top-3 right-3 text-2xl">×</button>
                <h3 class="text-xl font-bold mb-3">{{ selectedPackage.nombre }}</h3>
                <p class="muted mb-2">{{ selectedPackage.descripcion }}</p>
                <p class="font-bold text-lg mb-3">$ {{ selectedPackage.precio }}</p>
                <div v-if="selectedPackage.detalles && selectedPackage.detalles.length > 0" class="mb-4">
                    <h4 class="font-semibold mb-1">Detalles del paquete:</h4>
                    <ul class="list-disc list-inside muted">
                        <li v-for="(detail, i) in selectedPackage.detalles" :key="i">{{ detail }}</li>
                    </ul>
                </div>
                <a :href="selectedPackage.video_youtube" target="_blank"
                    class="btn-youtube inline-block px-5 py-2 rounded" v-if="selectedPackage.video_youtube">
                    Ver en YouTube
                </a>
            </div>
        </div>

        <section class="px-4 py-12 max-w-6xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Reseñas</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div v-for="(resena, index) in resenasFiltradas" :key="index" class="card p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <img :src="`/assets/images/${resena.pfp}`" class="w-10 h-10 rounded-full" />
                        <div>
                            <p class="font-semibold">{{ resena.titulo }}</p>
                            <p class="text-sm muted">{{ resena.usuario }}</p>
                        </div>
                    </div>
                    <p class="muted">{{ resena.comentario }}</p>
                </div>
            </div>
        </section>

        <Footer />
    </div>
    <div v-else class="text-center py-20 muted">Cargando servicio...</div>
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
