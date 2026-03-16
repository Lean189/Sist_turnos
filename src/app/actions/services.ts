"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createService(data: {
  name: string;
  description?: string;
  duration: number;
  price?: number;
  businessId: string;
}) {
  try {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        price: data.price,
        businessId: data.businessId,
      },
    });

    revalidatePath("/admin/services");
    return { success: true, service };
  } catch (error) {
    console.error("Error creating service:", error);
    return { success: false, error: "No se pudo crear el servicio" };
  }
}

export async function updateService(id: string, data: {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
}) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/services");
    return { success: true, service };
  } catch (error) {
    console.error("Error updating service:", error);
    return { success: false, error: "No se pudo actualizar el servicio" };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });

    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    return { success: false, error: "No se pudo eliminar el servicio" };
  }
}
