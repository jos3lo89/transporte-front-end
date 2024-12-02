import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import axios from "@/api/axios";
import { TerminalesApi } from "@/interfaces/auth.interfaces";
import { FormRegisterEmpleado, formSchema } from "./schemas/empleados.schema";

const RegistroPersonal = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [terminales, setTerminales] = useState<TerminalesApi[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    traerTerminales();
  }, []);

  const traerTerminales = async () => {
    try {
      const res = await axios.get("/terminales");
      setTerminales(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const quitarImagen = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const form = useForm<FormRegisterEmpleado>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      tipo_documento: "DNI",
      num_documento: "",
      genero: "MASCULINO",
      fecha_nacimiento: "",
      celular: "",
      email: "",
      direccion_domicilio: "",
      rol: "VENDEDOR",
      terminal_id: "",
    },
  });

  const onSubmit = async (values: FormRegisterEmpleado) => {
    console.log(values);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "file") {
        formData.append(key, (value as FileList)[0]);
      } else {
        formData.append(key, value as string);
      }
    });
    try {
      setLoading(true);

      const res = await axios.post("/auth/register", formData);
      console.log(res);

      toast.success("Registro exitoso", {
        description: "Tus datos han sido enviados correctamente.",
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

      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        setPreviewImage(null);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
      toast.error(
        "Hubo un problema al enviar tus datos. Por favor, intenta de nuevo.",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle>Registro Personal</CardTitle>
        <CardDescription>
          Ingresa los datos personales para su registro.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            handleImageChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Sube una imagen (JPG, PNG, WEBP). Tamaño máximo: 2MB.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {previewImage && (
                  <div className="mt-4">
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      className="w-full max-w-md rounded-lg shadow-md mx-auto"
                    />
                  </div>
                )}
                {previewImage && (
                  <div className="flex justify-start">
                    <Button onClick={() => quitarImagen()}>
                      Quitar imagen
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingresa tus nombres" {...field} />
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
                          <Input
                            placeholder="Ingresa tus apellidos"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipo_documento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>
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
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="genero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona tu género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MASCULINO">Masculino</SelectItem>
                          <SelectItem value="FEMENINO">Femenino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha_nacimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Nacimiento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="celular"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Celular"
                            {...field}
                            type="number"
                            pattern="\d*"
                            maxLength={9}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Ingresa tu email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="direccion_domicilio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Dirección" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="VENDEDOR">Vendedor</SelectItem>
                            <SelectItem value="ADMINISTRADOR">
                              Administrador
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="terminal_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terminal ID</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione una terminal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {terminales.map((t) => (
                              <SelectItem value={t.id} key={t.id}>
                                {t.ciudad}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default RegistroPersonal;
