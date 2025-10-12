import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, FileDown } from 'lucide-react';
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
import { TipoOrden } from '@/types';
import { exportToExcel } from '@/lib/exportToExcel';
import { formatCurrency } from '@/lib/utils';

export default function TiposOrden() {
  const [tiposOrden, setTiposOrden] = useState<TipoOrden[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TipoOrden | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre_orden: '',
    valor_orden: '',
    valor_orden_empresa: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await api.get<TipoOrden[]>(endpoints.tipodeordenes);
      setTiposOrden(response.data || []);
    } catch (error) {
      console.error('Error loading tipos de orden:', error);
      setTiposOrden([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`${endpoints.tipodeordenes}${editingItem.id_tipo_orden}/`, formData);
      } else {
        await api.post(endpoints.tipodeordenes, formData);
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tipo de orden:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este tipo de orden?')) {
      try {
        await api.delete(`${endpoints.tipodeordenes}${id}/`);
        loadData();
      } catch (error) {
        console.error('Error deleting tipo de orden:', error);
      }
    }
  };

  const handleEdit = (item: TipoOrden) => {
    setEditingItem(item);
    setFormData({
      nombre_orden: item.nombre_orden,
      valor_orden: item.valor_orden,
      valor_orden_empresa: item.valor_orden_empresa,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ nombre_orden: '', valor_orden: '', valor_orden_empresa: '' });
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredTiposOrden.map((tipo) => ({
      'Nombre Orden': tipo.nombre_orden,
      'Valor Orden': parseFloat(tipo.valor_orden),
      'Valor Orden Empresa': parseFloat(tipo.valor_orden_empresa),
    }));

    const filename = `TiposOrden_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}`;
    exportToExcel(dataToExport, filename, 'Tipos de Orden');
  };

  const filteredTiposOrden = tiposOrden.filter((tipo) =>
    tipo.nombre_orden.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tipos de Orden</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestión de tipos de órdenes de trabajo
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportToExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Tipo de Orden
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar tipo de orden..."
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
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Valor Orden</TableHead>
                <TableHead>Valor Orden Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTiposOrden.map((tipo) => (
                <TableRow key={tipo.id_tipo_orden}>
                  <TableCell className="font-medium">{tipo.id_tipo_orden}</TableCell>
                  <TableCell>{tipo.nombre_orden}</TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {formatCurrency(parseFloat(tipo.valor_orden))}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(parseFloat(tipo.valor_orden_empresa))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tipo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tipo.id_tipo_orden)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Tipo de Orden' : 'Nuevo Tipo de Orden'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_orden">Nombre de la Orden</Label>
              <Input
                id="nombre_orden"
                value={formData.nombre_orden}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_orden: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_orden">Valor Orden</Label>
              <Input
                id="valor_orden"
                type="number"
                step="0.01"
                value={formData.valor_orden}
                onChange={(e) =>
                  setFormData({ ...formData, valor_orden: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_orden_empresa">Valor Orden Empresa</Label>
              <Input
                id="valor_orden_empresa"
                type="number"
                step="0.01"
                value={formData.valor_orden_empresa}
                onChange={(e) =>
                  setFormData({ ...formData, valor_orden_empresa: e.target.value })
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
