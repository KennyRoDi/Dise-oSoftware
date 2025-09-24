<template>
    <div class="bg-white text-gray-900 font-sans min-h-screen">
        <Navbar />

        <section class="px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
            <div>
                <h2 class="text-3xl font-bold mb-4">Requisitos</h2>
                <p class="text-gray-600 mb-4">
                    Se debe cumplir con la mayoría de estos para poder dar el servicio, caso de no cumplir con alguno,
                    indicarlo en la sección de comentarios.
                </p>
                <ul class="list-disc list-inside text-gray-700">
                    <li v-for="(req, i) in servicio.requisitos" :key="i">{{ req }}</li>
                </ul>
            </div>
            <img :src="`/assets/images/${servicio.imagenes[1]}`" alt="Imagen presentación" class="rounded-md" />
        </section>

        <section class="px-4 py-12 max-w-4xl mx-auto">
            <h2 class="text-2xl font-bold mb-6">Envía tu solicitud</h2>
            <form @submit.prevent="enviarSolicitud" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                    <input v-model="nombre" type="text" placeholder="Nombre" class="border rounded px-4 py-2 w-full" />
                    <input v-model="apellidos" type="text" placeholder="Apellidos"
                        class="border rounded px-4 py-2 w-full" />
                    <input v-model="fechaEvento" type="date" placeholder="Fecha"
                        class="border rounded px-4 py-2 w-full" />
                </div>
                <input v-model="correo" type="email" placeholder="Correo electrónico"
                    class="border rounded px-4 py-2 w-full" />
                <input v-model="telefono" type="tel" placeholder="Número telefónico"
                    class="border rounded px-4 py-2 w-full" pattern="[0-9]{8}"
                    title="Por favor, ingresa un número de teléfono válido de 8 dígitos." />
                <select v-model="ubicacionSeleccionada" class="border rounded px-4 py-2 w-full">
                    <option value="" disabled>Selecciona una provincia</option>
                    <option v-for="provincia in provinciasCR" :key="provincia" :value="provincia">
                        {{ provincia }}
                    </option>
                </select>
                <div class="flex flex-wrap gap-2">
                    <span v-for="(paq, i) in servicio.paquetes" :key="i" @click="paqueteSeleccionado = paq.nombre"
                        class="bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
                        :class="{ 'bg-black text-white': paqueteSeleccionado === paq.nombre }">
                        {{ paq.nombre }}
                    </span>
                </div>
                <textarea v-model="comentarios" rows="4" class="w-full border rounded px-4 py-2"
                    placeholder="Comentarios"></textarea>
                <button type="submit" class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Enviar</button>
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
const correo = ref('') // Cambiado de 'contacto' a 'correo' para claridad
const telefono = ref('') // Nuevo campo para el número de teléfono
const ubicacionSeleccionada = ref('') // Nuevo campo para la ubicación
const paqueteSeleccionado = ref('')
const comentarios = ref('')
const fechaEvento = ref('')

// Lista de las 7 provincias de Costa Rica
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
    // Validaciones básicas antes de enviar
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
        correo: correo.value, // Ahora usa el ref 'correo'
        telefono: telefono.value, // Incluye el nuevo campo de teléfono
        mensaje: comentarios.value,
        fecha: fechaEvento.value,
        ubicacion: ubicacionSeleccionada.value, // Incluye la ubicación seleccionada
        servicio: servicio.value.titulo,
        paquete: paqueteSeleccionado.value,
        estado: 'pendiente'
    }

    const almacenadas = JSON.parse(localStorage.getItem('todasLasSolicitudes') || '[]');
    almacenadas.push(nuevaSolicitud);
    localStorage.setItem('todasLasSolicitudes', JSON.stringify(almacenadas));

    alert('¡Solicitud enviada correctamente!');
    // Limpiar formulario después de enviar
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

