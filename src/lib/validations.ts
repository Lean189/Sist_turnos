import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  duration: z.number().min(5, "La duración mínima es de 5 minutos"),
  price: z.number().min(0, "el precio no puede ser negativo"),
});

export type ServiceValues = z.infer<typeof serviceSchema>;

export const staffSchema = z.object({
  userId: z.string().min(1, "Debe seleccionar un usuario"),
  title: z.string().min(2, "El título es obligatorio"),
  bio: z.string().optional(),
  serviceIds: z.array(z.string()).optional(),
});

export type StaffValues = z.infer<typeof staffSchema>;

export const businessRegistrationSchema = z.object({
  businessName: z.string().min(2, "El nombre del negocio es muy corto"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres").regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export type BusinessRegistrationValues = z.infer<typeof businessRegistrationSchema>;
