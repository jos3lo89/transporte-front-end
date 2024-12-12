import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "@/api/axios";
import { useParams } from "react-router-dom";
import { Asientos, Ticket, ViajeV2Api } from "./schema/boletos.interface";
import { formSchemaBoleto, FormTypeBoleto } from "./schema/boletos.schema";
import DetallesViaje from "./components/DetallesViaje";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArmchairIcon, Bus, Luggage, Plane, User } from "lucide-react";
import { traerUsuario } from "@/utils/api-reniec";
import PdfTicket from "./utils/pdf";
import { pdf } from "@react-pdf/renderer";

import { saveAs } from "file-saver";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DetallesPajaveVendido } from "./schema/detalles.interface";
import { Separator } from "@/components/ui/separator";

const VentaBoletos = () => {
  const [viajeData, setViajeData] = useState<ViajeV2Api | null>(null);
  const [numasientocli, setNumasientocli] = useState<Asientos[]>();
  const { idviaje } = useParams();
  const [aux, setAux] = useState<number | null>(null);
  const [reniecLoading, setReniecLoading] = useState(false);

  // const [modalOpen, setModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [detallesPasajero, setDetallesPasajero] =
    useState<DetallesPajaveVendido | null>(null);

  const getDetelles = async (num: number) => {
    try {
      const res = await axios.get(`/pasajeros/detalles/${num}/${idviaje}`);
      console.log(res);
      setDetallesPasajero(res.data);
      // setModalOpen(true); // Abrir el modal
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const form = useForm<FormTypeBoleto>({
    resolver: zodResolver(formSchemaBoleto),
    defaultValues: {
      apellidos: "",
      nombres: "",
      tipo_documento: "DNI",
      num_documento: "",
      num_asiento: 0,
      destino: "",
      origen: "",
      descripcion_equipaje: "",
      peso_equipaje: 1,
    },
  });

  const downloadPdf = async (data: Ticket) => {
    const fileName = "test.pdf";
    const blob = await pdf(<PdfTicket datosViaje={data} />).toBlob();
    saveAs(blob, fileName);
  };

  useEffect(() => {
    if (idviaje) {
      traerDataViaje(idviaje);
    }
  }, []);

  const traerDataViaje = async (id: string) => {
    try {
      const res = await axios.get(`/viajes/${id}`);
      setViajeData(res.data);

      form.setValue("destino", res.data.ruta.destino.ciudad);
      form.setValue("origen", res.data.ruta.origen.ciudad);

      setAux(res.data.vehiculo.total_asientos);
      const asientos = await traerAsientoPorIdViaje(
        id,
        res.data.vehiculo.total_asientos
      );
      setNumasientocli(asientos);

      const primerAsientoDisponible = asientos.find(
        (asiento) => !asiento.sold && !asiento.isDriver
      );
      if (primerAsientoDisponible) {
        form.setValue("num_asiento", primerAsientoDisponible.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async (dni: string) => {
    try {
      if (dni.length < 8 || dni.length > 8) {
        toast.warning("El dni debe ser de 8 caracteres", {
          richColors: true,
          closeButton: true,
          duration: 1500,
          position: "top-center",
        });
        return;
      }

      setReniecLoading(true);
      const res = await traerUsuario(dni);
      console.log(res);
      setReniecLoading(false);

      form.setValue("nombres", res.data.nombres);
      form.setValue(
        "apellidos",
        `${res.data.apellidoPaterno} ${res.data.apellidoMaterno}`
      );
    } catch (error) {
      setReniecLoading(false);

      console.log(error);
    }
  };

  const traerAsientoPorIdViaje = async (idViaje: string, num: number) => {
    try {
      const res = await axios.get(`/pasajeros/viaje/${idViaje}`);

      return Array.from({ length: num }, (_, i) => ({
        id: i + 1,
        isDriver: i === 0,
        sold: res.data.some((soldSeat: any) => soldSeat.num_asiento === i + 1),
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleChangenumAsiento = (num: number) => {
    form.setValue("num_asiento", num);
  };

  const regenerarPdf = async (data: any) => {
    if (!viajeData || !idviaje) {
      return;
    }

    await downloadPdf({
      fechaSalida: new Date(viajeData.fecha).toLocaleDateString(),
      horaSalida: new Date(viajeData.fecha).toLocaleTimeString(),
      viaje_id: idviaje,
      ...data,
    });
  };

  const onSubmit = async (data: FormTypeBoleto) => {
    try {
      const newData = {
        ...data,
        viaje_id: idviaje,
      };

      await axios.post("/pasajeros", newData);

      if (viajeData && idviaje) {
        await downloadPdf({
          ...data,
          viaje_id: idviaje,
          fechaSalida: new Date(viajeData.fecha).toLocaleDateString(),
          horaSalida: new Date(viajeData.fecha).toLocaleTimeString(),
        });
      }

      toast.success("Venta registrada con éxito", {
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

      if (idviaje && aux) {
        const asientosActualizados = await traerAsientoPorIdViaje(idviaje, aux);
        setNumasientocli(asientosActualizados);

        const primerAsientoDisponible = asientosActualizados.find(
          (asiento) => !asiento.sold && !asiento.isDriver
        );

        if (primerAsientoDisponible) {
          form.setValue("num_asiento", primerAsientoDisponible.id);
        } else {
          form.setValue("num_asiento", 0);
        }
      }

      form.reset({
        apellidos: "",
        nombres: "",
        tipo_documento: "DNI",
        num_documento: "",
        destino: form.getValues("destino"),
        origen: form.getValues("origen"),
        num_asiento: form.getValues("num_asiento"),
        descripcion_equipaje: "",
        peso_equipaje: 1,
      });
    } catch (error) {
      console.log(error);
      toast.error(
        "No se pudo cargar la información del viaje, intente nuevamente",
        {
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
        }
      );
    }
  };

  return (
    <>
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {viajeData && <DetallesViaje detallesViaje={viajeData} />}

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Registro de Pasajero</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="tipo_documento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo documento</FormLabel>
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
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="num_documento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número documento</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el número de documento"
                            type="number"
                            autoFocus={true}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.getValues("tipo_documento") === "DNI" && (
                    // <div className="grid grid-cols-1">
                    <div className="">
                      <Button
                        variant="secondary"
                        className="w-full"
                        type="button"
                        disabled={reniecLoading}
                        onClick={() => getUser(form.getValues("num_documento"))}
                      >
                        {reniecLoading ? "Buscando..." : "Pedir datos"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese el nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apellidos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese el apellido" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="num_asiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Asiento</FormLabel>
                        <FormControl>
                          {field.value !== null ? (
                            <Input
                              disabled={true}
                              placeholder="Ingrese el número de asiento"
                              {...field}
                            />
                          ) : (
                            <p>No hay asientos disponibles</p>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {viajeData && (
                    <FormField
                      control={form.control}
                      name="destino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destino</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={viajeData.ruta.destino.ciudad}
                            disabled={true}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Andahuaylas">
                                Andahuaylas
                              </SelectItem>
                              <SelectItem value="Abancay">Abancay</SelectItem>
                              <SelectItem value="Ayacucho">Ayacucho</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="descripcion_equipaje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del equipaje</FormLabel>
                        <FormControl>
                          {/* <Input placeholder="Descripción del equipaje" {...field} /> */}
                          <Textarea
                            placeholder="Descripción del equipaje."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="peso_equipaje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso en kilos</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingrese el peso del equipaje"
                            {...field}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Registrar Venta
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Card className="container p-6 max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {numasientocli &&
            numasientocli.map((seat) => (
              <div key={seat.id}>
                {seat.isDriver ? (
                  // Botón deshabilitado para el asiento de conductor
                  <Button
                    variant="secondary"
                    className="w-full h-24 flex flex-col items-center justify-center opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <ArmchairIcon />
                    {seat.id}
                  </Button>
                ) : seat.sold ? (
                  // Botón para asiento vendido
                  <Button
                    onClick={() => getDetelles(seat.id)}
                    variant="destructive"
                    className="w-full h-24 flex flex-col items-center justify-center"
                  >
                    <ArmchairIcon />
                    {seat.id}
                  </Button>
                ) : (
                  // Botón para asiento disponible
                  <Button
                    onClick={() => handleChangenumAsiento(seat.id)}
                    variant="default"
                    className="w-full h-24 flex flex-col items-center justify-center hover:scale-105"
                  >
                    <ArmchairIcon />
                    {seat.id}
                  </Button>
                )}
              </div>
            ))}
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="hidden" variant="outline">
            Ver Detalles del Pasajero
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalles del Pasajero</DialogTitle>
            <DialogDescription>
              Información detallada sobre el pasajero y su viaje
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[60vh] pr-4">
            {detallesPasajero && (
              <div className="space-y-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                    <User className="h-5 w-5" />
                    Pasajero
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Nombre:</span>{" "}
                      {detallesPasajero.pasajero.nombres}{" "}
                      {detallesPasajero.pasajero.apellidos}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Documento:</span>{" "}
                      {detallesPasajero.pasajero.tipo_documento} -{" "}
                      {detallesPasajero.pasajero.num_documento}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Asiento:</span>{" "}
                      {detallesPasajero.num_asiento}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                    <Bus className="h-5 w-5" />
                    Viaje
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Fecha:</span>{" "}
                      {new Date(detallesPasajero.viaje.fecha).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Precio:</span> $
                      {detallesPasajero.viaje.precio}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Origen:</span>{" "}
                      {detallesPasajero.viaje.ruta.origen.ciudad}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Destino:</span>{" "}
                      {detallesPasajero.viaje.ruta.destino.ciudad}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Duración:</span>{" "}
                      {detallesPasajero.viaje.ruta.duracion} minutos
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Distancia:</span>{" "}
                      {detallesPasajero.viaje.ruta.distancia_km} km
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                    <Luggage className="h-5 w-5" />
                    Equipaje
                  </h3>
                  {detallesPasajero.pasajero.equipaje.map((item, index) => (
                    <div
                      key={item.id}
                      className="mt-2 bg-background p-2 rounded"
                    >
                      <p className="text-sm">
                        <span className="font-medium">
                          Equipaje {index + 1}:
                        </span>{" "}
                        {item.descripcion}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Peso:</span>{" "}
                        {item.peso_kilo} kg
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center ">
                  <Button
                    onClick={() =>
                      regenerarPdf({
                        nombres: detallesPasajero.pasajero.nombres,
                        apellidos: detallesPasajero.pasajero.apellidos,
                        tipo_documento:
                          detallesPasajero.pasajero.tipo_documento,
                        num_documento: detallesPasajero.pasajero.num_documento,
                        num_asiento: detallesPasajero.num_asiento,
                        destino: detallesPasajero.viaje.ruta.destino.ciudad,
                        origen: detallesPasajero.viaje.ruta.origen.ciudad,
                        descripcion_equipaje:
                          detallesPasajero.pasajero.equipaje[0].descripcion,
                        peso_equipaje:
                          detallesPasajero.pasajero.equipaje[0].peso_kilo,
                      })
                    }
                  >
                    Regenerar ticket
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default VentaBoletos;
