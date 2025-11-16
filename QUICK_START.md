# 🚀 Pasos Rápidos de Despliegue

## 1. Redis Setup (5 minutos)
- [ ] Crear cuenta en https://redis.com
- [ ] Crear base de datos "book-store"
- [ ] Copiar credenciales: Host, Port, Password

## 2. Preparar Código
```bash
# Actualizar src/main.ts con tu URL de Netlify (línea 9)
app.config.globalProperties.url = 'https://TU-SITIO.netlify.app';
```

## 3. GitHub
- [ ] Crear repositorio en GitHub
- [ ] Subir código:
```bash
git init
git add .
git commit -m "Initial commit - Tarea 5"
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

## 4. Netlify Deployment
1. Ir a https://netlify.com
2. "Add new site" → "Import from Git"
3. Conectar tu repositorio
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

## 5. Variables de Ambiente en Netlify
Site settings → Environment → Environment variables

Agregar:
- `REDIS_HOST` = tu-host.redis.com
- `REDIS_PORT` = 6379
- `REDIS_PSW` = tu-password

## 6. Inicializar Base de Datos
Visitar: `https://tu-sitio.netlify.app/.netlify/functions/dbCreate`

## ✅ Listo!
Tu app estará disponible en: `https://tu-sitio.netlify.app`

---

## 🧪 Probar Localmente (Opcional)

```bash
npm install
npm run dev
```

**Nota:** Para probar localmente necesitas configurar las variables de ambiente localmente o modificar `redisDB.js` temporalmente.
