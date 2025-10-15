# 🚀 Guía Rápida - Probar Paginación

## ⚡ Inicio Rápido

### 1️⃣ Iniciar Backend
```powershell
cd C:\Users\maog9\OneDrive\Escritorio\TELECOMUNICACIONES\technet
python manage.py runserver
```

### 2️⃣ Iniciar Frontend (en otra terminal)
```powershell
cd C:\Users\maog9\OneDrive\Escritorio\TELECOMUNICACIONES\frontend
npm run dev
```

### 3️⃣ Abrir en el navegador
```
http://localhost:5173
```

---

## 🧪 Pruebas a Realizar

### ✅ Prueba 1: Verificar Límite de 20 Registros
1. Ve a cualquier módulo (Técnicos, Productos, etc.)
2. Verifica que solo se muestren **20 registros máximo**
3. Confirma que aparece el componente de paginación en la parte inferior

**Resultado esperado:**
```
Mostrando 1 a 20 de X resultados
[<<] [<] [1] [2] [3] ... [>] [>>]
```

---

### ✅ Prueba 2: Navegación entre Páginas
1. Haz clic en el botón **"Página siguiente" (>)**
2. Verifica que cambia a la página 2
3. Confirma que muestra: "Mostrando 21 a 40 de X resultados"
4. Prueba los botones:
   - `<<` - Primera página
   - `<` - Página anterior
   - `>` - Página siguiente
   - `>>` - Última página

**Resultado esperado:**
- Los datos cambian al navegar
- El número de página actual se resalta
- Los botones se deshabilitan cuando corresponde

---

### ✅ Prueba 3: Búsqueda con Paginación
1. Ve al módulo **Técnicos**
2. Escribe algo en el campo de búsqueda (ej: "Juan")
3. Verifica que:
   - La búsqueda filtra los resultados
   - La paginación se reinicia a página 1
   - El contador muestra el total filtrado

**Resultado esperado:**
```
Mostrando 1 a 20 de 25 resultados (filtrados)
```

---

### ✅ Prueba 4: Números de Página Inteligentes

#### Si tienes pocas páginas (≤5):
```
[<<] [<] [1] [2] [3] [4] [5] [>] [>>]
```

#### Si tienes muchas páginas (>5):
```
[<<] [<] [1] [...] [8] [9] [10] [...] [50] [>] [>>]
```

**Cómo probar:**
1. Ve a un módulo con muchos datos (Instalaciones)
2. Verifica que aparecen los puntos suspensivos (...)
3. Navega a diferentes páginas y observa cómo cambian los números

---

### ✅ Prueba 5: Módulos Específicos

#### **Productos**
- Verifica que la paginación funciona
- Prueba la búsqueda por nombre, serie o categoría
- Confirma que la importación de Excel sigue funcionando

#### **Instalaciones**
- Verifica que mantiene la agrupación por OT duplicados
- Prueba los filtros por técnico y operador
- Confirma que la paginación funciona con filtros activos

#### **Técnicos**
- Busca por nombre, apellido o ID
- Verifica la paginación
- Prueba crear/editar/eliminar (debe recargar la página actual)

---

## 🔍 Verificación del API

### Probar endpoints directamente:

#### 1. Primera página de técnicos:
```
http://localhost:8000/api/tecnicos/?page=1
```

**Respuesta esperada:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/tecnicos/?page=2",
  "previous": null,
  "results": [
    { "id_unico_tecnico": 1, "nombre": "Juan", ... },
    // ... 19 más (total 20)
  ]
}
```

#### 2. Segunda página:
```
http://localhost:8000/api/tecnicos/?page=2
```

#### 3. Búsqueda paginada:
```
http://localhost:8000/api/tecnicos/?search=Juan&page=1
```

#### 4. Cambiar tamaño de página:
```
http://localhost:8000/api/tecnicos/?page_size=50&page=1
```

---

## 📊 Casos de Prueba por Módulo

### 🔧 Acometidas
- [ ] Muestra máximo 20 acometidas
- [ ] Búsqueda por nombre funciona
- [ ] Paginación navega correctamente
- [ ] Exportar Excel funciona

### 👷 Técnicos
- [ ] Muestra máximo 20 técnicos
- [ ] Búsqueda por nombre/apellido/ID funciona
- [ ] Crear nuevo técnico recarga la página
- [ ] Editar técnico mantiene la página actual

### 📡 Operadores
- [ ] Muestra máximo 20 operadores
- [ ] Búsqueda funciona
- [ ] CRUD completo funciona con paginación

### 💰 Dr (Derechos de Reparación)
- [ ] Muestra máximo 20 DRs
- [ ] Búsqueda por nombre funciona
- [ ] Valores se muestran correctamente

### 📋 Tipos de Orden
- [ ] Muestra máximo 20 tipos
- [ ] Búsqueda funciona
- [ ] Valores se formatean correctamente

### 📦 Productos
- [ ] Muestra máximo 20 productos
- [ ] Búsqueda por nombre/serie/categoría funciona
- [ ] Importación de Excel funciona
- [ ] Filtros de técnico funcionan

### 🏗️ Instalaciones
- [ ] Muestra máximo 20 instalaciones
- [ ] Búsqueda por OT/dirección funciona
- [ ] Agrupación de duplicados funciona
- [ ] Filtros (técnico, operador, fechas) funcionan
- [ ] Totales se calculan correctamente

---

## 🐛 Problemas Comunes y Soluciones

### ❌ No aparece la paginación
**Causa:** Menos de 20 registros en la base de datos
**Solución:** Agrega más datos de prueba o reduce `page_size` temporalmente

### ❌ Error "results is undefined"
**Causa:** El backend no está devolviendo el formato paginado
**Solución:** Verifica que el backend esté corriendo y los endpoints tengan `pagination_class`

### ❌ La búsqueda no funciona
**Causa:** El backend no tiene configurado `filter_backends`
**Solución:** Verifica que cada vista tenga `filter_backends = [filters.SearchFilter]`

### ❌ Los botones no funcionan
**Causa:** JavaScript deshabilitado o error en consola
**Solución:** Abre DevTools (F12) y revisa la consola

---

## 📱 Prueba en Diferentes Dispositivos

### Desktop (1920x1080)
- [ ] Paginación se ve completa
- [ ] Todos los botones son accesibles
- [ ] Contador de resultados visible

### Tablet (768px)
- [ ] Componente responsive
- [ ] Botones del tamaño adecuado

### Mobile (375px)
- [ ] Paginación se adapta
- [ ] Números de página se ajustan

---

## ✨ Características Especiales a Verificar

### Tooltips
Pasa el mouse sobre los botones de navegación:
- `<<` → "Primera página"
- `<` → "Página anterior"
- `>` → "Página siguiente"
- `>>` → "Última página"

### Estados Visuales
- Página actual: Botón resaltado (azul)
- Botones deshabilitados: Gris claro
- Hover: Efecto de resaltado

### Contador Dinámico
Verifica que el contador cambia correctamente:
- Página 1: "Mostrando 1 a 20 de 100"
- Página 2: "Mostrando 21 a 40 de 100"
- Última página (5): "Mostrando 81 a 100 de 100"

---

## 🎯 Checklist Final

Antes de considerar la prueba completa, verifica:

- [ ] Todos los módulos tienen paginación
- [ ] Límite de 20 registros funciona
- [ ] Navegación entre páginas funciona
- [ ] Búsqueda integrada funciona
- [ ] Contador de resultados es preciso
- [ ] Botones se deshabilitan correctamente
- [ ] Tooltips aparecen al hacer hover
- [ ] Exportar Excel sigue funcionando
- [ ] CRUD (crear/editar/eliminar) funciona
- [ ] Responsive en diferentes tamaños

---

## 📝 Reporte de Pruebas

### Formato de reporte:
```
Módulo: [Nombre]
Fecha: [DD/MM/YYYY]
Navegador: [Chrome/Firefox/Edge]

✅ Paginación funciona
✅ Búsqueda funciona
✅ Navegación funciona
❌ Problema encontrado: [descripción]

Notas adicionales:
[...]
```

---

## 🚀 Siguiente Paso

Una vez completadas todas las pruebas:
1. Documenta cualquier problema encontrado
2. Verifica el rendimiento con muchos datos
3. Prueba en producción con datos reales
4. Considera ajustar `page_size` según necesidades

---

**¡Listo para probar!** 🎉

Si encuentras algún problema, revisa:
- Consola del navegador (F12)
- Logs del servidor Django
- Archivo `PAGINACION_IMPLEMENTADA.md` para más detalles
