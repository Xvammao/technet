# 🚀 GUÍA SIMPLE - Desplegar en Railway

## ✅ LO QUE YA HICISTE

1. ✅ Código subido a GitHub
2. ✅ Servicio "web" creado (Frontend)
3. ✅ Servicio "technet" creado (Backend)
4. ✅ PostgreSQL creado

---

## 🎯 LO QUE FALTA HACER

### PASO 1: Configurar el Backend

1. Ve a Railway → Servicio **"technet"**
2. Click en **Settings**
3. Busca **Root Directory** y ponlo en: `/technet`
4. Guarda

### PASO 2: Configurar el Frontend

1. Ve a Railway → Servicio **"web"**
2. Click en **Settings**
3. Busca **Root Directory** y ponlo en: `/frontend`
4. Guarda

### PASO 3: Conectar PostgreSQL al Backend

1. Ve a Railway → Servicio **"technet"**
2. Click en **Variables**
3. Click en **New Variable** → **Add Reference**
4. Selecciona **Postgres**
5. Railway agregará `DATABASE_URL` automáticamente

### PASO 4: Agregar Variables del Backend

En **technet** → **Variables**, agrega estas **una por una**:

```
SECRET_KEY=trx2gewy5u84sxs7yr-q1haymvcr4f8frteez8
DEBUG=False
ALLOWED_HOSTS=.railway.app
CORS_ALLOW_ALL_ORIGINS=False
PYTHONUNBUFFERED=1
```

### PASO 5: Esperar a que Backend Despliegue

Espera a que el servicio "technet" termine de desplegar (verás "Deployment successful").

### PASO 6: Obtener URL del Backend

1. Ve al servicio **"technet"**
2. Arriba verás una URL como: `https://technet-production-xxxx.railway.app`
3. **COPIA ESA URL**

### PASO 7: Configurar Frontend

1. Ve al servicio **"web"**
2. Click en **Variables**
3. Agrega:

```
VITE_API_URL=<pega-la-url-del-backend-aqui>
NODE_ENV=production
```

### PASO 8: Obtener URL del Frontend

1. Ve al servicio **"web"**
2. Arriba verás una URL como: `https://web-production-xxxx.railway.app`
3. **COPIA ESA URL**

### PASO 9: Actualizar CORS del Backend

1. Ve al servicio **"technet"**
2. Click en **Variables**
3. Agrega:

```
CORS_ALLOWED_ORIGINS=<pega-la-url-del-frontend-aqui>
```

### PASO 10: Importar Base de Datos

Abre PowerShell y ejecuta:

```powershell
cd c:\Users\maog9\OneDrive\Escritorio\TELECOMUNICACIONES\technet
.\importar_sql_railway.ps1
```

El script te guiará para:
- Instalar Railway CLI
- Iniciar sesión
- Vincular proyecto
- Importar tu backup SQL

---

## 🎉 ¡LISTO!

Tu aplicación estará funcionando en:
- **Backend:** `https://technet-production-xxxx.railway.app`
- **Frontend:** `https://web-production-xxxx.railway.app`

---

## 📝 RESUMEN VISUAL

```
1. technet → Settings → Root Directory = /technet
2. web → Settings → Root Directory = /frontend
3. technet → Variables → Add Reference → Postgres
4. technet → Variables → Agregar SECRET_KEY, DEBUG, etc.
5. Copiar URL de technet
6. web → Variables → VITE_API_URL = URL de technet
7. Copiar URL de web
8. technet → Variables → CORS_ALLOWED_ORIGINS = URL de web
9. Ejecutar: .\importar_sql_railway.ps1
10. ¡Probar la aplicación!
```

---

## ⏱️ Tiempo Estimado

- Pasos 1-9: **15 minutos**
- Paso 10 (importar DB): **5-10 minutos**
- **Total: 20-25 minutos**

---

**¡Empieza por el PASO 1!**
