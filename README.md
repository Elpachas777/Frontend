# Frontend — Sistema de Gestión Escolar IPN

Aplicación React + Vite para gestión de docentes, alumnos, grupos y escuelas bajo el Instituto Politécnico Nacional.

---

## Tecnologías

| Tecnología | Versión |
|---|---|
| React | 19 |
| React Router DOM | 7 |
| Vite | 7 |
| Axios | 1.13 |
| SweetAlert2 | 11 |

---

## Roles y credenciales

| Rol | Correo | Contraseña | Ruta de entrada |
|---|---|---|---|
| **Administrador** | `admin@ipn.mx` | `Admin123$` | `/preview/admin/docentes` |
| **Docente** | `docente@ipn.mx` | `Docente123$` | `/preview/docente/alumnos` |
| **Director** | `director@ipn.mx` | `Director123$` | `/preview/docente/alumnos` |

### Reglas de contraseña (docentes)
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos un número
- Al menos un carácter especial (`@$!%*?&`)

### Reglas de correo
Todos los correos deben terminar en `@ipn.mx`.

---

## Arquitectura del sistema

```
Browser
  │
  ├── AppRouter               ← decide si mostrar ruta pública, privada o preview
  │     ├── Publico           ← rutas sin autenticación (Login, Registro, Recuperar)
  │     ├── Privado           ← rutas con sesión real (conectado a backend)
  │     └── PreviewRoutes     ← rutas de desarrollo sin backend, datos mock
  │
  ├── Hooks
  │     ├── useAuth           ← verifica sesión contra backend (/autentificado)
  │     └── useCredenciales   ← obtiene rol del usuario (backend o localStorage)
  │
  ├── API layer (Axios)
  │     ├── sesion.api        ← login, logout, recuperar contraseña
  │     ├── alumno.api        ← CRUD alumnos
  │     ├── grupo.api         ← CRUD grupos
  │     ├── docente.api       ← CRUD docentes
  │     └── admin.api         ← operaciones administrativas
  │
  └── MockData (localStorage)
        ← usado en modo Preview cuando no hay backend
        ← RolAdmin/mockData.js gestiona docentes, escuelas y grupos mock
```

### Flujo de autenticación

```
Login form
  │
  ├── Validar formato correo (@ipn.mx)
  ├── Validar formato contraseña
  │
  ├── [Preview / Dev] Comparar contra credenciales hardcoded
  │       admin@ipn.mx    → localStorage {rol:"admin"}    → /preview/admin/docentes
  │       docente@ipn.mx  → localStorage {rol:"docente"}  → /preview/docente/alumnos
  │       
  │
  └── [Producción] POST backend → cookie de sesión → AppRouter detecta autenticado
```

### Modo Preview vs Producción

| | Preview (DEV) | Producción |
|---|---|---|
| Datos | `localStorage` mock | Backend real |
| Auth | Credenciales hardcoded | Cookie de sesión |
| Rutas | `/preview/*` | `/Alumnos`, `/Grupos`, etc. |
| Activación | `import.meta.env.DEV === true` | Build de producción |

---

## Distribución de carpetas

```
src/
│
├── App.jsx / App.css              ← componente raíz, estilos globales del layout
├── LandingPage.jsx / .css         ← página de inicio pública
├── main.jsx                       ← punto de entrada, monta React
│
├── routes/                        ← enrutamiento principal
│   ├── AppRouter.jsx              ← decide Privado / Publico / Preview
│   ├── Privado.jsx                ← layout autenticado (sidebar + main)
│   └── Publico.jsx                ← layout público
│
├── sesion/                        ← vistas de autenticación
│   ├── Login.jsx / .css
│   ├── Recuperar.jsx / .css       ← solicitar enlace de recuperación
│   ├── RecuperarContra.jsx        ← nueva contraseña con token
│   └── RegistroAdmin.jsx          ← registro de administrador
│
├── RolAdmin/                      ← vistas y lógica del rol Administrador
│   ├── mockData.js                ← datos mock en localStorage (docentes, escuelas, grupos)
│   ├── EyeIcons.jsx               ← iconos SVG reutilizables (ojo abierto / cerrado)
│   ├── RolAdmin.css               ← estilos compartidos del panel admin
│   │
│   ├── DocentesAdmin.jsx          ← lista de docentes con filtros por nombre y escuela
│   ├── CrearDocente.jsx           ← formulario: foto, nombre, escuela, correo, contraseña
│   ├── EditarDocente.jsx          ← editar nombre, foto, contraseña (verifica antigua)
│   ├── VerDocente.jsx             ← perfil: habilitar/inhabilitar, eliminar, ver grupos
│   │
│   ├── Escuelas.jsx               ← lista de escuelas
│   ├── CrearEscuela.jsx           ← formulario: logo, URL Maps, teléfonos, director
│   ├── EditarEscuela.jsx          ← editar escuela con mismas validaciones
│   ├── VerEscuela.jsx             ← detalle: logo, director, contactos, mapa, profesores
│   │
│   └── VerGrupoAdmin.jsx          ← vista lectura de grupo con alumnos (desde perfil docente)
│
├── docente/                       ← vistas del rol Docente / Director
│   ├── Alumnos.jsx / .css         ← lista de alumnos con CRUD
│   ├── CrearAlumno.jsx / .css
│   ├── EditarAlumno.jsx
│   ├── VerAlumnos.jsx             ← alumnos de un grupo específico
│   ├── Grupos.jsx / .css          ← lista de grupos con CRUD
│   ├── CrearGrupos.jsx / .css
│   ├── EditarGrupo.jsx
│   ├── Ejercicios.jsx
│   └── Inicio.jsx / .css
│
├── admin/                         ← vistas legacy del rol Admin (backend real)
│   ├── Docentes.jsx
│   ├── EditarDocente.jsx
│   └── Registro.jsx / .css        ← registro de docente por admin
│
├── components/                    ← componentes reutilizables
│   ├── SideBar.jsx / .css         ← menú lateral (adapta links según rol)
│   ├── Tabla.jsx / .css           ← tabla genérica con CRUD y confirmación por contraseña
│   ├── Confirmar.jsx / .css       ← diálogo de confirmación
│   ├── Mensaje.jsx / .css         ← banner de error / éxito
│   └── button.css                 ← estilos base de botones
│
├── hooks/
│   ├── useAuth.js                 ← estado de autenticación global
│   ├── useCredenciales.js         ← rol y datos del usuario activo
│   └── useFormData.js             ← manejo genérico de formularios
│
├── api/                           ← capa de comunicación con backend
│   ├── sesion.api.js              ← login, logout, recuperar, verificarContraseña
│   ├── alumno.api.js
│   ├── grupo.api.js
│   ├── docente.api.js
│   └── admin.api.js
│
├── utils/                         ← helpers y lógica de negocio
│   ├── axios.js                   ← instancia Axios configurada (baseURL, cookies)
│   ├── loginDocente.js
│   ├── registrarDocente.js
│   ├── crearAlumno.js
│   ├── editarAlumno.js
│   ├── crearGrupo.js
│   ├── editarGrupo.js
│   └── editarDocente.js
│
├── enums/
│   ├── tipoUsuarios.js            ← constantes de roles
│   └── datosUsuarios.js           ← claves de formularios por tipo de usuario
│
└── dev/                           ← herramientas de diseño / desarrollo
    ├── DesignHub.jsx              ← índice de todas las pantallas en /design
    ├── PreviewLayout.jsx          ← layout preview con sidebar y logout
    ├── PreviewRoutes.jsx          ← rutas /preview/* con credencial simulada
    └── PreviewTables.jsx          ← tablas con datos mock para docente/director
```

---

## Rutas de navegación

### Rutas públicas

| Ruta | Vista |
|---|---|
| `/` | Landing Page |
| `/Login` | Inicio de sesión |
| `/Registro` | Registro de docente |
| `/RegistroAdmin` | Registro de administrador |
| `/Recuperar` | Solicitar recuperación de contraseña |
| `/RecuperarContraseña` | Nueva contraseña con token |

### Rutas privadas (producción)

| Ruta | Rol | Vista |
|---|---|---|
| `/Alumnos` | docente, director | Lista de alumnos |
| `/Grupos` | docente, director | Lista de grupos |
| `/Ejercicios` | docente, director | Ejercicios |
| `/admin/docentes` | admin | Gestión de docentes |
| `/admin/escuelas` | admin | Gestión de escuelas |

### Rutas preview (desarrollo)

| Ruta | Credencial |
|---|---|
| `/design` | — (índice de pantallas) |
| `/preview/login` | — |
| `/preview/docente/alumnos` | docente |
| `/preview/docente/grupos` | docente |
| `/preview/docente/ejercicios` | docente |
| `/preview/admin/docentes` | admin |
| `/preview/admin/escuelas` | admin |

---

## Instalación

```bash
npm install
npm run dev
```

Variables de entorno requeridas en `.env`:

```
VITE_URL_BACKEND=http://localhost:PUERTO
```

---

## Datos mock (modo Preview)

Los datos del rol Admin se guardan en `localStorage`:

| Clave | Contenido |
|---|---|
| `admin_docentes` | `[{ id, nombre, escuela, correo, password, foto, habilitado, fechaIngreso, grupos }]` |
| `admin_escuelas` | `[{ id, logo, nombre, ubicacion, director, contacto, contacto2 }]` |

> `ubicacion` almacena una URL de Google Maps. El campo `grupos` en docentes es un array de IDs que referencia a `GRUPOS_MOCK` en `mockData.js`.

Para resetear los datos mock desde la consola del navegador:

```javascript
localStorage.removeItem("admin_docentes");
localStorage.removeItem("admin_escuelas");
location.reload();
```
