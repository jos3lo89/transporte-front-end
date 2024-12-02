import { useState } from "react";

import { User, Pencil, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store";

interface User {
  id: string;
  name: string;
  email: string;
  foto_rul: string;
  role: string;
}
const ProfilePage = () => {
  // const [user, setUser] = useState<User>({
  //   id: "1",
  //   name: "Juan Pérez",
  //   email: "juan.perez@example.com",
  //   foto_rul: "https://i.pravatar.cc/150?img=68",
  //   role: "usuario",
  // });

  const { user } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(event);

    // event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // const updatedUser = {
    //   ...user,
    //   name: formData.get("name") as string,
    //   email: formData.get("email") as string,
    //   role: formData.get("role") as string,
    // };
    // setUser(updatedUser);
    // setIsEditing(false);
  };

  const handlePhotoUpdate = () => {
    // Aquí iría la lógica para actualizar la foto de perfil
    console.log("Actualizando foto de perfil");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mi perfil</CardTitle>
          <CardDescription>
            Gestiona tu información personal y preferencias
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-10">
            <Avatar className="h-auto w-24">
              <AvatarImage src={user?.foto_rul} alt={user?.name} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button onClick={handlePhotoUpdate} variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Actualizar Foto
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Nombre</Label>
            <div className="font-medium">{user?.name}</div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="font-medium">{user?.email}</div>
          </div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <div className="font-medium capitalize">{user?.role}</div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleEditSubmit}>
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                  <DialogDescription>
                    Realiza cambios en tu perfil aquí. Haz clic en guardar
                    cuando hayas terminado.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={user?.name}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      defaultValue={user?.email}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rol
                    </Label>
                    <Select name="role" defaultValue={user?.role}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                        <SelectItem value="ADMINISTRADOR">
                          Administrador
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Guardar cambios</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};
export default ProfilePage;
