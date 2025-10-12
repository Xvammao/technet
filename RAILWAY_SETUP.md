# 🚂 Configuración Railway - TechNet

## 📁 Estructura del Proyecto

```
TELECOMUNICACIONES/
├── technet/              ← BACKEND (Django)
│   ├── railway.json
│   ├── nixpacks.toml
│   ├── requirements.txt
│   └── manage.py
│
└── frontend/             ← FRONTEND (React)
    ├── railway.json
    ├── nixpacks.toml
    ├── package.json
    └── vite.config.ts
```

---

## 🎯 PASOS PARA DESPLEGAR

### 1️⃣ Crear Servicios en Railway

Necesitas crear **3 servicios**:

#### A. PostgreSQL
1. Click **"+ Create"** → **"Database"** → **"Add PostgreSQL"**

#### B. Backend (Django)
1. Click **"+ Create"** → **"GitHub Repo"**
2. Selecciona: **Xvammao/tehnet**
3. Railway detectará automáticamente `/technet`
4. En **Settings** → **Service Name**: `backend`
5. En **Settings** → **Root Directory**: `/technet`

#### C. Frontend (React)
1. Click **"+ Create"** → **"GitHub Repo"**
2. Selecciona: **Xvammao/tehnet** (el mismo repo)
3. Railway detectará automáticamente `/frontend`
4. En **Settings** → **Service Name**: `frontend`
5. En **Settings** → **Root Directory**: `/frontend`

---

### 2️⃣ Configurar Variables de Entorno

#### Backend (technet)

**Variables requeridas:**
```env
DATABASE_URL=<auto-generado-al-conectar-postgres>
SECRET_KEY=trx2gewy5u84sxs7yr-q1haymvcr4f8frteez8
DEBUG=False
ALLOWED_HOSTS=.railway.app
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app
CORS_ALLOW_ALL_ORIGINS=False
PYTHONUNBUFFERED=1
```

**Conectar PostgreSQL:**
1. Backend → Variables → New Variable → Add Reference
2. Selecciona: Postgres
3. Railway agregará `DATABASE_URL` automáticamente

#### Frontend

**Variables requeridas:**
```env
VITE_API_URL=https://tu-backend.railway.app
NODE_ENV=production
```

---

### 3️⃣ Importar Base de Datos

Una vez que el backend esté desplegado y conectado a PostgreSQL:

```powershell
# Instalar Railway CLI
iwr https://railway.app/install.ps1 | iex

# Iniciar sesión
railway login

# Vincular proyecto (selecciona el servicio BACKEND)
railway link

# Ejecutar migraciones
railway run python manage.py migrate

# Importar tu backup SQL
railway run psql $DATABASE_URL < ruta\a\tu\backup.sql

# Crear superusuario
railway run python manage.py createsuperuser
```

---

### 4️⃣ Actualizar URLs

Una vez desplegados ambos servicios:

1. **Copia URL del backend** (ej: `https://backend-production-xxxx.railway.app`)
2. **Actualiza frontend:**
   - Frontend → Variables → `VITE_API_URL` = URL del backend

3. **Copia URL del frontend** (ej: `https://frontend-production-xxxx.railway.app`)
4. **Actualiza backend:**
   - Backend → Variables → `CORS_ALLOWED_ORIGINS` = URL del frontend

---

## ✅ Verificación

Después de desplegar todo:

1. **Backend:** `https://tu-backend.railway.app/admin/` (debe mostrar Django admin)
2. **Frontend:** `https://tu-frontend.railway.app` (debe mostrar tu app)
3. **Login:** Prueba iniciar sesión desde el frontend

---

## 🔧 Comandos Útiles

```powershell
# Ver logs del backend
railway logs --service backend

# Ver logs del frontend
railway logs --service frontend

# Ejecutar comando en backend
railway run --service backend python manage.py <comando>

# Conectar a PostgreSQL
railway run --service backend psql $DATABASE_URL

# Ver variables
railway variables --service backend
```

---

## 📊 Arquitectura Final

```
┌─────────────────┐
│   PostgreSQL    │
│  (Base Datos)   │
└────────┬────────┘
         │
         │ DATABASE_URL
         │
┌────────▼────────┐      ┌─────────────────┐
│   Backend       │◄─────┤   Frontend      │
│   (Django)      │ API  │   (React)       │
│  Port: 8000     │─────►│  Port: 3000     │
└─────────────────┘      └─────────────────┘
```

---

## 🆘 Solución de Problemas

### Backend no encuentra requirements.txt
- Verifica que **Root Directory** = `/technet`

### Frontend no encuentra package.json
- Verifica que **Root Directory** = `/frontend`

### Error de CORS
- Verifica `CORS_ALLOWED_ORIGINS` en backend
- Verifica `VITE_API_URL` en frontend

### Error de DATABASE_URL
- Verifica que PostgreSQL esté conectado al backend
- Backend → Variables → Add Reference → Postgres

---

**Fecha:** 2025-10-12  
**Versión:** 2.0 (Reorganizado)
