# ============================================
# Script para Exportar Base de Datos Local
# ============================================
# Este script exporta tu base de datos PostgreSQL local
# para luego importarla en Railway

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  EXPORTAR BASE DE DATOS PARA RAILWAY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuración
$DB_USER = "postgres"
$DB_HOST = "localhost"
$DB_NAME = "telecomunicaciones"
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_DIR = "database_backups"

# Crear directorio de backups si no existe
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
    Write-Host "✅ Directorio de backups creado: $BACKUP_DIR`n" -ForegroundColor Green
}

Write-Host "📊 Información de la exportación:" -ForegroundColor Yellow
Write-Host "   Base de datos: $DB_NAME"
Write-Host "   Usuario: $DB_USER"
Write-Host "   Host: $DB_HOST"
Write-Host "   Fecha: $TIMESTAMP`n"

# Menú de opciones
Write-Host "Selecciona el formato de exportación:" -ForegroundColor Yellow
Write-Host "1. Formato Custom (pg_dump -Fc) - Recomendado"
Write-Host "2. Formato SQL (pg_dump)"
Write-Host "3. Django dumpdata (JSON)"
Write-Host "4. Todos los formatos"
Write-Host ""

$choice = Read-Host "Ingresa tu opción (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`n🔄 Exportando en formato Custom..." -ForegroundColor Cyan
        $BACKUP_FILE = "$BACKUP_DIR\backup_${TIMESTAMP}.dump"
        
        $env:PGPASSWORD = Read-Host "Ingresa la contraseña de PostgreSQL" -AsSecureString
        $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))
        
        pg_dump -U $DB_USER -h $DB_HOST -d $DB_NAME -F c -b -v -f $BACKUP_FILE
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backup creado exitosamente: $BACKUP_FILE" -ForegroundColor Green
            Write-Host "`n📝 Para restaurar en Railway, usa:" -ForegroundColor Yellow
            Write-Host "   railway run pg_restore -d `$DATABASE_URL $BACKUP_FILE`n" -ForegroundColor White
        } else {
            Write-Host "❌ Error al crear el backup" -ForegroundColor Red
        }
    }
    
    "2" {
        Write-Host "`n🔄 Exportando en formato SQL..." -ForegroundColor Cyan
        $BACKUP_FILE = "$BACKUP_DIR\backup_${TIMESTAMP}.sql"
        
        $env:PGPASSWORD = Read-Host "Ingresa la contraseña de PostgreSQL" -AsSecureString
        $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))
        
        pg_dump -U $DB_USER -h $DB_HOST -d $DB_NAME > $BACKUP_FILE
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backup creado exitosamente: $BACKUP_FILE" -ForegroundColor Green
            Write-Host "`n📝 Para restaurar en Railway, usa:" -ForegroundColor Yellow
            Write-Host "   railway run psql `$DATABASE_URL < $BACKUP_FILE`n" -ForegroundColor White
        } else {
            Write-Host "❌ Error al crear el backup" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host "`n🔄 Exportando con Django dumpdata..." -ForegroundColor Cyan
        $BACKUP_FILE = "$BACKUP_DIR\data_${TIMESTAMP}.json"
        
        python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > $BACKUP_FILE
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Datos exportados exitosamente: $BACKUP_FILE" -ForegroundColor Green
            Write-Host "`n📝 Para restaurar en Railway, usa:" -ForegroundColor Yellow
            Write-Host "   railway run python manage.py loaddata $BACKUP_FILE`n" -ForegroundColor White
        } else {
            Write-Host "❌ Error al exportar datos" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host "`n🔄 Exportando en todos los formatos..." -ForegroundColor Cyan
        
        # Formato Custom
        $BACKUP_FILE_DUMP = "$BACKUP_DIR\backup_${TIMESTAMP}.dump"
        Write-Host "`n1️⃣ Exportando formato Custom..." -ForegroundColor Yellow
        
        $env:PGPASSWORD = Read-Host "Ingresa la contraseña de PostgreSQL" -AsSecureString
        $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))
        
        pg_dump -U $DB_USER -h $DB_HOST -d $DB_NAME -F c -b -v -f $BACKUP_FILE_DUMP
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Formato Custom creado: $BACKUP_FILE_DUMP" -ForegroundColor Green
        }
        
        # Formato SQL
        $BACKUP_FILE_SQL = "$BACKUP_DIR\backup_${TIMESTAMP}.sql"
        Write-Host "`n2️⃣ Exportando formato SQL..." -ForegroundColor Yellow
        pg_dump -U $DB_USER -h $DB_HOST -d $DB_NAME > $BACKUP_FILE_SQL
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Formato SQL creado: $BACKUP_FILE_SQL" -ForegroundColor Green
        }
        
        # Django dumpdata
        $BACKUP_FILE_JSON = "$BACKUP_DIR\data_${TIMESTAMP}.json"
        Write-Host "`n3️⃣ Exportando con Django dumpdata..." -ForegroundColor Yellow
        python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > $BACKUP_FILE_JSON
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Formato JSON creado: $BACKUP_FILE_JSON" -ForegroundColor Green
        }
        
        Write-Host "`n✅ Todos los backups creados exitosamente en: $BACKUP_DIR" -ForegroundColor Green
    }
    
    default {
        Write-Host "`n❌ Opción inválida" -ForegroundColor Red
        exit 1
    }
}

# Mostrar tamaño del backup
Write-Host "`n📦 Archivos de backup creados:" -ForegroundColor Cyan
Get-ChildItem -Path $BACKUP_DIR -Filter "*${TIMESTAMP}*" | ForEach-Object {
    $size = [math]::Round($_.Length / 1MB, 2)
    Write-Host "   $($_.Name) - ${size} MB" -ForegroundColor White
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  EXPORTACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📝 Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Sube estos archivos a Railway usando Railway CLI"
Write-Host "2. O usa los comandos mostrados arriba para restaurar"
Write-Host "3. Consulta RAILWAY_DEPLOYMENT.md para más detalles`n"
