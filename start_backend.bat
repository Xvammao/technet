@echo off
echo ========================================
echo   Iniciando Backend TechNet (Django)
echo ========================================
echo.

cd technet
call ..\Entorno_virtual\Scripts\activate.bat

echo Activando entorno virtual...
echo.

echo Iniciando servidor Django en puerto 8000...
echo.
echo Backend disponible en: http://localhost:8000
echo Admin disponible en: http://localhost:8000/admin/
echo API disponible en: http://localhost:8000/technet/
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

python manage.py runserver

pause
