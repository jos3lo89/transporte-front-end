import { z } from "zod";

export const encomiendaSchema = z.object({
  emisor_nombres: z.string().min(1, "El nombre del emisor es requerido"),
  num_doc_emisor: z
    .string()
    .min(8, "El documento debe tener al menos 8 caracteres"),
  num_telefono_emisor: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 dígitos"),

  receptor_nombres: z.string().min(1, "El nombre del receptor es requerido"),
  num_doc_receptor: z
    .string()
    .min(8, "El documento debe tener al menos 8 caracteres"),
  num_telefono_receptor: z
    .string()
    .min(9, "El teléfono debe tener al menos 9 dígitos"),

  descripcion: z.string().min(1, "La descripción es requerida"),
  tipo: z.enum(["FRAGIL", "NORMAL", "RIGIDO", "PELIGROSO", "PERECEDERO"]),
  codigo_recogida: z.string().max(4),
  peso_kilos: z
    .number({
      message: "Este campo no puedo estar vacio",
    })
    .positive(),

  precio_total: z
    .number({
      message: "Este campo no puedo estar vacio",
    })
    .positive(),

  terminal_origen_id: z.string().uuid(),
  terminal_destino_id: z.string().uuid(),
});

export type EncomiendaFormData = z.infer<typeof encomiendaSchema>;
