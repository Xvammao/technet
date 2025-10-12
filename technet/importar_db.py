#!/usr/bin/env python
import os
import sys
import subprocess

# Obtener DATABASE_URL del entorno
database_url = os.environ.get('DATABASE_URL')

if not database_url:
    print("ERROR: DATABASE_URL no está configurado")
    sys.exit(1)

# Archivo SQL a importar
sql_file = 'dump-telecomunicaciones-202510122217.sql'

if not os.path.exists(sql_file):
    print(f"ERROR: No se encuentra el archivo {sql_file}")
    sys.exit(1)

print(f"Importando {sql_file} a Railway...")
print("Esto puede tomar varios minutos...")

# Ejecutar psql
try:
    with open(sql_file, 'r', encoding='utf-8') as f:
        result = subprocess.run(
            ['psql', database_url],
            stdin=f,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("\n✅ Datos importados exitosamente!")
        else:
            print(f"\n❌ Error al importar:")
            print(result.stderr)
            sys.exit(1)
            
except Exception as e:
    print(f"\n❌ Error: {e}")
    sys.exit(1)
