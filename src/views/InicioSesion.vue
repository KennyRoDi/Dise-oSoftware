<template>
  <div class="page font-sans min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-grow flex justify-center items-center px-4 py-16">
      <div class="w-full max-w-md">
        <form @submit.prevent="iniciarSesion" class="form-card shadow rounded p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold mb-1">Correo o Usuario</label>
            <input
              v-model="inputUsuario"
              type="text"
              placeholder="usuario@correo.com"
              class="w-full input-field px-4 py-2 rounded"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-1">Contraseña</label>
            <input
              v-model="inputPassword"
              type="password"
              placeholder="********"
              class="w-full input-field px-4 py-2 rounded"
            />
          </div>

          <p v-if="error" class="error-text text-sm text-center">{{ error }}</p>

          <button type="submit" class="w-full btn-primary py-2 rounded">
            Iniciar Sesión
          </button>

          <div class="text-sm text-center meta-text mt-4">
            ¿No tienes cuenta?
            <router-link to="/registro" class="link">Regístrate</router-link>
          </div>
        </form>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import usuarios from '@/assets/json/usuarios.json'
import { useAuth } from '@/composables/useAuth.js'

const router = useRouter()
const inputUsuario = ref('')
const inputPassword = ref('')
const error = ref('')
const { login } = useAuth()

function iniciarSesion() {
  const usuarioEncontrado = usuarios.find(
    u =>
      (u.usuario === inputUsuario.value || u.correo === inputUsuario.value) &&
      u.contraseña === inputPassword.value
  )

  if (usuarioEncontrado) {
    login({
      id: usuarioEncontrado.id,
      nombre: usuarioEncontrado.nombre,
      usuario: usuarioEncontrado.usuario,
      rol: usuarioEncontrado.rol
    })

    router.push('/')
  } else {
    error.value = 'Credenciales inválidas. Verifica tu usuario y contraseña.'
  }
}
</script>

<style scoped>
/* Container page (usa variables del themes.css que ya tienes) */
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Form card (antes bg-gray-50) */
.form-card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border-radius: 0.5rem;
  transition: background-color 180ms ease, color 180ms ease;
}

/* Inputs */
.input-field {
  width: 100%;
  background-color: var(--color-body-bg);
  color: var(--color-text);
  border: 1px solid var(--color-background-light);
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
  outline: none;
}

/* enfoque del input: usa el color del botón primario como borde de enfoque */
.input-field:focus {
  box-shadow: 0 0 0 3px var(--color-primary-button-bg);
}

/* Error (puede quedar como rojo fijo para destacar) */
.error-text {
  color: #dc2626; /* rojo; si quieres lo convertimos a variable luego */
}

/* Botón primario (iniciar sesión) */
.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: filter 120ms ease, opacity 120ms ease;
  cursor: pointer;
}

/* Hover: oscurece ligeramente con filter para no depender de nuevas variables */
.btn-primary:hover {
  filter: brightness(0.9);
}

/* Texto secundario / meta (antes text-gray-500) */
.meta-text {
  color: var(--color-text-light);
}

/* Link a registro (antes text-black font-medium) */
.link {
  color: var(--color-primary-button-bg);
  font-weight: 600;
  margin-left: 0.25rem;
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}

/* Ajuste de imagen/inputs si usas rounded */
input.rounded,
.input-field.rounded {
  border-radius: 0.375rem;
}

/* Mantén la sombra del formulario (Tailwind 'shadow' ya está aplicada) */
/* si quieres una sombra distinta en dark mode podemos moverla a themes.css o a un global */
</style>
