import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cable, Users, Package, TrendingUp } from 'lucide-react';
import api, { endpoints } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Instalacion, Tecnico, Producto } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalInstalaciones: 0,
    totalTecnicos: 0,
    totalProductos: 0,
    ingresosMes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentInstalaciones, setRecentInstalaciones] = useState<Instalacion[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadDashboardData();
    // Trigger animations after component mounts
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Cargando datos del dashboard...');
      const [instalacionesRes, tecnicosRes, productosRes] = await Promise.all([
        api.get<Instalacion[]>(endpoints.instalaciones),
        api.get<Tecnico[]>(endpoints.tecnicos),
        api.get<Producto[]>(endpoints.productos),
      ]);

      console.log('Datos recibidos:', {
        instalaciones: instalacionesRes.data,
        tecnicos: tecnicosRes.data,
        productos: productosRes.data
      });

      const instalaciones = instalacionesRes.data || [];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const instalacionesMes = instalaciones.filter(inst => {
        const date = new Date(inst.fecha_instalacion);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const ingresosMes = instalacionesMes.reduce(
        (sum, inst) => sum + parseFloat(inst.valor_total_empresa || '0'),
        0
      );

      setStats({
        totalInstalaciones: instalaciones.length,
        totalTecnicos: tecnicosRes.data?.length || 0,
        totalProductos: productosRes.data?.reduce((sum, p) => sum + p.cantidad, 0) || 0,
        ingresosMes,
      });

      setRecentInstalaciones(
        instalaciones
          .sort((a, b) => 
            new Date(b.fecha_instalacion).getTime() - new Date(a.fecha_instalacion).getTime()
          )
          .slice(0, 5)
      );
      
      setError(null);
      console.log('Dashboard cargado exitosamente');
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      console.error('Error details:', error.response);
      setError('Error al cargar los datos. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Instalaciones',
      value: stats.totalInstalaciones,
      icon: Cable,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Técnicos Activos',
      value: stats.totalTecnicos,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Productos en Stock',
      value: stats.totalProductos,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Ingresos del Mes',
      value: formatCurrency(stats.ingresosMes),
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">{error}</div>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with fade-in animation */}
      <div 
        className={`transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Cards with staggered animation */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={`overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-xl cursor-pointer ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor} transition-transform duration-300 hover:rotate-12 hover:scale-110`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white animate-in fade-in duration-1000">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Installations Card with slide-up animation */}
      <Card 
        className={`transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
        style={{ transitionDelay: '400ms' }}
      >
        <CardHeader>
          <CardTitle>Instalaciones Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInstalaciones.map((instalacion, index) => (
              <div
                key={instalacion.id_instalacion}
                className={`flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 
                  transform transition-all duration-500 hover:scale-[1.02] hover:shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white transition-colors">
                    OT: {instalacion.numero_ot}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {instalacion.direccion}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatCurrency(parseFloat(instalacion.total || '0'))}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(instalacion.fecha_instalacion).toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
