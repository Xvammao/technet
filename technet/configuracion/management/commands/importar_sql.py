from django.core.management.base import BaseCommand
from django.db import connection
import os

class Command(BaseCommand):
    help = 'Importa un archivo SQL a la base de datos'

    def add_arguments(self, parser):
        parser.add_argument('sql_file', type=str, help='Ruta al archivo SQL')

    def handle(self, *args, **options):
        sql_file = options['sql_file']
        
        if not os.path.exists(sql_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {sql_file}'))
            return
        
        self.stdout.write(f'Leyendo {sql_file}...')
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        self.stdout.write('Ejecutando SQL...')
        
        try:
            with connection.cursor() as cursor:
                cursor.execute(sql_content)
            self.stdout.write(self.style.SUCCESS('✅ Datos importados exitosamente!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {e}'))
