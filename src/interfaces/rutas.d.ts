export interface RutasApi {
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

export interface Origen {
  id: string
  ciudad: string
  createdAt: string
  updatedAt: string
}

export interface Destino {
  id: string
  ciudad: string
  createdAt: string
  updatedAt: string
}
