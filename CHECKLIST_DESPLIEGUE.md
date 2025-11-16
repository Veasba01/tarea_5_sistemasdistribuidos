# 📋 Checklist de Despliegue - Tarea 5

## ✅ Pre-requisitos
- [ ] Cuenta en Redis.com creada
- [ ] Base de datos "book-store" creada en Redis
- [ ] Credenciales de Redis guardadas (Host, Port, Password)
- [ ] Cuenta en Netlify.com creada
- [ ] Cuenta en GitHub.com creada

## 🔧 Configuración Local

### 1. Instalar Dependencias
```bash
cd "Tarea_5"
npm install
```
- [ ] Ejecutado sin errores

### 2. Actualizar URL de Backend
Archivo: `src/main.ts` (línea 9)
```javascript
app.config.globalProperties.url = 'https://TU-SITIO.netlify.app';
```
- [ ] URL actualizada (se hace después del primer deploy)

## 📤 Subir a GitHub

```bash
# Inicializar repositorio
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "Tarea 5: Sistema CRUD Autores y Editoriales"

# Conectar con GitHub (crear repo primero en github.com)
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git

# Subir
git push -u origin main
```

- [ ] Repositorio creado en GitHub
- [ ] Código subido correctamente

## 🚀 Despliegue en Netlify

### 1. Conectar Repositorio
1. Ir a https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Seleccionar GitHub
4. Buscar tu repositorio
5. Click en el repositorio

- [ ] Repositorio conectado

### 2. Configurar Build
En la pantalla de configuración:
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Functions directory:** `netlify/functions`

- [ ] Configuración de build correcta

### 3. Desplegar
Click en "Deploy site"

- [ ] Primer despliegue completado
- [ ] URL del sitio copiada

### 4. Configurar Variables de Ambiente
1. En tu sitio de Netlify: Site settings → Environment → Environment variables
2. Click "Add a variable"

Agregar una por una:

**Variable 1:**
- Key: `REDIS_HOST`
- Value: [tu-host.redis.com]
- [ ] Agregada

**Variable 2:**
- Key: `REDIS_PORT`
- Value: `6379`
- [ ] Agregada

**Variable 3:**
- Key: `REDIS_PSW`
- Value: [tu-password-redis]
- [ ] Agregada

### 5. Re-desplegar
Después de agregar variables:
- Ir a: Deploys → Trigger deploy → Deploy site

- [ ] Re-despliegue completado

## 🔄 Actualizar URL en el Código

### 1. Editar src/main.ts
Reemplazar línea 9:
```javascript
app.config.globalProperties.url = 'https://tu-sitio-real.netlify.app';
```

- [ ] URL actualizada con la real de Netlify

### 2. Commit y Push
```bash
git add src/main.ts
git commit -m "Actualizar URL de backend"
git push
```

- [ ] Cambio subido
- [ ] Netlify auto-desplegó el cambio

## 🎲 Inicializar Base de Datos

En el navegador, visitar:
```
https://tu-sitio.netlify.app/.netlify/functions/dbCreate
```

Deberías ver: "OK - Authors and Publishers initialized"

- [ ] Base de datos inicializada
- [ ] Mensaje de confirmación recibido

## ✨ Verificar Funcionamiento

### Probar en el sitio web:

**Autores:**
- [ ] Abrir https://tu-sitio.netlify.app
- [ ] Click en "Authors"
- [ ] Ver lista de autores
- [ ] Click en "New" - crear nuevo autor
- [ ] Click en "Edit" - editar autor
- [ ] Click en "Erase" - eliminar autor

**Editoriales:**
- [ ] Click en "Publishers"
- [ ] Ver lista de editoriales
- [ ] Click en "New" - crear nueva editorial
- [ ] Click en "Edit" - editar editorial
- [ ] Click en "Erase" - eliminar editorial

## 🐛 Troubleshooting

Si algo no funciona:

**No se cargan los datos:**
- [ ] Verificar variables de ambiente en Netlify
- [ ] Verificar que dbCreate se ejecutó
- [ ] Revisar logs en Netlify Functions

**Error de CORS:**
- [ ] Verificar que headersCORS.js existe
- [ ] Verificar URL en main.ts es correcta

**Error 404 en funciones:**
- [ ] Verificar que Functions directory es "netlify/functions"
- [ ] Re-desplegar

**Cambios no se reflejan:**
- [ ] Hacer hard refresh (Ctrl + F5)
- [ ] Verificar que el commit se hizo
- [ ] Verificar en Netlify que se desplegó

## 📸 Screenshots Recomendados

Para tu entrega, toma screenshots de:
- [ ] Lista de Autores funcionando
- [ ] Formulario de crear Autor
- [ ] Lista de Editoriales funcionando
- [ ] Formulario de crear Editorial
- [ ] Variables de ambiente en Netlify (ocultar password)
- [ ] Dashboard de Netlify Functions

## 📝 Documentación de Entrega

Incluir en tu reporte:
- [ ] URL del sitio desplegado
- [ ] URL del repositorio GitHub
- [ ] Screenshots del funcionamiento
- [ ] Explicación de la arquitectura
- [ ] Descripción de las funciones implementadas

## 🎉 ¡Completado!

Si todos los checks están marcados, tu tarea está completa y funcionando.

---

**Última actualización:** Noviembre 2025
**Curso:** Sistemas Distribuidos - II Semestre 2025
