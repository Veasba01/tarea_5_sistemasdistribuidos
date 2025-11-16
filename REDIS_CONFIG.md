# 🔐 Configuración de Variables de Ambiente - Netlify

## Tus Credenciales de Redis

Basado en tu archivo `redisDB.js`, estas son tus credenciales:

```
Host: redis-14213.c270.us-east-1-3.ec2.cloud.redislabs.com
Port: 14213
Username: default
Password: OYh0XsNK66Wlv3lcSrMrhkl2PrAFiYsf
```

## Configurar en Netlify

### Paso 1: Ir a Environment Variables

1. En tu sitio de Netlify, ve a: **Site settings**
2. Click en **Environment variables** (en el menú lateral)
3. Click en **Add a variable**

### Paso 2: Agregar Variables

Agrega las siguientes 4 variables (una por una):

#### Variable 1: REDIS_HOST
```
Key: REDIS_HOST
Value: redis-14213.c270.us-east-1-3.ec2.cloud.redislabs.com
```
- [ ] Agregada

#### Variable 2: REDIS_PORT
```
Key: REDIS_PORT
Value: 14213
```
- [ ] Agregada

#### Variable 3: REDIS_USERNAME
```
Key: REDIS_USERNAME
Value: default
```
- [ ] Agregada

#### Variable 4: REDIS_PSW
```
Key: REDIS_PSW
Value: OYh0XsNK66Wlv3lcSrMrhkl2PrAFiYsf
```
- [ ] Agregada

### Paso 3: Re-desplegar

Después de agregar todas las variables:
1. Ve a la pestaña **Deploys**
2. Click en **Trigger deploy** (botón arriba a la derecha)
3. Selecciona **Deploy site**

Esto hará que Netlify vuelva a desplegar tu sitio con las nuevas variables de ambiente.

## ⚠️ IMPORTANTE - Seguridad

### Antes de subir a GitHub:

El archivo `redisDB.js` actualmente tiene tus credenciales hardcodeadas como valores por defecto. Esto está bien para desarrollo, pero **DEBES** asegurarte de:

1. **Nunca** compartir públicamente tu repositorio con estas credenciales
2. Considerar cambiar el password de Redis después de la entrega del proyecto
3. En producción, las variables de ambiente de Netlify sobrescribirán estos valores

### Opcional: Limpiar credenciales del código

Si quieres hacer tu repositorio público, puedes editar `redisDB.js` y remover los valores por defecto:

```javascript
async function getClient() {
  if (!client) {
    client = createClient({
      username: process.env.REDIS_USERNAME || 'default',
      password: process.env.REDIS_PSW,  // ← Quitar el valor por defecto
      socket: {
        host: process.env.REDIS_HOST,  // ← Quitar el valor por defecto
        port: parseInt(process.env.REDIS_PORT || '6379')
      }
    });
    // ...
  }
}
```

## 🧪 Verificar Configuración

Una vez desplegado con las variables de ambiente:

1. Visita: `https://tu-sitio.netlify.app/.netlify/functions/dbCreate`
2. Deberías ver: `OK - Authors and Publishers initialized`
3. Ve a tu sitio y haz click en "Authors" - deberías ver la lista

Si hay errores:
- Revisa los **Function logs** en Netlify
- Verifica que las variables estén correctamente escritas (son case-sensitive)
- Asegúrate de que re-desplegaste después de agregar las variables

## 📝 Notas

- Las variables de ambiente en Netlify son **privadas** y seguras
- No se muestran en los logs públicos
- Solo están disponibles para las funciones del backend
- Cada vez que cambies una variable, debes re-desplegar

---

**Estado:** ✅ Configuración lista para Netlify
