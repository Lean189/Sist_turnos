"use server";

import { prisma } from "@/lib/prisma";
import { businessRegistrationSchema } from "@/lib/validations";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

export async function registerBusiness(data: any) {
  try {
    // 1. Validar datos
    const validation = businessRegistrationSchema.safeParse(data);
    if (!validation.success) {
      return { success: false, error: "Datos de registro inválidos" };
    }

    const { businessName, slug, name, email, password } = validation.data;

    // 2. Verificar disponibilidad de slug y email
    const existingBusiness = await prisma.business.findUnique({
      where: { slug },
    });
    if (existingBusiness) {
      return { success: false, error: "Este nombre de URL (slug) ya está en uso" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return { success: false, error: "Este correo electrónico ya está registrado" };
    }

    // 3. Hashear password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Crear todo en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear Negocio
      const business = await tx.business.create({
        data: {
          name: businessName,
          slug: slug.toLowerCase(),
        },
      });

      // Crear Usuario (Admin)
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: UserRole.ADMIN,
          businessId: business.id,
        },
      });

      // Crear Perfil de Staff para el dueño automáticamente
      await tx.staff.create({
        data: {
          userId: user.id,
          businessId: business.id,
          title: "Dueño / Administrador",
        },
      });

      return { business, user };
    });

    return { success: true, businessId: result.business.id };
  } catch (error) {
    console.error("Error in registerBusiness:", error);
    return { success: false, error: "Ocurrió un error inesperado durante el registro" };
  }
}
