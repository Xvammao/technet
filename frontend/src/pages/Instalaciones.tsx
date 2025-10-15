import { useEffect, useState, useRef } from 'react';
import { Plus, Search, Edit, Trash2, FileDown, Upload, ChevronDown, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pagination } from '@/components/ui/pagination';
import api, { endpoints } from '@/lib/api';
import { Instalacion, Tecnico, Operador, TipoOrden, Dr, Acometida } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { exportToExcel, formatDateForExcel } from '@/lib/exportToExcel';

export default function Instalaciones() {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [tiposOrden, setTiposOrden] = useState<TipoOrden[]>([]);
  const [drs, setDrs] = useState<Dr[]>([]);
  const [acometidas, setAcometidas] = useState<Acometida[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Instalacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTecnico, setFilterTecnico] = useState('');
  const [filterOperador, setFilterOperador] = useState('');
  const [filterFechaInicio, setFilterFechaInicio] = useState('');
  const [filterFechaFin, setFilterFechaFin] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    fecha_instalacion: '',
    id_tecnico: '',
    id_operador: '',
    direccion: '',
    numero_ot: '',
    producto_serie: '',
    id_dr: '',
    serie_dr: '',
    eq_reutilizado: '',
    eq_retirado: '',
    id_tipo_orden: '',
    metros_cable: '',
    id_acometida: '',
    observaciones: '',
    valor_añadido: '',
    valor_opcional_empresa: '',
    valor_dr: '',
    valor_orden: '',
    valor_orden_empresa: '',
    valor_dr_empresa: '',
    total: '',
    instalacion_compartida: '',
    valor_total_empresa: '',
    categoria: '',
  });

  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm, filterTecnico, filterOperador, filterFechaInicio, filterFechaFin]);

  const loadData = async () => {
    try {
      const params: any = { page: currentPage };
      if (searchTerm) {
        params.search = searchTerm;
      }
      // Aplicar filtros del backend
      if (filterTecnico) {
        params.id_tecnico = filterTecnico;
      }
      if (filterOperador) {
        params.id_operador = filterOperador;
      }
      if (filterFechaInicio) {
        params.fecha_inicio = filterFechaInicio;
      }
      if (filterFechaFin) {
        params.fecha_fin = filterFechaFin;
      }
      
      const [instRes, tecRes, opRes, toRes, drRes, acoRes] = await Promise.all([
        api.get(endpoints.instalaciones, { params }),
        api.get(endpoints.tecnicos, { params: { page_size: 1000 } }),
        api.get(endpoints.operadores, { params: { page_size: 1000 } }),
        api.get(endpoints.tipodeordenes, { params: { page_size: 1000 } }),
        api.get(endpoints.dr, { params: { page_size: 1000 } }),
        api.get(endpoints.acometidas, { params: { page_size: 1000 } }),
      ]);
      setInstalaciones(instRes.data.results || []);
      setTotalCount(instRes.data.count || 0);
      setTotalPages(Math.ceil((instRes.data.count || 0) / 20));
      setTecnicos(tecRes.data.results || tecRes.data || []);
      setOperadores(opRes.data.results || opRes.data || []);
      setTiposOrden(toRes.data.results || toRes.data || []);
      setDrs(drRes.data.results || drRes.data || []);
      setAcometidas(acoRes.data.results || acoRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Mantener arrays vacíos en caso de error
      setInstalaciones([]);
      setTecnicos([]);
      setOperadores([]);
      setTiposOrden([]);
      setDrs([]);
      setAcometidas([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar valores cuando cambia el tipo de orden
  const handleTipoOrdenChange = (tipoOrdenId: string) => {
    const tipoOrden = tiposOrden.find(t => t.id_tipo_orden.toString() === tipoOrdenId);
    if (tipoOrden) {
      setFormData({
        ...formData,
        id_tipo_orden: tipoOrdenId,
        valor_orden: tipoOrden.valor_orden,
        valor_orden_empresa: tipoOrden.valor_orden_empresa,
      });
    }
  };

  // Función para actualizar valores cuando cambia el DR
  const handleDrChange = (drId: string) => {
    const dr = drs.find(d => d.id_dr.toString() === drId);
    if (dr) {
      setFormData({
        ...formData,
        id_dr: drId,
        valor_dr: dr.valor_dr,
        valor_dr_empresa: dr.valor_dr_empresa,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Eliminar campos calculados/generados antes de enviar
      const { total, instalacion_compartida, valor_total_empresa, valor_añadido, valor_opcional_empresa, ...dataToSend } = formData;
      
      console.log('Datos a enviar:', dataToSend);
      
      if (editingItem) {
        await api.put(`${endpoints.instalaciones}${editingItem.id_instalacion}/`, dataToSend);
      } else {
        await api.post(endpoints.instalaciones, dataToSend);
      }
      loadData();
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving instalacion:', error);
      console.error('Respuesta del servidor:', error.response?.data);
      
      let errorMessage = 'Error al guardar la instalación.';
      if (error.response?.data) {
        const errors = error.response.data;
        const errorDetails = Object.entries(errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        errorMessage += '\n\n' + errorDetails;
      }
      
      alert(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta instalación?')) {
      try {
        await api.delete(`${endpoints.instalaciones}${id}/`);
        loadData();
      } catch (error) {
        console.error('Error deleting instalacion:', error);
      }
    }
  };

  const handleEdit = (item: Instalacion) => {
    setEditingItem(item);
    setFormData({
      fecha_instalacion: item.fecha_instalacion,
      id_tecnico: item.id_tecnico.toString(),
      id_operador: item.id_operador.toString(),
      direccion: item.direccion,
      numero_ot: item.numero_ot,
      producto_serie: item.producto_serie,
      id_dr: item.id_dr.toString(),
      serie_dr: item.serie_dr || '',
      eq_reutilizado: item.eq_reutilizado || '',
      eq_retirado: item.eq_retirado || '',
      id_tipo_orden: item.id_tipo_orden.toString(),
      metros_cable: item.metros_cable,
      id_acometida: item.id_acometida.toString(),
      observaciones: item.observaciones || '',
      valor_añadido: item.valor_añadido || '',
      valor_opcional_empresa: item.valor_opcional_empresa || '',
      valor_dr: item.valor_dr,
      valor_orden: item.valor_orden,
      valor_orden_empresa: item.valor_orden_empresa,
      valor_dr_empresa: item.valor_dr_empresa,
      total: item.total || '',
      instalacion_compartida: item.instalacion_compartida || '',
      valor_total_empresa: item.valor_total_empresa || '',
      categoria: item.categoria || '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      fecha_instalacion: '',
      id_tecnico: '',
      id_operador: '',
      direccion: '',
      numero_ot: '',
      producto_serie: '',
      id_dr: '',
      serie_dr: '',
      eq_reutilizado: '',
      eq_retirado: '',
      id_tipo_orden: '',
      metros_cable: '',
      id_acometida: '',
      observaciones: '',
      valor_añadido: '',
      valor_opcional_empresa: '',
      valor_dr: '',
      valor_orden: '',
      valor_orden_empresa: '',
      valor_dr_empresa: '',
      total: '',
      instalacion_compartida: '',
      valor_total_empresa: '',
      categoria: '',
    });
  };

  const handleExportToExcel = async () => {
    try {
      // Construir parámetros con los filtros activos
      const params: any = { page_size: 10000 };
      if (searchTerm) params.search = searchTerm;
      if (filterTecnico) params.id_tecnico = filterTecnico;
      if (filterOperador) params.id_operador = filterOperador;
      if (filterFechaInicio) params.fecha_inicio = filterFechaInicio;
      if (filterFechaFin) params.fecha_fin = filterFechaFin;
      
      // Obtener TODOS los datos filtrados para exportar
      const response = await api.get<{ results: Instalacion[] }>(
        endpoints.instalaciones,
        { params }
      );
      
      const allInstalaciones = response.data.results || response.data;
      
      const dataToExport = allInstalaciones.map((inst: Instalacion) => {
        const tecnico = tecnicos.find(t => t.id_unico_tecnico === inst.id_tecnico);
        const operador = operadores.find(o => o.id_ope === inst.id_operador);
        
        return {
          'Número OT': inst.numero_ot,
          'Fecha': formatDateForExcel(inst.fecha_instalacion),
          'Dirección': inst.direccion,
          'Técnico': tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : '-',
          'Operador': operador ? operador.nombre_operador : '-',
          'Metros Cable': inst.metros_cable,
          'Serie Producto': inst.producto_serie,
          'Equipo Reutilizado': inst.eq_reutilizado || '',
          'Equipo Retirado': inst.eq_retirado || '',
          'Total Técnico': parseFloat(inst.total || '0'),
          'Total Empresa': parseFloat(inst.valor_total_empresa || '0'),
          'Observaciones': inst.observaciones || '',
        };
      });

      const filename = `Instalaciones_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}`;
      exportToExcel(dataToExport, filename, 'Instalaciones');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const parseExcelDate = (excelDate: any): string => {
    if (!excelDate) return '';
    
    // Si ya es una fecha en formato string
    if (typeof excelDate === 'string') {
      // Intentar parsear diferentes formatos
      const dateFormats = [
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      ];
      
      for (const format of dateFormats) {
        const match = excelDate.match(format);
        if (match) {
          if (format === dateFormats[0]) {
            // DD/MM/YYYY
            const [, day, month, year] = match;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          } else {
            // YYYY-MM-DD
            return excelDate;
          }
        }
      }
    }
    
    // Si es un número serial de Excel
    if (typeof excelDate === 'number') {
      const date = new Date((excelDate - 25569) * 86400 * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    return '';
  };

  const findColumnValue = (row: any, possibleNames: string[]): any => {
    // Buscar el valor en cualquiera de los nombres posibles de columna
    for (const name of possibleNames) {
      if (row.hasOwnProperty(name)) {
        return row[name];
      }
      // Buscar sin distinguir mayúsculas/minúsculas
      const keys = Object.keys(row);
      const matchingKey = keys.find(key => key.toLowerCase() === name.toLowerCase());
      if (matchingKey) {
        return row[matchingKey];
      }
    }
    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log('Datos del Excel:', jsonData);
      console.log('Primera fila:', jsonData[0]);
      
      // Mostrar todas las columnas disponibles
      if (jsonData.length > 0) {
        const primeraFila = jsonData[0] as Record<string, any>;
        const columnas = Object.keys(primeraFila);
        console.log('Columnas disponibles en el Excel:', columnas);
        console.log('Total de columnas:', columnas.length);
      }

      if (jsonData.length === 0) {
        alert('El archivo Excel está vacío o no tiene datos válidos.');
        setIsImporting(false);
        return;
      }

      // Mapear columnas del Excel a campos de instalación
      const instalacionesData = jsonData.map((row: any, index: number) => {
        try {
          // Buscar valores SOLO de las columnas en amarillo que especificaste
          const clienteValue = findColumnValue(row, ['Cliente', 'cliente', 'CLIENTE']);
          const numeroOtValue = findColumnValue(row, ['Cod. cliente 1', 'COD. CLIENTE 1', 'Cod cliente 1']);
          const fechaValue = findColumnValue(row, ['Fecha fin actuación', 'Fecha fin actuacion', 'FECHA FIN ACTUACION']);
          const tecnicoValue = findColumnValue(row, ['Técnico cumplimentación', 'Tecnico cumplimentacion', 'TECNICO CUMPLIMENTACION']);
          const serieValue = findColumnValue(row, ['N/S', 'N S', 'NS']);
          const descripcionValue = findColumnValue(row, ['Descripción', 'Descripcion', 'DESCRIPCION']);
          const categoriaValue = findColumnValue(row, ['Categoria', 'categoria', 'CATEGORIA', 'Categoría']);

          // Log para debugging - mostrar valores extraídos
          if (index < 3) {
            console.log(`Fila ${index + 1} - Valores extraídos:`, {
              cliente: clienteValue,
              numeroOt: numeroOtValue,
              fecha: fechaValue,
              tecnico: tecnicoValue,
              serie: serieValue,
              descripcion: descripcionValue,
              categoria: categoriaValue
            });
          }

          // Buscar operador por nombre
          const operador = operadores.find(
            (op) => op.nombre_operador.toLowerCase() === String(clienteValue || '').toLowerCase().trim()
          );

          // Buscar técnico por nombre
          // El Excel puede tener formatos como: "84128 - JEISON DUBAN LONDOÑO" o "1. Mauricio Espejo"
          let tecnicoNombre = String(tecnicoValue || '').trim();
          
          // Remover números y guiones al inicio (ej: "84128 - JEISON DUBAN" → "JEISON DUBAN")
          // o "1. Mauricio Espejo" → "Mauricio Espejo"
          tecnicoNombre = tecnicoNombre.replace(/^\d+[\.\-\s]+/, '').trim();
          
          // Buscar técnico - comparar con nombre completo o buscar por coincidencia parcial
          let tecnico = tecnicos.find(
            (tec) => {
              const nombreCompleto = `${tec.nombre} ${tec.apellido}`.toLowerCase();
              const nombreExcel = tecnicoNombre.toLowerCase();
              
              // Comparación exacta
              if (nombreCompleto === nombreExcel) return true;
              
              // Comparación sin el ID del técnico en el nombre del sistema
              // Ej: "84128-Jeison Duban Londoño" vs "JEISON DUBAN LONDOÑO"
              const nombreSinId = tec.nombre.replace(/^\d+[\-\s]+/, '').toLowerCase();
              const nombreCompletoSinId = `${nombreSinId} ${tec.apellido}`.toLowerCase();
              if (nombreCompletoSinId === nombreExcel) return true;
              
              // Buscar por apellido si el nombre contiene el apellido
              if (nombreExcel.includes(tec.apellido.toLowerCase())) {
                return true;
              }
              
              return false;
            }
          );

          // Valores por defecto para campos requeridos - buscar "No definido"
          const defaultDrObj = drs.find(d => d.nombre_dr.toLowerCase().includes('no definido')) || drs[0];
          const defaultTipoOrdenObj = tiposOrden.find(t => t.nombre_orden.toLowerCase().includes('no definido')) || tiposOrden[0];
          const defaultAcometidaObj = acometidas.find(a => a.nombre_acometida.toLowerCase().includes('no definido')) || acometidas[0];
          
          const defaultDr = defaultDrObj?.id_dr || 1;
          const defaultTipoOrden = defaultTipoOrdenObj?.id_tipo_orden || 1;
          const defaultAcometida = defaultAcometidaObj?.id_acometida || 1;

          // Parsear fecha o usar fecha actual si no hay
          const fechaParsed = parseExcelDate(fechaValue);
          const fechaFinal = fechaParsed || new Date().toISOString().split('T')[0];

          const instalacionObj = {
            fecha_instalacion: fechaFinal,                              // Fecha fin actuación → fecha_instalacion
            id_tecnico: tecnico?.id_unico_tecnico || tecnicos[0]?.id_unico_tecnico,  // Técnico cumplimentación → id_tecnico
            id_operador: operador?.id_ope || operadores[0]?.id_ope,    // Cliente → id_operador
            direccion: 'NA',                                            // No viene del Excel, poner NA
            numero_ot: String(numeroOtValue || 'NA'),                  // Cod. cliente 1 → numero_ot
            producto_serie: String(serieValue || 'NA'),                // N/S → producto_serie (SOLO este campo)
            categoria: String(categoriaValue || 'NA'),                 // Categoria → categoria
            id_dr: defaultDr,
            serie_dr: '',                                               // serie_dr vacío (no viene del Excel)
            eq_reutilizado: 'NA',
            eq_retirado: 'NA',
            id_tipo_orden: defaultTipoOrden,
            metros_cable: '0',
            id_acometida: defaultAcometida,
            observaciones: String(descripcionValue || 'NA'),           // Descripción → observaciones
            valor_dr: defaultDrObj?.valor_dr || '0',
            valor_orden: defaultTipoOrdenObj?.valor_orden || '0',
            valor_orden_empresa: defaultTipoOrdenObj?.valor_orden_empresa || '0',
            valor_dr_empresa: defaultDrObj?.valor_dr_empresa || '0',
          };

          if (index < 3) {
            console.log(`Instalación generada fila ${index + 1}:`, instalacionObj);
          }

          return instalacionObj;
        } catch (error) {
          console.error(`Error procesando fila ${index + 1}:`, error);
          return null;
        }
      }).filter(inst => inst !== null);

      // Detectar duplicados por número OT para informar al usuario
      const otMap = new Map<string, any[]>();
      instalacionesData.forEach((inst: any, index: number) => {
        const ot = inst.numero_ot;
        if (!otMap.has(ot)) {
          otMap.set(ot, []);
        }
        otMap.get(ot)!.push({ ...inst, filaOriginal: index + 1 });
      });

      // Identificar duplicados solo para informar
      const duplicados: any[] = [];
      
      otMap.forEach((instalaciones, ot) => {
        if (instalaciones.length > 1) {
          duplicados.push({
            numero_ot: ot,
            cantidad: instalaciones.length,
            instalaciones: instalaciones
          });
        }
      });

      console.log('Total de instalaciones a importar:', instalacionesData.length);
      console.log('Grupos de duplicados encontrados:', duplicados.length);
      
      if (duplicados.length > 0) {
        console.log('Duplicados encontrados:', duplicados);
        let mensajeDuplicados = `Se encontraron ${duplicados.length} números de OT duplicados:\n\n`;
        duplicados.forEach(dup => {
          mensajeDuplicados += `• OT "${dup.numero_ot}": ${dup.cantidad} veces (filas: ${dup.instalaciones.map((i: any) => i.filaOriginal).join(', ')})\n`;
        });
        mensajeDuplicados += `\n\nSe importarán TODAS las instalaciones (${instalacionesData.length} en total).`;
        mensajeDuplicados += `\nLas duplicadas se agruparán visualmente en el listado.`;
        
        alert(mensajeDuplicados);
      }

      // Importar TODAS las instalaciones, incluyendo duplicadas
      const validInstalaciones = instalacionesData;

      if (validInstalaciones.length === 0) {
        alert('No se encontraron instalaciones para importar.');
        setIsImporting(false);
        return;
      }

      // Mostrar datos que se van a enviar
      console.log('=== DATOS A ENVIAR AL BACKEND ===');
      console.log('Total de instalaciones:', validInstalaciones.length);
      console.log('Primera instalación completa:', validInstalaciones[0]);
      
      // Enviar al backend
      const response = await api.post(endpoints.instalaciones + 'bulk-import/', {
        instalaciones: validInstalaciones,
      });

      const result = response.data;
      
      let message = `Importación completada:\n`;
      message += `Total procesadas: ${result.total}\n`;
      message += `Creadas exitosamente: ${result.creadas}\n`;
      
      if (result.errores && result.errores.length > 0) {
        message += `\nErrores: ${result.errores.length}\n`;
        result.errores.slice(0, 5).forEach((error: any) => {
          message += `- Fila ${error.fila}: ${error.error || JSON.stringify(error.errores)}\n`;
        });
        if (result.errores.length > 5) {
          message += `... y ${result.errores.length - 5} errores más\n`;
        }
      }
      
      alert(message);
      loadData();
    } catch (error: any) {
      console.error('Error importing Excel:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Error desconocido';
      alert(`Error al importar el archivo:\n${errorMsg}\n\nRevise la consola del navegador para más detalles.`);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Función para obtener el OT base (sin sufijos _DUP, _AGILETV, etc.)
  const getBaseOT = (numeroOt: string): string => {
    // Remover sufijos como _DUP1, _DUP2, _AGILETV, etc.
    return numeroOt.replace(/_(DUP\d+|AGILETV|[A-Z]+\d*)$/, '');
  };

  // Función para alternar expansión de grupos
  const toggleGroup = (baseOt: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(baseOt)) {
        newSet.delete(baseOt);
      } else {
        newSet.add(baseOt);
      }
      return newSet;
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

  const filteredInstalaciones = instalaciones.filter((inst) => {
    // Filtro por técnico
    const matchesTecnico = !filterTecnico || inst.id_tecnico.toString() === filterTecnico;

    // Filtro por operador
    const matchesOperador = !filterOperador || inst.id_operador.toString() === filterOperador;

    // Filtro por rango de fechas
    const matchesFecha = (!filterFechaInicio || inst.fecha_instalacion >= filterFechaInicio) &&
                         (!filterFechaFin || inst.fecha_instalacion <= filterFechaFin);

    return matchesTecnico && matchesOperador && matchesFecha;
  });

  // Calcular totales
  const totalTecnico = filteredInstalaciones.reduce(
    (sum, inst) => sum + parseFloat(inst.total || '0'),
    0
  );
  
  const totalEmpresa = filteredInstalaciones.reduce(
    (sum, inst) => sum + parseFloat(inst.valor_total_empresa || '0'),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Instalaciones</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestión de instalaciones realizadas
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <Button 
            onClick={handleImportClick} 
            variant="outline" 
            className="gap-2"
            disabled={isImporting}
          >
            <Upload className="h-4 w-4" />
            {isImporting ? 'Importando...' : 'Importar Excel'}
          </Button>
          <Button onClick={handleExportToExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Instalación
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar por OT o dirección..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Técnico</label>
                <select
                  value={filterTecnico}
                  onChange={(e) => setFilterTecnico(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {tecnicos.map((tec) => (
                    <option key={tec.id_unico_tecnico} value={tec.id_unico_tecnico}>
                      {tec.nombre} {tec.apellido}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Operador</label>
                <select
                  value={filterOperador}
                  onChange={(e) => setFilterOperador(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  {operadores.map((op) => (
                    <option key={op.id_ope} value={op.id_ope}>
                      {op.nombre_operador}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Inicio</label>
                <Input
                  type="date"
                  value={filterFechaInicio}
                  onChange={(e) => setFilterFechaInicio(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Fin</label>
                <Input
                  type="date"
                  value={filterFechaFin}
                  onChange={(e) => setFilterFechaFin(e.target.value)}
                />
              </div>
            </div>
            
            {/* Resumen de filtros */}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>Mostrando {filteredInstalaciones.length} de {instalaciones.length} instalaciones</span>
              {(filterTecnico || filterOperador || filterFechaInicio || filterFechaFin) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilterTecnico('');
                    setFilterOperador('');
                    setFilterFechaInicio('');
                    setFilterFechaFin('');
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="h-8"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>OT</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Total Técnico</TableHead>
                <TableHead>Total Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                // Agrupar instalaciones por OT base
                const grupos = new Map<string, Instalacion[]>();
                filteredInstalaciones.forEach((inst) => {
                  const baseOt = getBaseOT(inst.numero_ot);
                  if (!grupos.has(baseOt)) {
                    grupos.set(baseOt, []);
                  }
                  grupos.get(baseOt)!.push(inst);
                });

                const rows: JSX.Element[] = [];
                
                grupos.forEach((instalaciones, baseOt) => {
                  const esDuplicado = instalaciones.length > 1;
                  const estaExpandido = expandedGroups.has(baseOt);
                  
                  if (esDuplicado) {
                    // Calcular totales del grupo
                    const totalTecnicoGrupo = instalaciones.reduce((sum, inst) => 
                      sum + parseFloat(inst.total || '0'), 0
                    );
                    const totalEmpresaGrupo = instalaciones.reduce((sum, inst) => 
                      sum + parseFloat(inst.valor_total_empresa || '0'), 0
                    );
                    
                    // Fila de grupo (clickeable para expandir/contraer)
                    rows.push(
                      <TableRow 
                        key={`group-${baseOt}`}
                        className="bg-yellow-50 hover:bg-yellow-100 cursor-pointer"
                        onClick={() => toggleGroup(baseOt)}
                      >
                        <TableCell className="font-bold">
                          <div className="flex items-center gap-2">
                            {estaExpandido ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            {baseOt} ({instalaciones.length} duplicados)
                          </div>
                        </TableCell>
                        <TableCell colSpan={2} className="text-sm text-slate-600">
                          Click para {estaExpandido ? 'contraer' : 'expandir'}
                        </TableCell>
                        <TableCell className="text-right font-semibold">Subtotal:</TableCell>
                        <TableCell className="font-bold text-green-600">
                          {formatCurrency(totalTecnicoGrupo)}
                        </TableCell>
                        <TableCell className="font-bold text-blue-600">
                          {formatCurrency(totalEmpresaGrupo)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    );
                    
                    // Filas individuales (solo si está expandido)
                    if (estaExpandido) {
                      instalaciones.forEach((instalacion) => {
                        const tecnico = tecnicos.find(t => t.id_unico_tecnico === instalacion.id_tecnico);
                        rows.push(
                          <TableRow key={instalacion.id_instalacion} className="bg-yellow-50/50">
                            <TableCell className="font-medium pl-8">
                              {instalacion.numero_ot}
                            </TableCell>
                            <TableCell>
                              {new Date(instalacion.fecha_instalacion).toLocaleDateString('es-CO')}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{instalacion.direccion}</TableCell>
                            <TableCell>
                              {tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : '-'}
                            </TableCell>
                            <TableCell className="font-semibold text-green-600">
                              {formatCurrency(parseFloat(instalacion.total || '0'))}
                            </TableCell>
                            <TableCell className="font-semibold text-blue-600">
                              {formatCurrency(parseFloat(instalacion.valor_total_empresa || '0'))}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(instalacion);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(instalacion.id_instalacion);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      });
                    }
                  } else {
                    // Instalación única (sin duplicados)
                    const instalacion = instalaciones[0];
                    const tecnico = tecnicos.find(t => t.id_unico_tecnico === instalacion.id_tecnico);
                    rows.push(
                      <TableRow key={instalacion.id_instalacion}>
                        <TableCell className="font-medium">{instalacion.numero_ot}</TableCell>
                        <TableCell>
                          {new Date(instalacion.fecha_instalacion).toLocaleDateString('es-CO')}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{instalacion.direccion}</TableCell>
                        <TableCell>
                          {tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : '-'}
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(parseFloat(instalacion.total || '0'))}
                        </TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {formatCurrency(parseFloat(instalacion.valor_total_empresa || '0'))}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(instalacion)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(instalacion.id_instalacion)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  }
                });
                
                return rows;
              })()}
              
              {/* Fila de totales */}
              <TableRow className="bg-slate-100 dark:bg-slate-800 font-bold">
                <TableCell colSpan={4} className="text-right">TOTALES:</TableCell>
                <TableCell className="text-green-600 text-lg">
                  {formatCurrency(totalTecnico)}
                </TableCell>
                <TableCell className="text-blue-600 text-lg">
                  {formatCurrency(totalEmpresa)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalCount}
            itemsPerPage={20}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Instalación' : 'Nueva Instalación'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_instalacion">Fecha</Label>
                <Input
                  id="fecha_instalacion"
                  type="date"
                  value={formData.fecha_instalacion}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_instalacion: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_ot">Número OT</Label>
                <Input
                  id="numero_ot"
                  value={formData.numero_ot}
                  onChange={(e) =>
                    setFormData({ ...formData, numero_ot: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_tecnico">Técnico</Label>
                <select
                  id="id_tecnico"
                  value={formData.id_tecnico}
                  onChange={(e) =>
                    setFormData({ ...formData, id_tecnico: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {tecnicos.map((tec) => (
                    <option key={tec.id_unico_tecnico} value={tec.id_unico_tecnico}>
                      {tec.nombre} {tec.apellido}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_operador">Operador</Label>
                <select
                  id="id_operador"
                  value={formData.id_operador}
                  onChange={(e) =>
                    setFormData({ ...formData, id_operador: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {operadores.map((op) => (
                    <option key={op.id_ope} value={op.id_ope}>
                      {op.nombre_operador}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metros_cable">Metros de Cable</Label>
                <Input
                  id="metros_cable"
                  type="number"
                  step="0.01"
                  value={formData.metros_cable}
                  onChange={(e) =>
                    setFormData({ ...formData, metros_cable: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producto_serie">Serie Producto</Label>
                <Input
                  id="producto_serie"
                  value={formData.producto_serie}
                  onChange={(e) =>
                    setFormData({ ...formData, producto_serie: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_tipo_orden">Tipo de Orden</Label>
                <select
                  id="id_tipo_orden"
                  value={formData.id_tipo_orden}
                  onChange={(e) => handleTipoOrdenChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {tiposOrden.map((tipo) => (
                    <option key={tipo.id_tipo_orden} value={tipo.id_tipo_orden}>
                      {tipo.nombre_orden}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eq_reutilizado">Equipo Reutilizado</Label>
                <Input
                  id="eq_reutilizado"
                  value={formData.eq_reutilizado}
                  onChange={(e) =>
                    setFormData({ ...formData, eq_reutilizado: e.target.value })
                  }
                  placeholder="Ingrese equipo reutilizado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eq_retirado">Equipo Retirado</Label>
                <Input
                  id="eq_retirado"
                  value={formData.eq_retirado}
                  onChange={(e) =>
                    setFormData({ ...formData, eq_retirado: e.target.value })
                  }
                  placeholder="Ingrese equipo retirado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_dr">DR</Label>
                <select
                  id="id_dr"
                  value={formData.id_dr}
                  onChange={(e) => handleDrChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {drs.map((dr) => (
                    <option key={dr.id_dr} value={dr.id_dr}>
                      {dr.nombre_dr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serie_dr">Serie DR</Label>
                <Input
                  id="serie_dr"
                  value={formData.serie_dr}
                  onChange={(e) =>
                    setFormData({ ...formData, serie_dr: e.target.value })
                  }
                  placeholder="Ingrese serie del DR"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="id_acometida">Acometida</Label>
                <select
                  id="id_acometida"
                  value={formData.id_acometida}
                  onChange={(e) =>
                    setFormData({ ...formData, id_acometida: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {acometidas.map((aco) => (
                    <option key={aco.id_acometida} value={aco.id_acometida}>
                      {aco.nombre_acometida}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_dr">Valor DR (Auto)</Label>
                <Input
                  id="valor_dr"
                  type="number"
                  step="0.01"
                  value={formData.valor_dr}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_dr: e.target.value })
                  }
                  className="bg-slate-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_orden">Valor Orden (Auto)</Label>
                <Input
                  id="valor_orden"
                  type="number"
                  step="0.01"
                  value={formData.valor_orden}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_orden: e.target.value })
                  }
                  className="bg-slate-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_orden_empresa">Valor Orden Empresa (Auto)</Label>
                <Input
                  id="valor_orden_empresa"
                  type="number"
                  step="0.01"
                  value={formData.valor_orden_empresa}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_orden_empresa: e.target.value })
                  }
                  className="bg-slate-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_dr_empresa">Valor DR Empresa (Auto)</Label>
                <Input
                  id="valor_dr_empresa"
                  type="number"
                  step="0.01"
                  value={formData.valor_dr_empresa}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_dr_empresa: e.target.value })
                  }
                  className="bg-slate-50"
                  readOnly
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                <Input
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría (Opcional)</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  placeholder="Ingrese categoría"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingItem ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
