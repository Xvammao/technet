# 🚀 Guía Rápida: Migración a Railway

## ⚡ Pasos Principales

### 1️⃣ Preparación (5 minutos)

```powershell
# Instalar Railway CLI
iwr https://railway.app/install.ps1 | iex

# Verificar instalación
railway --version

# Iniciar sesión
railway login
```

### 2️⃣ Subir Código a GitHub (5 minutos)

```bash
cd c:\Users\maog9\OneDrive\Escritorio\TELECOMUNICACIONES
git init
git add .
git commit -m "Preparar para Railway"
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 3️⃣ Crear Proyecto en Railway (10 minutos)

1. Ve a [railway.app/dashboard](https://railway.app/dashboard)
2. Click en "New Project"
3. Selecciona "Provision PostgreSQL"
4. Click en "New Service" → "GitHub Repo"
5. Selecciona tu repositorio

### 4️⃣ Configurar Backend (10 minutos)

**En Railway Dashboard → Backend Service:**

1. **Settings:**
   - Root Directory: `/technet`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn technet.wsgi --log-file -`

2. **Variables (pestaña Variables):**
   ```env
   SECRET_KEY=<genera-nueva-clave>
   DEBUG=False
   ALLOWED_HOSTS=.railway.app
   CORS_ALLOW_ALL_ORIGINS=False
   PYTHONUNBUFFERED=1
   ```

3. **Conectar PostgreSQL:**
   - Click en "Add Reference"
   - Selecciona el servicio PostgreSQL
   - Railway agregará `DATABASE_URL` automáticamente

### 5️⃣ Exportar Base de Datos Local (5 minutos)

```powershell
cd technet
.\export_database.ps1
# Selecciona opción 1 (formato Custom)
```

### 6️⃣ Ejecutar Migraciones en Railway (5 minutos)

```powershell
railway link
railway run python manage.py migrate
railway run python manage.py createsuperuser
railway run python manage.py collectstatic --noinput
```

### 7️⃣ Importar Datos a Railway (10 minutos)

```powershell
.\import_to_railway.ps1
# Selecciona el backup más reciente
```

### 8️⃣ Configurar Frontend (10 minutos)

**En Railway Dashboard → New Service:**

1. **Settings:**
   - Root Directory: `/frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview -- --host 0.0.0.0 --port $PORT`

2. **Variables:**
   ```env
   VITE_API_URL=https://tu-backend.railway.app
   NODE_ENV=production
   ```

### 9️⃣ Actualizar CORS (5 minutos)

**En Railway Dashboard → Backend → Variables:**

```env
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app
```

### 🔟 Verificar Todo Funciona (5 minutos)

```powershell
# Ver logs del backend
railway logs

# Probar endpoints
curl https://tu-backend.railway.app/admin/

# Abrir frontend
# Visita: https://tu-frontend.railway.app
```

---

## 📋 Checklist Rápido

- [ ] Railway CLI instalado
- [ ] Código en GitHub
- [ ] Proyecto creado en Railway
- [ ] PostgreSQL agregado
- [ ] Backend desplegado
- [ ] Variables de entorno configuradas
- [ ] Base de datos exportada
- [ ] Migraciones ejecutadas
- [ ] Datos importados
- [ ] Superusuario creado
- [ ] Frontend desplegado
- [ ] CORS actualizado
- [ ] Login funciona

---

## 🆘 Comandos Útiles

```powershell
# Ver estado
railway status

# Ver variables
railway variables

# Ver logs en tiempo real
railway logs

# Ejecutar comando en Railway
railway run <comando>

# Conectar a PostgreSQL
railway run psql $DATABASE_URL

# Abrir dashboard
railway open
```

---

## 📞 Ayuda

- **Guía completa:** `technet/RAILWAY_DEPLOYMENT.md`
- **Script de ayuda:** `python technet/migrate_to_railway.py`
- **Docs Railway:** https://docs.railway.app/
- **Discord Railway:** https://discord.gg/railway

---

## 💰 Costos Estimados

- **Plan Free:** $5 crédito/mes (suficiente para pruebas)
- **Plan Hobby:** $5/mes + uso
- **Estimado total:** $10-18/mes

---

## ⚡ Tiempo Total Estimado

**~60-70 minutos** para migración completa

---

¡Listo! Tu aplicación estará en producción en Railway 🎉
