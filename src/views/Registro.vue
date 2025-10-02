<template>
  <div class="page font-sans min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow flex items-center justify-center px-4 py-16">
      <form
        @submit.prevent="registrarUsuario"
        class="form-card shadow rounded p-6 space-y-4 w-full max-w-md"
      >
        <h2 class="text-2xl font-bold text-center mb-4">Crear una Cuenta</h2>
        <div>
          <label class="label block text-sm font-semibold mb-1">Nombre</label>
          <input
            v-model="nombre"
            type="text"
            placeholder="Tu nombre completo"
            class="input"
          />
        </div>

        <div>
          <label class="label block text-sm font-semibold mb-1"
            >Nombre de Usuario</label
          >
          <input
            v-model="usuario"
            type="text"
            placeholder="usuario123"
            class="input"
          />
        </div>
        <div>
          <label class="label block text-sm font-semibold mb-1"
            >Correo Electrónico</label
          >
          <input
            v-model="correo"
            type="email"
            placeholder="correo@ejemplo.com"
            class="input"
          />
        </div>
        <div>
          <label class="label block text-sm font-semibold mb-1"
            >Contraseña</label
          >
          <input
            v-model="contraseña"
            type="password"
            placeholder="********"
            class="input"
          />
        </div>
        <div>
          <label class="label block text-sm font-semibold mb-1"
            >Confirmar Contraseña</label
          >
          <input
            v-model="confirmar"
            type="password"
            placeholder="********"
            class="input"
          />
        </div>
        <div>
          <label class="label block text-sm font-semibold mb-1">Rol</label>
          <select v-model="rol" class="input">
            <option disabled value="">Selecciona un rol</option>
            <option value="contratista">Contratista</option>
            <option value="oferente">Oferente</option>
          </select>
        </div>
        <p v-if="error" class="error text-sm text-center">{{ error }}</p>
        <button
          type="submit"
          class="btn-primary w-full py-2 rounded"
          :disabled="loading"
        >
        {{ loading ? "Registrando..." : "Registrarse" }}
        </button>
        <div class="text-sm text-center muted mt-4">
          ¿Ya tienes cuenta?
          <router-link to="/inicio-sesion" class="link-cta"
            >Inicia sesión</router-link
          >
        </div>
      </form>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { useUsers } from "@/composables/useUser.js";

const router = useRouter();

// Se llama al composable para usar sus funciones
const { registerUser, loading, error } = useUsers();

const nombre = ref("");
const correo = ref("");
const usuario = ref("");
const contraseña = ref("");
const confirmar = ref("");
const rol = ref("contratista");

// La función ahora es async para poder llamar a la API
async function registrarUsuario() {
  error.value = "";

  // 1. Validación de campos vacíos
  if (
    !nombre.value ||
    !correo.value ||
    !usuario.value ||
    !contraseña.value ||
    !confirmar.value ||
    !rol.value
  ) {
    error.value = "Todos los campos son obligatorios.";
    return;
  }

  // 2. Validación de contraseñas
  if (contraseña.value !== confirmar.value) {
    error.value = "Las contraseñas no coinciden.";
    return;
  }

  // 3. Creamos el objeto con los datos del nuevo usuario
  const nuevoUsuario = {
    nombre: nombre.value,
    correo: correo.value,
    usuario: usuario.value,
    contraseña: contraseña.value,
    rol: rol.value,
  };

  // 4. Llamamos a la función del composable dentro de un try-catch
  try {
    await registerUser(nuevoUsuario);
    // Si tiene éxito, mostramos un mensaje y redirigimos
    alert("¡Registro completado con éxito!");
    router.push("/inicio-sesion");
  } catch (err) {
    // Si hay un error (ej: usuario ya existe), el composable ya asignó el mensaje a `error.value`
    // No necesitamos hacer nada más, el <p> en el template lo mostrará.
    console.error("Fallo en el registro desde el componente:", err);
  }
}
</script>
<style scoped>
/* Page wrapper uses theme colors (themes.css) */
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
  display: block;
}

/* Card / form background */
.form-card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  transition: background-color 180ms ease, color 180ms ease,
    border-color 180ms ease;
}

/* Labels */
.label {
  color: var(--color-text);
}

/* Inputs & selects & textarea */
.input {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  box-sizing: border-box;
  transition: background-color 180ms ease, color 180ms ease,
    border-color 180ms ease, box-shadow 150ms ease;
}

/* focus state uses primary button color for accent (adapts to theme) */
.input:focus {
  outline: none;
  border-color: var(--color-primary-button-bg);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
}

/* Primary button */
.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  border: 1px solid transparent;
  transition: background-color 150ms ease, color 150ms ease, opacity 120ms ease;
  cursor: pointer;
  text-align: center;
}

/* slight hover effect */
.btn-primary:hover {
  opacity: 0.95;
}

/* Link CTA color (bottom link) */
.link-cta {
  color: var(--color-primary-button-bg);
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.25rem;
}

/* muted text uses the theme "light text" variable */
.muted {
  color: var(--color-text-light);
}

/* error text (kept in red for clarity) */
.error {
  color: #ef4444;
}

/* small accessibility: ensure contrast for headings/strong text */
h1,
h2,
h3,
h4,
label,
.font-semibold {
  color: var(--color-text);
}
</style>
