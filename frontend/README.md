# TechNet Frontend

Sistema de gestión de telecomunicaciones - Interfaz de usuario moderna y profesional.

## 🚀 Características

- **Dashboard Interactivo**: Visualización de métricas clave y estadísticas en tiempo real
- **Gestión Completa**: CRUD para todas las entidades del sistema
  - Instalaciones
  - Técnicos
  - Productos
  - Operadores
  - Acometidas
  - DR (Derechos de Reparación)
  - Tipos de Orden
- **UI Moderna**: Diseño profesional con TailwindCSS y shadcn/ui
- **Responsive**: Funciona perfectamente en dispositivos móviles y desktop
- **TypeScript**: Código type-safe para mayor confiabilidad

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **TailwindCSS** - Framework de CSS utility-first
- **shadcn/ui** - Componentes de UI de alta calidad
- **Lucide React** - Iconos modernos
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **Radix UI** - Primitivos de UI accesibles

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (opcional):
El proxy está configurado para apuntar a `http://localhost:8000` por defecto.

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   ├── ui/          # Componentes de UI (shadcn/ui)
│   │   └── Layout.tsx   # Layout principal
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Instalaciones.tsx
│   │   ├── Tecnicos.tsx
│   │   ├── Productos.tsx
│   │   ├── Operadores.tsx
│   │   ├── Acometidas.tsx
│   │   ├── Dr.tsx
│   │   └── TiposOrden.tsx
│   ├── lib/             # Utilidades y configuración
│   │   ├── api.ts       # Cliente API
│   │   └── utils.ts     # Funciones auxiliares
│   ├── types/           # Definiciones de TypeScript
│   ├── App.tsx          # Componente raíz
│   ├── main.tsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── public/              # Archivos estáticos
└── package.json         # Dependencias y scripts
```

## 🔌 Integración con Backend

El frontend se comunica con el backend Django a través de la API REST.

**Endpoints configurados:**
- `/api/acometidas/`
- `/api/descuentos/`
- `/api/dr/`
- `/api/instalaciones/`
- `/api/operadores/`
- `/api/productos/`
- `/api/tecnicos/`
- `/api/tipodeordenes/`

El proxy de Vite redirige `/api/*` a `/technet/*` en el backend.

## 🎨 Personalización

### Colores
Los colores del tema se pueden personalizar en `src/index.css` modificando las variables CSS.

### Componentes
Los componentes de UI están en `src/components/ui/` y pueden ser personalizados según necesidades.

## 📱 Características de UI

- **Sidebar Responsive**: Navegación lateral que se adapta a móviles
- **Búsqueda en Tiempo Real**: Filtrado instantáneo en todas las tablas
- **Modales de Edición**: Formularios modales para crear/editar registros
- **Confirmaciones**: Diálogos de confirmación para acciones destructivas
- **Loading States**: Indicadores de carga durante peticiones
- **Formato de Moneda**: Visualización profesional de valores monetarios
- **Formato de Fechas**: Fechas en formato local colombiano

## 🚀 Despliegue

Para construir la aplicación para producción:

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/` listos para ser desplegados en cualquier servidor web estático.

## 📝 Notas

- Asegúrate de que el backend Django esté corriendo en `http://localhost:8000`
- Para producción, actualiza la configuración del proxy en `vite.config.ts`
- El sistema usa autenticación por token (configurado en `src/lib/api.ts`)

## 🤝 Contribución

Este es un sistema profesional de gestión. Para contribuir:

1. Mantén el código limpio y bien documentado
2. Sigue las convenciones de TypeScript
3. Usa los componentes de UI existentes
4. Prueba en diferentes dispositivos antes de hacer commit

## 📄 Licencia

Propietario - Todos los derechos reservados
