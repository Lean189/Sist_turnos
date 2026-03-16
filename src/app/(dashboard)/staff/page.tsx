"use client";

import { 
  PauseCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfToday, addHours, setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";

const today = startOfToday();
const hours = Array.from({ length: 12 }, (_, i) => addHours(setHours(setMinutes(today, 0), 8), i));

const appointments = [
  { id: "1", client: "Ana García", service: "Consulta General", time: "09:00", duration: 30, status: "completed" },
  { id: "2", client: "Carlos Ruiz", service: "Limpieza Dental", time: "10:30", duration: 45, status: "confirmed" },
  { id: "3", client: "Elena Sanz", service: "Ortodoncia", time: "12:00", duration: 60, status: "confirmed" },
  { id: "4", time: "14:00", status: "blocked", reason: "Almuerzo" },
];

export default function StaffSchedulePage() {

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
        {/* Timeline headers */}
        <div className="hidden md:grid grid-cols-[100px_1fr] border-b bg-muted/30">
          <div className="p-4 text-xs font-bold text-muted-foreground uppercase text-center border-r">Hora</div>
          <div className="p-4 text-xs font-bold text-muted-foreground uppercase pl-8">Actividad</div>
        </div>

        <div className="flex flex-col relative">
          {hours.map((hour, i) => {
            const timeStr = format(hour, "HH:mm");
            const appointment = appointments.find(a => a.time === timeStr);
            
            return (
              <div key={i} className="grid grid-cols-[100px_1fr] min-h-[100px] border-b last:border-0 group relative hover:bg-muted/10 transition-colors">
                <div className="flex items-start justify-center pt-4 border-r text-sm font-bold text-muted-foreground">
                  {timeStr}
                </div>
                <div className="p-4 relative">
                  {appointment ? (
                    <div className={cn(
                      "rounded-2xl p-4 border flex items-center justify-between gap-4 transition-all hover:scale-[1.01]",
                      appointment.status === "confirmed" ? "bg-primary/5 border-primary/20" : 
                      appointment.status === "completed" ? "bg-muted/50 border-transparent opacity-80" :
                      "bg-orange-500/5 border-orange-500/20 italic"
                    )}>
                      <div className="flex items-center gap-4">
                        {appointment.status !== "blocked" ? (
                          <>
                            <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border font-bold text-primary shadow-sm">
                              {appointment.client ? appointment.client[0] : '?'}
                            </div>
                            <div>
                              <h4 className="font-bold">{appointment.client || 'Cliente bloqueado'}</h4>
                              <p className="text-xs text-muted-foreground">{appointment.service} {appointment.duration ? `• ${appointment.duration} min` : ''}</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 text-orange-600">
                            <PauseCircle className="h-5 w-5" />
                            <span className="font-bold text-sm tracking-wide uppercase">Bloqueado: {appointment.reason}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {appointment.status === "confirmed" && (
                          <button className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
                            Marcar Completado
                          </button>
                        )}
                        {appointment.status !== "blocked" && (
                          <button className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full w-full border-2 border-dashed border-transparent hover:border-muted rounded-2xl flex items-center justify-center transition-all opacity-0 hover:opacity-100 cursor-pointer">
                      <span className="text-xs font-bold text-muted-foreground">+ Disponible</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Current time indicator line - simplified mock */}
          <div className="absolute left-0 right-0 top-1/4 h-0.5 bg-destructive/40 z-10 pointer-events-none">
            <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-destructive shadow-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
