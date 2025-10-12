# Importación de Instalaciones desde Excel

## Descripción
El módulo de instalaciones ahora incluye funcionalidad para importar datos masivamente desde archivos Excel (.xlsx, .xls).

## Columnas del Excel Requeridas

El archivo Excel debe contener las siguientes columnas (los nombres deben coincidir exactamente):

| Columna Excel | Campo en Sistema | Descripción |
|---------------|------------------|-------------|
| `cliente` | Operador | Nombre del operador (debe existir en el sistema) |
| `Cod. cliente 1` | Número OT | Código de orden de trabajo |
| `Fecha fin actuación` | Fecha | Fecha de la instalación (formatos aceptados: DD/MM/YYYY, YYYY-MM-DD, o número serial de Excel) |
| `Técnico cumplimentación` | Técnico | Nombre completo del técnico (debe existir en el sistema) |
| `N/S` | Serie Producto | Número de serie del producto |
| `Descripción` | Dirección | Descripción o dirección de la instalación |
| `categoria` | Categoría | Categoría de la instalación |

## Campos con Valores por Defecto

Los siguientes campos se llenarán automáticamente con valores por defecto:
- **DR**: Se asigna el primer DR disponible en el sistema
- **Tipo de Orden**: Se asigna el primer tipo de orden disponible
- **Acometida**: Se asigna la primera acometida disponible
- **Metros de Cable**: 0
- **Valores monetarios**: Se calculan automáticamente según el DR y tipo de orden seleccionados

## Cómo Usar

1. **Preparar el archivo Excel**:
   - Asegúrate de que las columnas tengan los nombres exactos mencionados arriba
   - Los nombres de operadores y técnicos deben coincidir con los registrados en el sistema
   - Las fechas deben estar en formato válido

2. **Importar**:
   - Ve al módulo de Instalaciones
   - Haz clic en el botón "Importar Excel"
   - Selecciona tu archivo Excel
   - Espera a que se complete la importación

3. **Revisar resultados**:
   - Se mostrará un resumen con:
     - Total de registros procesados
     - Cantidad de instalaciones creadas exitosamente
     - Lista de errores (si los hay)

## Validaciones

- Se requiere que cada fila tenga al menos un **Número OT** y una **Fecha** válidos
- Si un operador o técnico no se encuentra en el sistema, se asignará el primero disponible
- Las filas sin datos válidos serán omitidas

## Ejemplo de Estructura Excel

```
| cliente | Cod. cliente 1 | Fecha fin actuación | Técnico cumplimentación | N/S        | Descripción           | categoria |
|---------|----------------|---------------------|-------------------------|------------|-----------------------|-----------|
| Movistar| OT-2024-001   | 15/01/2024         | Juan Pérez              | SN12345    | Calle Principal 123   | Fibra     |
| Vodafone| OT-2024-002   | 16/01/2024         | María García            | SN12346    | Avenida Central 456   | ADSL      |
```

## Notas Importantes

- El proceso es **transaccional por fila**: si una fila falla, las demás continúan procesándose
- Se recomienda revisar los datos antes de importar para minimizar errores
- Los campos opcionales pueden dejarse vacíos
- El sistema intentará parsear diferentes formatos de fecha automáticamente

## Solución de Problemas

### Error: "No se encontraron instalaciones válidas"
- Verifica que las columnas tengan los nombres correctos
- Asegúrate de que al menos haya datos en las columnas obligatorias

### Error en filas específicas
- Revisa que los nombres de operadores y técnicos existan en el sistema
- Verifica el formato de las fechas
- Asegúrate de que el Número OT sea único

### Operadores o técnicos no encontrados
- Los nombres deben coincidir exactamente (sin diferencias en mayúsculas/minúsculas)
- Si no se encuentra, se asignará el primer registro disponible por defecto
