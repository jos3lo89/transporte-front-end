import {z} from "zod"

export const formSchema = z.object({
  fecha: z.date(),
  precio: z.number().positive(),
  ruta_id: z.string().uuid(),
  vehiculo_id: z.string().uuid(),
  conductor_id: z.string().uuid(),
});

export type FormData = z.infer<typeof formSchema>;
