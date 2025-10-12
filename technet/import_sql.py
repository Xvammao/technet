import os
import django
from django.db import connection

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'technet.settings')
django.setup()

# Leer archivo SQL
sql_file = 'dump-telecomunicaciones-202510122217.sql'

print(f"Leyendo {sql_file}...")
with open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

print("Ejecutando SQL en la base de datos...")

try:
    with connection.cursor() as cursor:
        cursor.execute(sql_content)
    print("✅ Datos importados exitosamente!")
except Exception as e:
    print(f"❌ Error: {e}")
