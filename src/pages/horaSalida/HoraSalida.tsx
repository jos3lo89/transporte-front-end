import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { ViajesApi } from "@/interfaces/viajes";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HoraSalida = () => {
  const [searchDate, setSearchDate] = useState("");
  const [viajes, setViajes] = useState<ViajesApi[]>([]);
  const navigate = useNavigate();
  const filteredTrips = viajes.filter((trip) =>
    searchDate ? trip.fecha.includes(searchDate) : true
  );

  useEffect(() => {
    traerVaijes();
  }, []);

  const traerVaijes = async () => {
    try {
      const res = await axios.get("/viajes");
      console.log(res);
      setViajes(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const goVentaBoleto = (id: string) => {
    navigate(`/venta-boletos/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Input
          type="date"
          placeholder="Search by date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrips.map((trip) => (
          <Card
            key={trip.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => goVentaBoleto(trip.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span className="text-sm text-gray-500">
                    {new Date(trip.fecha).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-bold text-lg">S/ {trip.precio}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {trip.ruta.origen.ciudad} <MoveRight className="inline mr-2 text-gray-500" />
                {trip.ruta.destino.ciudad}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                <span className="text-primary">Duración: </span>
                {trip.ruta.duracion} minutos
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <span className="text-primary">Distancia: </span>
                {trip.ruta.distancia_km} km
              </p>
              <p className="text-sm text-gray-500 mb-2">
                <span className="text-primary">Vehiculo: </span>
                {trip.vehiculo.marca} {trip.vehiculo.modelo}
              </p>
              <p className="text-sm text-gray-500">
                <span className="text-primary">Placa: </span>
                {trip.vehiculo.numero_de_placa}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredTrips.length === 0 && (
        <p className="text-center mt-4 text-gray-500">
          No se encontraron viajes para la fecha seleccionada
        </p>
      )}
    </div>
  );
};
export default HoraSalida;
