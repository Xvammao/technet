#!/usr/bin/env python
"""
Script de Verificación Pre-Migración a Railway
Verifica que todo esté listo antes de migrar a Railway
"""

import os
import sys
import subprocess
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.CYAN}{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")

def check_file_exists(filepath, required=True):
    """Verifica si un archivo existe"""
    if os.path.exists(filepath):
        print_success(f"{filepath}")
        return True
    else:
        if required:
            print_error(f"{filepath} - FALTA (REQUERIDO)")
        else:
            print_warning(f"{filepath} - FALTA (OPCIONAL)")
        return False

def check_railway_cli():
    """Verifica si Railway CLI está instalado"""
    print_header("Verificando Railway CLI")
    try:
        result = subprocess.run(['railway', '--version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            version = result.stdout.strip()
            print_success(f"Railway CLI instalado: {version}")
            return True
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    
    print_error("Railway CLI no está instalado")
    print_info("Instala con: iwr https://railway.app/install.ps1 | iex")
    return False

def check_git():
    """Verifica si Git está instalado y configurado"""
    print_header("Verificando Git")
    
    # Verificar si git está instalado
    try:
        result = subprocess.run(['git', '--version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            version = result.stdout.strip()
            print_success(f"Git instalado: {version}")
        else:
            print_error("Git no está instalado")
            return False
    except (subprocess.TimeoutExpired, FileNotFoundError):
        print_error("Git no está instalado")
        return False
    
    # Verificar si es un repositorio git
    if os.path.exists('.git'):
        print_success("Repositorio Git inicializado")
    else:
        print_warning("No es un repositorio Git")
        print_info("Ejecuta: git init")
        return False
    
    # Verificar si hay remote configurado
    try:
        result = subprocess.run(['git', 'remote', '-v'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.stdout.strip():
            print_success("Remote Git configurado")
            print_info(result.stdout.strip())
        else:
            print_warning("No hay remote Git configurado")
            print_info("Configura con: git remote add origin <URL>")
    except subprocess.TimeoutExpired:
        pass
    
    return True

def check_required_files():
    """Verifica archivos requeridos"""
    print_header("Verificando Archivos de Configuración")
    
    files = {
        'requirements.txt': True,
        'Procfile': True,
        'runtime.txt': True,
        'railway.json': True,
        'nixpacks.toml': True,
        '.env.example': False,
        '.env.railway.example': True,
        '.gitignore': True,
        'manage.py': True,
        'technet/settings.py': True,
        'technet/wsgi.py': True,
    }
    
    all_required_exist = True
    for filepath, required in files.items():
        exists = check_file_exists(filepath, required)
        if required and not exists:
            all_required_exist = False
    
    return all_required_exist

def check_requirements():
    """Verifica dependencias en requirements.txt"""
    print_header("Verificando Dependencias")
    
    required_packages = [
        'Django',
        'djangorestframework',
        'django-cors-headers',
        'psycopg2-binary',
        'python-decouple',
        'whitenoise',
        'gunicorn',
        'dj-database-url'
    ]
    
    try:
        with open('requirements.txt', 'r') as f:
            content = f.read()
            
        all_present = True
        for package in required_packages:
            if package.lower() in content.lower():
                print_success(f"{package}")
            else:
                print_error(f"{package} - FALTA")
                all_present = False
        
        return all_present
    except FileNotFoundError:
        print_error("requirements.txt no encontrado")
        return False

def check_settings_py():
    """Verifica configuración en settings.py"""
    print_header("Verificando settings.py")
    
    try:
        with open('technet/settings.py', 'r', encoding='utf-8') as f:
            content = f.read()
        
        checks = {
            'dj_database_url': 'import dj_database_url' in content,
            'DATABASE_URL': 'DATABASE_URL' in content,
            'WhiteNoise': 'whitenoise' in content.lower(),
            'CORS': 'CORS_ALLOWED_ORIGINS' in content,
            'STATIC_ROOT': 'STATIC_ROOT' in content,
        }
        
        all_ok = True
        for check_name, check_result in checks.items():
            if check_result:
                print_success(f"{check_name} configurado")
            else:
                print_error(f"{check_name} no configurado")
                all_ok = False
        
        return all_ok
    except FileNotFoundError:
        print_error("technet/settings.py no encontrado")
        return False

def check_procfile():
    """Verifica Procfile"""
    print_header("Verificando Procfile")
    
    try:
        with open('Procfile', 'r') as f:
            content = f.read()
        
        if 'gunicorn' in content and 'technet.wsgi' in content:
            print_success("Procfile configurado correctamente")
            print_info(f"Contenido: {content.strip()}")
            return True
        else:
            print_error("Procfile no está configurado correctamente")
            return False
    except FileNotFoundError:
        print_error("Procfile no encontrado")
        return False

def check_gitignore():
    """Verifica .gitignore"""
    print_header("Verificando .gitignore")
    
    try:
        with open('.gitignore', 'r') as f:
            content = f.read()
        
        important_entries = ['.env', '*.pyc', 'staticfiles', 'database_backups']
        
        all_present = True
        for entry in important_entries:
            if entry in content:
                print_success(f"{entry}")
            else:
                print_warning(f"{entry} no está en .gitignore")
                all_present = False
        
        return all_present
    except FileNotFoundError:
        print_error(".gitignore no encontrado")
        return False

def check_frontend():
    """Verifica configuración del frontend"""
    print_header("Verificando Frontend")
    
    frontend_path = Path('../frontend')
    
    if not frontend_path.exists():
        print_warning("Directorio frontend no encontrado")
        return False
    
    files = {
        '../frontend/package.json': True,
        '../frontend/railway.json': True,
        '../frontend/nixpacks.toml': True,
        '../frontend/.env.railway.example': True,
        '../frontend/vite.config.ts': True,
    }
    
    all_exist = True
    for filepath, required in files.items():
        exists = check_file_exists(filepath, required)
        if required and not exists:
            all_exist = False
    
    return all_exist

def check_database_backup():
    """Verifica si hay backups de base de datos"""
    print_header("Verificando Backups de Base de Datos")
    
    backup_dir = Path('database_backups')
    
    if backup_dir.exists():
        backups = list(backup_dir.glob('*'))
        if backups:
            print_success(f"Se encontraron {len(backups)} backup(s)")
            for backup in backups[:5]:  # Mostrar solo los primeros 5
                size = backup.stat().st_size / (1024 * 1024)  # MB
                print_info(f"  {backup.name} - {size:.2f} MB")
            return True
        else:
            print_warning("Directorio de backups existe pero está vacío")
    else:
        print_warning("No hay backups de base de datos")
    
    print_info("Ejecuta: .\\export_database.ps1")
    return False

def generate_report(results):
    """Genera reporte final"""
    print_header("Reporte Final")
    
    total = len(results)
    passed = sum(results.values())
    failed = total - passed
    
    print(f"\n{Colors.BOLD}Resumen:{Colors.END}")
    print(f"  Total de verificaciones: {total}")
    print(f"  {Colors.GREEN}Pasadas: {passed}{Colors.END}")
    print(f"  {Colors.RED}Fallidas: {failed}{Colors.END}")
    
    percentage = (passed / total) * 100
    
    print(f"\n{Colors.BOLD}Progreso: {percentage:.1f}%{Colors.END}")
    
    if percentage == 100:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ¡Todo listo para migrar a Railway!{Colors.END}")
        print(f"\n{Colors.CYAN}Próximos pasos:{Colors.END}")
        print("  1. Ejecuta: python migrate_to_railway.py")
        print("  2. Sigue la guía: RAILWAY_DEPLOYMENT.md")
        print("  3. O usa la guía rápida: ../RAILWAY_QUICKSTART.md")
    elif percentage >= 80:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠️  Casi listo, pero hay algunas advertencias{Colors.END}")
        print(f"\n{Colors.CYAN}Revisa los items marcados con ⚠️  arriba{Colors.END}")
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}❌ Aún faltan configuraciones importantes{Colors.END}")
        print(f"\n{Colors.CYAN}Revisa los items marcados con ❌ arriba{Colors.END}")
    
    print()

def main():
    """Función principal"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'🚂 '*20}")
    print("  VERIFICACIÓN PRE-MIGRACIÓN A RAILWAY")
    print(f"{'🚂 '*20}{Colors.END}\n")
    
    results = {}
    
    # Ejecutar todas las verificaciones
    results['Railway CLI'] = check_railway_cli()
    results['Git'] = check_git()
    results['Archivos Requeridos'] = check_required_files()
    results['Dependencias'] = check_requirements()
    results['settings.py'] = check_settings_py()
    results['Procfile'] = check_procfile()
    results['.gitignore'] = check_gitignore()
    results['Frontend'] = check_frontend()
    results['Backups DB'] = check_database_backup()
    
    # Generar reporte
    generate_report(results)
    
    # Código de salida
    if all(results.values()):
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
