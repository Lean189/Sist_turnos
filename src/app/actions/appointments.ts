"use server";

import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import { getAvailableSlots } from "@/lib/availability";
import { revalidatePath } from "next/cache";
import { addDays, addMinutes, startOfDay, startOfMonth } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  clientId?: string;
  guestData?: {
    name: string;
    email: string;
    phone?: string;
  };
  startTime: string; // ISO String
  notes?: string;
}) {
  try {
    const { businessId, staffId, serviceId, clientId, guestData, startTime, notes } = data;
    const start = new Date(startTime);

    // 1. Obtener/Crear Cliente
    let finalClientId = clientId;

    if (!finalClientId && guestData) {
      // Intentar encontrar un usuario por email primero
      const existingUser = await prisma.user.findUnique({
        where: { email: guestData.email }
      });

      if (existingUser) {
        finalClientId = existingUser.id;
      } else {
        // Crear nuevo usuario con rol CLIENT
        const newUser = await prisma.user.create({
          data: {
            email: guestData.email,
            name: guestData.name,
            role: 'CLIENT',
          }
        });
        finalClientId = newUser.id;
      }
    }

    if (!finalClientId) return { success: false, error: "Datos de cliente no proporcionados" };

    // 2. Obtener duración del servicio
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) return { success: false, error: "Servicio no encontrado" };

    const end = addMinutes(start, service.duration);

    // 3. Verificar disponibilidad final (Double Booking Prevention)
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

    // 4. Crear el turno
    const appointment = await prisma.appointment.create({
      data: {
        businessId,
        staffId,
        serviceId,
        clientId: finalClientId,
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

/**
 * Obtener estadísticas para el dashboard del administrador.
 */
export async function getDashboardStats(businessId: string) {
  try {
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);

    const [appointmentsToDay, totalClients, , completedCount, totalPast] = await Promise.all([
      // Turnos hoy
      prisma.appointment.count({
        where: { businessId, startTime: { gte: today, lt: tomorrow } }
      }),
      // Total Clientes (Usuarios que han tenido al menos un turno en este negocio)
      prisma.user.count({
        where: { appointments: { some: { businessId } }, role: 'CLIENT' }
      }),
      // Ingresos Estimados (Suma de precios de servicios en turnos confirmados/completados del mes)
      prisma.appointment.aggregate({
        where: { 
          businessId, 
          status: { in: ['CONFIRMED', 'COMPLETED'] },
          startTime: { gte: startOfMonth(new Date()) }
        },
        // @ts-expect-error - Prisma aggregate sum type is complex for deep relations
        _sum: {
          service: {
            select: { price: true }
          }
        }
      }), 
      // Tasa de Asistencia (Completados vs Total Pasados)
      prisma.appointment.count({
        where: { businessId, status: 'COMPLETED', startTime: { lt: new Date() } }
      }),
      prisma.appointment.count({
        where: { businessId, startTime: { lt: new Date() }, status: { not: 'CANCELLED' } }
      })
    ]);

    // Calcular ingresos reales (necesitamos hacer una pequeña corrección porque Prisma aggregate _sum no entra en relaciones fácilmente de esta manera)
    const appointmentsWithPrice = await prisma.appointment.findMany({
      where: { 
        businessId, 
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        startTime: { gte: startOfMonth(new Date()) }
      },
      select: { service: { select: { price: true } } }
    });
    
    const realIncome = appointmentsWithPrice.reduce((acc, curr) => acc + (curr.service.price || 0), 0);
    const attendanceRate = totalPast > 0 ? (completedCount / totalPast) * 100 : 100;

    return {
      success: true,
      stats: {
        todayAppointments: appointmentsToDay,
        totalClients,
        estimatedIncome: realIncome,
        attendanceRate: attendanceRate.toFixed(1)
      }
    };
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    return { success: false, error: "No se pudieron cargar las estadísticas" };
  }
}

/**
 * Obtener los próximos turnos para el dashboard de admin.
 */
export async function getAdminUpcomingAppointments(businessId: string, limit = 5) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        businessId,
        startTime: { gte: new Date() },
        status: { in: ['CONFIRMED', 'PENDING'] }
      },
      include: {
        client: { select: { name: true, image: true } },
        service: { select: { name: true } },
        staff: { include: { user: { select: { name: true } } } }
      },
      orderBy: { startTime: 'asc' },
      take: limit
    });

    return { success: true, appointments };
  } catch (error) {
    console.error("Error getting upcoming appointments:", error);
    return { success: false, error: "No se pudieron los próximos turnos" };
  }
}

/**
 * Obtener el perfil de staff de un usuario.
 */
export async function getStaffProfile(userId: string) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { userId },
      include: { business: true }
    });
    return { success: true, staff };
  } catch (error) {
    console.error("Error getting staff profile:", error);
    return { success: false, error: "No se pudo cargar el perfil" };
  }
}

/**
 * Obtener los próximos turnos para un staff específico.
 */
export async function getStaffUpcomingAppointments(staffId: string, limit = 10) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        staffId,
        startTime: { gte: startOfDay(new Date()) },
        status: { not: 'CANCELLED' }
      },
      include: {
        client: { select: { name: true, image: true } },
        service: { select: { name: true, duration: true } }
      },
      orderBy: { startTime: 'asc' },
      take: limit
    });

    return { success: true, appointments };
  } catch (error) {
    console.error("Error getting staff appointments:", error);
    return { success: false, error: "No se pudieron cargar los turnos" };
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: {
        service: true,
        client: { select: { name: true, email: true } }
      }
    });

    revalidatePath("/admin/appointments");
    revalidatePath("/staff");
    return { success: true, appointment: updatedAppointment };
  } catch (error: any) {
    console.error("Error updating appointment:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}

export async function getAppointments(businessId: string, filters: { 
  status?: AppointmentStatus; 
  staffId?: string; 
  startDate?: Date; 
  endDate?: Date;
} = {}) {
  try {
    const where: {
      businessId: string;
      status?: AppointmentStatus;
      staffId?: string;
      startTime?: { gte?: Date; lte?: Date };
    } = { businessId };
    
    if (filters.status) where.status = filters.status;
    if (filters.staffId) where.staffId = filters.staffId;
    if (filters.startDate || filters.endDate) {
      where.startTime = {};
      if (filters.startDate) where.startTime.gte = filters.startDate;
      if (filters.endDate) where.startTime.lte = filters.endDate;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: { select: { name: true, email: true } },
        service: { select: { name: true, duration: true, price: true } },
        staff: { include: { user: { select: { name: true } } } }
      },
      orderBy: { startTime: 'desc' }
    });

    return { success: true, appointments };
  } catch (error) {
    console.error("Error getting appointments:", error);
    return { success: false, error: "Failed to fetch appointments" };
  }
}
