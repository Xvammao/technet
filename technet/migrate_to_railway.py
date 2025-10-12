#!/usr/bin/env python
"""
Script para ayudar con la migración a Railway
Genera comandos útiles y verifica la configuración
"""

import os
import sys
from pathlib import Path

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def generate_secret_key():
    """Genera una nueva SECRET_KEY para Django"""
    try:
        from django.core.management.utils import get_random_secret_key
        return get_random_secret_key()
    except ImportError:
        print("⚠️  Django no está instalado. Instala las dependencias primero:")
        print("   pip install -r requirements.txt")
        return None

def check_files():
    """Verifica que todos los archivos necesarios existan"""
    print_header("Verificando Archivos de Configuración")
    
    required_files = [
        'requirements.txt',
        'Procfile',
        'runtime.txt',
        'railway.json',
        'nixpacks.toml',
        '.env.example',
        '.gitignore'
    ]
    
    all_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file}")
        else:
            print(f"❌ {file} - FALTA")
            all_exist = False
    
    return all_exist

def generate_railway_commands():
    """Genera comandos útiles para Railway CLI"""
    print_header("Comandos Útiles de Railway CLI")
    
    commands = [
        ("Iniciar sesión", "railway login"),
        ("Vincular proyecto", "railway link"),
        ("Ver variables", "railway variables"),
        ("Establecer variable", "railway variables set SECRET_KEY='tu-clave'"),
        ("Ejecutar migraciones", "railway run python manage.py migrate"),
        ("Crear superusuario", "railway run python manage.py createsuperuser"),
        ("Recolectar estáticos", "railway run python manage.py collectstatic --noinput"),
        ("Ver logs", "railway logs"),
        ("Abrir dashboard", "railway open"),
        ("Conectar a PostgreSQL", "railway run psql $DATABASE_URL"),
    ]
    
    for description, command in commands:
        print(f"📌 {description}:")
        print(f"   {command}\n")

def export_database_commands():
    """Genera comandos para exportar la base de datos local"""
    print_header("Comandos para Exportar Base de Datos Local")
    
    print("🔹 Opción 1: Exportar con pg_dump (formato custom):")
    print("   pg_dump -U postgres -h localhost -d telecomunicaciones -F c -b -v -f backup_railway.dump\n")
    
    print("🔹 Opción 2: Exportar con pg_dump (formato SQL):")
    print("   pg_dump -U postgres -h localhost -d telecomunicaciones > backup_railway.sql\n")
    
    print("🔹 Opción 3: Exportar con Django dumpdata:")
    print("   python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 2 > data_backup.json\n")

def import_database_commands():
    """Genera comandos para importar la base de datos a Railway"""
    print_header("Comandos para Importar Base de Datos a Railway")
    
    print("🔹 Opción 1: Restaurar dump custom:")
    print("   railway run pg_restore -d $DATABASE_URL backup_railway.dump\n")
    
    print("🔹 Opción 2: Restaurar SQL:")
    print("   railway run psql $DATABASE_URL < backup_railway.sql\n")
    
    print("🔹 Opción 3: Cargar datos de Django:")
    print("   railway run python manage.py loaddata data_backup.json\n")

def deployment_checklist():
    """Muestra checklist de despliegue"""
    print_header("Checklist de Despliegue")
    
    checklist = [
        "Crear cuenta en Railway.app",
        "Subir código a GitHub",
        "Crear proyecto en Railway",
        "Agregar servicio PostgreSQL",
        "Configurar variables de entorno",
        "Conectar PostgreSQL al backend",
        "Desplegar backend",
        "Exportar base de datos local",
        "Importar datos a Railway",
        "Ejecutar migraciones",
        "Crear superusuario",
        "Desplegar frontend",
        "Actualizar CORS_ALLOWED_ORIGINS",
        "Probar login y funcionalidades",
        "Configurar dominio personalizado (opcional)",
    ]
    
    for i, item in enumerate(checklist, 1):
        print(f"  {i:2d}. [ ] {item}")
    
    print("\n💡 Marca cada item cuando lo completes")

def main():
    """Función principal"""
    print("\n" + "🚂 "*20)
    print("  ASISTENTE DE MIGRACIÓN A RAILWAY")
    print("🚂 "*20)
    
    # Verificar archivos
    files_ok = check_files()
    
    if not files_ok:
        print("\n⚠️  Algunos archivos de configuración faltan.")
        print("   Revisa la guía RAILWAY_DEPLOYMENT.md para más información.\n")
    
    # Generar SECRET_KEY
    print_header("Generar Nueva SECRET_KEY")
    secret_key = generate_secret_key()
    if secret_key:
        print("🔑 Tu nueva SECRET_KEY:")
        print(f"   {secret_key}")
        print("\n💡 Guarda esta clave de forma segura y agrégala a Railway")
    
    # Comandos de Railway
    generate_railway_commands()
    
    # Comandos de base de datos
    export_database_commands()
    import_database_commands()
    
    # Checklist
    deployment_checklist()
    
    # URLs importantes
    print_header("Enlaces Útiles")
    print("📚 Documentación de Railway: https://docs.railway.app/")
    print("🎯 Railway Dashboard: https://railway.app/dashboard")
    print("💬 Railway Discord: https://discord.gg/railway")
    print("📖 Guía completa: RAILWAY_DEPLOYMENT.md")
    
    print("\n" + "="*60)
    print("  ¡Buena suerte con tu despliegue! 🚀")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
