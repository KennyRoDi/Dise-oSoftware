<template>
    <div class="bg-white text-gray-900 font-sans min-h-screen flex flex-col">
        <Navbar />

        <main class="flex-grow flex justify-center items-center px-4 py-16">
            <div class="w-full max-w-md">
                <form @submit.prevent="iniciarSesion" class="bg-gray-50 shadow rounded p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-semibold mb-1">Correo o Usuario</label>
                        <input v-model="inputUsuario" type="text" placeholder="usuario@correo.com"
                            class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold mb-1">Contraseña</label>
                        <input v-model="inputPassword" type="password" placeholder="********"
                            class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
                    </div>

                    <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

                    <button type="submit" class="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition">
                        Iniciar Sesión
                    </button>

                    <div class="text-sm text-center text-gray-500 mt-4">
                        ¿No tienes cuenta?
                        <router-link to="/registro"
                            class="text-black font-medium hover:underline">Regístrate</router-link>
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

<style scoped></style>
