export interface SegEncomiendas {
  id: string;
  emisor_nombres: string;
  num_doc_emisor: string;
  num_telefono_emisor: string;
  receptor_nombres: string;
  num_doc_receptor: string;
  num_telefono_receptor: string;
  tipo: string;
  codigo_recogida: string;
  peso_kilos: number;
  descripcion: string;
  precio_total: number;
  estado: string;
  terminal_origen_id: string;
  terminal_destino_id: string;
  createdAt: string;
  updatedAt: string;
  fecha_hora_envio: string;
  destino_terminal: DestinoTerminal;
  origen_terminal: OrigenTerminal;
}

export interface DestinoTerminal {
  id: string;
  ciudad: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrigenTerminal {
  id: string;
  ciudad: string;
  createdAt: string;
  updatedAt: string;
}
