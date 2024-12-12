import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import api from "@/api/axios";
import { EncomiendaDetalle } from "./interfaces/encomiendaDetalles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EstadoEncomienda } from "./enums/tipoEncomienda";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  nuevoEstado: z.nativeEnum(EstadoEncomienda),
  claveEntrega: z.string().min(1, "La clave de entrega es requerida"),
});

const EncomiendaDetallePage = () => {
  const { idEncomienda } = useParams();
  const [encomienda, setEncomienda] = useState<EncomiendaDetalle | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nuevoEstado: EstadoEncomienda.RECIBIDO,
      claveEntrega: "",
    },
  });

  useEffect(() => {
    if (idEncomienda) {
      getWithId(idEncomienda);
    }
  }, []);

  const getWithId = async (id: string) => {
    try {
      const res = await api.get(`/encomienda/por-id/${id}`);
      console.log(res.data);
      setEncomienda(res.data);
      form.setValue("nuevoEstado", res.data.estado);
    } catch (error) {
      console.error("Error fetching encomienda:", error);
      toast.error("Error al cargar los detalles de la encomienda");
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!encomienda) return;
    try {
      const res = await api.put(`/encomienda/change-state/${encomienda.id}`, {
        state: values.nuevoEstado,
        clave: values.claveEntrega,
      });
      console.log(res.data);

      toast.success("Estado de la encomienda actualizado", {
        richColors: true,
        position: "top-center",
        closeButton: true,
        duration: 1500,
      });
      form.reset();
      if (idEncomienda) {
        getWithId(idEncomienda);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Detalles de la Encomienda</h1>

      {encomienda && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Emisor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Nombre</Label>
              <Input value={encomienda.emisor_nombres} readOnly />
              <Label>Documento</Label>
              <Input value={encomienda.num_doc_emisor} readOnly />
              <Label>Teléfono</Label>
              <Input value={encomienda.num_telefono_emisor} readOnly />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Información del Receptor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Nombre</Label>
              <Input value={encomienda.receptor_nombres} readOnly />
              <Label>Documento</Label>
              <Input value={encomienda.num_doc_receptor} readOnly />
              <Label>Teléfono</Label>
              <Input value={encomienda.num_telefono_receptor} readOnly />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Encomienda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div>
                  <Label>Tipo</Label>
                  <Input value={encomienda.tipo} readOnly />
                </div>
                <div>
                  <Label>Peso</Label>
                  <Input value={`${encomienda.peso_kilos} kg`} readOnly />
                </div>
              </div>
              <Label>Descripción</Label>
              <Textarea value={encomienda.descripcion} readOnly />

              <div className="grid grid-cols-2 gap-3 my-2">
                <div>
                  <Label>Precio Total</Label>
                  <Input value={`$${encomienda.precio_total}`} readOnly />
                </div>
                <div>
                  <Label>Estado Actual</Label>
                  <Input value={encomienda.estado} readOnly />
                </div>
              </div>

              <Label>Fecha de Envío</Label>
              <Input
                value={new Date(encomienda.fecha_hora_envio).toLocaleString()}
                readOnly
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Terminales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Origen</Label>
              <Input value={encomienda.origen_terminal.ciudad} readOnly />
              <Label>Destino</Label>
              <Input value={encomienda.destino_terminal.ciudad} readOnly />
            </CardContent>
          </Card>
        </div>
      )}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Cambiar Estado</CardTitle>
        </CardHeader>
        <CardContent>
          {encomienda && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="nuevoEstado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nuevo Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={encomienda.estado}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un nuevo estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(EstadoEncomienda).map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="claveEntrega"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Clave de Entrega</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ingrese la clave de entrega"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-center items-center py-3">
                  <Button type="submit">Confirmar Cambio</Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EncomiendaDetallePage;
