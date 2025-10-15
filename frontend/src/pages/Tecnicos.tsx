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
import { Tecnico } from '@/types';
import { exportToExcel } from '@/lib/exportToExcel';

export default function Tecnicos() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Tecnico | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    id_tecnico: '',
    cedula: '',
    telefono: '',
    email: '',
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
      const response = await api.get(endpoints.tecnicos, { params });
      setTecnicos(response.data.results || []);
      setTotalCount(response.data.count || 0);
      setTotalPages(Math.ceil((response.data.count || 0) / 20));
    } catch (error) {
      console.error('Error loading tecnicos:', error);
      setTecnicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`${endpoints.tecnicos}${editingItem.id_unico_tecnico}/`, formData);
      } else {
        await api.post(endpoints.tecnicos, formData);
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving tecnico:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este técnico?')) {
      try {
        await api.delete(`${endpoints.tecnicos}${id}/`);
        loadData();
      } catch (error) {
        console.error('Error deleting tecnico:', error);
      }
    }
  };

  const handleEdit = (item: Tecnico) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      apellido: item.apellido,
      id_tecnico: item.id_tecnico,
      cedula: item.cedula || '',
      telefono: item.telefono || '',
      email: item.email || '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({
      nombre: '',
      apellido: '',
      id_tecnico: '',
      cedula: '',
      telefono: '',
      email: '',
    });
  };

  const handleExportToExcel = async () => {
    try {
      const response = await api.get<{ results: Tecnico[] }>(
        `${endpoints.tecnicos}?page_size=50000`
      );
      
      const allTecnicos = response.data.results || response.data;
      
      const dataToExport = allTecnicos.map((tec: Tecnico) => ({
        'ID Técnico': tec.id_tecnico,
        'Nombre': tec.nombre,
        'Apellido': tec.apellido,
      }));

      const filename = `Tecnicos_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}`;
      exportToExcel(dataToExport, filename, 'Técnicos');
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Técnicos</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestión de técnicos del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportToExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Técnico
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar técnico..."
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
                <TableHead>ID Técnico</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tecnicos.map((tecnico) => (
                <TableRow key={tecnico.id_unico_tecnico}>
                  <TableCell className="font-medium">{tecnico.id_tecnico}</TableCell>
                  <TableCell>{tecnico.nombre}</TableCell>
                  <TableCell>{tecnico.apellido}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tecnico)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tecnico.id_unico_tecnico)}
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
              {editingItem ? 'Editar Técnico' : 'Nuevo Técnico'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="id_tecnico">ID Técnico</Label>
              <Input
                id="id_tecnico"
                value={formData.id_tecnico}
                onChange={(e) =>
                  setFormData({ ...formData, id_tecnico: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) =>
                  setFormData({ ...formData, apellido: e.target.value })
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
