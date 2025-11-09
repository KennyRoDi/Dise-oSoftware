<template>
  <div class="page font-sans min-h-screen">
    <Navbar />

    <div v-if="isLoadingServicio" class="text-center py-20">
      Cargando información del servicio...
    </div>
    <div v-else-if="errorServicio" class="text-center text-red-500 py-20">
      Error al cargar el servicio: {{ errorServicio }}
    </div>
    <div v-else-if="servicio">
      <section class="px-4 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 class="text-3xl font-bold mb-4">Requisitos</h2>
          <p class="muted mb-4">
            Se debe cumplir con la mayoría de estos para poder dar el servicio, caso de no
            cumplir con alguno, indicarlo en la sección de comentarios.
          </p>
          <ul class="list-disc list-inside">
            <li v-for="(req, i) in servicio.requisitos" :key="i">{{ req }}</li>
          </ul>
        </div>
        <img
          :src="`/assets/images/${servicio.imagenes[1]}`"
          alt="Imagen presentación"
          class="rounded-md"
        />
      </section>

      <section class="px-4 py-12 max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Envía tu solicitud</h2>
        <form @submit.prevent="enviarSolicitud" class="space-y-6">
          
          <div>
            <input
              v-model="nombre"
              type="text"
              placeholder="Nombre completo"
              class="input"
            />
          </div>

          <input
            v-model="correo"
            type="email"
            placeholder="Correo electrónico"
            class="input"
          />

          <input
            v-model="telefono"
            type="tel"
            placeholder="Número telefónico"
            class="input"
            pattern="[0-9]{8}"
            title="Por favor, ingresa un número de teléfono válido de 8 dígitos."
          />

          <input v-model="fechaEvento" type="date" placeholder="Fecha" class="input" />

          <select v-model="ubicacionSeleccionada" class="input">
            <option value="" disabled>Selecciona una provincia</option>
            <option v-for="provincia in provinciasCR" :key="provincia" :value="provincia">
              {{ provincia }}
            </option>
          </select>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="(paq, i) in servicio.paquetes"
              :key="i"
              @click="paqueteSeleccionado = paq.nombre"
              class="paquete cursor-pointer"
              :class="{ 'paquete-activo': paqueteSeleccionado === paq.nombre }"
            >
              {{ paq.nombre }}
            </span>
          </div>

          <textarea
            v-model="comentarios"
            rows="4"
            class="input"
            placeholder="Comentarios"
          ></textarea>

          <button type="submit" class="btn-primary px-6 py-2 rounded">Enviar</button>
        </form>
      </section>
    </div>
    <div v-else class="text-center text-xl py-20">Servicio no encontrado.</div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { useServices } from "@/composables/useServices.js";
import { useAuth } from "@/composables/useAuth.js"; // Para saber QUIÉN está logueado
import { useUsers } from "@/composables/useUser.js"; // ⭐️ Para OBTENER los datos del usuario

// --- Lógica de datos ---
const route = useRoute();
const {
  services,
  loadAll,
  getById,
  loading: isLoadingServicio,
  error: errorServicio,
} = useServices();
const servicio = ref(null);

// --- Lógica de Usuarios (para auto-rellenado) ---
const { usuario } = useAuth(); // Datos básicos de sesión
const { users, loadAll: loadAllUsers } = useUsers(); // Lista completa de usuarios

/* watchEffect: carga el servicio (sin cambios) */
watchEffect(async () => {
  const id = route.params.id;
  if (id) {
    await loadAll();
    servicio.value = getById(id);
  }
});

// --- Lógica del formulario ---
const nombre = ref("");
// const apellidos = ref(""); // ⭐️ ELIMINADO
const correo = ref("");
const telefono = ref("");
const ubicacionSeleccionada = ref("");
const paqueteSeleccionado = ref("");
const comentarios = ref("");
const fechaEvento = ref("");

/* ⭐️ NUEVO watchEffect: Para auto-rellenar el formulario ⭐️ */
watchEffect(async () => {
  // 1. Cargar la lista de usuarios de la API (solo si no se ha cargado)
  if (users.value.length === 0) {
    await loadAllUsers(); 
  }

  // 2. Si hay un usuario logueado (de useAuth)
  if (usuario.value) {
    // 3. Encontrar los detalles completos de ese usuario en la lista de useUsers
    // (Buscamos por ID, que es más fiable)
    const fullUserDetails = users.value.find(u => u.id === usuario.value.id);
    
    if (fullUserDetails) {
      // 4. Rellenar el formulario
      nombre.value = fullUserDetails.nombre;
      correo.value = fullUserDetails.correo;
      telefono.value = fullUserDetails.contacto ? fullUserDetails.contacto.toString() : "";
    } else {
      // Fallback si no se encuentra (usa datos básicos de useAuth)
      nombre.value = usuario.value.nombre;
      correo.value = usuario.value.correo;
    }
  }
});


/* Lista estática de provincias de Costa Rica (sin cambios) */
const provinciasCR = [
  "Alajuela",
  "Cartago",
  "Guanacaste",
  "Heredia",
  "Limón",
  "Puntarenas",
  "San José",
];

// =================================================================
// ⭐️ FUNCIÓN DE ENVÍO AL MICROSERVICIO (ACTUALIZADA) ⭐️
// =================================================================
async function enviarSolicitud() {
  // 1. Validación (actualizada sin apellidos)
  if (
    !nombre.value ||
    !correo.value ||
    !fechaEvento.value ||
    !ubicacionSeleccionada.value ||
    !paqueteSeleccionado.value
  ) {
    alert(
      "Por favor, completa todos los campos obligatorios."
    );
    return;
  }
  if (telefono.value && !/^\d{8}$/.test(telefono.value)) {
    alert("Por favor, ingresa un número de teléfono válido de 8 dígitos.");
    return;
  }

  // 2. Construcción del objeto solicitud (actualizado)
  const nuevaSolicitud = {
    cliente: nombre.value, // ⭐️ CAMBIADO (antes era nombre + apellido)
    correo: correo.value,
    telefono: telefono.value,
    mensaje: comentarios.value,
    fecha: fechaEvento.value,
    ubicacion: ubicacionSeleccionada.value,
    paquete: paqueteSeleccionado.value,
    
    // Datos clave (sin cambios)
    servicioTitulo: servicio.value.titulo, 
    artistaUsuario: servicio.value.titulo
  };

  // 3. Envío de datos al Microservicio (Express)
  try {
    const response = await fetch('http://localhost:3001/api/solicitudes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevaSolicitud),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.statusText}`);
    }

    // 4. Éxito y reseteo del formulario
    alert("¡Solicitud enviada correctamente a la API!");
    
    // Reseteamos solo los campos del evento
    // (No reseteamos nombre, correo, telefono)
    ubicacionSeleccionada.value = "";
    paqueteSeleccionado.value = "";
    comentarios.value = "";
    fechaEvento.value = "";

  } catch (error) {
    // 5. Manejo de errores
    console.error("Error al enviar la solicitud:", error);
    alert("Hubo un error al enviar la solicitud. Asegúrate de que el microservicio esté corriendo en 'http://localhost:3001'.");
  }
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