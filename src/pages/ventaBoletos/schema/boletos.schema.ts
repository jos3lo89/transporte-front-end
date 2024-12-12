import { z } from "zod";

export const formSchemaBoleto = z.object({
  nombres: z.string().min(2, "El nombre es requerido"),
  apellidos: z.string().min(2, "Los apellidos son requeridos"),
  tipo_documento: z.enum(["DNI", "Pasaporte"]),
  num_documento: z
    .string()
    .min(8, "El número de documento debe tener al menos 8 caracteres"),
  num_asiento: z
    .number()
    .int()
    .positive()
    .max(
      20,
      "El número de asiento no puede ser mayor que el total de asientos"
    ),
  // .nullable(), // Permitir null en num_asiento
  destino: z.string(),
  origen: z.string(),
  // destino: z.enum(["Andahuaylas", "Abancay", "Ayacucho"]),
  descripcion_equipaje: z.string().optional(),
  peso_equipaje: z.preprocess(
    (value) => (value !== "" ? Number(value) : undefined),
    z.number().min(1, "El número debe ser mayor que 0")
  ),
});

export type FormTypeBoleto = z.infer<typeof formSchemaBoleto>;
