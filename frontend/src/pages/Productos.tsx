import { useEffect, useState, useRef } from 'react';
import { Plus, Edit, Trash2, Search, FileDown, Package, Upload } from 'lucide-react';
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
import api, { endpoints } from '@/lib/api';
import { Producto, Tecnico } from '@/types';
import { exportToExcel, formatDateForExcel } from '@/lib/exportToExcel';

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    categoria: '',
    nombre_producto: '',
    producto_serie: '',
    cantidad: '',
    id_tecnico: '',
    fecha_asignacion: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prodRes, tecRes] = await Promise.all([
        api.get<Producto[]>(endpoints.productos),
        api.get<Tecnico[]>(endpoints.tecnicos),
      ]);
      setProductos(prodRes.data || []);
      setTecnicos(tecRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setProductos([]);
      setTecnicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`${endpoints.productos}${editingItem.id_producto}/`, formData);
      } else {
        await api.post(endpoints.productos, formData);
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving producto:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await api.delete(`${endpoints.productos}${id}/`);
        loadData();
      } catch (error) {
        console.error('Error deleting producto:', error);
      }
    }
  };

  const handleEdit = (item: Producto) => {
    setEditingItem(item);
    setFormData({
      categoria: item.categoria,
      nombre_producto: item.nombre_producto,
      producto_serie: item.producto_serie,
      cantidad: item.cantidad.toString(),
      id_tecnico: item.id_tecnico.toString(),
      fecha_asignacion: item.fecha_asignacion,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      categoria: '',
      nombre_producto: '',
      producto_serie: '',
      cantidad: '',
      id_tecnico: '',
      fecha_asignacion: '',
    });
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredProductos.map((prod) => {
      const tecnico = tecnicos.find(t => t.id_unico_tecnico === prod.id_tecnico);
      return {
        'Categoría': prod.categoria,
        'Nombre': prod.nombre_producto,
        'Serie': prod.producto_serie,
        'Cantidad': prod.cantidad,
        'Técnico': tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : '-',
        'Fecha Asignación': formatDateForExcel(prod.fecha_asignacion),
      };
    });

    const filename = `Productos_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}`;
    exportToExcel(dataToExport, filename, 'Productos');
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      // Buscar o crear técnico "Stock"
      let tecnicoStock = tecnicos.find(t => 
        t.nombre.toLowerCase() === 'stock' || 
        (t.nombre.toLowerCase() === 'stock' && t.apellido.toLowerCase() === 'stock')
      );

      let idTecnicoStock: number;

      if (!tecnicoStock) {
        // Crear técnico Stock si no existe
        try {
          const response = await api.post(endpoints.tecnicos, {
            nombre: 'Stock',
            apellido: 'Stock',
            id_tecnico: 'STOCK001'
          });
          idTecnicoStock = response.data.id_unico_tecnico;
        } catch (error) {
          console.error('Error creando técnico Stock:', error);
          alert('Error al crear el técnico Stock. Por favor, créalo manualmente.');
          setImporting(false);
          return;
        }
      } else {
        idTecnicoStock = tecnicoStock.id_unico_tecnico;
      }

      // Fecha actual en formato YYYY-MM-DD
      const fechaActual = new Date().toISOString().split('T')[0];

      // Mapear y crear productos
      const productosImportados = jsonData.map((row) => ({
        categoria: row['Categoria'] || row['Categoría'] || '',
        nombre_producto: row['Descripcion'] || row['Descripción'] || '',
        producto_serie: row['Nº serie'] || row['Nu serie'] || row['N° serie'] || '',
        cantidad: parseInt(row['Cantidad'] || '0'),
        id_tecnico: idTecnicoStock,
        fecha_asignacion: fechaActual,
      }));

      // Enviar productos al backend
      let exitosos = 0;
      let fallidos = 0;

      for (const producto of productosImportados) {
        try {
          await api.post(endpoints.productos, producto);
          exitosos++;
        } catch (error) {
          console.error('Error importando producto:', producto, error);
          fallidos++;
        }
      }

      alert(`Importación completada:\n✓ ${exitosos} productos importados\n✗ ${fallidos} productos fallidos`);
      loadData();
    } catch (error) {
      console.error('Error procesando archivo Excel:', error);
      alert('Error al procesar el archivo Excel. Verifica el formato.');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredProductos = productos.filter(
    (prod) => {
      const tecnico = tecnicos.find(t => t.id_unico_tecnico === prod.id_tecnico);
      const nombreTecnico = tecnico ? `${tecnico.nombre} ${tecnico.apellido}`.toLowerCase() : '';
      
      return (
        prod.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.producto_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nombreTecnico.includes(searchTerm.toLowerCase())
      );
    }
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Productos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestión de inventario de productos
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="outline" 
            className="gap-2"
            disabled={importing}
          >
            <Upload className="h-4 w-4" />
            {importing ? 'Importando...' : 'Importar Excel'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportExcel}
            className="hidden"
          />
          <Button onClick={handleExportToExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por producto, serie, categoría o técnico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Serie</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Fecha Asignación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductos.map((producto) => {
                const tecnico = tecnicos.find(t => t.id_unico_tecnico === producto.id_tecnico);
                return (
                  <TableRow key={producto.id_producto}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        {producto.categoria}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{producto.nombre_producto}</TableCell>
                    <TableCell>{producto.producto_serie}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producto.cantidad > 10 
                          ? 'bg-green-100 text-green-700' 
                          : producto.cantidad > 0 
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {producto.cantidad}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tecnico ? `${tecnico.nombre} ${tecnico.apellido}` : '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(producto.fecha_asignacion).toLocaleDateString('es-CO')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(producto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(producto.id_producto)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) =>
                  setFormData({ ...formData, categoria: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre_producto">Nombre del Producto</Label>
              <Input
                id="nombre_producto"
                value={formData.nombre_producto}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_producto: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="producto_serie">Serie</Label>
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
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                value={formData.cantidad}
                onChange={(e) =>
                  setFormData({ ...formData, cantidad: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="id_tecnico">Técnico Asignado</Label>
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
              <Label htmlFor="fecha_asignacion">Fecha de Asignación</Label>
              <Input
                id="fecha_asignacion"
                type="date"
                value={formData.fecha_asignacion}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_asignacion: e.target.value })
                }
                required
              />
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
