<template>
    <header class="header">
        <img :src="`/assets/images/logoEF.png`" alt="Foto" class="header-logo" />
        <nav class="header-nav">
            <div class="menu-container" ref="menuContainerRef">
                <button @click="toggleMenu" class="menu-button">
                    Menú
                </button>

                <div v-if="isMenuOpen" class="dropdown-menu">
                    <RouterLink to="/" class="dropdown-link" @click="closeMenu">Inicio</RouterLink>
                    <RouterLink to="/categorias" class="dropdown-link" @click="closeMenu">Categorías</RouterLink>
                    <RouterLink to="/servicios" class="dropdown-link" @click="closeMenu">Servicios</RouterLink>
                    <RouterLink v-if="usuario"
                        :to="usuario.rol === 'oferente' ? `/perfil/${usuario.usuario}` : usuario.rol === 'administrador' ? '/revision' : '/cliente'"
                        class="dropdown-link" @click="closeMenu">
                        Perfil
                    </RouterLink>
                    
                    <hr class="dropdown-divider" />

                    <RouterLink v-if="!usuario" to="/inicio-sesion" class="dropdown-link" @click="closeMenu">
                        Iniciar Sesión
                    </RouterLink>
                    <button v-else @click="cerrarSesion" class="dropdown-logout-button">
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <ThemeSwitcher />
        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import ThemeSwitcher from './ThemeSwitcher.vue'

const router = useRouter()
const { usuario, logout } = useAuth()

// --- Lógica para el menú desplegable ---
const isMenuOpen = ref(false)
const menuContainerRef = ref(null)

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
    isMenuOpen.value = false
}

// Cierra el menú si se hace clic fuera de él
const handleClickOutside = (event) => {
    if (menuContainerRef.value && !menuContainerRef.value.contains(event.target)) {
        closeMenu()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

function cerrarSesion() {
    logout()
    router.push('/')
    closeMenu() 
}
</script>

<style scoped>
/* Estilos generales del header */
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    background-color: var(--color-header-bg);
    color: var(--color-header-text);
}

.header-logo {
    height: 4rem;
    width: auto;
}

.header-nav {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.menu-container {
    position: relative;
    display: inline-block;
}

.menu-button {
    background-color: var(--color-primary-button-bg);
    color: var(--color-primary-button-text);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s, color 0.3s;
}

.menu-button:hover {
    background-color: var(--color-primary-button-text);
    color: var(--color-primary-button-bg);
}

/* Estilos del menú desplegable */
.dropdown-menu {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    background-color: var(--color-header-bg);
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    border-radius: 0.375rem;
    padding: 0.5rem 0;
    z-index: 50;
    min-width: 180px;
    display: flex;
    flex-direction: column;
}

body.dark-mode .dropdown-menu {
    border-color: #4a5568;
}

/* Estilo para los enlaces normales del dropdown */
.dropdown-link {
    text-decoration: none;
    color: var(--color-header-text);
    padding: 0.75rem 1.5rem;
    display: block;
    transition: background-color 0.2s ease;
    text-align: left;
    background: none;
    border: none;
    width: 100%;
    font-size: 1rem;
}
.dropdown-menu {
        /* Se mantiene la alineación a la izquierda, que ya está corregida */
        right: 0;
        left: auto;
    }

.dropdown-link:hover {
    background-color: rgba(66, 65, 65, 0.534);
}

body.dark-mode .dropdown-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Estilo para la línea divisora */
.dropdown-divider {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 0.5rem 0;
}

body.dark-mode .dropdown-divider {
    border-top-color: #4a5568;
}

/* Estilo específico para el botón "Cerrar Sesión" dentro del menú */
.dropdown-logout-button {
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    display: block;
    transition: background-color 0.2s ease;
    text-align: left;
    background: none;
    border: none;
    width: 100%;
    cursor: pointer;
    font-size: 1rem; 

    /* Estilo distintivo */
    color: #ef4444; /* Rojo para indicar una acción destructiva */
}

.dropdown-logout-button:hover {
    background-color: rgba(239, 68, 68, 0.1); /* Fondo rojo muy claro al pasar el mouse */
}

/*resposivos*/
@media (max-width: 768px) {
    .header-logo {
        display: none;
    }

    .header-nav {
        width: 100%;
        justify-content: space-between;
    }

    .menu-button {
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
    }

    .dropdown-menu {
        /* Se mantiene la alineación a la izquierda, que ya está corregida */
        left: 0;
        right: auto;
    }
}
</style>