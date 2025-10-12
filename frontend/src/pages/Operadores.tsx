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
import { Operador } from '@/types';
import { exportToExcel } from '@/lib/exportToExcel';

export default function Operadores() {
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Operador | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre_operador: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await api.get<Operador[]>(endpoints.operadores);
      setOperadores(response.data || []);
    } catch (error) {
      console.error('Error loading operadores:', error);
      setOperadores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`${endpoints.operadores}${editingItem.id_ope}/`, formData);
      } else {
        await api.post(endpoints.operadores, formData);
      }
      loadData();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving operador:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este operador?')) {
      try {
        await api.delete(`${endpoints.operadores}${id}/`);
        loadData();
      } catch (error) {
        console.error('Error deleting operador:', error);
      }
    }
  };

  const handleEdit = (item: Operador) => {
    setEditingItem(item);
    setFormData({ nombre_operador: item.nombre_operador });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData({ nombre_operador: '' });
  };

  const handleExportToExcel = () => {
    const dataToExport = filteredOperadores.map((op) => ({
      'Nombre Operador': op.nombre_operador,
    }));

    const filename = `Operadores_${new Date().toLocaleDateString('es-CO').replace(/\//g, '-')}`;
    exportToExcel(dataToExport, filename, 'Operadores');
  };

  const filteredOperadores = operadores.filter((op) =>
    op.nombre_operador.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Operadores</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Gestión de operadores de telecomunicaciones
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportToExcel} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar a Excel
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Operador
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar operador..."
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
                <TableHead>Nombre del Operador</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOperadores.map((operador) => (
                <TableRow key={operador.id_ope}>
                  <TableCell className="font-medium">{operador.id_ope}</TableCell>
                  <TableCell>{operador.nombre_operador}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(operador)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(operador.id_ope)}
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
              {editingItem ? 'Editar Operador' : 'Nuevo Operador'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_operador">Nombre del Operador</Label>
              <Input
                id="nombre_operador"
                value={formData.nombre_operador}
                onChange={(e) =>
                  setFormData({ nombre_operador: e.target.value })
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
