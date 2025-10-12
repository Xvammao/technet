# TechNet - Sistema de Telecomunicaciones

Sistema Django REST API para gestión de telecomunicaciones.

## 🚀 Inicio Rápido

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd technet
```

2. **Crear entorno virtual**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

3. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

4. **Configurar variables de entorno**
```bash
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac
```

Edita el archivo `.env` con tus configuraciones locales.

5. **Ejecutar migraciones**
```bash
python manage.py migrate
```

6. **Crear superusuario**
```bash
python manage.py createsuperuser
```

7. **Iniciar servidor de desarrollo**
```bash
python manage.py runserver
```

La aplicación estará disponible en `http://localhost:8000`

## 📚 Documentación

- **[Guía de Despliegue](DEPLOYMENT.md)** - Instrucciones completas para desplegar en producción
- **Admin Panel**: `/admin/`
- **API Endpoints**: `/api/`

## 🛠️ Tecnologías

- **Django 5.2.7** - Framework web
- **Django REST Framework** - API REST
- **PostgreSQL** - Base de datos
- **Djoser** - Autenticación
- **CORS Headers** - Manejo de CORS
- **WhiteNoise** - Servir archivos estáticos
- **Gunicorn** - Servidor WSGI

## 🔐 Seguridad

- Las credenciales sensibles se manejan mediante variables de entorno
- Nunca subas el archivo `.env` al repositorio
- Usa `.env.example` como plantilla
- Genera una nueva `SECRET_KEY` para producción

## 📦 Estructura del Proyecto

```
technet/
├── configuracion/      # Aplicación principal
├── technet/           # Configuración del proyecto
│   ├── settings.py    # Configuración
│   ├── urls.py        # URLs principales
│   └── wsgi.py        # WSGI config
├── manage.py          # Script de gestión
├── requirements.txt   # Dependencias
├── .env.example       # Plantilla de variables
├── .gitignore         # Archivos ignorados
└── DEPLOYMENT.md      # Guía de despliegue
```

## 🧪 Testing

```bash
python manage.py test
```

## 📝 Comandos Útiles

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Recolectar archivos estáticos
python manage.py collectstatic

# Crear superusuario
python manage.py createsuperuser

# Shell de Django
python manage.py shell

# Verificar configuración de despliegue
python manage.py check --deploy
```

## 🌐 API Endpoints

### Autenticación
- `POST /auth/users/` - Registro de usuario
- `POST /auth/token/login/` - Login
- `POST /auth/token/logout/` - Logout

### Configuración
- Endpoints definidos en la app `configuracion`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📞 Contacto

Para soporte o consultas, contacta al equipo de desarrollo.
