export interface ViajesApi {
  id: string
  fecha: string
  precio: number
  ruta_id: string
  vehiculo_id: string
  conductor_id: string
  createdAt: string
  updatedAt: string
  vehiculo: Vehiculo
  ruta: Ruta
}

export interface Vehiculo {
  id: string
  tarjeta_de_circulacion: string
  numero_de_placa: string
  marca: string
  modelo: string
  annio_de_fabricacion: number
  tipo_combustible: string
  color: string
  numero_motor: string
  cantidad_ruedas: number
  total_asientos: number
  total_pasajeros: number
  peso_seco: number
  peso_bruto: number
  tipo_servicio: string
  estado: string
  conductor_id: string
  createdAt: string
  updatedAt: string
}





export interface ViajeApiPorID {
  id: string
  fecha: string
  precio: number
  ruta_id: string
  vehiculo_id: string
  conductor_id: string
  createdAt: string
  updatedAt: string
  vehiculo: VehiculoWtihCondutor
  ruta: Ruta
}

export interface VehiculoWtihCondutor {
  id: string
  tarjeta_de_circulacion: string
  numero_de_placa: string
  marca: string
  modelo: string
  annio_de_fabricacion: number
  tipo_combustible: string
  color: string
  numero_motor: string
  cantidad_ruedas: number
  total_asientos: number
  total_pasajeros: number
  peso_seco: number
  peso_bruto: number
  tipo_servicio: string
  estado: string
  conductor_id: string
  createdAt: string
  updatedAt: string
  conductor: Conductor
}

export interface Conductor {
  id: string
  nombres: string
  apellidos: string
  tipo_documento: string
  num_documento: string
  genero: string
  fecha_nacimiento: string
  celular: string
  email: string
  direccion_domicilio: string
  licencia: string
  foto_url: string
  foto_id: string
  estado: string
  createdAt: string
  updatedAt: string
}

export interface Ruta {
  id: string
  duracion: number
  distancia_km: string
  origen_id: string
  destino_id: string
  updatedAt: string
  createdAt: string
  origen: Origen
  destino: Destino
}

export interface Destino {
  id: string
  ciudad: string
  createdAt: string
  updatedAt: string
}

export interface Origen {
  id: string
  ciudad: string
  createdAt: string
  updatedAt: string
}