"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createStaff(data: {
  userId: string;
  businessId: string;
  title?: string;
  bio?: string;
  serviceIds?: string[];
}) {
  try {
    const staff = await prisma.staff.create({
      data: {
        userId: data.userId,
        businessId: data.businessId,
        title: data.title,
        bio: data.bio,
        services: {
          connect: data.serviceIds?.map(id => ({ id })) || [],
        },
      },
      include: {
        user: true,
        services: true,
      }
    });

    revalidatePath("/admin/staff");
    return { success: true, staff };
  } catch (error) {
    console.error("Error creating staff:", error);
    return { success: false, error: "No se pudo agregar al miembro del equipo" };
  }
}

export async function deleteStaff(id: string) {
  try {
    await prisma.staff.delete({
      where: { id },
    });

    revalidatePath("/admin/staff");
    return { success: true };
  } catch (error) {
    console.error("Error deleting staff:", error);
    return { success: false, error: "No se pudo eliminar al miembro del equipo" };
  }
}
