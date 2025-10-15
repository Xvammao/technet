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
import { Dr } from '@/types';
import { exportToExcel } from '@/lib/exportToExcel';
import { formatCurrency } from '@/lib/utils';

export default function DrPage() {
  const [drs, setDrs] = useState<Dr[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Dr | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [formData, setFormData] = useState({
    nombre_dr: '',
    valor_dr: '',
    valor_dr_empresa: '',
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
      const response = await api.get(endpoints.dr, { params });
      setDrs(response.data.results || []);
      setTotalCount(response.data.count || 0);
      setTotalPages(Math.ceil((response.data.count || 0) / 20));
    } catch (error) {
      console.error('Error loading DR:', error);
      setDrs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`${endpoints.dr}${editingItem.id_dr}/`, formData);
      } else {
        await api.post(endpoints.dr, formData);
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving DR:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este DR?')) {
      try {
        await api.delete(`${endpoints.dr}${id}/`);
        loadData();
      } catch (error) {
        console.error('Error deleting DR:', error);
      }
    }
  };

  const handleEdit = (item: Dr) => {
    setEditingItem(item);
    setFormData({
      nombre_dr: item.nombre_dr,
      valor_dr: item.valor_dr,
      valor_dr_empresa: item.valor_dr_empresa,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ nombre_dr: '', valor_dr: '', valor_dr_empresa: '' });
  };

  const handleExportToExcel = () => {
    const dataToExport = drs.map((dr) => ({
      'Nombre DR': dr.nombre_dr,
      'Valor DR': parseFloat(dr.valor_dr),
      'Valor DR Empresa': parseFloat(dr.valor_dr_empresa),
    }));

    const filename = `DR_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}`;
    exportToExcel(dataToExport, filename, 'DR');
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">DR (Derechos de Reparación)</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestión de derechos de reparación
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportToExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo DR
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar DR..."
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
                <TableHead>Valor DR</TableHead>
                <TableHead>Valor DR Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drs.map((dr) => (
                <TableRow key={dr.id_dr}>
                  <TableCell className="font-medium">{dr.id_dr}</TableCell>
                  <TableCell>{dr.nombre_dr}</TableCell>
                  <TableCell className="font-medium text-blue-600">
                    {formatCurrency(parseFloat(dr.valor_dr))}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(parseFloat(dr.valor_dr_empresa))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(dr)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(dr.id_dr)}
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
              {editingItem ? 'Editar DR' : 'Nuevo DR'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_dr">Nombre del DR</Label>
              <Input
                id="nombre_dr"
                value={formData.nombre_dr}
                onChange={(e) =>
                  setFormData({ ...formData, nombre_dr: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_dr">Valor DR</Label>
              <Input
                id="valor_dr"
                type="number"
                step="0.01"
                value={formData.valor_dr}
                onChange={(e) =>
                  setFormData({ ...formData, valor_dr: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_dr_empresa">Valor DR Empresa</Label>
              <Input
                id="valor_dr_empresa"
                type="number"
                step="0.01"
                value={formData.valor_dr_empresa}
                onChange={(e) =>
                  setFormData({ ...formData, valor_dr_empresa: e.target.value })
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
