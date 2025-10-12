# 🎯 Comandos Railway - Referencia Rápida

## 🔧 Instalación y Configuración

```powershell
# Instalar Railway CLI
iwr https://railway.app/install.ps1 | iex

# Verificar instalación
railway --version

# Iniciar sesión
railway login

# Ver quién está logueado
railway whoami

# Vincular a un proyecto
railway link

# Ver estado del proyecto
railway status

# Abrir dashboard en navegador
railway open
```

---

## 📦 Variables de Entorno

```powershell
# Ver todas las variables
railway variables

# Establecer una variable
railway variables set SECRET_KEY="tu-clave-secreta"

# Establecer múltiples variables
railway variables set DEBUG=False ALLOWED_HOSTS=.railway.app

# Eliminar una variable
railway variables delete VARIABLE_NAME

# Ver una variable específica
railway variables get SECRET_KEY
```

---

## 🚀 Despliegue

```powershell
# Desplegar manualmente (si no hay auto-deploy)
railway up

# Forzar redespliegue
railway redeploy

# Ver deployments
railway deployments

# Ver logs en tiempo real
railway logs

# Ver logs de un servicio específico
railway logs --service backend
railway logs --service frontend
```

---

## 🗄️ Base de Datos PostgreSQL

```powershell
# Conectar a PostgreSQL
railway run psql $DATABASE_URL

# Ejecutar query directamente
railway run psql $DATABASE_URL -c "SELECT COUNT(*) FROM configuracion_instalacion;"

# Ver tablas
railway run psql $DATABASE_URL -c "\dt"

# Ver información de la base de datos
railway run psql $DATABASE_URL -c "\l"

# Backup de base de datos
railway run pg_dump $DATABASE_URL > backup.sql

# Restaurar backup
railway run psql $DATABASE_URL < backup.sql
```

---

## 🐍 Django en Railway

```powershell
# Ejecutar migraciones
railway run python manage.py migrate

# Crear superusuario
railway run python manage.py createsuperuser

# Recolectar archivos estáticos
railway run python manage.py collectstatic --noinput

# Ejecutar shell de Django
railway run python manage.py shell

# Ver modelos
railway run python manage.py showmigrations

# Crear migraciones
railway run python manage.py makemigrations

# Verificar configuración
railway run python manage.py check --deploy

# Cargar datos desde fixture
railway run python manage.py loaddata data.json

# Exportar datos
railway run python manage.py dumpdata > data.json
```

---

## 📊 Monitoreo y Debugging

```powershell
# Ver logs en tiempo real
railway logs --follow

# Ver últimas 100 líneas de logs
railway logs --tail 100

# Filtrar logs por servicio
railway logs --service backend

# Ver métricas
railway metrics

# Ver uso de recursos
railway usage

# Ver información del servicio
railway service
```

---

## 🔄 Gestión de Servicios

```powershell
# Listar servicios
railway service list

# Cambiar a un servicio
railway service

# Reiniciar servicio
railway restart

# Detener servicio
railway down

# Iniciar servicio
railway up
```

---

## 🌐 Dominios

```powershell
# Ver dominios
railway domain

# Agregar dominio personalizado
railway domain add tudominio.com

# Eliminar dominio
railway domain remove tudominio.com
```

---

## 🔍 Información del Proyecto

```powershell
# Ver información del proyecto
railway status

# Ver variables de entorno
railway variables

# Ver servicios
railway service list

# Ver deployments recientes
railway deployments

# Ver logs de build
railway logs --deployment <deployment-id>
```

---

## 🛠️ Comandos Útiles Combinados

### Despliegue Completo del Backend

```powershell
# Secuencia completa de despliegue
railway link
railway run python manage.py migrate
railway run python manage.py collectstatic --noinput
railway run python manage.py createsuperuser
railway logs --follow
```

### Verificación Post-Despliegue

```powershell
# Verificar que todo funciona
railway status
railway logs --tail 50
railway run python manage.py check --deploy
railway run psql $DATABASE_URL -c "SELECT COUNT(*) FROM auth_user;"
```

### Actualización de la Aplicación

```powershell
# Después de hacer cambios en el código
git add .
git commit -m "Actualización"
git push origin main
# Railway despliega automáticamente
railway logs --follow
```

### Debugging de Problemas

```powershell
# Ver logs detallados
railway logs --tail 200

# Verificar variables de entorno
railway variables

# Probar conexión a base de datos
railway run psql $DATABASE_URL -c "SELECT version();"

# Verificar migraciones
railway run python manage.py showmigrations

# Ejecutar shell para debugging
railway run python manage.py shell
```

---

## 🔐 Seguridad

```powershell
# Generar nueva SECRET_KEY
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Establecer SECRET_KEY en Railway
railway variables set SECRET_KEY="<nueva-clave>"

# Verificar configuración de seguridad
railway run python manage.py check --deploy
```

---

## 📦 Backup y Restauración

### Backup Completo

```powershell
# Backup de base de datos (formato custom)
railway run pg_dump -Fc $DATABASE_URL > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").dump

# Backup de base de datos (formato SQL)
railway run pg_dump $DATABASE_URL > backup_$(Get-Date -Format "yyyyMMdd_HHmmss").sql

# Backup de datos Django
railway run python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > data_$(Get-Date -Format "yyyyMMdd_HHmmss").json
```

### Restauración

```powershell
# Restaurar desde dump custom
railway run pg_restore -d $DATABASE_URL --clean --if-exists backup.dump

# Restaurar desde SQL
railway run psql $DATABASE_URL < backup.sql

# Restaurar datos Django
railway run python manage.py loaddata data.json
```

---

## 🚨 Comandos de Emergencia

```powershell
# Rollback a deployment anterior
railway rollback <deployment-id>

# Ver deployments disponibles
railway deployments

# Reiniciar servicio
railway restart

# Ver logs de error
railway logs --tail 100 | Select-String "ERROR"

# Conectar a base de datos para verificar
railway run psql $DATABASE_URL

# Ejecutar migraciones forzadas
railway run python manage.py migrate --run-syncdb
```

---

## 💡 Tips y Trucos

### Ejecutar Comandos Locales con Variables de Railway

```powershell
# Obtener variables de Railway localmente
railway run env

# Ejecutar servidor local con variables de Railway
railway run python manage.py runserver
```

### Copiar Base de Datos de Railway a Local

```powershell
# Exportar desde Railway
railway run pg_dump $DATABASE_URL > railway_backup.sql

# Importar a local
psql -U postgres -h localhost -d telecomunicaciones < railway_backup.sql
```

### Ver Configuración Actual

```powershell
# Ver toda la configuración
railway status
railway variables
railway service list
railway domain
```

---

## 📚 Recursos

- **Documentación:** https://docs.railway.app/
- **CLI Reference:** https://docs.railway.app/develop/cli
- **Discord:** https://discord.gg/railway
- **Status:** https://status.railway.app/

---

## 🆘 Ayuda Rápida

```powershell
# Ver ayuda general
railway help

# Ver ayuda de un comando específico
railway help logs
railway help variables
railway help run

# Ver versión
railway --version
```

---

**💡 Tip:** Guarda este archivo como referencia rápida. Todos estos comandos están probados y funcionan con Railway CLI.
