import { 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AppointmentsChart } from "@/components/dashboard/chart";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Panel de Administración</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de nuevo. Aquí está lo que está pasando hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-medium shadow-sm transition-all hover:bg-accent">
            Descargar Reporte
          </button>
          <button className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105">
            + Nuevo Turno
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Turnos Hoy"
          value="24"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
          description="8 pendientes de confirmar"
        />
        <StatsCard
          title="Total Clientes"
          value="1,284"
          icon={Users}
          trend={{ value: 4, isPositive: true }}
          description="48 nuevos este mes"
        />
        <StatsCard
          title="Ingresos Estimados"
          value="$12,450"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          description="Basado en turnos del mes"
        />
        <StatsCard
          title="Tasa de Asistencia"
          value="94.2%"
          icon={TrendingUp}
          trend={{ value: 2, isPositive: false }}
          description="-2.1% respecto al mes anterior"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Actividad Semanal</h3>
              <p className="text-sm text-muted-foreground">Volumen de turnos por día</p>
            </div>
            <select className="bg-muted/50 border-none rounded-xl text-sm px-3 py-2 outline-hidden">
              <input type="checkbox" className="hidden" />
              <option>Esta Semana</option>
              <option>Mes Pasado</option>
            </select>
          </div>
          <div className="h-[300px]">
            <AppointmentsChart />
          </div>
        </div>

        <div className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight">Próximos Turnos</h3>
            <Link href="/admin/schedule" className="text-xs font-bold text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-6 flex-1">
            {[
              { name: "Ana García", service: "Consulta General", time: "10:30 AM", status: "confirmed" },
              { name: "Carlos Ruiz", service: "Limpieza Dental", time: "11:15 AM", status: "pending" },
              { name: "Elena Sanz", service: "Ortodoncia", time: "12:00 PM", status: "confirmed" },
              { name: "Roberto Gómez", service: "Extracción", time: "01:30 PM", status: "confirmed" },
            ].map((appointment, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-transparent hover:border-border pb-2 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {appointment.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{appointment.name}</p>
                    <p className="text-xs text-muted-foreground">{appointment.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold mb-1">
                    <Clock className="h-3 w-3" />
                    {appointment.time}
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block",
                    appointment.status === "confirmed" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                  )}>
                    {appointment.status === "confirmed" ? "Confirmado" : "Pendiente"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-2xl bg-muted/50 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center justify-center gap-2">
            Gestionar Agenda <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-primary to-primary/80 rounded-3xl p-8 text-primary-foreground shadow-xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Briefcase className="h-24 w-24" />
          </div>
          <div className="relative">
            <h3 className="text-xl font-bold mb-2">Configura tu Negocio</h3>
            <p className="text-primary-foreground/80 text-sm mb-6">Completa la información de tu perfil profesional para recibir pagos online.</p>
          </div>
          <button className="bg-white text-primary px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-all self-start relative">
            Configurar
          </button>
        </div>
        
        <div className="md:col-span-2 bg-card border rounded-3xl p-8 shadow-sm flex items-center justify-between overflow-hidden relative">
          <div className="space-y-4 max-w-md relative z-10">
            <div className="h-10 w-10 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Nuevas Funcionalidades</h3>
            <p className="text-muted-foreground text-sm">Ahora puedes integrar Google Calendar y enviar recordatorios por WhatsApp directamente desde tu panel.</p>
            <button className="inline-flex items-center text-primary text-sm font-bold hover:underline gap-1">
              Saber más <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
          <div className="hidden lg:block absolute -right-4 -bottom-4 translate-x-1/4 translate-y-1/4">
             <div className="h-64 w-64 rounded-full bg-primary/5 border border-primary/10"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
