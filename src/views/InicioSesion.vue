<template>
  <div class="page font-sans min-h-screen flex flex-col">
    <Navbar />

    <main class="flex-grow flex justify-center items-center px-4 py-16">
      <div class="w-full max-w-md">
        <form @submit.prevent="iniciarSesion" class="form-card shadow rounded p-6 space-y-4">

          <h2 class="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>

          <div class="space-y-3">
              </div>

          <div class="flex items-center">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="flex-shrink mx-4 text-gray-500 text-sm">o continuar con</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

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
            <div class="relative">
              <input 
                v-model="inputPassword" 
                :type="passwordFieldType" 
                placeholder="********"
                class="w-full input-field px-4 py-2 rounded pr-10" 
              />
              </div>
          </div>

          <p v-if="error" class="error-text text-sm text-center">{{ error }}</p>

          <button type="submit" class="w-full btn-primary py-2 rounded" :disabled="loading">
            {{ loading ? 'Verificando...' : 'Iniciar Sesión' }}
          </button>

          <div class="text-sm text-center meta-text pt-2">
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuth } from '@/composables/useAuth.js'
import { useUsers } from '@/composables/useUser.js'

const router = useRouter()
const inputUsuario = ref('')
const inputPassword = ref('')
const error = ref('')
const { login } = useAuth()
const { users, loadAll, loading } = useUsers()
const showPassword = ref(false)
const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'))

async function iniciarSesion() {
  error.value = '' 
  await loadAll()

  const usuarioEncontrado = users.value.find(
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
.page {
  background-color: var(--color-body-bg);
  color: var(--color-text);
  min-height: 100vh;
  transition: background-color 180ms ease, color 180ms ease;
}

.form-card {
  background-color: var(--color-background-light);
  color: var(--color-text);
  border-radius: 0.5rem;
  transition: background-color 180ms ease, color 180ms ease;
}

.input-field {
  width: 100%;
  background-color: var(--color-body-bg);
  color: var(--color-text);
  border: 1px solid var(--color-background-light);
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
  outline: none;
}

.input-field:focus {
  box-shadow: 0 0 0 3px var(--color-primary-button-bg);
}

.error-text {
  color: #dc2626;
}

.btn-primary {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: filter 120ms ease, opacity 120ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  filter: brightness(0.9);
}

.meta-text {
  color: var(--color-text-light);
}

.link {
  color: var(--color-primary-button-bg);
  font-weight: 600;
  margin-left: 0.25rem;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

input.rounded,
.input-field.rounded {
  border-radius: 0.375rem;
}

.btn-social-google {
  background-color: white;
  color: #444;
  border: 1px solid var(--color-border);
  font-weight: 500;
  transition: background-color 120ms ease;
}

.btn-social-google:hover {
  background-color: #f0f0f0;
}

.btn-social-github {
  background-color: #24292e;
  color: white;
  font-weight: 500;
  transition: background-color 120ms ease;
}

.btn-social-github:hover {
  background-color: #33383d;
}

.btn-social-github svg {
  color: white;
}
</style>