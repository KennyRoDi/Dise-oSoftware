<template>
    <header class="flex justify-between items-center p-4 shadow bg-white relative">
        <h1 class="text-xl font-bold z-10">ENTERTAINFLIX</h1>

        <span v-if="usuario" class="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-700 font-medium">
            Hola, {{ usuario.nombre }}!
        </span>

        <nav class="space-x-4 flex items-center z-10">
            <RouterLink to="/chat" class="hover:underline">💬</RouterLink>
            <RouterLink to="/" class="hover:underline">Inicio</RouterLink>
            <RouterLink to="/categorias" class="hover:underline">Categorías</RouterLink>
            <RouterLink to="/servicios" class="hover:underline">Servicios</RouterLink>

            <RouterLink v-if="usuario"
                :to="usuario.rol === 'oferente' ? `/perfil/${usuario.usuario}` : usuario.rol === 'administrador' ? '/revision' : '/cliente'"
                class="hover:underline">
                Perfil
            </RouterLink>

            <button v-if="usuario" @click="cerrarSesion"
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                Cerrar Sesión
            </button>

            <RouterLink v-else to="/inicio-sesion" class="bg-black text-white px-3 py-1 rounded">
                Iniciar Sesión
            </RouterLink>
        </nav>
    </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'

const router = useRouter()
const { usuario, logout } = useAuth()

function cerrarSesion() {
    logout()
    router.push('/')
}
</script>
