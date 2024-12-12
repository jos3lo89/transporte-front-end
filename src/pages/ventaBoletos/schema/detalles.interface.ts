export interface DetallesPajaveVendido {
  id: string;
  num_asiento: number;
  pasajero_id: string;
  viaje_id: string;
  pasajero: Pasajero;
  viaje: Viaje;
}

export interface Pasajero {
  id: string;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  num_documento: string;
  destino: string;
  num_asiento: number;
  viaje_id: string;
  createdAt: string;
  updatedAt: string;
  equipaje: Equipaje[];
}

export interface Equipaje {
  id: string;
  pasajero_id: string;
  descripcion: string;
  peso_kilo: number;
  createdAt: string;
  updatedAt: string;
}

export interface Viaje {
  id: string;
  fecha: string;
  precio: number;
  ruta_id: string;
  vehiculo_id: string;
  conductor_id: string;
  createdAt: string;
  updatedAt: string;
  ruta: Ruta;
}

export interface Ruta {
  id: string;
  duracion: number;
  distancia_km: string;
  origen_id: string;
  destino_id: string;
  createdAt: string;
  updatedAt: string;
  destino: Destino;
  origen: Origen;
}

export interface Destino {
  id: string;
  ciudad: string;
  createdAt: string;
  updatedAt: string;
}

export interface Origen {
  id: string;
  ciudad: string;
  createdAt: string;
  updatedAt: string;
}
