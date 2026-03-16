"use server";

import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/lib/availability";
import { revalidatePath } from "next/cache";
import { addMinutes } from "date-fns";

/**
 * Obtener slots libres para un staff, día y servicio específico.
 */
export async function fetchAvailableSlots(staffId: string, serviceId: string, date: Date) {
  try {
    const slots = await getAvailableSlots(staffId, serviceId, date);
    return { success: true, slots };
  } catch (error) {
    console.error("Error fetching slots:", error);
    return { success: false, error: "No se pudieron cargar los horarios disponibles" };
  }
}

/**
 * Crear un nuevo turno con validación de conflictos en el servidor.
 */
export async function createAppointment(data: {
  businessId: string;
  staffId: string;
  serviceId: string;
  clientId: string;
  startTime: string; // ISO String
  notes?: string;
}) {
  try {
    const { businessId, staffId, serviceId, clientId, startTime, notes } = data;
    const start = new Date(startTime);

    // 1. Obtener duración del servicio
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) return { success: false, error: "Servicio no encontrado" };

    const end = addMinutes(start, service.duration);

    // 2. Verificar disponibilidad final (Double Booking Prevention)
    const collision = await prisma.appointment.findFirst({
      where: {
        staffId,
        status: { in: ['CONFIRMED', 'PENDING'] },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (collision) {
      return { success: false, error: "Este horario ya ha sido reservado. Por favor, elige otro." };
    }

    // 3. Crear el turno
    const appointment = await prisma.appointment.create({
      data: {
        businessId,
        staffId,
        serviceId,
        clientId,
        startTime: start,
        endTime: end,
        notes,
        status: 'CONFIRMED' // Por defecto confirmado para esta fase
      }
    });

    revalidatePath("/admin/appointments");
    return { success: true, appointment };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return { success: false, error: "No se pudo agendar el turno" };
  }
}
