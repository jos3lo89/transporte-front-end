import axios from "@/api/axios";
import { terminalDb } from "@/interfaces/terminales.interfaces";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast, Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the schema for our form
const formSchema = z
  .object({
    origen_id: z.string(),
    destino_id: z.string(),
    duracion: z.number(),
    distancia_km: z.number(),
  })
  .refine((data) => data.origen_id !== data.destino_id, {
    message: "Origen y destino no pueden ser iguales",
    path: ["destino"],
  });

type FormValues = z.infer<typeof formSchema>;

interface Ruta {
  id: string;
  duracion: number;
  distancia_km: string;
  origen: { ciudad: string };
  destino: { ciudad: string };
  createdAt: string;
}

const CrearRutasPage = () => {
  /* ----------------- */

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Ruta;
    direction: "asc" | "desc";
  } | null>(null);

  const [rutas, setRutas] = useState<Ruta[]>([]);

  useEffect(() => {
    traerRutas();
  }, []);

  const traerRutas = async () => {
    try {
      const res = await axios.get("/rutas");
      console.log(res);

      setRutas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSort = (key: keyof Ruta) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig?.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const sortedRutas = [...rutas].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredRutas = sortedRutas.filter(
    (ruta) =>
      ruta.origen.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.destino.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ----------------- */

  const [terminales, setTerminales] = useState<terminalDb[] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origen_id: "",
      destino_id: "",
      duracion: 33,
      distancia_km: 33.3,
    },
  });

  useEffect(() => {
    handleFetchRutas();
    fetchTerminales();
  }, []);

  const handleFetchRutas = async () => {
    try {
      const res = await axios.get("/rutas");
      console.log(res);
      setRutas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTerminales = async () => {
    try {
      const res = await axios.get("/terminales");
      console.log(res);
      setTerminales(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log(data);
      const res = await axios.post("/rutas", data);
      console.log(res);

      toast.success("Ruta registrada con éxito", {
        richColors: true,
        position: "top-center",
        duration: 1500,
        closeButton: true,
      });
      traerRutas();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto mt-8">
        <Toaster />
        <CardHeader>
          <CardTitle>Crear Nueva Ruta</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="origen_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origen</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el origen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {terminales?.map((terminal) => (
                            <SelectItem key={terminal.id} value={terminal.id}>
                              {terminal.ciudad}
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
                  name="destino_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione el destino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {terminales
                            ?.filter((t) => t.id !== form.watch("origen_id"))
                            .map((terminal) => (
                              <SelectItem key={terminal.id} value={terminal.id}>
                                {terminal.ciudad}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <FormField
                  control={form.control}
                  name="duracion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración del viaje (MIN)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese la duración del viaje"
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? "" : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distancia_km"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distancia del viaje (KM)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingrese la distancia del viaje"
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? "" : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Registrar Ruta</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lista de Rutas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Buscar por origen o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort("origen")}
                    className="cursor-pointer"
                  >
                    Origen <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("destino")}
                    className="cursor-pointer"
                  >
                    Destino <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("duracion")}
                    className="cursor-pointer"
                  >
                    Duración (min){" "}
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("distancia_km")}
                    className="cursor-pointer"
                  >
                    Distancia (km){" "}
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRutas.map((ruta) => (
                  <TableRow key={ruta.id}>
                    <TableCell>{ruta.origen.ciudad}</TableCell>
                    <TableCell>{ruta.destino.ciudad}</TableCell>
                    <TableCell>{ruta.duracion}</TableCell>
                    <TableCell>{ruta.distancia_km}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CrearRutasPage;
