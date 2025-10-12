
from django.urls import path, include
from . import views
urlpatterns = [
    path('acometidas/', views.AcometidasList.as_view()),
    path('acometidas/<int:pk>/', views.AcometidasDetail.as_view()),
    path('descuentos/', views.DescuentosList.as_view()),
    path('descuentos/<int:pk>/', views.DescuentosDetail.as_view()),
    path('dr/', views.DrList.as_view()),
    path('dr/<int:pk>/', views.DrDetail.as_view()),
    path('instalaciones/', views.InstalacionesList.as_view()),
    path('instalaciones/<int:pk>/', views.InstalacionesDetail.as_view()),
    path('instalaciones/bulk-import/', views.instalaciones_bulk_import),
    path('operadores/', views.OperadoresList.as_view()),
    path('operadores/<int:pk>/', views.OperadoresDetail.as_view()),
    path('productos/', views.ProductosList.as_view()),
    path('productos/<int:pk>/', views.ProductosDetail.as_view()),
    path('tecnicos/', views.TecnicosList.as_view()),
    path('tecnicos/<int:pk>/', views.TecnicosDetail.as_view()),
    path('tipodeordenes/', views.TipoOrdenLista.as_view()),
    path('tipodeordenes/<int:pk>/', views.TipoOrdenEliminar.as_view()),
]
