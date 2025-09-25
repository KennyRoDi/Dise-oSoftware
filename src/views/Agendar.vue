<template>
    <div class="page font-sans min-h-screen">
        <Navbar />

        <section class="px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            <div>
                <h2 class="text-3xl font-bold mb-4">Requisitos</h2>
                <p class="muted mb-4">
                    Se debe cumplir con la mayoría de estos para poder dar el servicio, caso de no cumplir con alguno,
                    indicarlo en la sección de comentarios.
                </p>
                <ul class="list-disc list-inside">
                    <li v-for="(req, i) in servicio.requisitos" :key="i">{{ req }}</li>
                </ul>
            </div>
            <img :src="`/assets/images/${servicio.imagenes[1]}`" alt="Imagen presentación" class="rounded-md" />
        </section>

        <section class="px-4 py-12 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Envía tu solicitud</h2>
            <form @submit.prevent="enviarSolicitud" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                    <input v-model="nombre" type="text" placeholder="Nombre" class="input" />
                    <input v-model="apellidos" type="text" placeholder="Apellidos" class="input" />
                    <input v-model="fechaEvento" type="date" placeholder="Fecha" class="input" />
                </div>
                <input v-model="correo" type="email" placeholder="Correo electrónico" class="input" />
                <input v-model="telefono" type="tel" placeholder="Número telefónico"
                    class="input" pattern="[0-9]{8}"
                    title="Por favor, ingresa un número de teléfono válido de 8 dígitos." />
                <select v-model="ubicacionSeleccionada" class="input">
                    <option value="" disabled>Selecciona una provincia</option>
                    <option v-for="provincia in provinciasCR" :key="provincia" :value="provincia">
                        {{ provincia }}
                    </option>
                </select>
                <div class="flex flex-wrap gap-2">
                    <span v-for="(paq, i) in servicio.paquetes" :key="i" @click="paqueteSeleccionado = paq.nombre"
                        class="paquete"
                        :class="{ 'paquete-activo': paqueteSeleccionado === paq.nombre }">
                        {{ paq.nombre }}
                    </span>
                </div>
                <textarea v-model="comentarios" rows="4" class="input"
                    placeholder="Comentarios"></textarea>
                <button type="submit" class="btn-primary px-6 py-2 rounded">Enviar</button>
            </form>
        </section>

        <Footer />
    </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import serviciosData from '@/assets/json/servicios.json'

const route = useRoute()
const servicio = ref({})
const nombre = ref('')
const apellidos = ref('')
const correo = ref('')
const telefono = ref('')
const ubicacionSeleccionada = ref('')
const paqueteSeleccionado = ref('')
const comentarios = ref('')
const fechaEvento = ref('')

const provinciasCR = [
    'Alajuela',
    'Cartago',
    'Guanacaste',
    'Heredia',
    'Limón',
    'Puntarenas',
    'San José'
]

watchEffect(() => {
    const id = parseInt(route.params.id)
    servicio.value = serviciosData.find(s => s.id === id) || {}
})

function enviarSolicitud() {
    if (!nombre.value || !apellidos.value || !correo.value || !fechaEvento.value || !ubicacionSeleccionada.value || !paqueteSeleccionado.value) {
        alert('Por favor, completa todos los campos obligatorios (Nombre, Apellidos, Correo, Fecha, Ubicación, y selecciona un Paquete).');
        return;
    }

    if (telefono.value && !/^\d{8}$/.test(telefono.value)) {
        alert('Por favor, ingresa un número de teléfono válido de 8 dígitos.');
        return;
    }

    const idUnico = Date.now() + Math.random().toString(36).substr(2, 9);

    const nuevaSolicitud = {
        id: idUnico,
        cliente: `${nombre.value} ${apellidos.value}`,
        correo: correo.value,
        telefono: telefono.value,
        mensaje: comentarios.value,
        fecha: fechaEvento.value,
        ubicacion: ubicacionSeleccionada.value,
        servicio: servicio.value.titulo,
        paquete: paqueteSeleccionado.value,
        estado: 'pendiente'
    }

    const almacenadas = JSON.parse(localStorage.getItem('todasLasSolicitudes') || '[]');
    almacenadas.push(nuevaSolicitud);
    localStorage.setItem('todasLasSolicitudes', JSON.stringify(almacenadas));

    alert('¡Solicitud enviada correctamente!');
    nombre.value = '';
    apellidos.value = '';
    correo.value = '';
    telefono.value = '';
    ubicacionSeleccionada.value = '';
    paqueteSeleccionado.value = '';
    comentarios.value = '';
    fechaEvento.value = '';
}
</script>

<style scoped>
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  transition: background-color 180ms ease, color 180ms ease;
}

.muted {
  color: var(--color-text-light);
  transition: color 180ms ease;
}

.input {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid var(--color-footer-text);
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  width: 100%;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

.paquete {
  background-color: var(--color-background-light);
  color: var(--color-text);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 180ms ease, color 180ms ease;
}

.paquete-activo {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
}
</style>
