# Tarea 5 - Sistema de Gestión de Autores y Editoriales

Aplicación web desarrollada con Vue.js 3 y Netlify Functions que permite administrar autores y editoriales almacenados en Redis.

## 📋 Características

- ✅ CRUD completo de **Autores**
- ✅ CRUD completo de **Editoriales**
- ✅ Backend con Netlify Functions (AWS Lambda)
- ✅ Base de datos Redis
- ✅ Frontend con Vue.js 3 + Vite

## 🚀 Configuración Inicial

### 1. Crear cuenta en Redis

1. Regístrate en: https://redis.com
2. Crea una base de datos llamada **book-store**
3. Guarda las credenciales:
   - Host: `REDIS_HOST`
   - Port: `REDIS_PORT` (generalmente 6379)
   - Password: `REDIS_PSW`

### 2. Instalación Local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 📦 Despliegue en Netlify

### Paso 1: Conectar repositorio

1. Crea un repositorio en GitHub/Bitbucket
2. Sube este código al repositorio
3. Ve a [Netlify](https://www.netlify.com) e inicia sesión
4. Click en "Add new site" → "Import an existing project"
5. Conecta tu repositorio

### Paso 2: Configurar Build Settings

En la configuración de build:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

### Paso 3: Variables de Ambiente

En Netlify, ve a: **Site settings → Build & deploy → Environment → Environment variables**

Agrega las siguientes variables:

| Variable | Valor |
|----------|-------|
| `REDIS_HOST` | Tu host de Redis (ej: `redis-12345.c123.us-east-1-1.ec2.cloud.redislabs.com`) |
| `REDIS_PORT` | Puerto de Redis (generalmente `6379`) |
| `REDIS_PSW` | Tu password de Redis |

### Paso 4: Actualizar URL del Backend

Una vez desplegado, copia la URL de tu sitio Netlify (ej: `https://mi-sitio.netlify.app`)

Actualiza el archivo `src/main.ts`:
```javascript
app.config.globalProperties.url = 'https://TU-SITIO-AQUI.netlify.app';
```

Haz commit y push de este cambio.

### Paso 5: Inicializar Base de Datos

Una vez desplegado, accede a:
```
https://tu-sitio.netlify.app/.netlify/functions/dbCreate
```

Esto creará los datos iniciales de autores y editoriales.

## 🗂️ Estructura del Proyecto

```
Tarea_5/
├── netlify/
│   └── functions/              # Backend - Netlify Functions
│       ├── redisDB.js         # Configuración Redis
│       ├── headersCORS.js     # Configuración CORS
│       ├── dbCreate.js        # Inicializar DB
│       ├── authorFindAll.js   # Listar autores
│       ├── authorFind.js      # Buscar autor
│       ├── authorInsert.js    # Crear autor
│       ├── authorUpdate.js    # Actualizar autor
│       ├── authorDelete.js    # Eliminar autor
│       ├── publisherFindAll.js # Listar editoriales
│       ├── publisherFind.js    # Buscar editorial
│       ├── publisherInsert.js  # Crear editorial
│       ├── publisherUpdate.js  # Actualizar editorial
│       └── publisherDelete.js  # Eliminar editorial
├── src/
│   ├── components/            # Componentes Vue
│   │   ├── Home.vue
│   │   ├── AuthorIndex.vue
│   │   ├── AuthorDetails.vue
│   │   ├── PublisherIndex.vue
│   │   └── PublisherDetails.vue
│   ├── assets/
│   │   └── css/
│   │       ├── normalize.css
│   │       └── skeleton.css
│   ├── App.vue
│   ├── main.ts
│   └── router.js
├── package.json
└── vite.config.ts
```

## 🔌 API Endpoints

### Autores
- `GET /.netlify/functions/authorFindAll` - Listar todos los autores
- `GET /.netlify/functions/authorFind/{id}` - Obtener un autor
- `POST /.netlify/functions/authorInsert` - Crear autor
- `PUT /.netlify/functions/authorUpdate/{id}` - Actualizar autor
- `DELETE /.netlify/functions/authorDelete/{id}` - Eliminar autor

### Editoriales
- `GET /.netlify/functions/publisherFindAll` - Listar todas las editoriales
- `GET /.netlify/functions/publisherFind/{id}` - Obtener una editorial
- `POST /.netlify/functions/publisherInsert` - Crear editorial
- `PUT /.netlify/functions/publisherUpdate/{id}` - Actualizar editorial
- `DELETE /.netlify/functions/publisherDelete/{id}` - Eliminar editorial

## 📊 Modelos de Datos

### Author (Autor)
```json
{
  "id": 1,
  "name": "Abraham Silberschatz",
  "nationality": "American",
  "birthYear": 1952
}
```

### Publisher (Editorial)
```json
{
  "id": 1,
  "name": "John Wiley & Sons",
  "country": "United States",
  "foundedYear": 1807
}
```

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Vue.js 3, Vue Router, Vite
- **Backend:** Netlify Functions (AWS Lambda)
- **Base de datos:** Redis
- **Estilos:** Skeleton CSS
- **Hosting:** Netlify

## 📝 Notas Importantes

1. Las variables de ambiente en Netlify son **sensibles a mayúsculas**
2. Después de cambiar variables de ambiente, debes hacer un **re-deploy**
3. Los IDs se generan automáticamente con números aleatorios
4. La función `dbCreate` solo debe ejecutarse una vez para inicializar

## 🐛 Solución de Problemas

### Error de CORS
- Verifica que `headersCORS.js` esté correctamente configurado
- Asegúrate que todas las funciones incluyan el handler para OPTIONS

### Error de conexión a Redis
- Verifica las variables de ambiente en Netlify
- Confirma que las credenciales de Redis sean correctas
- Revisa que la base de datos esté activa en Redis.com

### No se muestran datos
- Ejecuta la función `dbCreate` primero
- Verifica en los logs de Netlify Functions si hay errores
- Revisa la consola del navegador

## 👨‍💻 Autor

Desarrollado para el curso de Sistemas Distribuidos - II Semestre 2025

## 📄 Licencia

Este proyecto es de uso académico.
