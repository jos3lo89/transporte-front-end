import { VehiculosApi } from "@/interfaces/vehiculos";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import UpdateVehicle from "./UpdateVehicle";

type Props = {
  listaVehiculos: VehiculosApi[];
  traerVehiculos: () => Promise<void>;
};

const ListaVehiculos = ({ listaVehiculos, traerVehiculos }: Props) => {
  const [employeeToDelete, setEmployeeToDelete] = useState<VehiculosApi | null>(
    null
  );

  const [deleteCredentials, setDeleteCredentials] = useState({
    username: "",
    password: "",
  });

  const handleDelete = (employee: VehiculosApi) => {
    setEmployeeToDelete(employee);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      console.log("Eliminando empleado:", employeeToDelete);
      console.log("Credenciales:", deleteCredentials);
      // Implementar lógica de eliminación aquí
      setEmployeeToDelete(null);
      setDeleteCredentials({ username: "", password: "" });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Lista de Vehiculos</h1>
      <ScrollArea className="w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marca</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Tarjeta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listaVehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.id}>
                <TableCell>{vehiculo.marca}</TableCell>
                <TableCell>{vehiculo.modelo}</TableCell>
                <TableCell>{vehiculo.numero_de_placa}</TableCell>
                <TableCell>{vehiculo.conductor.nombres}</TableCell>
                <TableCell>{vehiculo.tarjeta_de_circulacion}</TableCell>
                <TableCell>{vehiculo.estado.toLowerCase()}</TableCell>
                <TableCell className="text-right">
                  <UpdateVehicle
                    vehiculo={vehiculo}
                    traerVehiculos={traerVehiculos}
                  />

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(vehiculo)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar a{" "}
                          {vehiculo.marca} {vehiculo.modelo}? Esta acción no se
                          puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Input
                          placeholder="Usuario"
                          value={deleteCredentials.username}
                          onChange={(e) =>
                            setDeleteCredentials({
                              ...deleteCredentials,
                              username: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="password"
                          placeholder="Contraseña"
                          value={deleteCredentials.password}
                          onChange={(e) =>
                            setDeleteCredentials({
                              ...deleteCredentials,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="destructive" onClick={confirmDelete}>
                          Eliminar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
export default ListaVehiculos;
