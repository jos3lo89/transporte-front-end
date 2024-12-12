import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Calendar, DollarSign } from "lucide-react";
import { ViajeV2Api } from "../schema/boletos.interface";

type Props = { detallesViaje: ViajeV2Api };

const DetallesViaje = ({ detallesViaje }: Props) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Detalles del Viaje</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <MapPin className="mr-2" />
            <div>
              <p className="text-sm font-medium">Origen</p>
              <p className="text-lg">{detallesViaje.ruta.origen.ciudad}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <MapPin className="mr-2" />
            <div>
              <p className="text-sm font-medium">Destino</p>
              <p className="text-lg">{detallesViaje.ruta.destino.ciudad}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Calendar className="mr-2" />
            <div>
              <p className="text-sm font-medium">Fecha de salida</p>
              <p className="text-lg">
                {detallesViaje &&
                  new Date(detallesViaje.fecha).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="mr-2" />
            <div>
              <p className="text-sm font-medium">Hora de salida</p>
              <p className="text-lg">
                {detallesViaje &&
                  new Date(detallesViaje.fecha).toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <DollarSign className="mr-2" />
            <div>
              <p className="text-sm font-medium">Precio</p>
              <p className="text-lg">S/ {detallesViaje.precio.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default DetallesViaje;
