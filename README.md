# Clon de la interfaz de Google creado con HTML5 y CSS3

Proyecto de clonación de Google creado en el bootcamp de Tecnolochicas PRO, ahora con tests automatizados y CI/CD.

## 1. Intro
HTML5 trabaja d ela mano con CSS3 par acrear sitios web que usamos todos los días. Incluso, este sitio web donde estás viendo este contenido está contruido con HTML y CSS.
En este proyecto, conlos conocimientos de HTML y CSS realice la clonoción de la interfaz de Google.

## 2. Qué construí 
En este proyecto me enfoqué en construir la clonación de la interfaz de google 
Contien las siguientes secciones:

* Header: Sección que involucra la foto d perfil, íconos y el menú con hipervínculos.
* Main: Sección del contenedor para los elementos centrales de la página: logo, barra de busqueda. íconos y botones 
* footer: Sección que incluye hipervínculos  al final de la página 

## 3. Objetivo del proyecto
Aprender a utilizar las heramientas de HTML5 y CSS3

## 4. Tests y CI/CD

Este proyecto incluye tests automatizados con Jest y un pipeline de CI/CD con GitHub Actions.

### Características de Testing

- **Tests Unitarios**: Validación de funciones individuales
- **Tests de Integración**: Pruebas de interacción con el DOM
- **Cobertura de Código**: Reportes automáticos de cobertura
- **CI/CD Pipeline**: Tests ejecutados automáticamente en cada push

### Funcionalidad JavaScript

El proyecto ahora incluye:
- Sistema de búsqueda funcional
- Validación de términos de búsqueda
- Historial de búsquedas guardado en localStorage
- Integración con búsqueda de Google
- Función "Voy a tener suerte"

### Tests Incluidos

- Validación de búsquedas
- Sanitización de texto
- Construcción de URLs
- Gestión de historial
- Integración con el DOM
- Manejo de edge cases

## 5. Estructura del Proyecto

```
clondegoogle/
├── src/                    # Código fuente
│   ├── index.html         # Página principal
│   ├── css/
│   │   └── estilos.css    # Estilos CSS
│   └── js/
│       └── search.js      # Lógica de búsqueda
├── test/                   # Tests
│   └── search.test.js     # Tests unitarios e integración
├── public/                 # Archivos públicos
│   └── health            # Endpoint de health check
├── .github/
│   └── workflows/
│       └── deploy.yml     # Pipeline CI/CD
├── package.json           # Dependencias npm
├── jest.config.js         # Configuración Jest
├── Dockerfile             # Dockerfile
├── docker-compose.yml     # Blue-Green deployment
└── README.md
```

## 6. Instalación y Uso

### Requisitos Previos
- Node.js 18 o superior (para tests)
- npm o yarn
- Docker (opcional, para deployment)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Gabs-Contreras/clondegoogle.git

# Entrar al directorio
cd clondegoogle

# Instalar dependencias
npm install
```

### Ejecutar Tests

```bash
# Ejecutar tests en modo watch
npm test

# Ejecutar tests una vez
npm run test:ci

# Generar reporte de cobertura
npm run test:coverage
```

### Abrir el Proyecto

Simplemente abre el archivo `src/index.html` en tu navegador o usa un servidor local:

```bash
# Con Python 3 (desde la raíz del proyecto)
cd src && python -m http.server 8000

# Con Node.js (http-server)
npx http-server src
```

### Ejecutar con Docker

```bash
# Construir y ejecutar
docker build -t clondegoogle .
docker run -p 8080:80 clondegoogle

# Acceder en: http://localhost:8080
```

### Blue-Green Deployment con Docker Compose

```bash
# Levantar ambos ambientes
docker-compose up -d

# Acceder:
# Blue:  http://localhost:8081
# Green: http://localhost:8082

# Detener
docker-compose down
```

### Pipeline de CI/CD

El proyecto está configurado con GitHub Actions para:
1. Ejecutar todos los tests automáticamente
2. Generar reportes de cobertura
3. Solo hacer deploy si los tests pasan exitosamente
4. Implementar estrategia Blue-Green Deployment