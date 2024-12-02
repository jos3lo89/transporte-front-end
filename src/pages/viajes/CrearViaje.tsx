import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "@/api/axios";
import { RutasApi } from "@/interfaces/rutas";
import { VehiculosApi } from "@/interfaces/vehiculos";
import { formSchema, FormData } from "./schemas/viajes.schema";
import ListaViajes from "./components/ListaViajes";
import { ViajesApi } from "@/interfaces/viajes";

const CrearViaje = () => {
  const [rutas, setRutas] = useState<RutasApi[]>([]);
  const [vehiculos, setVehiculos] = useState<VehiculosApi[]>([]);
  const [selectedConductor, setSelectedConductor] = useState("");
  const [viajes, setViajes] = useState<ViajesApi[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: new Date(),
      precio: 20,
      ruta_id: "",
      vehiculo_id: "",
      conductor_id: "",
    },
  });

  const vehiculo_id = watch("vehiculo_id");

  useEffect(() => {
    traerDatos();
    traerViajes();
  }, []);

  const traerDatos = async () => {
    try {
      const resOne = await axios.get("/rutas/andahuaylas");
      const resTwo = await axios.get("/vehiculos");
      setRutas(resOne.data);
      setVehiculos(resTwo.data);
    } catch (error) {
      console.log(error);
    }
  };
  const traerViajes = async () => {
    try {
      const res = await axios.get("/viajes");

      setViajes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (vehiculo_id) {
      const selectedVehicle = vehiculos.find((v) => v.id === vehiculo_id);
      if (selectedVehicle) {
        setSelectedConductor(selectedVehicle.conductor.nombres);
        setValue("conductor_id", selectedVehicle.conductor.id);
      }
    } else {
      setSelectedConductor("");
      setValue("conductor_id", "");
    }
  }, [vehiculo_id, vehiculos, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const res = await axios.post("/viajes", data);
      console.log(res);

      traerViajes();
      traerDatos();
      setSelectedConductor(""); // no probado
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Crear Viaje</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha y Hora</Label>
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-black dark:text-white" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm")
                        ) : (
                          <span>Seleccionar fecha y hora</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t">
                        <Input
                          className="text-black bg-secondary dark:text-white"
                          type="time"
                          onChange={(e) => {
                            const date = new Date(field.value);
                            const [hours, minutes] = e.target.value.split(":");
                            date.setHours(parseInt(hours), parseInt(minutes));
                            field.onChange(date);
                          }}
                          value={format(field.value, "HH:mm")}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                type="number"
                {...register("precio", { valueAsNumber: true })}
              />
              {errors.precio && (
                <p className="text-sm text-red-500">{errors.precio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ruta_id">Ruta</Label>
              <Controller
                name="ruta_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      {rutas.map((ruta) => (
                        <SelectItem key={ruta.id} value={ruta.id}>
                          <span>{ruta.origen.ciudad}</span>
                          <span className="mx-2 text-muted-foreground">|</span>
                          <span>{ruta.destino.ciudad}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ruta_id && (
                <p className="text-sm text-red-500">{errors.ruta_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehiculo_id">Vehículo</Label>
              <Controller
                name="vehiculo_id"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar vehículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehiculos.map((vehiculo) => (
                        <SelectItem key={vehiculo.id} value={vehiculo.id}>
                          <span>{vehiculo.marca}</span>
                          <span className="mx-2 text-muted-foreground">|</span>
                          <span>{vehiculo.modelo}</span>
                          <span className="mx-2 text-muted-foreground">|</span>
                          <span>{vehiculo.numero_de_placa}</span>
                          <span className="mx-2 text-muted-foreground">|</span>
                          <span>{vehiculo.conductor.nombres}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vehiculo_id && (
                <p className="text-sm text-red-500">
                  {errors.vehiculo_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conductor">Conductor</Label>
              <Input
                id="conductor"
                type="text"
                value={selectedConductor}
                disabled
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creando viaje..." : "Registrar"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <ListaViajes viajes={viajes} />
    </>
  );
};
export default CrearViaje;
