@echo off
echo ========================================
echo   Reparando Sistema de Login
echo ========================================
echo.

cd technet
call ..\Entorno_virtual\Scripts\activate.bat

echo [1/3] Instalando djoser...
pip install djoser

echo.
echo [2/3] Aplicando migraciones...
python manage.py migrate

echo.
echo [3/3] Verificando usuario...
python manage.py shell -c "from django.contrib.auth.models import User; u = User.objects.get(username='mao'); print(f'Usuario: {u.username}, Superusuario: {u.is_superuser}')"

echo.
echo ========================================
echo   Reparacion completada!
echo ========================================
echo.
echo Ahora ejecuta:
echo   1. python manage.py runserver
echo   2. En otra terminal: cd frontend ^&^& npm run dev
echo   3. Abre http://localhost:3000
echo.
pause
