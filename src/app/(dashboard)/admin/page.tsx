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
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getDashboardStats, getAdminUpcomingAppointments } from "@/app/actions/appointments";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN" || !session.user.businessId) {
    redirect("/login");
  }

  const businessId = session.user.businessId as string;
  const statsResult = await getDashboardStats(businessId);
  const appointmentsResult = await getAdminUpcomingAppointments(businessId);

  const stats = (statsResult.success && statsResult.stats) ? statsResult.stats : {
    todayAppointments: 0,
    totalClients: 0,
    estimatedIncome: 0,
    attendanceRate: "0"
  };

  const appointments = (appointmentsResult.success && appointmentsResult.appointments) ? appointmentsResult.appointments : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Panel de Administración</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de nuevo, {session.user.name}. Aquí está lo que está pasando hoy.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-medium shadow-sm transition-all hover:bg-accent">
            Descargar Reporte
          </button>
          <Link 
            href="/admin/appointments/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
          >
            + Nuevo Turno
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Turnos Hoy"
          value={stats.todayAppointments.toString()}
          icon={Calendar}
          trend={{ value: 0, isPositive: true }}
          description="En el día de hoy"
        />
        <StatsCard
          title="Total Clientes"
          value={stats.totalClients.toString()}
          icon={Users}
          trend={{ value: 0, isPositive: true }}
          description="Clientes registrados"
        />
        <StatsCard
          title="Ingresos (Mes)"
          value={`$${stats.estimatedIncome.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 0, isPositive: true }}
          description="Estimado este mes"
        />
        <StatsCard
          title="Tasa Asistencia"
          value={`${stats.attendanceRate}%`}
          icon={TrendingUp}
          trend={{ value: 0, isPositive: true }}
          description="Turnos completados"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card border rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Actividad Semanal</h3>
              <p className="text-sm text-muted-foreground">Volumen de turnos por día</p>
            </div>
          </div>
          <div className="h-[300px]">
            <AppointmentsChart />
          </div>
        </div>

        <div className="bg-card border rounded-3xl p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight">Próximos Turnos</h3>
            <Link href="/admin/appointments" className="text-xs font-bold text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-6 flex-1">
            {appointments.length > 0 ? (appointments as { 
              client: { name: string | null }; 
              service: { name: string }; 
              startTime: Date | string; 
              status: string 
            }[]).map((appointment, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-transparent hover:border-border pb-2 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {appointment.client.name ? appointment.client.name[0] : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{appointment.client.name || 'Cliente'}</p>
                    <p className="text-xs text-muted-foreground">{appointment.service.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-bold mb-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(appointment.startTime), "HH:mm")}
                  </div>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block",
                    appointment.status === "CONFIRMED" ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"
                  )}>
                    {appointment.status === "CONFIRMED" ? "Confirmado" : "Pendiente"}
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                <Calendar className="h-10 w-10 mb-2" />
                <p className="text-sm font-medium">No hay turnos próximos</p>
              </div>
            )}
          </div>
          <Link 
            href="/admin/appointments"
            className="w-full mt-6 py-3 rounded-2xl bg-muted/50 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all flex items-center justify-center gap-2"
          >
            Gestionar Agenda <ChevronRight className="h-4 w-4" />
          </Link>
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
          <Link 
            href="/admin/settings"
            className="bg-white text-primary px-6 py-2 rounded-xl text-sm font-bold hover:bg-white/90 transition-all self-start relative"
          >
            Configurar
          </Link>
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
