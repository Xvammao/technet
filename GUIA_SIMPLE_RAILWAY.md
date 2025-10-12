# 🚀 GUÍA SIMPLE - Desplegar en Railway (DESDE CERO)

## ✅ PREREQUISITOS

1. ✅ Código subido a GitHub: `https://github.com/Xvammao/tehnet`
2. ✅ Cuenta en Railway: `https://railway.app`

---

## 🎯 PASOS COMPLETOS

### PASO 1: Crear Proyecto en Railway

1. Ve a [railway.app/dashboard](https://railway.app/dashboard)
2. Click en **"New Project"**
3. Selecciona **"Empty Project"**
4. Dale un nombre (ejemplo: "TechNet")

### PASO 2: Agregar PostgreSQL

1. Dentro del proyecto, click en **"+ Create"**
2. Selecciona **"Database"**
3. Selecciona **"Add PostgreSQL"**
4. Espera a que se cree (toma unos segundos)

### PASO 3: Crear Servicio Backend

1. Click en **"+ Create"**
2. Selecciona **"GitHub Repo"**
3. Selecciona tu repositorio: **"Xvammao/tehnet"**
4. Railway creará un servicio

**Configurar el servicio:**
1. Click en el servicio que se creó
2. Ve a **"Settings"**
3. En **"Service Name"** ponlo: `backend`
4. Busca **"Root Directory"** y ponlo en: `/technet`
5. Guarda los cambios

### PASO 4: Crear Servicio Frontend

1. Click en **"+ Create"**
2. Selecciona **"GitHub Repo"**
3. Selecciona **EL MISMO repositorio**: **"Xvammao/tehnet"**
4. Railway creará otro servicio

**Configurar el servicio:**
1. Click en el servicio que se creó
2. Ve a **"Settings"**
3. En **"Service Name"** ponlo: `frontend`
4. Busca **"Root Directory"** y ponlo en: `/frontend`
5. Guarda los cambios

### PASO 5: Conectar PostgreSQL al Backend

1. Click en el servicio **"backend"**
2. Ve a **"Variables"**
3. Click en **"New Variable"** → **"Add Reference"**
4. Selecciona **"Postgres"**
5. Railway agregará `DATABASE_URL` automáticamente

### PASO 6: Agregar Variables del Backend

En el servicio **"backend"** → **"Variables"**, agrega estas **una por una**:

```
SECRET_KEY=trx2gewy5u84sxs7yr-q1haymvcr4f8frteez8
DEBUG=False
ALLOWED_HOSTS=.railway.app
CORS_ALLOW_ALL_ORIGINS=False
PYTHONUNBUFFERED=1
```

### PASO 7: Esperar Despliegues

Espera a que ambos servicios terminen de desplegar:
- **backend**: Verás "Deployment successful" ✅
- **frontend**: Verás "Deployment successful" ✅

Esto puede tomar 2-5 minutos.

### PASO 8: Obtener URL del Backend

1. Click en el servicio **"backend"**
2. En la parte superior verás una URL como: `https://backend-production-xxxx.railway.app`
3. **COPIA ESA URL COMPLETA**

### PASO 9: Configurar Variables del Frontend

1. Click en el servicio **"frontend"**
2. Ve a **"Variables"**
3. Agrega estas variables:

**Variable 1:**
- VARIABLE_NAME: `VITE_API_URL`
- VALUE: `<pega-la-url-del-backend-aqui>`
- Click **Add**

**Variable 2:**
- VARIABLE_NAME: `NODE_ENV`
- VALUE: `production`
- Click **Add**

### PASO 10: Obtener URL del Frontend

1. Click en el servicio **"frontend"**
2. En la parte superior verás una URL como: `https://frontend-production-xxxx.railway.app`
3. **COPIA ESA URL COMPLETA**

### PASO 11: Actualizar CORS del Backend

1. Click en el servicio **"backend"**
2. Ve a **"Variables"**
3. Agrega:

- VARIABLE_NAME: `CORS_ALLOWED_ORIGINS`
- VALUE: `<pega-la-url-del-frontend-aqui>`
- Click **Add**

### PASO 12: Importar Base de Datos

Abre PowerShell y ejecuta:

```powershell
cd c:\Users\maog9\OneDrive\Escritorio\TELECOMUNICACIONES\technet
.\importar_sql_railway.ps1
```

El script te guiará para:
1. Instalar Railway CLI (si no está instalado)
2. Iniciar sesión en Railway
3. Vincular al proyecto (selecciona el servicio **backend**)
4. Seleccionar tu archivo .sql
5. Importar los datos automáticamente

---

## 🎉 ¡LISTO!

Tu aplicación estará funcionando en:
- **Backend:** `https://backend-production-xxxx.railway.app`
- **Frontend:** `https://frontend-production-xxxx.railway.app`

---

## 📝 RESUMEN DE LOS 12 PASOS

```
1. Crear proyecto vacío en Railway
2. Agregar PostgreSQL
3. Crear servicio backend (repo + Root Directory: /technet)
4. Crear servicio frontend (mismo repo + Root Directory: /frontend)
5. Conectar Postgres al backend
6. Agregar variables del backend (SECRET_KEY, DEBUG, etc.)
7. Esperar a que desplieguen
8. Copiar URL del backend
9. Agregar variables del frontend (VITE_API_URL, NODE_ENV)
10. Copiar URL del frontend
11. Agregar CORS_ALLOWED_ORIGINS al backend
12. Importar base de datos con el script
```

---

## ⏱️ Tiempo Estimado

- Pasos 1-11: **20 minutos**
- Paso 12 (importar DB): **5-10 minutos**
- **Total: 25-30 minutos**

---

**¡Empieza por el PASO 1!**
