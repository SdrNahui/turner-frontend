# Turamali Masajes — Frontend

Frontend del sistema de gestión de turnos para Turamali Masajes, desarrollado con React + Vite + Tailwind CSS.
Proyecto real usado diariamente por el negocio familiar, migrado desde vanilla JS + HTML a React como parte del aprendizaje.

## Tecnologías

- React 19
- Vite 9
- Tailwind CSS v4
- React Router DOM
- SweetAlert2
- Vite PWA Plugin

## Funcionalidades

- Dashboard con calendario interactivo, disponibilidad semanal y reporte financiero
- Gestión completa de turnos (crear, confirmar, reorganizar, finalizar, cancelar)
- Gestión de clientes con tipo automático (Nuevo / Regular / Frecuente)
- Gestión de masajes con precios y duración
- Login con JWT y roles (ADMIN / VIEWER)
- PWA instalable en dispositivos móviles
- Alertas personalizadas con SweetAlert2

## Requisitos

- Node.js 18+
- API REST corriendo (ver turner backend)

## Instalación local

```bash
npm install --legacy-peer-deps
npm run dev
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080
```

## Conceptos previos aplicados

- JavaScript (arrow functions, map/filter/reduce, async/await, fetch)
- HTML/CSS básico
- Consumo de APIs REST
- Lógica de negocio con vanilla JS

## Conceptos aprendidos

- Lifting state up y paso de props
- Autenticación con JWT en el frontend
- Manejo de roles en la UI (ADMIN vs VIEWER)
- Variables de entorno con Vite

## Estructura del proyecto

```
src/
├── components/
│   ├── api/           # Funciones fetch hacia el backend
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   ├── availability.js
│   │   ├── clients.js
│   │   ├── config.js
│   │   └── services.js
│   ├── hooks/         # Custom hooks con useState y useEffect
│   │   ├── useAppointments.js
│   │   ├── useAvailability.js
│   │   ├── useClients.js
│   │   └── useServices.js
│   ├── layout/        # Componentes de estructura
│   │   ├── Header.jsx
│   │   └── SideBar.jsx
│   ├── pages/         # Páginas de la aplicación
│   │   ├── ClienteDetalle.jsx
│   │   ├── Clientes.jsx
│   │   ├── Configuracion.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── MasajeDetalle.jsx
│   │   ├── Masajes.jsx
│   │   └── Turnos.jsx
│   └── ui/            # Componentes reutilizables
│       ├── ModalDispo.jsx
│       └── ReportDay.jsx
└── utils/
    ├── alerts.js      # SweetAlert2 helpers
    └── formatters.js  # Formateo de precios y fechas
```

## Deploy

- Frontend: **Vercel**
- En Settings → General → Install Command usar: `npm install --legacy-peer-deps`
- Variable de entorno requerida: `VITE_API_URL`

## Estado del proyecto

* Funcional y en producción
* Usado diariamente por el negocio familiar
* Versión: **v1.0**

## Notas

Proyecto migrado desde vanilla JS + HTML + CSS a React como parte del proceso de aprendizaje. La primera versión funcionaba completamente en el frontend de Spring Boot; la versión actual es una SPA independiente con deploy separado.
