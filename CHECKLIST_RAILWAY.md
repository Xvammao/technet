# ✅ CHECKLIST - Despliegue Railway

Marca cada paso cuando lo completes:

## 📋 Configuración Inicial

- [ ] **PASO 1:** Crear proyecto vacío en Railway
- [ ] **PASO 2:** Agregar PostgreSQL al proyecto

## 🔧 Servicios

- [ ] **PASO 3:** Crear servicio backend
  - [ ] Seleccionar repo: Xvammao/tehnet
  - [ ] Service Name: `backend`
  - [ ] Root Directory: `/technet`
  
- [ ] **PASO 4:** Crear servicio frontend
  - [ ] Seleccionar repo: Xvammao/tehnet (mismo)
  - [ ] Service Name: `frontend`
  - [ ] Root Directory: `/frontend`

## 🔌 Conexiones y Variables

- [ ] **PASO 5:** Conectar Postgres al backend
  - [ ] backend → Variables → Add Reference → Postgres
  
- [ ] **PASO 6:** Agregar variables del backend
  - [ ] SECRET_KEY
  - [ ] DEBUG=False
  - [ ] ALLOWED_HOSTS=.railway.app
  - [ ] CORS_ALLOW_ALL_ORIGINS=False
  - [ ] PYTHONUNBUFFERED=1

- [ ] **PASO 7:** Esperar despliegues (2-5 min)

## 🌐 URLs y CORS

- [ ] **PASO 8:** Copiar URL del backend
  - URL: `_______________________________`

- [ ] **PASO 9:** Configurar frontend
  - [ ] VITE_API_URL = URL del backend
  - [ ] NODE_ENV = production

- [ ] **PASO 10:** Copiar URL del frontend
  - URL: `_______________________________`

- [ ] **PASO 11:** Actualizar CORS del backend
  - [ ] CORS_ALLOWED_ORIGINS = URL del frontend

## 💾 Base de Datos

- [ ] **PASO 12:** Importar base de datos
  - [ ] Ejecutar: `.\importar_sql_railway.ps1`
  - [ ] Seleccionar archivo .sql
  - [ ] Confirmar importación

## 🎉 Verificación Final

- [ ] Backend funciona: `https://backend-production-xxxx.railway.app/admin/`
- [ ] Frontend funciona: `https://frontend-production-xxxx.railway.app`
- [ ] Login funciona correctamente
- [ ] Datos se muestran en el dashboard

---

**Fecha de inicio:** __________  
**Fecha de finalización:** __________  
**Tiempo total:** __________
