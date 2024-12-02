import { z } from "zod";

export const formSchemaVehiculo = z.object({
  tarjeta_de_circulacion: z
    .string()
    .min(8, "La tarjeta de circulación debe tener al menos 8 caracteres"),
  numero_de_placa: z
    .string()
    .regex(/^[A-Z]{3}-\d{3}$/, "El formato de la placa debe ser ABC-123"),
  numero_motor: z
    .string()
    .min(10, "El número de motor debe tener al menos 10 caracteres"),
  marca: z.string().min(2, "La marca debe tener al menos 2 caracteres"),
  modelo: z.string().min(2, "El modelo debe tener al menos 2 caracteres"),

  annio_de_fabricacion: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear()),
  color: z.string().min(3, "El color debe tener al menos 3 caracteres"),
  cantidad_ruedas: z.string(),
  // .regex(/^\d{2}$/, "Debe ser un número de dos dígitos"),

  total_asientos: z
    .string()
    .regex(/^\d{2}$/, "Debe ser un número de dos dígitos"),
  total_pasajeros: z
    .string()
    .regex(/^\d{2}$/, "Debe ser un número de dos dígitos"),
  peso_seco: z
    .string()
    .regex(/^\d{4}$/, "Debe ser un número de cuatro dígitos"),

  peso_bruto: z
    .string()
    .regex(/^\d{4}$/, "Debe ser un número de cuatro dígitos"),
  tipo_combustible: z.enum([
    "GASOLINA",
    "DIESEL",
    "HIBRIDO",
    "ELECTRICO",
    "GLP",
  ]),
  tipo_servicio: z.enum(["TRANSPORTE_MIXTO", "SOLO_ENCOMIENDAS"]),
  conductor_id: z.string().uuid(),
});

export type FormValuesVehiculo = z.infer<typeof formSchemaVehiculo>;
