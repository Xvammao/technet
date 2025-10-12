
from django.contrib import admin
from django.urls import path, include
from configuracion.views import CustomAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('technet/', include('configuracion.urls')),
    path('token/login/', CustomAuthToken.as_view(), name='api_token_auth'),
]
