#!/usr/bin/env python
"""
Script para configurar el archivo .env inicial
Ejecutar: python setup_env.py
"""

import os
import shutil
from pathlib import Path

def setup_environment():
    """Copia .env.example a .env si no existe"""
    base_dir = Path(__file__).resolve().parent
    env_example = base_dir / '.env.example'
    env_file = base_dir / '.env'
    
    if env_file.exists():
        print("❌ El archivo .env ya existe.")
        response = input("¿Deseas sobrescribirlo? (s/N): ")
        if response.lower() != 's':
            print("✅ Operación cancelada.")
            return
    
    if not env_example.exists():
        print("❌ Error: No se encontró el archivo .env.example")
        return
    
    # Copiar archivo
    shutil.copy(env_example, env_file)
    print("✅ Archivo .env creado exitosamente!")
    print("\n📝 IMPORTANTE:")
    print("   1. Edita el archivo .env con tus configuraciones")
    print("   2. Para producción, genera una nueva SECRET_KEY")
    print("   3. Establece DEBUG=False en producción")
    print("   4. Configura ALLOWED_HOSTS con tu dominio")
    print("\n💡 Para generar una nueva SECRET_KEY, ejecuta:")
    print("   python -c \"from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())\"")
    print("\n📚 Consulta DEPLOYMENT.md para más información")

if __name__ == '__main__':
    setup_environment()
