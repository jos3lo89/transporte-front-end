import { z } from "zod";
export enum Role {
  GERENTE = "GERENTE",
  BOLETERO = "BOLETERO",
  ENCOMENDERO = "ENCOMENDERO",
}

export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const formSchema = z.object({
  nombres: z
    .string()
    .min(2, { message: "Nombres debe tener al menos 2 caracteres" }),
  apellidos: z
    .string()
    .min(2, { message: "Apellidos debe tener al menos 2 caracteres" }),
  tipo_documento: z.enum(["DNI", "Pasaporte"]),
  num_documento: z.string().min(8, { message: "Número de documento inválido" }),
  genero: z.enum(["MASCULINO", "FEMENINO"]),
  fecha_nacimiento: z.string(),
  celular: z.string().regex(/^\d{9}$/, {
    message: "Celular debe tener exactamente 9 dígitos numéricos",
  }),
  email: z.string().email({ message: "Email inválido" }),
  direccion_domicilio: z.string(),
  rol: z.enum(["GERENTE", "BOLETERO", "ENCOMENDERO"]),
  terminal_id: z.string(),
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "La imagen es requerida")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `El tamaño máximo de archivo es 2MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Solo se aceptan archivos .jpg, .png, .webp"
    ),
});

export type FormRegisterEmpleado = z.infer<typeof formSchema>;
