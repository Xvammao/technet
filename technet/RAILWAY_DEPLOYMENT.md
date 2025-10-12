# 🚂 Guía Completa de Migración a Railway

Esta guía te llevará paso a paso para migrar tu aplicación completa (Backend Django + Frontend React + PostgreSQL) a Railway.

## 📋 Tabla de Contenidos
1. [Preparación](#preparación)
2. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
3. [Despliegue del Backend](#despliegue-del-backend)
4. [Despliegue del Frontend](#despliegue-del-frontend)
5. [Migración de Datos](#migración-de-datos)
6. [Verificación y Pruebas](#verificación-y-pruebas)
7. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Preparación

### 1. Crear Cuenta en Railway

1. Ve a [Railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Inicia sesión con GitHub (recomendado) o email
4. Verifica tu cuenta

### 2. Instalar Railway CLI (Opcional pero recomendado)

**Windows (PowerShell):**
```powershell
iwr https://railway.app/install.ps1 | iex
```

**Verificar instalación:**
```powershell
railway --version
```

### 3. Preparar tu Repositorio Git

Si aún no tienes tu código en GitHub:

```bash
# Inicializar repositorio (si no existe)
cd c:\Users\maog9\OneDrive\Escritorio\TELECOMUNICACIONES
git init

# Agregar archivos
git add .
git commit -m "Preparar para despliegue en Railway"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## 🗄️ Configuración de la Base de Datos

### Paso 1: Crear Base de Datos PostgreSQL en Railway

1. **Accede a Railway Dashboard:**
   - Ve a [railway.app/dashboard](https://railway.app/dashboard)
   - Haz clic en "New Project"

2. **Agregar PostgreSQL:**
   - Selecciona "Provision PostgreSQL"
   - Railway creará automáticamente una base de datos PostgreSQL

3. **Obtener Credenciales:**
   - Haz clic en el servicio PostgreSQL
   - Ve a la pestaña "Variables"
   - Verás las siguientes variables automáticamente creadas:
     - `DATABASE_URL` (URL completa de conexión)
     - `PGHOST`
     - `PGPORT`
     - `PGUSER`
     - `PGPASSWORD`
     - `PGDATABASE`

4. **Copiar DATABASE_URL:**
   - Copia el valor de `DATABASE_URL`
   - Formato: `postgresql://user:password@host:port/database`

### Paso 2: Exportar Datos de tu Base de Datos Local

**Opción A: Usando pg_dump (Recomendado)**

```powershell
# Exportar toda la base de datos
pg_dump -U postgres -h localhost -d telecomunicaciones -F c -b -v -f "backup_railway.dump"

# O exportar en formato SQL
pg_dump -U postgres -h localhost -d telecomunicaciones > backup_railway.sql
```

**Opción B: Usando Django dumpdata**

```powershell
cd technet
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > data_backup.json
```

---

## 🔧 Despliegue del Backend (Django)

### Paso 1: Actualizar Archivos de Configuración

Los archivos ya están creados en tu proyecto. Verifica que existan:

- ✅ `Procfile` - Ya existe
- ✅ `requirements.txt` - Ya existe
- ✅ `runtime.txt` - Ya existe
- ✅ `railway.json` - **NUEVO** (se creará)
- ✅ `nixpacks.toml` - **NUEVO** (se creará)

### Paso 2: Crear Proyecto en Railway para Backend

1. **Desde Railway Dashboard:**
   - Haz clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway a acceder a tu repositorio
   - Selecciona tu repositorio

2. **Configurar Root Directory:**
   - En "Settings" → "Service Settings"
   - Root Directory: `/technet`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn technet.wsgi --log-file -`

### Paso 3: Configurar Variables de Entorno

En Railway Dashboard → Tu servicio Backend → Variables, agrega:

```env
# Django Settings
SECRET_KEY=<genera-una-nueva-clave-secreta>
DEBUG=False
ALLOWED_HOSTS=.railway.app

# Database (Railway proporciona DATABASE_URL automáticamente)
# Si Railway no lo hace automático, agrégalo manualmente:
DATABASE_URL=postgresql://user:password@host:port/database

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app
CORS_ALLOW_ALL_ORIGINS=False

# Python
PYTHONUNBUFFERED=1
```

**Para generar SECRET_KEY:**
```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Paso 4: Conectar Base de Datos al Backend

1. En Railway Dashboard, ve a tu proyecto
2. Haz clic en el servicio Backend
3. Ve a "Settings" → "Service Variables"
4. Haz clic en "Add Reference"
5. Selecciona tu base de datos PostgreSQL
6. Railway agregará automáticamente `DATABASE_URL`

### Paso 5: Ejecutar Migraciones

**Opción A: Desde Railway CLI**

```powershell
railway login
railway link
railway run python manage.py migrate
railway run python manage.py createsuperuser
railway run python manage.py collectstatic --noinput
```

**Opción B: Agregar comando de inicio que incluya migraciones**

Edita tu `Procfile`:
```
release: python manage.py migrate --noinput && python manage.py collectstatic --noinput
web: gunicorn technet.wsgi --log-file -
```

---

## 🎨 Despliegue del Frontend (React + Vite)

### Paso 1: Crear Servicio para Frontend

1. En tu proyecto Railway, haz clic en "New Service"
2. Selecciona "GitHub Repo"
3. Selecciona el mismo repositorio
4. Configura:
   - Root Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`

### Paso 2: Configurar Variables de Entorno del Frontend

En Railway Dashboard → Servicio Frontend → Variables:

```env
VITE_API_URL=https://tu-backend.railway.app
NODE_ENV=production
```

### Paso 3: Actualizar Configuración de Vite para Producción

Crea `frontend/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview -- --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Paso 4: Actualizar CORS en Backend

Una vez que tengas la URL del frontend, actualiza las variables de entorno del backend:

```env
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app,https://tu-dominio-custom.com
ALLOWED_HOSTS=.railway.app,tu-dominio-custom.com
```

---

## 📦 Migración de Datos

### Opción 1: Restaurar desde pg_dump

**Usando Railway CLI:**

```powershell
# Conectarse a la base de datos de Railway
railway login
railway link

# Restaurar el dump
railway run pg_restore -d $DATABASE_URL backup_railway.dump

# O si usaste formato SQL:
railway run psql $DATABASE_URL < backup_railway.sql
```

**Usando conexión directa:**

```powershell
# Obtén las credenciales de Railway y ejecuta:
pg_restore -h <RAILWAY_HOST> -p <RAILWAY_PORT> -U <RAILWAY_USER> -d <RAILWAY_DB> backup_railway.dump
```

### Opción 2: Restaurar desde Django dumpdata

```powershell
railway login
railway link
railway run python manage.py loaddata data_backup.json
```

### Opción 3: Migración Manual (Para bases de datos pequeñas)

1. Exporta datos desde tu base local
2. Crea un script de migración personalizado
3. Ejecuta el script en Railway

---

## ✅ Verificación y Pruebas

### 1. Verificar Backend

```powershell
# Probar endpoint de salud
curl https://tu-backend.railway.app/admin/

# Ver logs
railway logs
```

### 2. Verificar Frontend

1. Abre `https://tu-frontend.railway.app`
2. Verifica que se conecte al backend
3. Prueba login y funcionalidades principales

### 3. Verificar Base de Datos

```powershell
railway login
railway link

# Conectarse a PostgreSQL
railway run psql $DATABASE_URL

# Verificar tablas
\dt

# Verificar datos
SELECT COUNT(*) FROM configuracion_instalacion;
```

### 4. Crear Superusuario (si es necesario)

```powershell
railway run python manage.py createsuperuser
```

---

## 🔧 Configuración Adicional

### Configurar Dominio Personalizado

1. En Railway Dashboard → Tu servicio → Settings
2. Ve a "Domains"
3. Haz clic en "Generate Domain" para obtener un dominio `.railway.app`
4. O agrega tu dominio personalizado:
   - Haz clic en "Custom Domain"
   - Ingresa tu dominio
   - Configura los registros DNS según las instrucciones

### Configurar Variables de Entorno Sensibles

```powershell
# Usando Railway CLI
railway variables set SECRET_KEY="tu-clave-secreta"
railway variables set DB_PASSWORD="tu-password"
```

### Configurar Backups Automáticos

Railway hace backups automáticos de PostgreSQL, pero puedes configurar backups adicionales:

1. Ve a tu servicio PostgreSQL
2. Settings → Backups
3. Configura la frecuencia de backups

---

## 🐛 Solución de Problemas

### Error: "DisallowedHost"

**Solución:**
```env
ALLOWED_HOSTS=.railway.app,tu-dominio.com
```

### Error: "CORS policy"

**Solución:**
```env
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app
CORS_ALLOW_ALL_ORIGINS=False
```

### Error: "Static files not found"

**Solución:**
```powershell
railway run python manage.py collectstatic --noinput
```

### Error: "Database connection failed"

**Solución:**
1. Verifica que `DATABASE_URL` esté configurado
2. Verifica que el servicio PostgreSQL esté corriendo
3. Revisa los logs: `railway logs`

### Frontend no se conecta al Backend

**Solución:**
1. Verifica `VITE_API_URL` en variables del frontend
2. Verifica CORS en el backend
3. Verifica que ambos servicios estén corriendo

### Ver Logs en Tiempo Real

```powershell
# Backend
railway logs --service backend

# Frontend
railway logs --service frontend

# Base de datos
railway logs --service postgres
```

---

## 📊 Monitoreo y Mantenimiento

### Ver Métricas

1. Railway Dashboard → Tu proyecto
2. Cada servicio muestra:
   - CPU usage
   - Memory usage
   - Network traffic
   - Logs en tiempo real

### Actualizar la Aplicación

```bash
# Hacer cambios en tu código
git add .
git commit -m "Actualización"
git push origin main

# Railway desplegará automáticamente
```

### Rollback a Versión Anterior

1. Railway Dashboard → Tu servicio
2. Ve a "Deployments"
3. Selecciona un despliegue anterior
4. Haz clic en "Redeploy"

---

## 💰 Costos Estimados

Railway ofrece:
- **Plan Free**: $5 de crédito mensual (suficiente para desarrollo)
- **Plan Hobby**: $5/mes + uso adicional
- **Plan Pro**: $20/mes + uso adicional

**Estimación para tu aplicación:**
- Backend Django: ~$3-5/mes
- Frontend React: ~$2-3/mes
- PostgreSQL: ~$5-10/mes (dependiendo del tamaño)

**Total estimado: $10-18/mes**

---

## 📞 Recursos Adicionales

- [Documentación de Railway](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)
- [Ejemplos de Railway](https://github.com/railwayapp/examples)

---

## 🎉 Checklist Final

Antes de considerar la migración completa:

- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Base de datos migrada con todos los datos
- [ ] CORS configurado correctamente
- [ ] Variables de entorno configuradas
- [ ] Dominios configurados (si aplica)
- [ ] Superusuario creado
- [ ] Archivos estáticos servidos correctamente
- [ ] Login funciona correctamente
- [ ] Todas las funcionalidades principales probadas
- [ ] Backups configurados
- [ ] Monitoreo configurado

---

## 🚀 Próximos Pasos

1. **Configurar CI/CD**: Railway ya tiene despliegue automático desde GitHub
2. **Configurar SSL**: Railway proporciona SSL automáticamente
3. **Optimizar rendimiento**: Revisar métricas y ajustar recursos
4. **Configurar alertas**: Configurar notificaciones para errores
5. **Documentar URLs**: Mantener registro de URLs de producción

---

¡Felicidades! Tu aplicación ahora está desplegada en Railway. 🎊
