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
import { Pagination } from '@/components/ui/pagination';
import api, { endpoints } from '@/lib/api';
import { Acometida } from '@/types';
import { exportToExcel } from '@/lib/exportToExcel';
import { formatCurrency } from '@/lib/utils';

export default function Acometidas() {
  const [acometidas, setAcometidas] = useState<Acometida[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Acometida | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formData, setFormData] = useState({
    nombre_acometida: '',
    precio: '',
  });

  useEffect(() => {
    loadData();
  }, [currentPage, searchTerm]);

  const loadData = async () => {
    try {
      const params: any = { page: currentPage };
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await api.get(endpoints.acometidas, { params });
      setAcometidas(response.data.results || []);
      setTotalCount(response.data.count || 0);
      setTotalPages(Math.ceil((response.data.count || 0) / 20));
    } catch (error) {
      console.error('Error loading acometidas:', error);
      setAcometidas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`${endpoints.acometidas}${editingItem.id_acometida}/`, formData);
      } else {
        await api.post(endpoints.acometidas, formData);
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving acometida:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar esta acometida?')) {
      try {
        await api.delete(`${endpoints.acometidas}${id}/`);
        loadData();
      } catch (error) {
        console.error('Error deleting acometida:', error);
      }
    }
  };

  const handleEdit = (item: Acometida) => {
    setEditingItem(item);
    setFormData({
      nombre_acometida: item.nombre_acometida,
      precio: item.precio,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ nombre_acometida: '', precio: '' });
  };

  const handleExportToExcel = async () => {
    try {
      const response = await api.get<{ results: Acometida[] }>(
        `${endpoints.acometidas}?page_size=50000`
      );
      
      const allAcometidas = response.data.results || response.data;
      
      const dataToExport = allAcometidas.map((aco: Acometida) => ({
        'Nombre Acometida': aco.nombre_acometida,
        'Precio': parseFloat(aco.precio),
      }));

      const filename = `Acometidas_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}`;
      exportToExcel(dataToExport, filename, 'Acometidas');
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar los datos');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoading(true);
  };

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Acometidas</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestión de tipos de acometidas
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportToExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Acometida
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar acometida..."
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
                <TableHead>Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {acometidas.map((acometida) => (
                <TableRow key={acometida.id_acometida}>
                  <TableCell className="font-medium">{acometida.id_acometida}</TableCell>
                  <TableCell>{acometida.nombre_acometida}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(parseFloat(acometida.precio))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(acometida)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(acometida.id_acometida)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Acometida' : 'Nueva Acometida'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_acometida">Nombre de la Acometida</Label>
              <Input
                id="nombre_acometida"
                value={formData.nombre_acometida}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_acometida: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
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
