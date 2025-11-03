from django.shortcuts import render
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework import filters
from django.contrib.auth import authenticate
from . import models
from . import serializers

# Configuración de paginación
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50000  # Permitir exportar grandes cantidades de datos

# Acometidas
class AcometidasList(generics.ListCreateAPIView):
    queryset = models.Acometidas.objects.all()
    serializer_class = serializers.AcometidasSerializers
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_acometida']

class AcometidasDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Acometidas.objects.all()
    serializer_class = serializers.AcometidasSerializers

# Descuentos
class DescuentosList(generics.ListCreateAPIView):
    queryset = models.Descuentos.objects.all()
    serializer_class = serializers.DescuentosSerializers
    pagination_class = StandardResultsSetPagination

class DescuentosDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Descuentos.objects.all()
    serializer_class = serializers.DescuentosSerializers

# Dr
class DrList(generics.ListCreateAPIView):
    queryset = models.Dr.objects.all()
    serializer_class = serializers.DrSerializers
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_dr']

class DrDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Dr.objects.all()
    serializer_class = serializers.DrSerializers

#Instalaciones
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime

class InstalacionesList(generics.ListCreateAPIView):
    queryset = models.Instalaciones.objects.all()
    serializer_class = serializers.InstalacionesSerializers
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['numero_ot', 'direccion', 'producto_serie__producto_serie']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtro por técnico
        id_tecnico = self.request.query_params.get('id_tecnico', None)
        if id_tecnico:
            queryset = queryset.filter(id_tecnico=id_tecnico)
        
        # Filtro por operador
        id_operador = self.request.query_params.get('id_operador', None)
        if id_operador:
            queryset = queryset.filter(id_operador=id_operador)
        
        # Filtro por rango de fechas
        fecha_inicio = self.request.query_params.get('fecha_inicio', None)
        fecha_fin = self.request.query_params.get('fecha_fin', None)
        
        if fecha_inicio:
            queryset = queryset.filter(fecha_instalacion__gte=fecha_inicio)
        if fecha_fin:
            queryset = queryset.filter(fecha_instalacion__lte=fecha_fin)
        
        return queryset.order_by('-fecha_instalacion')
    
    def perform_create(self, serializer):
        # Usar SQL crudo para evitar problemas con campos generados
        data = serializer.validated_data
        
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO instalaciones (
                    fecha_instalacion, id_tecnico, id_operador, direccion, numero_ot,
                    producto_serie, id_dr, eq_reutilizado, eq_retirado, id_tipo_orden,
                    metros_cable, id_acometida, observaciones, valor_dr, valor_orden,
                    valor_orden_empresa, valor_dr_empresa, serie_dr, categoria
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_instalacion
            """, [
                data['fecha_instalacion'],
                data['id_tecnico'].id_unico_tecnico,
                data['id_operador'].id_ope,
                data['direccion'],
                data['numero_ot'],
                data['producto_serie'].producto_serie,
                data['id_dr'].id_dr,
                data.get('eq_reutilizado', ''),
                data.get('eq_retirado', ''),
                data['id_tipo_orden'].id_tipo_orden,
                data['metros_cable'],
                data['id_acometida'].id_acometida,
                data.get('observaciones', ''),
                data['valor_dr'],
                data['valor_orden'],
                data['valor_orden_empresa'],
                data['valor_dr_empresa'],
                data.get('serie_dr', ''),
                data.get('categoria', '')
            ])
            new_id = cursor.fetchone()[0]
        
        # Retornar el objeto creado
        return models.Instalaciones.objects.get(id_instalacion=new_id)

class InstalacionesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Instalaciones.objects.all()
    serializer_class = serializers.InstalacionesSerializers
    
    def perform_update(self, serializer):
        # Usar SQL crudo para evitar problemas con campos generados
        data = serializer.validated_data
        instance = self.get_object()
        
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE instalaciones SET
                    fecha_instalacion = %s,
                    id_tecnico = %s,
                    id_operador = %s,
                    direccion = %s,
                    numero_ot = %s,
                    producto_serie = %s,
                    id_dr = %s,
                    eq_reutilizado = %s,
                    eq_retirado = %s,
                    id_tipo_orden = %s,
                    metros_cable = %s,
                    id_acometida = %s,
                    observaciones = %s,
                    valor_dr = %s,
                    valor_orden = %s,
                    valor_orden_empresa = %s,
                    valor_dr_empresa = %s,
                    serie_dr = %s,
                    categoria = %s
                WHERE id_instalacion = %s
            """, [
                data['fecha_instalacion'],
                data['id_tecnico'].id_unico_tecnico,
                data['id_operador'].id_ope,
                data['direccion'],
                data['numero_ot'],
                data['producto_serie'].producto_serie if hasattr(data['producto_serie'], 'producto_serie') else data['producto_serie'],
                data['id_dr'].id_dr,
                data.get('eq_reutilizado', ''),
                data.get('eq_retirado', ''),
                data['id_tipo_orden'].id_tipo_orden,
                data['metros_cable'],
                data['id_acometida'].id_acometida,
                data.get('observaciones', ''),
                data['valor_dr'],
                data['valor_orden'],
                data['valor_orden_empresa'],
                data['valor_dr_empresa'],
                data.get('serie_dr', ''),
                data.get('categoria', ''),
                instance.id_instalacion
            ])
        
        # Retornar el objeto actualizado
        return models.Instalaciones.objects.get(id_instalacion=instance.id_instalacion)

@api_view(['POST'])
def instalaciones_bulk_import(request):
    """
    Endpoint para importar instalaciones desde Excel
    Espera un array de objetos con los datos de las instalaciones
    """
    try:
        instalaciones_data = request.data.get('instalaciones', [])
        
        if not instalaciones_data:
            return Response(
                {'error': 'No se proporcionaron datos de instalaciones'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_count = 0
        errors = []
        
        for idx, inst_data in enumerate(instalaciones_data):
            try:
                # Manejar producto_serie - crear si no existe
                producto_serie_str = inst_data.get('producto_serie', 'NA')
                
                # Buscar o crear el producto
                producto = models.Productos.objects.filter(producto_serie=producto_serie_str).first()
                if not producto:
                    # Crear un producto temporal si no existe
                    tecnico_default = models.Tecnicos.objects.first()
                    if tecnico_default:
                        producto = models.Productos.objects.create(
                            categoria=inst_data.get('categoria', 'NA'),
                            nombre_producto='Producto Importado',
                            producto_serie=producto_serie_str,
                            cantidad=1,
                            id_tecnico=tecnico_default,
                            fecha_asignacion=inst_data.get('fecha_instalacion')
                        )
                
                # Actualizar inst_data con el producto_serie correcto
                inst_data['producto_serie'] = producto_serie_str if producto else 'NA'
                
                # Manejar duplicados de numero_ot - agregar sufijo si ya existe
                numero_ot_original = inst_data.get('numero_ot', 'NA')
                numero_ot_final = numero_ot_original
                contador = 1
                
                # Verificar si ya existe una instalación con este numero_ot
                while models.Instalaciones.objects.filter(numero_ot=numero_ot_final).exists():
                    numero_ot_final = f"{numero_ot_original}_DUP{contador}"
                    contador += 1
                
                inst_data['numero_ot'] = numero_ot_final
                
                # Validar y crear cada instalación
                serializer = serializers.InstalacionesSerializers(data=inst_data)
                if serializer.is_valid():
                    # Usar el mismo método de creación que InstalacionesList
                    data = serializer.validated_data
                    
                    with connection.cursor() as cursor:
                        cursor.execute("""
                            INSERT INTO instalaciones (
                                fecha_instalacion, id_tecnico, id_operador, direccion, numero_ot,
                                producto_serie, id_dr, eq_reutilizado, eq_retirado, id_tipo_orden,
                                metros_cable, id_acometida, observaciones, valor_dr, valor_orden,
                                valor_orden_empresa, valor_dr_empresa, serie_dr, categoria
                            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                            RETURNING id_instalacion
                        """, [
                            data['fecha_instalacion'],
                            data['id_tecnico'].id_unico_tecnico,
                            data['id_operador'].id_ope,
                            data['direccion'],
                            data['numero_ot'],
                            producto_serie_str,
                            data['id_dr'].id_dr,
                            data.get('eq_reutilizado', ''),
                            data.get('eq_retirado', ''),
                            data['id_tipo_orden'].id_tipo_orden,
                            data['metros_cable'],
                            data['id_acometida'].id_acometida,
                            data.get('observaciones', ''),
                            data['valor_dr'],
                            data['valor_orden'],
                            data['valor_orden_empresa'],
                            data['valor_dr_empresa'],
                            data.get('serie_dr', ''),
                            data.get('categoria', '')
                        ])
                    
                    created_count += 1
                else:
                    errors.append({
                        'fila': idx + 1,
                        'errores': serializer.errors
                    })
            except Exception as e:
                errors.append({
                    'fila': idx + 1,
                    'error': str(e)
                })
        
        return Response({
            'creadas': created_count,
            'errores': errors,
            'total': len(instalaciones_data)
        }, status=status.HTTP_201_CREATED if created_count > 0 else status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': f'Error en la importación: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

#Operadores
class OperadoresList(generics.ListCreateAPIView):
    queryset = models.Operadores.objects.all()
    serializer_class = serializers.OperadoresSerializers
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_operador']

class OperadoresDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Operadores.objects.all()
    serializer_class = serializers.OperadoresSerializers

#Productos
class ProductosList(generics.ListCreateAPIView):
    queryset = models.Productos.objects.all()
    serializer_class = serializers.ProductosSerializers
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_producto', 'producto_serie', 'categoria']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtro por técnico
        id_tecnico = self.request.query_params.get('id_tecnico', None)
        if id_tecnico:
            queryset = queryset.filter(id_tecnico=id_tecnico)
        
        return queryset.order_by('-fecha_asignacion')

class ProductosDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Productos.objects.all()
    serializer_class = serializers.ProductosSerializers

#Tecnicos
class TecnicosList(generics.ListCreateAPIView):
    queryset = models.Tecnicos.objects.all()
    serializer_class = serializers.TecnicosSerializers
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'apellido', 'id_tecnico']

class TecnicosDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Tecnicos.objects.all()
    serializer_class = serializers.TecnicosSerializers

#Tipos de ordenes
class TipoOrdenLista(generics.ListCreateAPIView):
    queryset = models.Tipodeordenes.objects.all()
    serializer_class = serializers.TipoOrdenSerializers
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre_tipo_orden']

class TipoOrdenEliminar(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Tipodeordenes.objects.all()
    serializer_class = serializers.TipoOrdenSerializers

# Vista de Login personalizada
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'auth_token': token.key,
                'user_id': user.pk,
                'username': user.username
            })
        else:
            return Response(
                {'detail': 'Usuario o contraseña incorrectos'},
                status=status.HTTP_400_BAD_REQUEST
            )



