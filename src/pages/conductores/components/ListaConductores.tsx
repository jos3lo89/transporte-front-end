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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConductoresApi } from "@/interfaces/conductores";
import UpdateDriver from "./UpdateDriver";

type Props = {
  listaConductores: ConductoresApi[];
  traerConductores: () => Promise<void>;
};

const ListaConductores = ({ listaConductores, traerConductores }: Props) => {
  const [employeeToDelete, setEmployeeToDelete] =
    useState<ConductoresApi | null>(null);

  const [deleteCredentials, setDeleteCredentials] = useState({
    username: "",
    password: "",
  });

  const handleDelete = (employee: ConductoresApi) => {
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
      <h1 className="text-3xl font-bold mb-6">Lista de Conductores</h1>
      <ScrollArea className="w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Foto</TableHead>
              <TableHead>Nombres</TableHead>
              <TableHead>Apellidos</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vehiculo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listaConductores.map((empleado) => (
              <TableRow key={empleado.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={empleado.foto_url}
                      alt={`${empleado.nombres} ${empleado.apellidos}`}
                    />
                    <AvatarFallback>
                      {empleado.nombres[0]}
                      {empleado.apellidos[0]}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{empleado.nombres}</TableCell>
                <TableCell>{empleado.apellidos}</TableCell>
                <TableCell>{empleado.email}</TableCell>
                <TableCell>
                  {empleado.vehiculo
                    ? `${empleado.vehiculo.marca} - ${empleado.vehiculo.modelo}`
                    : "No asignado"}
                </TableCell>
                <TableCell>{empleado.estado.toLowerCase()}</TableCell>
                <TableCell className="text-right">
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(empleado)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button> */}
                  <UpdateDriver
                    traerConductores={traerConductores}
                    driver={empleado}
                  />

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(empleado)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar eliminación</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que quieres eliminar a{" "}
                          {empleado.nombres} {empleado.apellidos}? Esta acción
                          no se puede deshacer.
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
export default ListaConductores;
