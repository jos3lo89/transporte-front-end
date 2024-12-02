import { useEffect, useState } from "react";
import {
  formSchemaVehiculo,
  FormValuesVehiculo,
} from "./schema/vehiculo.schema";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import axios from "@/api/axios";
import { ConductoresApi } from "@/interfaces/conductores";
import { VehiculosApi } from "@/interfaces/vehiculos";
import ListaVehiculos from "./components/ListaVehiculos";
// import { formVehicle } from "./utils/hookForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const RegistrarVehiculo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conductores, setconductores] = useState<ConductoresApi[]>([]);
  const [vehiculos, setVehiculos] = useState<VehiculosApi[]>([]);

  const formVehicle = useForm<FormValuesVehiculo>({
    resolver: zodResolver(formSchemaVehiculo),
    defaultValues: {
      tarjeta_de_circulacion: "",
      numero_de_placa: "",
      numero_motor: "",
      marca: "",
      modelo: "",
      annio_de_fabricacion: new Date().getFullYear(),
      color: "",
      cantidad_ruedas: "",
      total_asientos: "",
      total_pasajeros: "",
      peso_seco: "",
      peso_bruto: "",
      tipo_combustible: "GASOLINA",
      tipo_servicio: "TRANSPORTE_MIXTO",
      conductor_id: "",
    },
  });

  useEffect(() => {
    traerConductores();
    traerVehiculos();
  }, []);

  const traerConductores = async () => {
    try {
      const res = await axios.get("/conductores");
      setconductores(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const traerVehiculos = async () => {
    try {
      const res = await axios.get("/vehiculos/all-state");
      setVehiculos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  async function onSubmit(data: FormValuesVehiculo) {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/vehiculos", {
        ...data,
        cantidad_ruedas: Number(data.cantidad_ruedas),
        total_asientos: Number(data.total_asientos),
        total_pasajeros: Number(data.total_pasajeros),
        peso_seco: Number(data.peso_seco),
        peso_bruto: Number(data.peso_bruto),
      });
      console.log(response);

      toast.success(`Vehículo ${data.marca} - ${data.modelo} registrado`, {
        description: "Los datos del vehículo se han enviado correctamente.",
        duration: 2000,
        position: "top-center",
        richColors: true,
        dismissible: true,
        action: {
          label: "Cerrar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });

      traerConductores(); // no me gusta
      formVehicle.reset();
      traerVehiculos();
    } catch (error) {
      toast.error("Error", {
        description: "Hubo un problema al enviar los datos del vehículo.",
        duration: 2000,
        position: "bottom-center",
        richColors: true,
        dismissible: true,
        action: {
          label: "Cerrar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Registro de vehiculo</CardTitle>
          <CardDescription>
            Ingresa los datos del vehiculo para su registro.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formVehicle}>
            <form
              onSubmit={formVehicle.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* <div className="grid grid-cols-1 gap-8"> */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FormField
                    control={formVehicle.control}
                    name="marca"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Marca del vehiculo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="modelo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input placeholder="Modelo del vehiculo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="numero_de_placa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de placa</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de placa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="tarjeta_de_circulacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tarjeta de circulación</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tarjeta de circulación"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FormField
                    control={formVehicle.control}
                    name="tipo_combustible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo combustible</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GASOLINA">GASOLINA</SelectItem>
                            <SelectItem value="DIESEL">DIESEL</SelectItem>
                            <SelectItem value="HIBRIDO">HIBRIDO</SelectItem>
                            <SelectItem value="ELECTRICO">ELECTRICO</SelectItem>
                            <SelectItem value="GLP">GLP</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formVehicle.control}
                    name="tipo_servicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo servicio</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="TRANSPORTE_MIXTO">
                              TRANSPORTE_MIXTO
                            </SelectItem>
                            <SelectItem value="SOLO_ENCOMIENDAS">
                              SOLO_ENCOMIENDAS
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="numero_motor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de motor</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de motor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color del vehículo</FormLabel>
                        <FormControl>
                          <Input placeholder="Color del vehículo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FormField
                    control={formVehicle.control}
                    name="cantidad_ruedas"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad ruedas</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ruedas"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="total_pasajeros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total pasajeros</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Pasajeros"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="peso_seco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso seco</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Peso seco"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="peso_bruto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso bruto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Peso bruto"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FormField
                    control={formVehicle.control}
                    name="total_asientos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total asientos</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Total asientos"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="conductor_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conductor del vehículo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {conductores
                              .filter((c) => c.vehiculo === null)
                              .map((c) => (
                                <SelectItem value={c.id} key={c.id}>
                                  {c.nombres}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formVehicle.control}
                    name="annio_de_fabricacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Año de fabricación</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            defaultValue={field.value.toString()}
                          >
                            <SelectTrigger className="">
                              {field.value ? (
                                field.value
                              ) : (
                                <span>Selecciona un año</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from(
                                { length: new Date().getFullYear() - 1899 },
                                (_, index) => 1900 + index
                              ).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* </div> */}

              <div className="flex justify-end">
                <Button type="submit">
                  {isSubmitting ? "Registrando.." : "Registrar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ListaVehiculos
        listaVehiculos={vehiculos}
        traerVehiculos={traerVehiculos}
      />
    </>
  );
};
export default RegistrarVehiculo;
