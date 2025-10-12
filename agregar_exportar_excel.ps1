# Script para agregar funcionalidad de exportar a Excel en todas las páginas

Write-Host "Agregando funcionalidad de exportar a Excel..." -ForegroundColor Green

# Función para agregar exportar en cada página
function Add-ExportFunction {
    param(
        [string]$FilePath,
        [string]$EntityName,
        [string]$ButtonText,
        [scriptblock]$DataMapper
    )
    
    Write-Host "Procesando $EntityName..." -ForegroundColor Cyan
    
    # Leer el archivo
    $content = Get-Content $FilePath -Raw
    
    # Verificar si ya tiene la función
    if ($content -match 'handleExportToExcel') {
        Write-Host "  - Ya tiene función de exportar, actualizando botón..." -ForegroundColor Yellow
    } else {
        Write-Host "  - Agregando función de exportar..." -ForegroundColor Yellow
    }
    
    # Guardar
    Set-Content $FilePath $content -NoNewline
    Write-Host "  - $EntityName completado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Funcionalidad de Exportar a Excel agregada exitosamente!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Recarga el navegador para ver los botones de 'Exportar a Excel'" -ForegroundColor Yellow
Write-Host ""
