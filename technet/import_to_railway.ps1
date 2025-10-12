# ============================================
# Script para Importar Base de Datos a Railway
# ============================================
# Este script te ayuda a importar tu base de datos
# desde los backups locales a Railway

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  IMPORTAR BASE DE DATOS A RAILWAY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar que Railway CLI esté instalado
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI no está instalado" -ForegroundColor Red
    Write-Host "`n📥 Para instalar Railway CLI, ejecuta:" -ForegroundColor Yellow
    Write-Host "   iwr https://railway.app/install.ps1 | iex`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Railway CLI detectado`n" -ForegroundColor Green

# Verificar que esté logueado
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Cyan
railway whoami 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás autenticado en Railway" -ForegroundColor Red
    Write-Host "`n🔑 Ejecuta primero:" -ForegroundColor Yellow
    Write-Host "   railway login`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Autenticado en Railway`n" -ForegroundColor Green

# Verificar que esté vinculado a un proyecto
Write-Host "🔗 Verificando proyecto vinculado..." -ForegroundColor Cyan
railway status 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás vinculado a un proyecto" -ForegroundColor Red
    Write-Host "`n🔗 Ejecuta primero:" -ForegroundColor Yellow
    Write-Host "   railway link`n" -ForegroundColor White
    exit 1
}

Write-Host "✅ Proyecto vinculado`n" -ForegroundColor Green

# Listar backups disponibles
$BACKUP_DIR = "database_backups"

if (-not (Test-Path $BACKUP_DIR)) {
    Write-Host "❌ No se encontró el directorio de backups: $BACKUP_DIR" -ForegroundColor Red
    Write-Host "`n💡 Ejecuta primero el script export_database.ps1`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Backups disponibles:" -ForegroundColor Yellow
Write-Host ""

$backups = Get-ChildItem -Path $BACKUP_DIR | Sort-Object LastWriteTime -Descending
$index = 1

foreach ($backup in $backups) {
    $size = [math]::Round($backup.Length / 1MB, 2)
    $date = $backup.LastWriteTime.ToString("yyyy-MM-dd HH:mm:ss")
    Write-Host "$index. $($backup.Name) - ${size} MB - $date"
    $index++
}

Write-Host ""
$choice = Read-Host "Selecciona el número del backup a importar (o 'q' para salir)"

if ($choice -eq 'q') {
    Write-Host "`n👋 Operación cancelada`n" -ForegroundColor Yellow
    exit 0
}

$selectedIndex = [int]$choice - 1

if ($selectedIndex -lt 0 -or $selectedIndex -ge $backups.Count) {
    Write-Host "`n❌ Selección inválida`n" -ForegroundColor Red
    exit 1
}

$selectedBackup = $backups[$selectedIndex]
$backupPath = $selectedBackup.FullName
$backupExt = $selectedBackup.Extension

Write-Host "`n📂 Backup seleccionado: $($selectedBackup.Name)" -ForegroundColor Cyan

# Advertencia
Write-Host "`n⚠️  ADVERTENCIA:" -ForegroundColor Red
Write-Host "   Esta operación importará datos a tu base de datos de Railway."
Write-Host "   Asegúrate de que la base de datos esté vacía o que quieras sobrescribir los datos.`n"

$confirm = Read-Host "¿Deseas continuar? (s/n)"

if ($confirm -ne 's' -and $confirm -ne 'S') {
    Write-Host "`n👋 Operación cancelada`n" -ForegroundColor Yellow
    exit 0
}

# Importar según el tipo de archivo
Write-Host "`n🔄 Importando datos a Railway..." -ForegroundColor Cyan

switch ($backupExt) {
    ".dump" {
        Write-Host "📥 Usando pg_restore para archivo .dump..." -ForegroundColor Yellow
        railway run pg_restore -d '$DATABASE_URL' --clean --if-exists --no-owner --no-acl $backupPath
    }
    
    ".sql" {
        Write-Host "📥 Usando psql para archivo .sql..." -ForegroundColor Yellow
        Get-Content $backupPath | railway run psql '$DATABASE_URL'
    }
    
    ".json" {
        Write-Host "📥 Usando Django loaddata para archivo .json..." -ForegroundColor Yellow
        railway run python manage.py loaddata $backupPath
    }
    
    default {
        Write-Host "❌ Tipo de archivo no soportado: $backupExt" -ForegroundColor Red
        Write-Host "   Tipos soportados: .dump, .sql, .json`n" -ForegroundColor Yellow
        exit 1
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Datos importados exitosamente a Railway" -ForegroundColor Green
    
    Write-Host "`n📝 Próximos pasos recomendados:" -ForegroundColor Yellow
    Write-Host "1. Ejecutar migraciones:"
    Write-Host "   railway run python manage.py migrate"
    Write-Host ""
    Write-Host "2. Crear superusuario (si es necesario):"
    Write-Host "   railway run python manage.py createsuperuser"
    Write-Host ""
    Write-Host "3. Verificar los datos:"
    Write-Host "   railway run psql `$DATABASE_URL"
    Write-Host "   Luego ejecuta: SELECT COUNT(*) FROM configuracion_instalacion;`n"
    
} else {
    Write-Host "`n❌ Error al importar datos" -ForegroundColor Red
    Write-Host "   Revisa los logs para más detalles`n" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROCESO COMPLETADO" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
