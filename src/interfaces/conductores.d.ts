
export interface ConductoresApi {
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
  foto_id?: string
  estado: string
  createdAt: string
  updatedAt: string
  vehiculo?: Vehiculo
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
