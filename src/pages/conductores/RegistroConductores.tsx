import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { FormSchema, formSchema } from "./schema/form.schema";
import ListaConductores from "./components/ListaConductores";
import { ConductoresApi } from "@/interfaces/conductores";
import { traerUsuario } from "@/utils/api-reniec";

const RegistroPersonal = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [reniecLoading, setReniecLoading] = useState(false);

  const quitarImagen = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const form = useForm<FormSchema>({
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
      licencia: "",
    },
  });

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      const res = await axios.post("/conductores", formData);
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

      traerConductores();

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

  const [empleados, setEmpleados] = useState<ConductoresApi[]>([]);

  useEffect(() => {
    traerConductores();
  }, []);

  const traerConductores = async () => {
    try {
      const res = await axios.get("/conductores/all-state");
      setEmpleados(res.data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card className="w-full max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Registro de conductores</CardTitle>
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
                            <Input
                              placeholder="Ingresa tus nombres"
                              {...field}
                            />
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

                  {form.getValues("tipo_documento") === "DNI" && (
                    <div className="grid grid-cols-1">
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        disabled={reniecLoading}
                        onClick={() => getUser(form.getValues("num_documento"))}
                      >
                        {reniecLoading ? "Buscando..." : "Pedir datos"}
                      </Button>
                    </div>
                  )}

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
                              <SelectItem value="Pasaporte">
                                Pasaporte
                              </SelectItem>
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

                  <div className="grid grid-cols-2 gap-4">
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
                              <SelectItem value="MASCULINO">
                                Masculino
                              </SelectItem>
                              <SelectItem value="FEMENINO">Femenino</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="licencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Licencia</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Número de licencia"
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

      <ListaConductores
        listaConductores={empleados}
        traerConductores={traerConductores}
      />
    </>
  );
};
export default RegistroPersonal;
