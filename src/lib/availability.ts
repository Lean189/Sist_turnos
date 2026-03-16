import { prisma } from "./prisma";
import { 
  addMinutes, 
  format, 
  parse, 
  isBefore, 
  isAfter, 
  isEqual, 
  startOfDay, 
  endOfDay,
  getDay 
} from "date-fns";

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string;   // ISO string
  displayTime: string; // "HH:mm"
}

/**
 * Genera slots de disponibilidad para un staff, servicio y fecha específica.
 */
export async function getAvailableSlots(
  staffId: string,
  serviceId: string,
  date: Date
): Promise<TimeSlot[]> {
  // 1. Obtener el servicio para saber la duración
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) return [];

  const duration = service.duration;

  // 2. Obtener el día de la semana (0-6)
  const dayOfWeek = getDay(date);

  // 3. Obtener el horario de trabajo de ese staff para ese día
  const workingHours = await prisma.workingHours.findUnique({
    where: {
      staffId_dayOfWeek: {
        staffId,
        dayOfWeek
      }
    }
  });

  if (!workingHours || !workingHours.isActive) return [];

  // 4. Obtener turnos existentes para ese día
  const appointments = await prisma.appointment.findMany({
    where: {
      staffId,
      startTime: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      },
      status: {
        in: ['CONFIRMED', 'PENDING']
      }
    }
  });

  // 5. Generar slots
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = workingHours.startTime.split(':').map(Number);
  const [endHour, endMinute] = workingHours.endTime.split(':').map(Number);

  let currentSlotStart = new Date(date);
  currentSlotStart.setHours(startHour, startMinute, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(endHour, endMinute, 0, 0);

  // Intervalos de 15 minutos para empezar slots (configurable luego)
  const step = 15; 

  while (isBefore(addMinutes(currentSlotStart, duration), dayEnd) || isEqual(addMinutes(currentSlotStart, duration), dayEnd)) {
    const slotEnd = addMinutes(currentSlotStart, duration);
    
    // Verificar si el slot choca con algún turno existente
    const hasCollision = appointments.some(app => {
      // Un slot choca si:
      // (SlotStart < AppEnd) AND (SlotEnd > AppStart)
      return (currentSlotStart < app.endTime && slotEnd > app.startTime);
    });

    if (!hasCollision) {
      slots.push({
        startTime: currentSlotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        displayTime: format(currentSlotStart, "HH:mm")
      });
    }

    currentSlotStart = addMinutes(currentSlotStart, step);
  }

  return slots;
}
