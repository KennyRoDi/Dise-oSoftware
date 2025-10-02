<template>
    <div class="page font-sans min-h-screen flex flex-col">
        <Navbar />

        <main class="flex-grow">
            <section class="px-4 py-12 max-w-4xl mx-auto">
                <div class="profile-card p-6 rounded shadow flex flex-col md:flex-row gap-6 items-center">
                    <img :src="`/assets/images/${usuario?.pfp}`" 
                        class="profile-img w-40 h-40 object-cover rounded-full" />
                    <div>
                        <p class="text-main"><strong>Nombre:</strong> {{ usuario?.nombre }}</p>
                        <p class="text-main"><strong>Usuario:</strong> {{ usuario?.usuario }}</p>
                        <p class="text-main"><strong>Correo:</strong> {{ usuario?.correo }}</p>
                        <p class="text-main"><strong>Contacto:</strong> {{ usuario?.contacto }}</p>
                    </div>
                </div>
            </section>

            <section v-if="solicitudesDelCliente.length" class="px-4 py-12 max-w-6xl mx-auto">
                <h2 class="text-2xl font-bold mb-6">Mis Solicitudes</h2>
                <div class="grid gap-6">
                    <div v-for="(sol, index) in solicitudesDelCliente" :key="index" class="request-card border rounded shadow p-6">
                        <h3 class="font-semibold text-lg mb-1">{{ sol.servicio }} - {{ sol.paquete }}</h3>
                        <p class="text-sm small-muted">{{ sol.fecha }} | {{ sol.ubicacion }}</p>
                        <p class="mt-2"><strong>Mensaje:</strong> {{ sol.mensaje }}</p>
                        <p class="small-muted"><strong>Contacto:</strong> {{ sol.correo }}</p>
                        <button @click="cancelarSolicitud(index)"
                            class="btn-danger mt-4">
                            Cancelar
                        </button>
                    </div>
                </div>
            </section>

            <section v-else class="text-center muted py-12 max-w-4xl mx-auto">
                <p>No has enviado ninguna solicitud todavía.</p>
            </section>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import solicitudesBase from '@/assets/json/solicitudes.json'
import { useAuth } from '@/composables/useAuth.js'

const { usuario } = useAuth()
const nuevasSolicitudes = ref(JSON.parse(localStorage.getItem('nuevasSolicitudes') || '[]'))

const solicitudesDelCliente = computed(() => {
    if (!usuario.value) return []
    const base = solicitudesBase.filter(s => s.cliente?.toLowerCase() === usuario.value.nombre.toLowerCase())
    const nuevas = nuevasSolicitudes.value.filter(s => s.cliente?.toLowerCase() === usuario.value.nombre.toLowerCase())
    return [...base, ...nuevas]
})

function cancelarSolicitud(index) {
    nuevasSolicitudes.value.splice(index - solicitudesBase.length, 1)
    localStorage.setItem('nuevasSolicitudes', JSON.stringify(nuevasSolicitudes.value))
}
</script>

<style scoped>
/* Page wrapper uses theme variables from themes.css */
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
  display: block;
}

.profile-card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid var(--color-footer-text);
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

/* Profile image border uses footer text color */
.profile-img {
  border: 3px solid var(--color-footer-text);
}

/* General "main" text (used instead of text-gray-700) */
.text-main {
  color: var(--color-text);
}

/* muted and small-muted text */
.muted {
  color: var(--color-text-light);
  transition: color 180ms ease;
}
.small-muted {
  color: var(--color-text-light);
  font-size: 0.875rem;
}

/* Request / solicitation card */
.request-card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid var(--color-footer-text);
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

/* Danger / cancel button */
.btn-danger {
  background-color: #dc2626;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;
}
.btn-danger:hover {
  background-color: #b91c1c;
}

/* Images */
.img-cover, .profile-img {
  object-fit: cover;
}

h2, h3 {
  color: var(--color-text);
}

button:focus, a:focus {
  outline: 3px solid rgba(0,0,0,0.06);
  outline-offset: 2px;
}
</style>
