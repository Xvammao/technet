@echo off
echo ========================================
echo   Iniciando Frontend TechNet (React)
echo ========================================
echo.

cd frontend

echo Verificando instalacion de dependencias...
if not exist "node_modules\" (
    echo.
    echo Instalando dependencias por primera vez...
    echo Esto puede tomar unos minutos...
    echo.
    call npm install
)

echo.
echo Iniciando servidor de desarrollo...
echo.
echo Frontend disponible en: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call npm run dev

pause
