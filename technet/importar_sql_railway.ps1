# ============================================
# Script para Importar archivo SQL a Railway
# ============================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  IMPORTAR SQL A RAILWAY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar Railway CLI
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI no está instalado" -ForegroundColor Red
    Write-Host "`n📥 Instalando Railway CLI..." -ForegroundColor Yellow
    iwr https://railway.app/install.ps1 | iex
    Write-Host "✅ Railway CLI instalado`n" -ForegroundColor Green
}

Write-Host "✅ Railway CLI detectado`n" -ForegroundColor Green

# Verificar autenticación
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Cyan
railway whoami 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás autenticado en Railway" -ForegroundColor Red
    Write-Host "`n🔑 Iniciando sesión..." -ForegroundColor Yellow
    railway login
}

Write-Host "✅ Autenticado en Railway`n" -ForegroundColor Green

# Vincular proyecto
Write-Host "🔗 Vinculando proyecto..." -ForegroundColor Cyan
railway link

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al vincular proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Proyecto vinculado`n" -ForegroundColor Green

# Buscar archivos SQL
Write-Host "📂 Buscando archivos SQL..." -ForegroundColor Cyan
$sqlFiles = Get-ChildItem -Path . -Filter "*.sql" -Recurse | Where-Object { $_.DirectoryName -notlike "*node_modules*" }

if ($sqlFiles.Count -eq 0) {
    Write-Host "❌ No se encontraron archivos SQL" -ForegroundColor Red
    Write-Host "`n💡 Asegúrate de tener tu backup .sql en alguna carpeta del proyecto`n" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📦 Archivos SQL encontrados:" -ForegroundColor Yellow
for ($i = 0; $i -lt $sqlFiles.Count; $i++) {
    $file = $sqlFiles[$i]
    $size = [math]::Round($file.Length / 1KB, 2)
    Write-Host "$($i + 1). $($file.Name) - ${size} KB - $($file.DirectoryName)" -ForegroundColor White
}

Write-Host ""
$choice = Read-Host "Selecciona el número del archivo SQL a importar"

$selectedIndex = [int]$choice - 1

if ($selectedIndex -lt 0 -or $selectedIndex -ge $sqlFiles.Count) {
    Write-Host "`n❌ Selección inválida`n" -ForegroundColor Red
    exit 1
}

$selectedFile = $sqlFiles[$selectedIndex]
$filePath = $selectedFile.FullName

Write-Host "`n📂 Archivo seleccionado: $($selectedFile.Name)" -ForegroundColor Cyan

# Advertencia
Write-Host "`n⚠️  ADVERTENCIA:" -ForegroundColor Red
Write-Host "   Esta operación importará datos a tu base de datos de Railway." -ForegroundColor Yellow
Write-Host "   Asegúrate de que las migraciones de Django ya se ejecutaron.`n" -ForegroundColor Yellow

$confirm = Read-Host "¿Deseas continuar? (s/n)"

if ($confirm -ne 's' -and $confirm -ne 'S') {
    Write-Host "`n👋 Operación cancelada`n" -ForegroundColor Yellow
    exit 0
}

# Importar SQL
Write-Host "`n🔄 Importando SQL a Railway..." -ForegroundColor Cyan
Write-Host "   Esto puede tomar varios minutos...`n" -ForegroundColor Yellow

Get-Content $filePath | railway run psql '$DATABASE_URL'

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Datos importados exitosamente a Railway" -ForegroundColor Green
    
    Write-Host "`n📝 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Verificar los datos:"
    Write-Host '   railway run psql $DATABASE_URL -c "SELECT COUNT(*) FROM configuracion_instalacion;"'
    Write-Host ""
    Write-Host "2. Crear superusuario (si es necesario):"
    Write-Host "   railway run python manage.py createsuperuser"
    Write-Host ""
    Write-Host "3. Recolectar archivos estáticos:"
    Write-Host "   railway run python manage.py collectstatic --noinput`n"
    
} else {
    Write-Host "`n❌ Error al importar datos" -ForegroundColor Red
    Write-Host "   Revisa los logs para más detalles`n" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PROCESO COMPLETADO" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
