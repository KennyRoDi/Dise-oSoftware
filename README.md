# EntertainFlix

## Descripción del proyecto.

EntertainFlix es una plataforma web especializada que centraliza y simplifica la contratación de servicios de entretenimiento (músicos, artistas, shows, etc.).

El proyecto aborda la ineficiencia de depender de redes sociales, ofreciendo a los oferentes un espacio de visibilidad dedicado y a los contratistas herramientas de búsqueda, filtrado, comparación y un sistema de reseñas.

La plataforma garantiza un flujo de trabajo asistido, desde la gestión de perfiles hasta la administración de solicitudes y contratos.

## Instrucciones de despliegue local.

**Clonar el repositorio**
```bash
git clone https://github.com/KennyRoDi/Dise-oSoftware.git

cd Entertainflix
cd services
cd microservice-frontend
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

```bash
EntertainFlix/
└── services/
    ├── microservice-frontend/
    │── .github/
    │   └── workflows/
    │── .vscode/
    │── public/
    │   └── assets/
    │       └── images/   
    │   └── vite.svg
    │
    │── src/
    │   ├── assets/
    │   │   └── json/     
    │   ├── components/   
    │   ├── composables/
    │   │   └── useAuth.js
    │   ├── router/
    │   │   └── index.js
    │   ├── views/        
    │   ├── App.vue      
    │   ├── main.js
    │   ├── style.css
    │   └── themes.css
    │
    │── .gitignore
    │── README.md
    │── index.html
    │── package.json
    │── vite.config.js
    │── tailwind.config.js
    ├── microservice-java/
    ├── microservice-js/
    └── microservice-py/
```
## Referencias bibliográficas.
Broadcom. (s.f.). Spring Boot. Spring. Recuperado de: https://spring.io/projects/spring-boot#overview 

DevDocs. (s.f.). JavaScript documentation. Recuperado de: https://devdocs.io/javascript/

draw.io. (s.f.). Getting started — Editor. Recuperado de: https://www.drawio.com/doc/getting-started-edito 

Express. (n.d.). Express - Node.js web application framework. Recuperado de: https://expressjs.com/

Figma. (s.f.). Help Center. Recuperado de: https://help.figma.com/hc/en-us/categories/360002042553

GeeksforGeeks. (2025, 23 de julio). Hexagonal architecture - system design. Recuperado de: https://www.geeksforgeeks.org/system-design/hexagonal-architecture-system-design/

GeeksforGeeks. (2025, 23 de julio). SQL cheat sheet ( basic to advanced). Recuperado de: https://www.geeksforgeeks.org/sql/sql-cheat-sheet/

GeeksforGeeks. (2025, 29 de agosto). Spring Boot tutorial. Recuperado de: https://www.geeksforgeeks.org/advance-java/spring-boot/

GeeksforGeeks. (2025, 10 de septiembre). FastAPI tutorial. Recuperado de: https://www.geeksforgeeks.org/python/fastapi-tutorial/

GeeksforGeeks. (2025, 24 de septiembre). Express.js tutorial. Recuperado de: https://www.geeksforgeeks.org/node-js/express-js/

GeeksforGeeks. (2025, 30 de octubre). Introduction to REST API. Recuperado de: https://www.geeksforgeeks.org/node-js/rest-api-introduction/

GeeksforGeeks. (2025, 7 de noviembre). Introduction to GitHub Actions. Recuperado de: https://www.geeksforgeeks.org/git/github-actions/

GitHub Docs. (s.f.). Actions. GitHub. Recuperado de: https://docs.github.com/en/actions 

GitHub Docs. (s.f.). Hello World. GitHub. Recuperado de: https://docs.github.com/en/get-started/start-your-journey/hello-world 

MongoDB, Inc. (2025). Welcome to the MongoDB docs. MongoDB. Recuperado de: https://www.mongodb.com/docs/

Mozilla. (2025, 8 de julio). JavaScript (MDN Web Docs). Recuperado de: https://developer.mozilla.org/en-US/docs/Web/JavaScript

Postman. (s.f.). Overview. Postman Learning Center. Recuperado de: https://learning.postman.com/docs/introduction/overview/ 

Ramírez, S. (s.f.). FastAPI. Recuperado de: https://fastapi.tiangolo.com/ 

Refsnes Data. (2025). MongoDB tutorial. W3Schools. Recuperado de: https://www.w3schools.com/mongodb/

Refsnes Data. (2025). PostgreSQL tutorial. W3Schools. Recuperado de: https://www.w3schools.com/postgresql/index.php

Tailwind CSS. (s.f.). Docs. Recuperado de: https://v2.tailwindcss.com/docs 

The PostgreSQL Global Development Group. (2025). PostgreSQL 18.0 documentation. PostgreSQL. Recuperado de: https://www.postgresql.org/docs/current/index.html 

Vite. (s.f.). Guide. Recuperado de: https://vite.dev/guide/ 

Vue.js. (s.f.). Introduction. Recuperado de: https://vuejs.org/guide/introduction.html 
