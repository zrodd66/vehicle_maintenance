# Sistema de Gestión de Mantenimiento de Vehículos

Este sistema permite gestionar el mantenimiento de una flota de vehículos, incluyendo el registro de vehículos y sus mantenimientos programados.

## Características

- Gestión de usuarios (admin, técnicos, usuarios regulares)
- Registro y gestión de vehículos
- Programación y seguimiento de mantenimientos
- Panel de control con estadísticas
- Interfaz responsive y moderna

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MySQL
- JWT para autenticación
- bcrypt para encriptación

### Frontend
- React
- React Router
- Tailwind CSS
- Axios para peticiones HTTP
- Heroicons

## Requisitos Previos

- Node.js (v14 o superior)
- MySQL (v8 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd vehicle-maintenance-api
```

2. Instalar dependencias del backend:
```bash
npm install
```

3. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

4. Configurar variables de entorno:
   - Crear archivo `.env` en la raíz del proyecto
   - Agregar las siguientes variables:
```env
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=vehicle_maintenance_db
JWT_SECRET=tu_secreto_jwt
```

5. Inicializar la base de datos:
```bash
node src/models/initDb.js
```

## Uso

1. Iniciar el servidor backend:
```bash
npm run dev
```

2. Iniciar el servidor frontend:
```bash
cd frontend
npm run dev
```

3. Acceder a la aplicación:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Credenciales por Defecto

- Email: admin@example.com
- Contraseña: admin123

## Estructura del Proyecto

```
vehicle-maintenance-api/
├── src/
│   ├── config/         # Configuración de la base de datos y variables de entorno
│   ├── controllers/    # Controladores de la aplicación
│   ├── middlewares/    # Middlewares personalizados
│   ├── models/         # Modelos de la base de datos
│   ├── routes/         # Rutas de la API
│   └── server.js       # Punto de entrada del servidor
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── pages/      # Páginas de la aplicación
│   │   ├── services/   # Servicios para llamadas a la API
│   │   └── context/    # Contextos de React
│   └── index.html
└── README.md
```

## Endpoints de la API

### Autenticación
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me

### Vehículos
- GET /api/vehicles
- POST /api/vehicles
- GET /api/vehicles/:id
- PUT /api/vehicles/:id
- DELETE /api/vehicles/:id

### Mantenimiento
- GET /api/maintenance
- POST /api/maintenance
- GET /api/maintenance/:id
- PUT /api/maintenance/:id
- DELETE /api/maintenance/:id

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 