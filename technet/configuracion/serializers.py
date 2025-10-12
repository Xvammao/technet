from rest_framework import serializers
from . import models


class AcometidasSerializers (serializers.ModelSerializer):
    class Meta:
        model = models.Acometidas
        fields = '__all__'

class DescuentosSerializers (serializers.ModelSerializer):
    class Meta:
        model = models.Descuentos
        fields = '__all__'

class DrSerializers (serializers.ModelSerializer):
    class Meta:
        model = models.Dr
        fields = '__all__'

class InstalacionesSerializers (serializers.ModelSerializer):
    # Hacer que los campos generados sean opcionales y de solo lectura
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, required=False)
    instalacion_compartida = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, required=False)
    valor_total_empresa = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, required=False)
    
    class Meta:
        model = models.Instalaciones
        fields = '__all__'
    
    def create(self, validated_data):
        # Remover campos generados si existen
        validated_data.pop('total', None)
        validated_data.pop('instalacion_compartida', None)
        validated_data.pop('valor_total_empresa', None)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Remover campos generados si existen
        validated_data.pop('total', None)
        validated_data.pop('instalacion_compartida', None)
        validated_data.pop('valor_total_empresa', None)
        return super().update(instance, validated_data)

class OperadoresSerializers (serializers.ModelSerializer):
    class Meta:
        model = models.Operadores
        fields = '__all__'

class ProductosSerializers (serializers.ModelSerializer):
    class Meta:
        model = models.Productos
        fields = '__all__'

class TecnicosSerializers (serializers.ModelSerializer):
    class Meta:
        model = models.Tecnicos
        fields = '__all__'

class TipoOrdenSerializers (serializers.ModelSerializer):
    class Meta:
        model = models.Tipodeordenes
        fields = '__all__'


