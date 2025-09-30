<template>
  <label class="theme-switcher">
    <input type="checkbox" v-model="isDarkMode" @change="toggleTheme">
    <span class="slider"></span>
  </label>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const isDarkMode = ref(false);

const toggleTheme = () => {
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.body.classList.add('dark-mode');
  }
});

// Opcional: Esto asegura que el tema se aplique incluso si el estado cambia por fuera del componente
watch(isDarkMode, () => {
  toggleTheme();
});
</script>

<style scoped>
/*estilo del contenedor */
.theme-switcher {
  position: relative;
  display: inline-block;
  width: 55px; 
  height: 30px; 
}

/* Oculta el checkbox nativo */
.theme-switcher input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Estilos del "slider" o interruptor */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc; 
  transition: .4s;
  border-radius: 34px;
}

/* Círculo que se mueve dentro del slider */
.slider:before {
  position: absolute;
  content: "";
  height: 23px;
  width: 23px;
  left: 4px;
  bottom: 4px;
  background-color: var(--color-header-bg);
  transition: .4s;
  border-radius: 50%;
}

/* Color del slider cuando el checkbox está activado (modo oscuro) */
input:checked + .slider {
  background-color: var(--color-header-text);
}

/* Mueve el círculo a la derecha cuando el checkbox está activado */
input:checked + .slider:before {
  transform: translateX(26px);
}
</style>