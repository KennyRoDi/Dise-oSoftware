# EntertainFlix

## Descripción del proyecto.

EntertainFlix es una plataforma web especializada que centraliza y simplifica la contratación de servicios de entretenimiento (músicos, artistas, shows, etc.).

El proyecto aborda la ineficiencia de depender de redes sociales, ofreciendo a los oferentes un espacio de visibilidad dedicado y a los contratistas herramientas de búsqueda, filtrado, comparación y un sistema de reseñas.

La plataforma garantiza un flujo de trabajo asistido, desde la gestión de perfiles hasta la administración de solicitudes y contratos.

## Instrucciones de despliegue local.

**Clonar el repositorio**
```bash
git clone https://github.com/KennyRoDi/Dise-oSoftware.git

cd Dise-oSoftware
```
**Instalar dependencias**
```bash
npm install
```

**Ejecutar en modo desarrollo**
```bash
npm run dev
```

## Capturas de pantalla del sistema en funcionamiento.

#### Modo claro:

<img width="900" height="600" alt="Screenshot 2025-09-26 183019" src="https://github.com/user-attachments/assets/e6b42b1b-ccfe-4033-9b34-9ab9e87038d0" />

#### Modo oscuro:

<img width="900" height="600" alt="Screenshot 2025-09-26 183028" src="https://github.com/user-attachments/assets/fc66b991-0fb6-41ac-a63c-ab4c97b281f5" />

#### Perfil de oferente:

<img width="900" height="600" alt="Screenshot 2025-09-26 183146" src="https://github.com/user-attachments/assets/8a80394a-f0d8-4be8-b256-342c96ff4261" />

#### Perfil de contratista:

<img width="900" height="600" alt="Screenshot 2025-09-26 183940" src="https://github.com/user-attachments/assets/8391fe23-87f4-4548-9c3d-b2e262408a7d" />

#### Ventana de inicio y registro

<img width="900" height="600" alt="image" src="https://github.com/user-attachments/assets/c6e7f975-1f1d-44c9-8daf-8b6598367573" />   <img width="900" height="600" alt="Screenshot 2025-09-26 183045" src="https://github.com/user-attachments/assets/369f0fe7-d6a4-42c2-a883-206d4e597cb6" />


## Estructura del repositorio:

```plaintext
.
├── .github/workflows/                                     # Configuración para CI/CD en GitHub Actions
│   └── azure-static-web-apps-white-pebble-0f617fd0f.yml   # Despliegue en Azure
│
├── .vscode/                         # Configuración recomendada para VSCode
│   └── extensions.json
│
├── public/                          # Archivos públicos accesibles
│   └── assets/images/               # Imágenes estáticas
│   └── vite.svg
│
├── src/                             # Código fuente principal
│   ├── assets/                      # Recursos del proyecto
│   │   └── json/                    # Archivos de datos estáticos
│   │
│   ├── components/                  # Componentes reutilizables
│   │   ├── Footer.vue
│   │   ├── Navbar.vue
│   │   └── ThemeSwitcher.vue
│   │
│   ├── composables/                 # Lógica reutilizable (hooks)
│   │   └── useAuth.js
│   │
│   ├── router/                      # Configuración de rutas
│   │   └── index.js
│   │
│   ├── views/                       # Vistas/páginas principales
│   │   ├── Agendar.vue
│   │   ├── AgendarPrevista.vue
│   │   ├── CatalogoCategoria.vue
│   │   ├── Categorias.vue
│   │   ├── Chat.vue
│   │   ├── Cliente.vue
│   │   ├── Detalle.vue
│   │   ├── DetallePrevista.vue
│   │   ├── Inicio.vue
│   │   ├── InicioSesion.vue
│   │   ├── Perfil.vue
│   │   ├── Registro.vue
│   │   ├── Revision.vue
│   │   ├── Servicios.vue
│   │   └── Solicitudes.vue
│   │
│   ├── App.vue                      # Componente raíz de la aplicación
│   ├── main.js                      # Punto de entrada de la app
│   ├── style.css                    # Estilos globales
│   └── themes.css                   # Definición de temas
│
├── .gitignore                       # Archivos/carpetas ignorados por Git
├── README.md                        # Documentación principal
└── index.html                       # Archivo HTML base

```
## Referencias bibliográficas.

GitHub Docs. (s.f.). Actions. GitHub. Recuperado de: https://docs.github.com/en/actions

GitHub Docs. (s.f.). Hello World. GitHub. Recuperado de: https://docs.github.com/en/get-started/start-your-journey/hello-world

Vue.js. (s.f.). Introduction. Recuperado de: https://vuejs.org/guide/introduction.html

Tailwind CSS. (s.f.). Docs. Recuperado de: https://v2.tailwindcss.com/docs

Vite. (s.f.). Guide. Recuperado de: https://vite.dev/guide/

Postman. (s.f.). Overview. Postman Learning Center. Recuperado de: https://learning.postman.com/docs/introduction/overview/

Figma. (s.f.). Help Center. Recuperado de: https://help.figma.com/hc/en-us/categories/360002042553

draw.io. (s.f.). Getting started — Editor. Recuperado de: https://www.drawio.com/doc/getting-started-edito

Mozilla. (2025, 8 de julio). JavaScript (MDN Web Docs). Recuperado de: https://developer.mozilla.org/en-US/docs/Web/JavaScript

DevDocs. (s.f.). JavaScript documentation. Recuperado de: https://devdocs.io/javascript/
