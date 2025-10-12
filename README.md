# 🌐 TechNet - Sistema de Gestión de Telecomunicaciones

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2-green.svg)
![React](https://img.shields.io/badge/React-18.2-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

**Sistema profesional y moderno para la gestión integral de operaciones de telecomunicaciones**

[Inicio Rápido](#-inicio-rápido) • [Características](#-características) • [Documentación](#-documentación) • [Tecnologías](#-tecnologías)

</div>

---

## 📸 Vista Previa

### Dashboard Principal
- Métricas en tiempo real
- Estadísticas visuales
- Instalaciones recientes
- Diseño moderno y profesional

### Gestión de Datos
- Tablas interactivas con búsqueda
- Formularios modales elegantes
- Validación en tiempo real
- Feedback visual inmediato

---

## ✨ Características

### 🎯 Funcionalidades Principales

- **📊 Dashboard Interactivo** - Visualización de métricas clave y estadísticas
- **📡 Gestión de Instalaciones** - Control completo de instalaciones de servicios
- **👷 Administración de Técnicos** - Registro y asignación de técnicos
- **📦 Control de Inventario** - Gestión de productos y stock
- **🏢 Operadores** - Administración de operadores de telecomunicaciones
- **🔧 Acometidas** - Configuración de tipos y precios
- **📋 Tipos de Orden** - Gestión de órdenes de trabajo
- **💰 DR (Derechos de Reparación)** - Control de valores y tarifas

### 🎨 Diseño y UX

- ✅ **Responsive Design** - Funciona en móviles, tablets y desktop
- ✅ **UI Moderna** - Diseño profesional con TailwindCSS
- ✅ **Componentes Reutilizables** - shadcn/ui components
- ✅ **Iconografía Consistente** - Lucide React icons
- ✅ **Animaciones Suaves** - Transiciones y feedback visual
- ✅ **Tema Personalizable** - Colores y estilos configurables

### 🔐 Seguridad

- 🔒 **Sistema de Login** - Autenticación con credenciales de Django
- 🔒 **Rutas Protegidas** - Acceso solo con autenticación
- 🔒 **Token de Sesión** - Persistente en localStorage
- 🔒 **Logout Seguro** - Cierre de sesión desde cualquier página
- 🔒 **CORS Configurado** - Comunicación segura frontend-backend
- 🔒 **Validación de Datos** - En frontend y backend
- 🔒 **Manejo de Errores** - Sin pantallas en blanco

---

## 🚀 Inicio Rápido

### Requisitos Previos

```bash
✅ Python 3.8+
✅ Node.js 18+
✅ PostgreSQL 12+
✅ Git
```

### Instalación en 4 Pasos

#### 1️⃣ Crear Superusuario (Primera vez)

```bash
cd technet
..\Entorno_virtual\Scripts\activate
python manage.py createsuperuser
```

Ingresa:
- Username: `admin` (o el que prefieras)
- Email: tu email
- Password: contraseña segura

#### 2️⃣ Instalar Backend

```bash
pip install -r ../requeriments.txt
python manage.py runserver
```

#### 3️⃣ Instalar Frontend

```bash
cd frontend
npm install
npm run dev
```

#### 4️⃣ Acceder al Sistema

```
🌐 Frontend: http://localhost:3000
   → Usa las credenciales del superusuario para login
🔧 Backend API: http://localhost:8000/technet/
⚙️ Admin Django: http://localhost:8000/admin/
```

### 🎬 Inicio Automático (Windows)

Simplemente ejecuta:
- `start_backend.bat` - Inicia el backend
- `start_frontend.bat` - Inicia el frontend

---

## 🛠️ Tecnologías

### Backend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Django** | 5.2 | Framework web |
| **Django REST Framework** | Latest | API REST |
| **PostgreSQL** | 12+ | Base de datos |
| **Djoser** | Latest | Autenticación |
| **django-cors-headers** | Latest | CORS |

### Frontend

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.2 | Framework UI |
| **TypeScript** | 5.2 | Tipado estático |
| **Vite** | 5.0 | Build tool |
| **TailwindCSS** | 3.3 | Estilos |
| **shadcn/ui** | Latest | Componentes UI |
| **Lucide React** | Latest | Iconos |
| **React Router** | 6.20 | Navegación |
| **Axios** | 1.6 | HTTP client |

---

## 📁 Estructura del Proyecto

```
TELECOMUNICACIONES/
├── 📂 technet/                    # Backend Django
│   ├── 📂 configuracion/          # App principal
│   │   ├── models.py              # Modelos de datos
│   │   ├── views.py               # Vistas API
│   │   ├── serializers.py         # Serializadores
│   │   └── urls.py                # URLs de la app
│   ├── 📂 technet/                # Configuración
│   │   ├── settings.py            # Configuración Django
│   │   └── urls.py                # URLs principales
│   └── manage.py                  # CLI Django
│
├── 📂 frontend/                   # Frontend React
│   ├── 📂 src/
│   │   ├── 📂 components/         # Componentes React
│   │   │   ├── 📂 ui/             # Componentes UI base
│   │   │   └── Layout.tsx         # Layout principal
│   │   ├── 📂 pages/              # Páginas
│   │   │   ├── Dashboard.tsx      # Dashboard
│   │   │   ├── Instalaciones.tsx  # Gestión instalaciones
│   │   │   ├── Tecnicos.tsx       # Gestión técnicos
│   │   │   ├── Productos.tsx      # Gestión productos
│   │   │   └── ...                # Más páginas
│   │   ├── 📂 lib/                # Utilidades
│   │   │   ├── api.ts             # Cliente API
│   │   │   └── utils.ts           # Funciones auxiliares
│   │   ├── 📂 types/              # Tipos TypeScript
│   │   ├── App.tsx                # App principal
│   │   └── main.tsx               # Punto de entrada
│   ├── package.json               # Dependencias npm
│   └── vite.config.ts             # Configuración Vite
│
├── 📂 Entorno_virtual/            # Entorno Python
├── 📄 requeriments.txt            # Dependencias Python
├── 📄 start_backend.bat           # Script inicio backend
├── 📄 start_frontend.bat          # Script inicio frontend
├── 📄 INICIO_RAPIDO.md            # Guía rápida
├── 📄 GUIA_COMPLETA.md            # Documentación completa
└── 📄 README.md                   # Este archivo
```

---

## 📚 Documentación

| Documento | Descripción |
|-----------|-------------|
| **INICIO_RAPIDO.md** | Guía de inicio rápido y solución de problemas |
| **CONFIGURACION_LOGIN.md** | ✨ **NUEVO** - Configuración del sistema de login |
| **SOLUCION_PROBLEMAS.md** | ✨ **NUEVO** - Soluciones a problemas comunes |
| **GUIA_COMPLETA.md** | Documentación completa del sistema |
| **SETUP_FRONTEND.md** | Configuración detallada del frontend |
| **frontend/README.md** | Documentación específica del frontend |

---

## 🎯 Módulos del Sistema

### 1. Dashboard
- Resumen de métricas clave
- Total de instalaciones
- Técnicos activos
- Productos en stock
- Ingresos del mes
- Instalaciones recientes

### 2. Instalaciones
- Crear/Editar/Eliminar instalaciones
- Asignación de técnicos
- Selección de operador
- Configuración de productos
- Cálculo automático de totales
- Búsqueda y filtrado

### 3. Técnicos
- Registro de técnicos
- ID único por técnico
- Información personal
- Asignación de productos

### 4. Productos
- Gestión de inventario
- Categorías de productos
- Series únicas
- Control de stock
- Asignación a técnicos
- Indicadores visuales

### 5. Operadores
- Gestión de operadores
- Información de contacto
- Asociación con instalaciones

### 6. Acometidas
- Tipos de acometidas
- Configuración de precios
- Formato de moneda

### 7. DR (Derechos de Reparación)
- Configuración de DRs
- Valores para técnicos
- Valores para empresa

### 8. Tipos de Orden
- Tipos de órdenes de trabajo
- Valores asociados
- Configuración de tarifas

---

## 🔧 Configuración

### Variables de Entorno (Backend)

```python
# technet/technet/settings.py
DEBUG = True  # False en producción
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'telecomunicaciones',
        'USER': 'postgres',
        'PASSWORD': 'tu-contraseña',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Configuración del Frontend

```typescript
// frontend/vite.config.ts
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/technet')
    }
  }
}
```

---

## 🎨 Personalización

### Cambiar Colores del Tema

Edita `frontend/src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;      /* Azul */
  --secondary: 210 40% 96.1%;        /* Gris claro */
  --accent: 210 40% 96.1%;           /* Acento */
  /* Personaliza según necesites */
}
```

### Cambiar Logo y Branding

Edita `frontend/src/components/Layout.tsx`:

```tsx
<Cable className="h-8 w-8 text-blue-600" />
<span className="text-xl font-bold">TechNet</span>
```

---

## 🐛 Solución de Problemas

### Backend no inicia

```bash
# Verificar PostgreSQL
psql -U postgres

# Reinstalar dependencias
pip install -r requeriments.txt

# Aplicar migraciones
python manage.py migrate
```

### Frontend no inicia

```bash
# Limpiar e instalar
rm -rf node_modules package-lock.json
npm install

# Verificar puerto
netstat -ano | findstr :3000
```

### Error de CORS

```bash
# Instalar django-cors-headers
pip install django-cors-headers

# Reiniciar servidor Django
```

---

## 📊 API Endpoints

### Base URL: `http://localhost:8000/technet/`

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/acometidas/` | GET, POST | Listar/Crear acometidas |
| `/acometidas/{id}/` | GET, PUT, DELETE | Detalle acometida |
| `/tecnicos/` | GET, POST | Listar/Crear técnicos |
| `/tecnicos/{id}/` | GET, PUT, DELETE | Detalle técnico |
| `/productos/` | GET, POST | Listar/Crear productos |
| `/productos/{id}/` | GET, PUT, DELETE | Detalle producto |
| `/instalaciones/` | GET, POST | Listar/Crear instalaciones |
| `/instalaciones/{id}/` | GET, PUT, DELETE | Detalle instalación |
| `/operadores/` | GET, POST | Listar/Crear operadores |
| `/dr/` | GET, POST | Listar/Crear DRs |
| `/tipodeordenes/` | GET, POST | Listar/Crear tipos de orden |

---

## 🚀 Despliegue

### 🚂 Despliegue en Railway (Recomendado)

**¡NUEVO!** Migración completa a Railway con guías paso a paso:

```powershell
# 1. Lee la guía de inicio
code EMPIEZA_AQUI.md

# 2. Verifica que todo esté listo
cd technet
python check_railway_ready.py

# 3. Sigue la guía rápida (60-70 min)
code ../RAILWAY_QUICKSTART.md
```

**Documentación completa:**
- 📖 **EMPIEZA_AQUI.md** - Punto de inicio
- 📖 **RAILWAY_QUICKSTART.md** - Guía rápida (10 pasos)
- 📖 **technet/RAILWAY_DEPLOYMENT.md** - Guía completa
- 📖 **CAMBIOS_RAILWAY.md** - Resumen de cambios

**Scripts incluidos:**
- ✅ `check_railway_ready.py` - Verificación pre-migración
- ✅ `migrate_to_railway.py` - Asistente interactivo
- ✅ `export_database.ps1` - Exportar base de datos
- ✅ `import_to_railway.ps1` - Importar a Railway

**Características:**
- ✅ Despliegue automático desde GitHub
- ✅ PostgreSQL incluido
- ✅ SSL/HTTPS automático
- ✅ Escalado automático
- ✅ Backups automáticos
- ✅ Monitoreo en tiempo real

**Costo estimado:** $10-18/mes (Plan Free: $5 crédito/mes)

### Backend (Producción Manual)

```bash
# Configurar settings
DEBUG = False
ALLOWED_HOSTS = ['tu-dominio.com']

# Recolectar estáticos
python manage.py collectstatic

# Usar Gunicorn
pip install gunicorn
gunicorn technet.wsgi:application
```

### Frontend (Producción Manual)

```bash
# Build
npm run build

# Los archivos estarán en dist/
# Servir con Nginx, Apache, etc.
```

---

## 📈 Roadmap

- [ ] Sistema de autenticación completo
- [ ] Reportes en PDF
- [ ] Exportación a Excel
- [ ] Gráficos avanzados
- [ ] Notificaciones en tiempo real
- [ ] App móvil
- [ ] Modo offline
- [ ] Integración con APIs externas

---

## 🤝 Contribución

Este es un proyecto propietario. Para contribuir:

1. Mantén el código limpio y documentado
2. Sigue las convenciones de estilo
3. Prueba en diferentes dispositivos
4. Documenta cambios importantes

---

## 📄 Licencia

**Propietario** - Todos los derechos reservados

---

## 👨‍💻 Desarrollado con

- ❤️ Pasión por el código limpio
- ☕ Mucho café
- 🎨 Atención al detalle
- 🚀 Tecnologías modernas

---

<div align="center">

**TechNet** - Sistema Profesional de Gestión de Telecomunicaciones

Desarrollado con las mejores prácticas y tecnologías modernas

[⬆ Volver arriba](#-technet---sistema-de-gestión-de-telecomunicaciones)

</div>
