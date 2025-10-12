export interface Acometida {
  id_acometida: number;
  nombre_acometida: string;
  precio: string;
}

export interface Descuento {
  id_descuento: number;
  valor_descuento: string;
  id_instalacion: number;
}

export interface Dr {
  id_dr: number;
  nombre_dr: string;
  valor_dr: string;
  valor_dr_empresa: string;
}

export interface Instalacion {
  id_instalacion: number;
  fecha_instalacion: string;
  id_tecnico: number;
  id_operador: number;
  direccion: string;
  numero_ot: string;
  producto_serie: string;
  id_dr: number;
  serie_dr?: string;
  eq_reutilizado?: string;
  eq_retirado?: string;
  id_tipo_orden: number;
  metros_cable: string;
  id_acometida: number;
  observaciones?: string;
  valor_añadido?: string;
  valor_opcional_empresa?: string;
  valor_dr: string;
  valor_orden: string;
  valor_orden_empresa: string;
  valor_dr_empresa: string;
  total?: string;
  instalacion_compartida?: string;
  valor_total_empresa?: string;
  categoria?: string;
}

export interface Operador {
  id_ope: number;
  nombre_operador: string;
}

export interface Producto {
  id_producto: number;
  categoria: string;
  nombre_producto: string;
  producto_serie: string;
  cantidad: number;
  id_tecnico: number;
  fecha_asignacion: string;
}

export interface Tecnico {
  id_unico_tecnico: number;
  nombre: string;
  apellido: string;
  id_tecnico: string;
}

export interface TipoOrden {
  id_tipo_orden: number;
  nombre_orden: string;
  valor_orden: string;
  valor_orden_empresa: string;
}
