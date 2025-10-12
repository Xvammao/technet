import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Datos') => {
  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();
  
  // Convertir los datos a una hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generar el archivo y descargarlo
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const formatDateForExcel = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO');
};
