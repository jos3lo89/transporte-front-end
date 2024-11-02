import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "@/api/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  usuario: z.string().min(1, { message: "El usuario no puede estar vacío" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usuario: "",
      password: "",
    },
  });

  const { setToken, login } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await axios.post("/auth/login", {
        usuario: data.usuario,
        clave: data.password,
      });

      login({
        id: res.data.id,
        name: res.data.nombres,
        email: res.data.email,
        foto_rul: res.data.foto_url,
        role: res.data.rol,
      });
      setToken(res.data.token);
      form.reset();
      navigate("/");
      toast.success(`Vienvenido ${res.data.nombres}`, {
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
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.warning(error.response?.data.message, {
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
      } else {
        console.log(error);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingrese sus credenciales para acceder a su cuenta.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="usuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Ingresar
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default Login;
