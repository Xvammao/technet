# ============================================
# Script Simple para Importar SQL a Railway
# ============================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IMPORTAR BACKUP SQL A RAILWAY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "Railway CLI no esta instalado" -ForegroundColor Red
    Write-Host "Instalando Railway CLI..." -ForegroundColor Yellow
    Write-Host ""
    iwr https://railway.app/install.ps1 | iex
    Write-Host ""
    Write-Host "Railway CLI instalado correctamente" -ForegroundColor Green
    Write-Host ""
}

Write-Host "Railway CLI detectado" -ForegroundColor Green
Write-Host ""

# Verificar autenticacion
Write-Host "Verificando autenticacion..." -ForegroundColor Cyan
railway whoami 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "No estas autenticado en Railway" -ForegroundColor Red
    Write-Host "Iniciando sesion..." -ForegroundColor Yellow
    Write-Host ""
    railway login
}

Write-Host "Autenticado en Railway" -ForegroundColor Green
Write-Host ""

# Vincular proyecto
Write-Host "Vinculando proyecto..." -ForegroundColor Cyan
Write-Host "IMPORTANTE: Selecciona el servicio BACKEND" -ForegroundColor Yellow
Write-Host ""
railway link

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al vincular proyecto" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Proyecto vinculado correctamente" -ForegroundColor Green
Write-Host ""

# Buscar archivos SQL
Write-Host "Buscando archivos SQL..." -ForegroundColor Cyan
$sqlFiles = Get-ChildItem -Path . -Filter "*.sql" -Recurse | Where-Object { $_.DirectoryName -notlike "*node_modules*" }

if ($sqlFiles.Count -eq 0) {
    Write-Host "No se encontraron archivos SQL" -ForegroundColor Red
    Write-Host "Asegurate de tener tu backup .sql en la carpeta del proyecto" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Archivos SQL encontrados:" -ForegroundColor Yellow
for ($i = 0; $i -lt $sqlFiles.Count; $i++) {
    $file = $sqlFiles[$i]
    $size = [math]::Round($file.Length / 1KB, 2)
    Write-Host "$($i + 1). $($file.Name) - ${size} KB" -ForegroundColor White
}

Write-Host ""
$choice = Read-Host "Selecciona el numero del archivo SQL a importar"

$selectedIndex = [int]$choice - 1

if ($selectedIndex -lt 0 -or $selectedIndex -ge $sqlFiles.Count) {
    Write-Host ""
    Write-Host "Seleccion invalida" -ForegroundColor Red
    Write-Host ""
    exit 1
}

$selectedFile = $sqlFiles[$selectedIndex]
$filePath = $selectedFile.FullName

Write-Host ""
Write-Host "Archivo seleccionado: $($selectedFile.Name)" -ForegroundColor Cyan
Write-Host ""

# Advertencia
Write-Host "ADVERTENCIA:" -ForegroundColor Red
Write-Host "Esta operacion importara datos a tu base de datos de Railway." -ForegroundColor Yellow
Write-Host "Asegurate de que las migraciones de Django ya se ejecutaron." -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "Deseas continuar? (s/n)"

if ($confirm -ne 's' -and $confirm -ne 'S') {
    Write-Host ""
    Write-Host "Operacion cancelada" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

# Importar SQL
Write-Host ""
Write-Host "Importando SQL a Railway..." -ForegroundColor Cyan
Write-Host "Esto puede tomar varios minutos..." -ForegroundColor Yellow
Write-Host ""

# Usar psql directamente
$env:PGPASSWORD = ""
railway run --service backend "psql `$DATABASE_URL < $filePath"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Datos importados exitosamente a Railway" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Crear superusuario:" -ForegroundColor White
    Write-Host "   railway run python manage.py createsuperuser" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Verificar que el backend funcione:" -ForegroundColor White
    Write-Host "   Abre la URL del backend en el navegador" -ForegroundColor Gray
    Write-Host ""
    
} else {
    Write-Host ""
    Write-Host "Error al importar datos" -ForegroundColor Red
    Write-Host "Revisa los logs para mas detalles" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROCESO COMPLETADO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
