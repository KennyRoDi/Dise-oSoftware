<template>
  <div class="page font-sans min-h-screen">
    <Navbar />

    <section class="px-4 py-12 max-w-7xl mx-auto">
      <h2 class="text-3xl font-bold mb-8 strong-text">Catálogo</h2>

      <div class="flex flex-col md:flex-row items-center gap-4 mb-8">
        <button @click="toggleSearch" class="btn-plain p-2 rounded">
          <span v-if="!showSearch">Buscar</span>
          <span v-else>Buscar</span>
        </button>

        <button @click="toggleFilters" class="btn-plain p-2 rounded">
          <span v-if="!showFilters">Filtros</span>
          <span v-else>Filtros</span>
        </button>

        <div v-if="showSearch" class="w-full md:w-1/3">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por título..."
            class="w-full input-field px-4 py-2 mt-2 md:mt-0 rounded"
          />
        </div>
      </div>

      <div v-if="showFilters" class="mb-8 space-y-4 p-4 panel rounded-lg">
        <div>
          <h3 class="font-semibold mb-2 text-lg strong-text">Filtrar por Categoría</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="cat in categorias"
              :key="cat.nombre"
              @click="filtroCategoria = filtroCategoria === cat.nombre ? '' : cat.nombre"
              class="chip px-4 py-2 rounded-full text-sm cursor-pointer transition"
              :class="{ 'chip-active': filtroCategoria === cat.nombre }"
            >
              {{ cat.nombre }}
            </span>
          </div>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-lg strong-text">Precio Máximo</h3>
          <input
            v-model="precioMax"
            type="range"
            min="0"
            max="10000"
            step="100"
            class="w-full range-input"
          />
          <p class="text-sm muted">Hasta <span class="font-bold strong-text">${{ precioMax }}</span></p>
        </div>

        <div>
          <h3 class="font-semibold mb-2 text-lg strong-text">Filtrar por Ubicación</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="ubi in ubicacionesDisponibles"
              :key="ubi"
              @click="filtroUbicacion = filtroUbicacion === ubi ? '' : ubi"
              class="chip px-4 py-2 rounded-full text-sm cursor-pointer transition"
              :class="{ 'chip-active': filtroUbicacion === ubi }"
            >
              {{ ubi }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="serviciosFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div
          v-for="serv in serviciosFiltrados"
          :key="serv.id"
          class="card rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
        >
          <img :src="`/assets/images/${serv.imagenes[0]}`" class="w-full h-48 object-cover object-center" :alt="serv.titulo" />
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
        <p>No se encontraron servicios que coincidan con los criterios de búsqueda y filtros.</p>
        <p class="mt-2">Intenta ajustar tus selecciones.</p>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // Import onMounted
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import serviciosData from '@/assets/json/servicios.json'; // Initial static services
import categoriasData from '@/assets/json/categorias.json';

const servicios = ref([]); // This will now hold combined data
const categorias = ref(categoriasData);
const showFilters = ref(false);
const showSearch = ref(false);
const searchQuery = ref('');
const filtroCategoria = ref('');
const filtroUbicacion = ref('');
const precioMax = ref(10000);

// Computed property for available locations, updated after services are loaded
const ubicacionesDisponibles = computed(() => {
    // Collect all unique locations from the combined services
    const locations = new Set(servicios.value.map(s => s.ubicacion));
    return Array.from(locations).sort(); // Convert to array and sort for consistency
});

const serviciosFiltrados = computed(() => {
    return servicios.value.filter(s => {
        // Ensure that `s.titulo` and `s.ubicacion` exist before calling toLowerCase()
        const tituloLower = s.titulo ? s.titulo.toLowerCase() : '';
        const ubicacionLower = s.ubicacion ? s.ubicacion.toLowerCase() : '';

        const coincideBusqueda = tituloLower.includes(searchQuery.value.toLowerCase());
        const coincideCategoria = filtroCategoria.value ? s.categoria === filtroCategoria.value : true;
        const coincideUbicacion = filtroUbicacion.value ? ubicacionLower === filtroUbicacion.value.toLowerCase() : true;
        
        // Ensure s.paquetes exists and is an array before using .some()
        const coincidePrecio = s.paquetes && Array.isArray(s.paquetes) ? s.paquetes.some(p => p.precio <= precioMax.value) : false;
        
        return coincideBusqueda && coincideCategoria && coincideUbicacion && coincidePrecio;
    });
});

function toggleFilters() {
    showFilters.value = !showFilters.value;
}

function toggleSearch() {
    showSearch.value = !showSearch.value;
}

onMounted(() => {
    let allServices = [...serviciosData];

    const approvedServicesJSON = localStorage.getItem('approvedServices');
    if (approvedServicesJSON) {
        try {
            const approvedServices = JSON.parse(approvedServicesJSON);
            const existingIds = new Set(allServices.map(s => s.id));
            approvedServices.forEach(approvedServ => {
                if (!existingIds.has(approvedServ.id)) {
                    allServices.push(approvedServ);
                    existingIds.add(approvedServ.id); // Add new ID to the set
                }
            });
        } catch (e) {
            console.error("Error parsing approved services from localStorage:", e);
        }
    }

    servicios.value = allServices;
});
</script>

<style scoped>
/* Page wrapper uses your existing theme CSS variables */
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Strong headings */
.strong-text {
  color: var(--color-text);
}

/* Muted text (antes text-gray-600 / text-gray-500) */
.muted {
  color: var(--color-text-light);
  transition: color 180ms ease;
}

/* Panel (filtros) */
.panel {
  background-color: var(--color-background-light);
  border: 1px solid transparent;
  color: var(--color-text);
  transition: background-color 180ms ease, color 180ms ease;
}

/* Plain small buttons */
.btn-plain {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid rgba(0,0,0,0.06);
  transition: filter 120ms ease, transform 120ms ease;
}
.btn-plain:hover { filter: brightness(0.98); transform: translateY(-1px); }

/* Card for each servicio */
.card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border: 1px solid transparent;
  box-shadow: var(--container-shadow);
  transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
}

/* Primary button (Ver más) */
.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: filter 120ms ease, opacity 120ms ease;
}
.btn-primary:hover { filter: brightness(0.92); }

/* Chip (categoria / ubicacion pills) */
.chip {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border-radius: 9999px;
  padding: 0.45rem 0.9rem;
}
.chip-active {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
}

/* Range input accent */
.range-input {
  accent-color: var(--color-primary-button-bg);
  margin-top: 0.25rem;
}

/* Inputs */
.input-field {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  border: 1px solid var(--color-background-light);
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
  outline: none;
}
.input-field:focus {
  box-shadow: 0 0 0 3px var(--color-primary-button-bg);
}

/* Image object-fit helper (keeps original behavior) */
img.object-cover {
  object-fit: cover;
}

/* Small utilities */
.transition-transform { transition: transform 160ms ease; }
</style>
