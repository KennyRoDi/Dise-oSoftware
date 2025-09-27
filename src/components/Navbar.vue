<template>
    <header class="header">
        <img :src="`/assets/images/logoEF.png`" alt="Foto" class="header-logo" />
        <nav class="header-nav">
            <RouterLink to="/" class="nav-link">Inicio</RouterLink>
            <RouterLink to="/categorias" class="nav-link">Categorías</RouterLink>
            <RouterLink to="/servicios" class="nav-link">Servicios</RouterLink>
            <RouterLink v-if="usuario"
                :to="usuario.rol === 'oferente' ? `/perfil/${usuario.usuario}` : usuario.rol === 'administrador' ? '/revision' : '/cliente'"
                class="nav-link">
                Perfil
            </RouterLink>
            <button v-if="usuario" @click="cerrarSesion" class="logout-button">
                Cerrar Sesión
            </button>
            <RouterLink v-else to="/inicio-sesion" class="login-link">
                Iniciar Sesión
            </RouterLink>
            <span class="theme-text">⏾</span>
            <ThemeSwitcher /> </nav>
    </header>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import ThemeSwitcher from './ThemeSwitcher.vue'; // <-- Importa el componente

const router = useRouter()
const { usuario, logout } = useAuth()

function cerrarSesion() {
    logout()
    router.push('/')
}
</script>

<style scoped>
/* Estilos para el modo claro */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  background-color: var(--color-header-bg);
  color: var(--color-header-text);
  position: relative;
}
.header-logo {
  height: 4rem;
  width: auto;
  z-index: 10;
}

.header-title {
  font-size: 1.25rem;
  font-weight: bold;
  z-index: 10;
}

.header-greeting {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.875rem;
  color: var(--color-header-text);
  font-weight: 500;
}

.header-nav {
  display: flex;
  align-items: center;
  z-index: 10;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: var(--color-header-text);
  transition: color 0.3s ease;
}

.nav-link:hover {
  text-decoration: underline;
}

.logout-button {
  background-color: #ef4444; /* Rojo fijo */
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #dc2626; /* Rojo más oscuro */
}

.login-link {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}

/* El modo oscuro cambia automáticamente estos valores */
body.dark-mode .header {
  background-color: var(--color-header-bg);
  color: var(--color-header-text);
}

body.dark-mode .nav-link {
  color: var(--color-header-text);
}

body.dark-mode .header-title {
  color: var(--color-header-text);
}

body.dark-mode .header-greeting {
  color: var(--color-text);
}

body.dark-mode .login-link {
  background-color: var(--color-primary-button-bg);
  color: var(--color-primary-button-text);
}
.header-nav {
  display: flex;
  align-items: center;
  z-index: 10;
  gap: 1rem;
}

@media (max-width: 768px) {
    .header {
        /* Volvemos a la dirección horizontal por defecto, pero con más compresión */
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 0.5rem; /* Reducimos el padding general */
    }

    .header-logo {
        /* Solución clave: OCULTAR EL LOGO en móviles */
        display: none; 
    }

    .header-greeting {
        /* Ocultamos el saludo para liberar espacio, o lo dejamos pequeño y a la izquierda */
        display: none; 
        /* Si quieres dejarlo, usa: 
           position: static; transform: none; font-size: 0.6rem; margin-right: 0.5rem;
        */
    }

    .header-nav {
        /* Permitimos envolver, aunque el objetivo sea forzar una fila */
        flex-wrap: nowrap; /* Desactivamos el envolvimiento para forzar la fila */
        justify-content: space-between;
        gap: 0.5rem; /* Reducimos el espacio entre elementos */
        width: 100%; /* Ocupa todo el ancho disponible */
        margin-top: 0;
    }

    .nav-link,
    .logout-button,
    .login-link {
        /* Hacemos los elementos mucho más pequeños */
        font-size: 0.75rem; /* Texto pequeño, esencial para caber */
        padding: 0.4rem 0.5rem; /* Padding muy reducido */
        margin-bottom: 0; /* Sin margen inferior */
        flex-shrink: 0; /* Evita que el navegador los comprima aún más */
        /* Eliminamos el display: block y width: 100% de la solución anterior */
    }
    
    .login-link {
        /* Aseguramos que el botón de sesión también sea compacto */
        font-size: 0.75rem;
        padding: 0.4rem 0.5rem;
    }

    .theme-text {
        /* Ocultamos el ícono de texto '⏾' y confiamos solo en el componente ThemeSwitcher */
        display: none;
    }

    /* Ajuste para el ThemeSwitcher para que quede junto a los botones */
    .header-nav > * {
        /* Asegura que todos los hijos se alineen y sean compactos */
        align-self: center;
    }
}
</style>