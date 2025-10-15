# 📚 Ejemplos de Código - Sistema de Paginación

## 🎯 Cómo Agregar Paginación a un Nuevo Módulo

### Backend (Django)

#### 1. Agregar paginación a una nueva vista:

```python
from rest_framework import generics, filters
from rest_framework.pagination import PageNumberPagination
from . import models, serializers

# Usar la clase de paginación existente
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

# Ejemplo: Nueva vista para "Clientes"
class ClientesList(generics.ListCreateAPIView):
    queryset = models.Clientes.objects.all()
    serializer_class = serializers.ClientesSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'email', 'telefono']  # Campos buscables
```

---

### Frontend (React/TypeScript)

#### 1. Importar el componente de paginación:

```tsx
import { Pagination } from '@/components/ui/pagination';
```

#### 2. Agregar estados necesarios:

```tsx
export default function NuevoModulo() {
  const [datos, setDatos] = useState<TipoDato[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // ... resto del código
}
```

#### 3. Actualizar la función de carga de datos:

```tsx
const loadData = async () => {
  try {
    // Construir parámetros de consulta
    const params: any = { page: currentPage };
    
    // Agregar búsqueda si existe
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    // Hacer la petición
    const response = await api.get(endpoints.nuevoModulo, { params });
    
    // Actualizar estados
    setDatos(response.data.results || []);
    setTotalCount(response.data.count || 0);
    setTotalPages(Math.ceil((response.data.count || 0) / 20));
  } catch (error) {
    console.error('Error loading data:', error);
    setDatos([]);
  } finally {
    setLoading(false);
  }
};
```

#### 4. Agregar useEffect con dependencias:

```tsx
useEffect(() => {
  loadData();
}, [currentPage, searchTerm]); // Se recarga al cambiar página o búsqueda
```

#### 5. Crear manejador de cambio de página:

```tsx
const handlePageChange = (page: number) => {
  setCurrentPage(page);
  setLoading(true);
};
```

#### 6. Agregar el componente de paginación en el JSX:

```tsx
<CardContent>
  <Table>
    {/* ... TableHeader y TableBody ... */}
  </Table>
  
  {/* Componente de paginación */}
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={handlePageChange}
    totalItems={totalCount}
    itemsPerPage={20}
  />
</CardContent>
```

---

## 🔧 Personalizaciones Avanzadas

### 1. Cambiar el tamaño de página dinámicamente

```tsx
const [pageSize, setPageSize] = useState(20);

const loadData = async () => {
  const params: any = { 
    page: currentPage,
    page_size: pageSize 
  };
  // ... resto del código
};

// En el JSX
<select 
  value={pageSize} 
  onChange={(e) => setPageSize(Number(e.target.value))}
>
  <option value="10">10 por página</option>
  <option value="20">20 por página</option>
  <option value="50">50 por página</option>
  <option value="100">100 por página</option>
</select>
```

---

### 2. Paginación con múltiples filtros

```tsx
const [filters, setFilters] = useState({
  categoria: '',
  estado: '',
  fechaInicio: '',
  fechaFin: '',
});

const loadData = async () => {
  const params: any = { page: currentPage };
  
  // Agregar búsqueda
  if (searchTerm) params.search = searchTerm;
  
  // Agregar filtros adicionales
  if (filters.categoria) params.categoria = filters.categoria;
  if (filters.estado) params.estado = filters.estado;
  if (filters.fechaInicio) params.fecha_inicio = filters.fechaInicio;
  if (filters.fechaFin) params.fecha_fin = filters.fechaFin;
  
  const response = await api.get(endpoints.datos, { params });
  // ... resto del código
};

// Recargar cuando cambian los filtros
useEffect(() => {
  setCurrentPage(1); // Volver a página 1
  loadData();
}, [filters]);
```

---

### 3. Indicador de carga durante navegación

```tsx
const handlePageChange = (page: number) => {
  setCurrentPage(page);
  setLoading(true);
  
  // Scroll al inicio de la tabla
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// En el JSX
{loading ? (
  <div className="flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
) : (
  <Table>
    {/* ... contenido ... */}
  </Table>
)}
```

---

### 4. Guardar página actual en URL (query params)

```tsx
import { useSearchParams } from 'react-router-dom';

export default function ModuloConURL() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  );
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };
  
  // ... resto del código
}
```

---

### 5. Paginación con ordenamiento

```tsx
const [sortField, setSortField] = useState('nombre');
const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

const loadData = async () => {
  const params: any = { 
    page: currentPage,
    ordering: sortOrder === 'desc' ? `-${sortField}` : sortField
  };
  
  const response = await api.get(endpoints.datos, { params });
  // ... resto del código
};

// En el TableHead
<TableHead 
  onClick={() => {
    if (sortField === 'nombre') {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField('nombre');
      setSortOrder('asc');
    }
  }}
  className="cursor-pointer"
>
  Nombre {sortField === 'nombre' && (sortOrder === 'asc' ? '↑' : '↓')}
</TableHead>
```

---

## 🎨 Variantes del Componente de Paginación

### Paginación Simple (sin números de página)

```tsx
export function SimplePagination({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between py-4">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </Button>
      
      <span>Página {currentPage} de {totalPages}</span>
      
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </Button>
    </div>
  );
}
```

---

### Paginación con "Cargar Más"

```tsx
export default function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = async () => {
    const response = await api.get(endpoints.items, { 
      params: { page: page + 1 } 
    });
    
    setItems([...items, ...response.data.results]);
    setPage(page + 1);
    setHasMore(response.data.next !== null);
  };
  
  return (
    <>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
      
      {hasMore && (
        <Button onClick={loadMore}>
          Cargar más
        </Button>
      )}
    </>
  );
}
```

---

## 🔍 Ejemplos de Búsqueda Avanzada

### Búsqueda con debounce (evitar muchas peticiones)

```tsx
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce'; // Crear este hook

export default function ModuloConDebounce() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms delay
  
  useEffect(() => {
    setCurrentPage(1);
    loadData();
  }, [debouncedSearch]); // Solo busca después del delay
  
  return (
    <Input
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

// Hook useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

---

### Búsqueda en múltiples campos

```tsx
const [searchFilters, setSearchFilters] = useState({
  nombre: '',
  email: '',
  telefono: '',
});

const loadData = async () => {
  const params: any = { page: currentPage };
  
  // Construir query de búsqueda
  const searchQueries = [];
  if (searchFilters.nombre) searchQueries.push(`nombre:${searchFilters.nombre}`);
  if (searchFilters.email) searchQueries.push(`email:${searchFilters.email}`);
  if (searchFilters.telefono) searchQueries.push(`telefono:${searchFilters.telefono}`);
  
  if (searchQueries.length > 0) {
    params.search = searchQueries.join(',');
  }
  
  const response = await api.get(endpoints.datos, { params });
  // ... resto del código
};
```

---

## 📊 Ejemplos Backend (Django)

### Paginación personalizada por vista

```python
class CustomPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 200

class ProductosGrandesList(generics.ListAPIView):
    queryset = models.Productos.objects.all()
    serializer_class = serializers.ProductosSerializer
    pagination_class = CustomPagination  # Usa paginación personalizada
```

---

### Búsqueda con filtros personalizados

```python
from django_filters import rest_framework as filters

class ProductoFilter(filters.FilterSet):
    nombre = filters.CharFilter(lookup_expr='icontains')
    precio_min = filters.NumberFilter(field_name='precio', lookup_expr='gte')
    precio_max = filters.NumberFilter(field_name='precio', lookup_expr='lte')
    categoria = filters.CharFilter(field_name='categoria', lookup_expr='exact')
    
    class Meta:
        model = models.Productos
        fields = ['nombre', 'categoria']

class ProductosList(generics.ListCreateAPIView):
    queryset = models.Productos.objects.all()
    serializer_class = serializers.ProductosSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductoFilter
    search_fields = ['nombre', 'descripcion']
```

---

### Ordenamiento personalizado

```python
from rest_framework import filters

class ProductosList(generics.ListCreateAPIView):
    queryset = models.Productos.objects.all()
    serializer_class = serializers.ProductosSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['nombre', 'precio', 'fecha_creacion']
    ordering = ['-fecha_creacion']  # Orden por defecto
```

---

## 🎯 Mejores Prácticas

### 1. Siempre manejar estados de carga
```tsx
if (loading) {
  return <LoadingSpinner />;
}

if (error) {
  return <ErrorMessage error={error} />;
}

return <DataTable data={data} />;
```

### 2. Validar datos antes de renderizar
```tsx
const safeData = Array.isArray(data) ? data : [];
```

### 3. Resetear página al buscar
```tsx
const handleSearch = (term: string) => {
  setSearchTerm(term);
  setCurrentPage(1); // Siempre volver a página 1
};
```

### 4. Manejar errores de API
```tsx
const loadData = async () => {
  try {
    const response = await api.get(endpoints.datos, { params });
    setDatos(response.data.results || []);
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error al cargar datos');
    setDatos([]);
  }
};
```

### 5. Optimizar re-renders
```tsx
const handlePageChange = useCallback((page: number) => {
  setCurrentPage(page);
}, []);

const memoizedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    formatted: formatData(item)
  }));
}, [data]);
```

---

## 🚀 Optimizaciones de Rendimiento

### 1. Lazy Loading de componentes
```tsx
import { lazy, Suspense } from 'react';

const Pagination = lazy(() => import('@/components/ui/pagination'));

<Suspense fallback={<div>Cargando...</div>}>
  <Pagination {...props} />
</Suspense>
```

### 2. Virtualización para listas grandes
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 50,
});
```

### 3. Cache de peticiones
```tsx
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['datos', currentPage, searchTerm],
  queryFn: () => fetchData(currentPage, searchTerm),
  staleTime: 5 * 60 * 1000, // Cache por 5 minutos
});
```

---

## 📝 Plantilla Completa

```tsx
import { useEffect, useState } from 'react';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api, { endpoints } from '@/lib/api';

interface Item {
  id: number;
  nombre: string;
  // ... otros campos
}

export default function NuevoModulo() {
  // Estados
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm]);

  const loadData = async () => {
    try {
      const params: any = { page: currentPage };
      if (searchTerm) params.search = searchTerm;
      
      const response = await api.get(endpoints.items, { params });
      setItems(response.data.results || []);
      setTotalCount(response.data.count || 0);
      setTotalPages(Math.ceil((response.data.count || 0) / 20));
    } catch (error) {
      console.error('Error:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <Input
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.nombre}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalCount}
        itemsPerPage={20}
      />
    </div>
  );
}
```

---

¡Usa estos ejemplos como referencia para extender la funcionalidad de paginación! 🚀
