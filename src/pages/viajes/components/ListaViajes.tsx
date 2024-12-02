import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ClipboardPaste, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViajesApi } from "@/interfaces/viajes";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

const ListaViajes = ({ viajes }: { viajes: ViajesApi[] }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const navigate = useNavigate();

  const filteredTrips = viajes.filter(
    (trip) =>
      format(new Date(trip.fecha), "yyyy-MM-dd") === format(date!, "yyyy-MM-dd")
  );

  const goVentaBoleto = (id: string) => {
    navigate(`/venta-boletos/${id}`);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {filteredTrips.length > 0 ? (
        <ScrollArea className="w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Vehiculo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>
                    {format(new Date(trip.fecha), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{format(new Date(trip.fecha), "HH:mm")}</TableCell>
                  <TableCell>{trip.ruta.origen.ciudad}</TableCell>
                  <TableCell>{trip.ruta.destino.ciudad}</TableCell>
                  <TableCell>{trip.vehiculo.numero_de_placa}</TableCell>
                  <TableCell>En espera</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-1">
                      <Users2 />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => goVentaBoleto(trip.id)}
                    >
                      <ClipboardPaste />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="text-center py-4">No hay viajes para este día.</div>
      )}
    </div>
  );
};
export default ListaViajes;
