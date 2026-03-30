import { 
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfToday, addHours, setHours, setMinutes, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getStaffProfile, getStaffUpcomingAppointments } from "@/app/actions/appointments";
import { redirect } from "next/navigation";

export default async function StaffSchedulePage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "STAFF" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const staffResult = await getStaffProfile(session.user.id);
  if (!staffResult.success || !staffResult.staff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-bold">Perfil de Staff no encontrado</h2>
        <p className="text-muted-foreground">Contacta al administrador para activar tu perfil.</p>
      </div>
    );
  }

  const staffId = staffResult.staff.id;
  const today = startOfToday();
  const appointmentsResult = await getStaffUpcomingAppointments(staffId);
  const dbAppointments = (appointmentsResult.success && appointmentsResult.appointments) ? appointmentsResult.appointments : [];

  const hours = Array.from({ length: 12 }, (_, i) => addHours(setHours(setMinutes(today, 0), 8), i));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Mi Agenda</h1>
          <p className="text-muted-foreground mt-1">{format(today, "EEEE d 'de' MMMM, yyyy", { locale: es })}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border">
            <button className="p-2 rounded-lg hover:bg-background transition-all shadow-sm"><ChevronLeft className="h-4 w-4" /></button>
            <button className="px-4 py-1.5 text-xs font-bold bg-background rounded-lg shadow-sm">Hoy</button>
            <button className="p-2 rounded-lg hover:bg-background transition-all shadow-sm"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <button className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
            Bloquear Horario
          </button>
        </div>
      </div>

      <div className="bg-card border rounded-3xl overflow-hidden shadow-sm relative">
        <div className="hidden md:grid grid-cols-[100px_1fr] border-b bg-muted/30">
          <div className="p-4 text-xs font-bold text-muted-foreground uppercase text-center border-r">Hora</div>
          <div className="p-4 text-xs font-bold text-muted-foreground uppercase pl-8">Actividad</div>
        </div>

        <div className="flex flex-col relative">
          {hours.map((hour, i) => {
            const timeStr = format(hour, "HH:mm");
            // Encontrar turnos que COMIENCEN en esta hora o estén dentro del rango
            const appointmentsAtThisHour = dbAppointments.filter((a: { startTime: Date | string }) => {
               const start = new Date(a.startTime);
               return format(start, "HH:mm") === timeStr && isSameDay(start, today);
            });
            
            return (
              <div key={i} className="grid grid-cols-[100px_1fr] min-h-[100px] border-b last:border-0 group relative hover:bg-muted/10 transition-colors">
                <div className="flex items-start justify-center pt-4 border-r text-sm font-bold text-muted-foreground">
                  {timeStr}
                </div>
                <div className="p-4 relative">
                  {appointmentsAtThisHour.length > 0 ? (appointmentsAtThisHour as {
                    id: string;
                    client: { name: string | null };
                    service: { name: string, duration: number };
                    status: string;
                  }[]).map((appointment) => (
                    <div key={appointment.id} className={cn(
                      "rounded-2xl p-4 border flex items-center justify-between gap-4 transition-all hover:scale-[1.01] mb-2 last:mb-0",
                      appointment.status === "CONFIRMED" ? "bg-primary/5 border-primary/20" : 
                      appointment.status === "COMPLETED" ? "bg-muted/50 border-transparent opacity-80" :
                      "bg-orange-500/5 border-orange-500/20 italic"
                    )}>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border font-bold text-primary shadow-sm">
                          {appointment.client.name ? appointment.client.name[0] : '?'}
                        </div>
                        <div>
                          <h4 className="font-bold">{appointment.client.name || 'Cliente'}</h4>
                          <p className="text-xs text-muted-foreground">
                            {appointment.service.name} • {appointment.service.duration} min
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {appointment.status === "CONFIRMED" && (
                          <button className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
                            Marcar Completado
                          </button>
                        )}
                        <button className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-all">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="h-full w-full border-2 border-dashed border-transparent hover:border-muted rounded-2xl flex items-center justify-center transition-all opacity-0 hover:opacity-100 cursor-pointer">
                      <span className="text-xs font-bold text-muted-foreground">+ Disponible</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {dbAppointments.length === 0 && (
             <div className="flex flex-col items-center justify-center py-20 opacity-30 pointer-events-none">
                <Calendar className="h-12 w-12 mb-4" />
                <p className="text-lg font-bold">Sin actividad agendada para hoy</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
