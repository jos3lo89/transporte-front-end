import axios from "@/api/axios";
import { terminalDb } from "@/interfaces/terminales.interfaces";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  ciudades: z.string().min(1, "El nombre de la ciudad es requerida"),
});
type FormSchematype = z.infer<typeof formSchema>;

const CrearTerminalesPage = () => {
  const [terminales, setTerminales] = useState<terminalDb[] | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchematype>({
    defaultValues: {
      ciudades: "",
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    fetchTerminales();
  }, []);

  const fetchTerminales = async () => {
    try {
      const res = await axios.get("/terminales");
      setTerminales(res.data);
    } catch (error) {
      console.error("Error fetching terminales:", error);
      toast.error("Error al cargar las terminales");
    }
  };

  const onSubmit = async (values: FormSchematype) => {
    try {
      console.log("Ciudad registrada:", values);

      const res = await axios.post("/terminales", values);
      console.log(res);

      toast.success("Terminal registrada con éxito", {
        richColors: true,
        position: "top-center",
        closeButton: true,
        duration: 1500,
      });
      reset();
      fetchTerminales();
    } catch (error) {
      console.log(error);
      toast.warning("Erro al registrar la terminal", {
        richColors: true,
        position: "bottom-center",
        closeButton: true,
        duration: 1500,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Registrar Nueva Terminal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="ciudad" className="mb-4">
                Nombre de la Ciudad
              </Label>
              <Input
                id="ciudad"
                {...register("ciudades")}
                placeholder="Ingrese el nombre de la ciudad"
                type="text"
              />
              {errors.ciudades && (
                <span className="text-red-600 my-2">
                  {errors.ciudades.message}
                </span>
              )}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Registrando" : "Registrar"}
            </Button>
            {errors.root && <span>{errors.root.message}</span>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Terminales</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ciudad</TableHead>
                <TableHead>Fecha de Creación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {terminales?.map((terminal) => (
                <TableRow key={terminal.id}>
                  <TableCell>{terminal.ciudad}</TableCell>
                  <TableCell>
                    {new Date(terminal.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearTerminalesPage;
