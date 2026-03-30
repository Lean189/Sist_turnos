"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Search, 
  Check, 
  X, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { updateAppointmentStatus } from "@/app/actions/appointments";

interface Appointment {
  id: string;
  startTime: Date | string;
  status: string;
  notes: string | null;
  client: { name: string | null; email: string };
  service: { name: string; price: number; duration: number };
  staff: { user: { name: string } };
}

interface AppointmentsTableProps {
  initialAppointments: Appointment[];
}

export function AppointmentsTable({ initialAppointments }: AppointmentsTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleStatusChange = async (id: string, newStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    startTransition(async () => {
      const result = await updateAppointmentStatus(id, newStatus);
      if (result.success) {
        setAppointments(prev => 
          prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
        );
      } else {
        alert(result.error);
      }
    });
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3" /> Confirmado</span>;
      case "PENDING":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700"><Clock className="h-3 w-3" /> Pendiente</span>;
      case "CANCELLED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Cancelado</span>;
      case "COMPLETED":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700"><CheckCircle2 className="h-3 w-3" /> Completado</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por cliente o servicio..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-background border rounded-xl p-1 shadow-sm">
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                  statusFilter === s ? "bg-primary text-white shadow-sm" : "hover:bg-muted text-muted-foreground"
                )}
              >
                {s === "ALL" ? "Todos" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("overflow-x-auto", isPending && "opacity-50 pointer-events-none")}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/5">
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Cliente</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Servicio</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Fecha y Hora</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Staff</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAppointments.length > 0 ? filteredAppointments.map((app) => (
              <tr key={app.id} className="hover:bg-muted/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {app.client.name ? app.client.name[0] : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{app.client.name || 'Invitado'}</p>
                      <p className="text-xs text-muted-foreground">{app.client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{app.service.name}</p>
                    <p className="text-xs text-muted-foreground">${app.service.price} • {app.service.duration} min</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{format(new Date(app.startTime), "d 'de' MMM", { locale: es })}</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(app.startTime), "HH:mm")} hs</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium">{app.staff.user.name}</span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(app.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {app.status === "PENDING" && (
                      <button 
                        onClick={() => handleStatusChange(app.id, "CONFIRMED")}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all shadow-sm border border-green-200"
                        title="Confirmar"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {(app.status === "CONFIRMED" || app.status === "PENDING") && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(app.id, "COMPLETED")}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shadow-sm border border-blue-200"
                          title="Completar"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(app.id, "CANCELLED")}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all shadow-sm border border-red-200"
                          title="Cancelar"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground font-medium">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <AlertCircle className="h-10 w-10" />
                    <p>No se encontraron turnos con los filtros actuales</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
