<template>
    <div class="page font-sans min-h-screen">
        <Navbar />

        <section class="px-4 py-12 max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-8 text-center">Solicitudes Recibidas</h2>

            <div v-if="solicitudes.length" class="space-y-6">
                <div v-for="(sol, index) in solicitudes" :key="index" class="card p-6 rounded shadow">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-semibold">{{ sol.nombre }} - {{ sol.servicio }}</h3>
                            <p class="small-muted">{{ sol.fecha }} | {{ sol.ubicacion }}</p>
                        </div>
                        <div class="space-x-2">
                            <button class="accept-btn px-4 py-2 rounded">Aceptar</button>
                            <button class="reject-btn px-4 py-2 rounded">Rechazar</button>
                        </div>
                    </div>

                    <p><strong>Correo:</strong> {{ sol.correo }}</p>
                    <p><strong>Teléfono:</strong> {{ sol.telefono }}</p>
                    <p><strong>Paquete Seleccionado:</strong> {{ sol.paquete }}</p>
                    <p class="mt-2 text-main"><strong>Mensaje:</strong> {{ sol.mensaje }}</p>
                </div>
            </div>

            <div v-else class="text-center muted">No hay solicitudes por el momento.</div>
        </section>

        <Footer />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import solicitudesData from '@/assets/json/solicitudes.json'
import { useAuth } from '@/composables/useAuth.js'

const { usuario } = useAuth()

const todasLasSolicitudes = ref(solicitudesData)

const solicitudes = computed(() => {
    if (!usuario.value) return []
    return todasLasSolicitudes.value.filter(s => s.oferente === usuario.value.usuario)
})
</script>

<style scoped>
/* Página: usa variables del themes.css */
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Tarjeta genérica para cada solicitud */
.card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid var(--color-footer-text);
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

/* Texto principal (antes text-gray-700) */
.text-main {
  color: var(--color-text);
}

/* Muted / secundario (antes text-gray-500) */
.muted, .small-muted {
  color: var(--color-text-light);
  transition: color 180ms ease;
}

/* Botón aceptar (mantengo verde para claridad) */
.accept-btn {
  background-color: #16a34a;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;
}
.accept-btn:hover { background-color: #15803d; }

/* Botón rechazar (mantengo rojo para claridad) */
.reject-btn {
  background-color: #dc2626;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, opacity 120ms ease;
}
.reject-btn:hover { background-color: #b91c1c; }

/* Asegurar contraste en headings */
h2, h3 {
  color: var(--color-text);
}

/* Accesibilidad: foco visible */
button:focus, a:focus {
  outline: 3px solid rgba(0,0,0,0.06);
  outline-offset: 2px;
}
</style>
