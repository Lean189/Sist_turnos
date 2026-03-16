"use client";

import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  User,
  MapPin, 
  MoreVertical, 
  XCircle, 
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const appointments = [
  { 
    id: "1", 
    service: "Consulta General", 
    staff: "Dr. Juan Pérez", 
    date: "2024-03-25", 
    time: "10:30", 
    status: "confirmed",
    business: "Clínica Médica Central"
  },
  { 
    id: "2", 
    service: "Limpieza Dental", 
    staff: "Dra. Maria Luz", 
    date: "2024-03-12", 
    time: "15:00", 
    status: "pending",
    business: "Clínica Médica Central"
  },
  { 
    id: "3", 
    service: "Control de Ortodoncia", 
    staff: "Dra. Maria Luz", 
    date: "2024-02-15", 
    time: "11:00", 
    status: "completed",
    business: "Clínica Médica Central"
  },
];

export default function MyAppointmentsPage() {
  const [filter, setFilter] = useState("all");

  const filteredAppointments = appointments.filter(a => {
    if (filter === "all") return true;
    if (filter === "upcoming") return a.status === "confirmed" || a.status === "pending";
    if (filter === "completed") return a.status === "completed";
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Mis Turnos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus reservas y revisa tu historial.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-muted rounded-2xl">
          {[
            { id: "all", label: "Todos" },
            { id: "upcoming", label: "Próximos" },
            { id: "completed", label: "Historial" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-bold rounded-xl transition-all",
                filter === tab.id ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((app) => (
            <div key={app.id} className="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-start gap-5">
                <div className={cn(
                  "h-14 w-14 rounded-2xl flex flex-col items-center justify-center border shrink-0",
                  app.status === "completed" ? "bg-muted/50 border-transparent" : "bg-primary/5 border-primary/10 text-primary"
                )}>
                   <span className="text-[10px] font-bold uppercase opacity-80">{app.date.split("-")[1] === "03" ? "MAR" : "FEB"}</span>
                   <span className="text-xl font-extrabold leading-none">{app.date.split("-")[2]}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{app.service}</h3>
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                      app.status === "confirmed" ? "bg-green-500/10 text-green-600 border-green-500/20" : 
                      app.status === "pending" ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                      "bg-muted text-muted-foreground border-transparent"
                    )}>
                      {app.status === "confirmed" ? "Confirmado" : app.status === "pending" ? "Pendiente" : "Completado"}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {app.staff}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {app.time} hs
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 italic">
                    <MapPin className="h-3 w-3" /> {app.business}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 md:border-l md:pl-6">
                {app.status !== "completed" ? (
                  <>
                    <button className="flex-1 md:flex-none inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-bold hover:bg-accent transition-all gap-2">
                      <RotateCcw className="h-4 w-4" /> Reprogramar
                    </button>
                    <button className="p-2 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all" title="Cancelar Turno">
                      <XCircle className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <button className="flex-1 md:flex-none inline-flex h-10 items-center justify-center rounded-xl bg-primary/10 text-primary px-4 text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-all gap-2">
                    Reservar de Nuevo
                  </button>
                )}
                <button className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-all">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-card border rounded-3xl border-dashed">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">No tienes turnos en esta categoría</h3>
            <p className="text-muted-foreground">¡Anímate a reservar tu próxima cita!</p>
          </div>
        )}
      </div>

      <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-3xl flex items-start gap-4">
        <div className="h-10 w-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-orange-800 dark:text-orange-400">Política de Cancelación</h4>
          <p className="text-sm text-orange-700/80 dark:text-orange-400/80">Recuerda que puedes cancelar o reprogramar tu turno hasta 24 horas antes sin cargos adicionales.</p>
        </div>
      </div>
    </div>
  );
}
